import {
  entriesFromObject,
  ObjectEntry,
  objectFromEntries,
} from '@/calculators/common/tools/object';
import { Scope1Totals } from '@/calculators/types/scope1.output';
import { z } from 'zod';
import { Container, root } from './containers';
import { extractMassAsNumber } from './extract';
import { CH4GWPByMass, CO2GWPByMass, N2OGWPByMass } from './gwp';
import { output } from './outputs';
import { sum } from './sum';
import { exposeKeysOnOutput, KeysOnOutput } from './totals';
import { kgToTonnes } from './unit-conversion';
import { AnyUnit, isVoid, mass, Mass } from './units';

type Gas = 'CO2' | 'CH4' | 'N2O' | 'CO2e';
type GasContainer = Container<Mass<Gas>>;
type CO2eContainer = Container<Mass<'CO2e'>>;

/**
 * Keys of a scope output shape whose schema is a total (`outputTonnesCO2e`), as opposed to an
 * individual emission (`outputKey`). Derived from the zod types, so the schema stays the single
 * source of truth for which keys are totals.
 */
export type TotalKeysOf<Shape extends Record<string, z.ZodType>> = {
  [K in keyof Shape]: z.output<Shape[K]> extends { tonnesCO2e: number }
    ? K
    : never;
}[keyof Shape] &
  string;

/**
 * One scope's results while still in container form. Emissions and totals are kept apart so
 * each has a precise type, and are only flattened into one object when serialised.
 */
export type ScopeLedger<
  E extends Record<string, GasContainer>,
  TK extends string,
> = {
  emissions: E;
  totals: Record<TK, CO2eContainer>;
};

/** Combines a scope's emission containers into one total, in CO2e */
export type TotalRule = (emissions: GasContainer[]) => CO2eContainer;

function hasGas<G extends Gas>(
  container: GasContainer,
  gas: G,
): container is Container<Mass<G>> {
  // `sum([])` yields a Void unit at runtime despite its Mass type, so guard for it first
  return !isVoid(container.unit as AnyUnit) && container.unit.substance === gas;
}

/** Converts an emission of any gas to CO2e, keeping the GWP constant in its provenance */
export function toCO2e(container: GasContainer): CO2eContainer {
  if (hasGas(container, 'CO2e')) return container;
  if (hasGas(container, 'CH4')) return container.multiply(CH4GWPByMass);
  if (hasGas(container, 'N2O')) return container.multiply(N2OGWPByMass);
  if (hasGas(container, 'CO2')) return container.multiply(CO2GWPByMass);
  return root(mass('CO2e', 0));
}

export const sumCO2e = (containers: GasContainer[]): CO2eContainer =>
  sum(containers.map(toCO2e));

const sumOfGas =
  (gas: Gas): TotalRule =>
  (emissions) =>
    sumCO2e(emissions.filter((container) => hasGas(container, gas)));

/**
 * How each scope 1 total is built. `satisfies` ties these to the keys of `Scope1TotalsSchema`,
 * so adding a total to the schema without a rule here is a compile error.
 */
export const scope1TotalRules = {
  totalCO2: sumOfGas('CO2'),
  totalCH4: sumOfGas('CH4'),
  totalN2O: sumOfGas('N2O'),
  totalOtherGases: sumOfGas('CO2e'),
  total: sumCO2e,
} satisfies Record<keyof Scope1Totals, TotalRule>;

export const scope23TotalRules = {
  total: sumCO2e,
} satisfies Record<'total', TotalRule>;

export function buildScopeLedger<
  E extends Record<string, GasContainer>,
  R extends Record<string, TotalRule>,
>(emissions: E, rules: R): ScopeLedger<E, keyof R & string> {
  const containers: GasContainer[] = Object.values(emissions);
  const totals = objectFromEntries<Record<keyof R & string, CO2eContainer>>(
    entriesFromObject(rules).map(([key, rule]) => [key, rule(containers)]),
  );
  return { emissions, totals };
}

/** A CO2e total, converted to tonnes for output */
export const exposeTonnesCO2e = (container: CO2eContainer) => ({
  tonnesCO2e: kgToTonnes(extractMassAsNumber(container)).toNumber(),
});

export type SerialisedScope<E, TK extends string> = {
  [K in keyof E]: KeysOnOutput;
} & { [K in TK]: { tonnesCO2e: number } };

/** The only place a scope's containers are turned into plain numbers for JSON output */
export function serialiseScope<
  E extends Record<string, GasContainer>,
  TK extends string,
>(ledger: ScopeLedger<E, TK>, scope: 1 | 2 | 3): SerialisedScope<E, TK> {
  const emissions = objectFromEntries<Record<keyof E, KeysOnOutput>>(
    entriesFromObject(ledger.emissions).map(
      ([key, container]): ObjectEntry<Record<keyof E, KeysOnOutput>> => [
        key,
        exposeKeysOnOutput(output(String(key), scope, container)),
      ],
    ),
  );
  const totals = objectFromEntries<Record<TK, { tonnesCO2e: number }>>(
    entriesFromObject(ledger.totals).map(([key, container]) => [
      key,
      exposeTonnesCO2e(container),
    ]),
  );
  return { ...emissions, ...totals };
}

type Scope1TotalKey = keyof typeof scope1TotalRules & string;
type Scope23TotalKey = keyof typeof scope23TotalRules & string;

/** A whole calculator result (or one activity's share of it) while still in container form */
export type CalculatorLedger<
  E1 extends Record<string, GasContainer>,
  E2 extends Record<string, GasContainer>,
  E3 extends Record<string, GasContainer>,
> = {
  scope1: ScopeLedger<E1, Scope1TotalKey>;
  scope2: ScopeLedger<E2, Scope23TotalKey>;
  scope3: ScopeLedger<E3, Scope23TotalKey>;
  net: CO2eContainer;
};

export function buildCalculatorLedger<
  E1 extends Record<string, GasContainer>,
  E2 extends Record<string, GasContainer>,
  E3 extends Record<string, GasContainer>,
>(scopes: {
  scope1: E1;
  scope2: E2;
  scope3: E3;
}): CalculatorLedger<E1, E2, E3> {
  const scope1 = buildScopeLedger(scopes.scope1, scope1TotalRules);
  const scope2 = buildScopeLedger(scopes.scope2, scope23TotalRules);
  const scope3 = buildScopeLedger(scopes.scope3, scope23TotalRules);
  const net = sum([
    scope1.totals.total,
    scope2.totals.total,
    scope3.totals.total,
  ]);
  return { scope1, scope2, scope3, net };
}

export function serialiseCalculatorLedger<
  E1 extends Record<string, GasContainer>,
  E2 extends Record<string, GasContainer>,
  E3 extends Record<string, GasContainer>,
>(ledger: CalculatorLedger<E1, E2, E3>) {
  return {
    scope1: serialiseScope(ledger.scope1, 1),
    scope2: serialiseScope(ledger.scope2, 2),
    scope3: serialiseScope(ledger.scope3, 3),
    net: {
      total: exposeTonnesCO2e(ledger.net),
    },
  };
}
