import Decimal from 'decimal.js-light';
import {
  collectConstants,
  collectInputs,
  collectReferences,
  ConstantDefinition,
  InputDefinition,
} from './collect';
import { Container } from './containers';
import { convertToCO2e } from './gwp';
import { isVoid, mass, Mass, VoidUnit } from './units';
import { isValueSeedMethod2 } from './value-store';

export const makeUnique = <T>(a: T[]): T[] => {
  return [...new Set(a)];
};
export const makeUniqueByName = <T extends { name: string }>(a: T[]): T[] => {
  return a.filter((v, i, s) => s.findIndex((t) => t.name === v.name) === i);
};

type HasDecimalValue = {
  value: Decimal;
};

interface OutputCore<
  Scope extends 1 | 2 | 3,
  S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e',
> extends HasDecimalValue {
  amountKgCO2e: Decimal;
  name: string;
  unit: Mass<S>;
  scope: Scope;
  from: Container<Mass<S> | VoidUnit>;
  valueType: 'output';
  originType: 'unary';
  references: string[];
  constants: ConstantDefinition[];
  inputs: InputDefinition[];
}

/** Only the method 1 track was calculated, so there is no method 2 value to report. */
interface Method1Values {
  method: '1';
  valueMethod1: Decimal;
  valueMethod2: undefined;
}

/**
 * A method 2 value was calculated. The method 1 value is only present when the calculation has a
 * method 1 equivalent, which is not the case for method-2-only calculations.
 */
interface Method2Values {
  method: '2';
  valueMethod1: Decimal | undefined;
  valueMethod2: Decimal;
}

type MethodValues = Method1Values | Method2Values;

export interface OutputMethod1<
  Scope extends 1 | 2 | 3,
  S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e' = 'CO2' | 'CH4' | 'N2O' | 'CO2e',
>
  extends OutputCore<Scope, S>, Method1Values {}

export interface OutputMethod2<
  Scope extends 1 | 2 | 3,
  S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e' = 'CO2' | 'CH4' | 'N2O' | 'CO2e',
>
  extends OutputCore<Scope, S>, Method2Values {}

export type Output<
  Scope extends 1 | 2 | 3,
  S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e' = 'CO2' | 'CH4' | 'N2O' | 'CO2e',
> = OutputMethod1<Scope, S> | OutputMethod2<Scope, S>;

export const output = <
  Scope extends 1 | 2 | 3,
  S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e',
>(
  name: string,
  scope: Scope,
  from: Container<Mass<S> | VoidUnit>,
): Output<Scope, S> => {
  const gasAmountKg = isVoid(from.unit)
    ? new Decimal(0)
    : from.unit.store.value;
  const gas = isVoid(from.unit) ? ('CO2' as S) : from.unit.substance;
  const amountKgCO2e = convertToCO2e(gasAmountKg, gas);
  const seed = from.unit.store.seed;

  // A method-2-only calculation has no method 1 equivalent, so its method 1 slot stays undefined.
  const methodValues: MethodValues = isValueSeedMethod2(seed)
    ? {
        method: '2',
        valueMethod1: undefined,
        valueMethod2: seed.valueMethod2,
      }
    : seed.valueMethod2 === undefined
      ? {
          method: '1',
          valueMethod1: seed.valueMethod1,
          valueMethod2: undefined,
        }
      : {
          method: '2',
          valueMethod1: seed.valueMethod1,
          valueMethod2: seed.valueMethod2,
        };

  return {
    valueType: 'output',
    originType: 'unary',
    name,
    scope,
    value: gasAmountKg,
    amountKgCO2e,
    ...methodValues,
    from,
    unit: mass(gas),
    references: makeUnique(collectReferences(from)),
    constants: makeUniqueByName(collectConstants(from)),
    inputs: makeUniqueByName(collectInputs(from)),
  };
};

export const scope23Output = <
  Scope extends 2 | 3,
  S extends 'CO2' | 'CO2e' | 'N2O',
>(
  name: string,
  scope: Scope,
  from: Container<Mass<S> | VoidUnit>,
): Output<Scope, S> => output(name, scope, from);

export type Scope1Output<S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e'> = Output<
  1,
  S
> & { gas: S };
export const scope1Output = <S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e'>(
  name: string,
  from: Container<Mass<S> | VoidUnit>,
): Scope1Output<S> => {
  const gas: S = isVoid(from.unit) ? ('CO2' as S) : from.unit.substance;
  return {
    ...output(name, 1, from),
    gas,
  };
};

export const valueObject = (value: number) => ({
  value,
});
