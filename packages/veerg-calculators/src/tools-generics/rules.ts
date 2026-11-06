/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type */
import type { NumberUnit, RealNumber, UnitRegistry, UnitType } from './units';

/**
 * One way of combining a left unit with a right unit: which right unit is accepted, and the unit
 * that results.
 */
export type Rule<Right, Result> = { right: Right; result: Result };

/**
 * The type-level multiplication table. Each property is a rule, written as a conditional type over
 * the left unit `L` (and optionally the right unit `R`) that evaluates to a `Rule` when it applies
 * and `never` when it does not. For example:
 *
 *   massPerMassTimesMass: L extends MassPerMass<infer A, infer B> ? Rule<Mass<B>, Mass<A>> : never;
 *
 * reads as "MassPerMass<A, B> * Mass<B> = Mass<A>".
 *
 * This is how the table stays open: interfaces merge, so consumers add rules with module
 * augmentation. Generic interfaces only merge when the type parameters are identical, so
 * augmentations must also be declared as `MultiplyRules<L, R>`.
 *
 * The property names only exist so declarations can merge; pick something descriptive.
 */
export interface MultiplyRules<L, R> {}

/** The type-level division table, shaped exactly like `MultiplyRules`. */
export interface DivideRules<L, R> {}

// Both helpers distribute over the union of table entries, so entries that evaluated to `never`
// (rules that don't apply to `L`) drop out. Mapping over the keys instead would be wrong:
// `never extends Rule<infer Right, ...>` is true and infers `unknown`, which accepts anything.
type AcceptedRight<Entry> =
  Entry extends Rule<infer Right, unknown> ? Right : never;

type ProducedResult<Entry, R> =
  Entry extends Rule<infer Right, infer Result>
    ? [R] extends [Right]
      ? Result
      : never
    : never;

type Entries<Rules> = Rules[keyof Rules];

/** Union of every right unit that `L` can be multiplied by. */
export type MultiplyRight<L, R> = AcceptedRight<Entries<MultiplyRules<L, R>>>;
/** The unit of `L * R`, or `never` when no rule applies. */
export type MultiplyResult<L, R> = ProducedResult<
  Entries<MultiplyRules<L, R>>,
  R
>;
export type DivideRight<L, R> = AcceptedRight<Entries<DivideRules<L, R>>>;
export type DivideResult<L, R> = ProducedResult<Entries<DivideRules<L, R>>, R>;

/** plus/minus: same unit on both sides, or a RealNumber on either side. Not extensible. */
export type AdditiveRight<L> = L extends RealNumber
  ? NumberUnit
  : L | RealNumber;
export type AdditiveResult<L, R> = L extends RealNumber ? R : L;

/*
 * Runtime rules. The type tables above only describe what the compiler allows, something still has
 * to compute the resulting unit when the code runs. Runtime rules are registered against the pair of
 * `__unitType`s they handle.
 *
 * The `result` callback is typed as returning `MultiplyResult` of the two (substance-erased) units,
 * so registering a runtime rule without a matching type rule fails to compile. The reverse (a type
 * rule with no runtime rule) can't be detected statically and throws on first use instead.
 *
 * A callback returns undefined when the substances don't line up, e.g. MassPerMass<'CO2e', 'Fuel'>
 * times Mass<'Diesel'>. The types normally prevent that, but values that cross a boundary typed as
 * `Substance` (user input) are only caught here.
 */
type RuntimeRule = (
  left: NumberUnit,
  right: NumberUnit,
) => NumberUnit | undefined;

const multiplyTable = new Map<string, RuntimeRule>();
const divideTable = new Map<string, RuntimeRule>();

const key = (left: string, right: string) => `${left}|${right}`;

export const defineMultiply = <LT extends UnitType, RT extends UnitType>(
  left: LT,
  right: RT,
  result: (
    l: UnitRegistry[LT],
    r: UnitRegistry[RT],
  ) => MultiplyResult<UnitRegistry[LT], UnitRegistry[RT]> | undefined,
) => {
  multiplyTable.set(key(left, right), result as RuntimeRule);
};

export const defineDivide = <LT extends UnitType, RT extends UnitType>(
  left: LT,
  right: RT,
  result: (
    l: UnitRegistry[LT],
    r: UnitRegistry[RT],
  ) => DivideResult<UnitRegistry[LT], UnitRegistry[RT]> | undefined,
) => {
  divideTable.set(key(left, right), result as RuntimeRule);
};

export class UnitError extends Error {}

const describe = (unit: NumberUnit) => JSON.stringify(unit);

const sameUnit = (left: NumberUnit, right: NumberUnit) => {
  const l = left as Record<string, unknown>;
  const r = right as Record<string, unknown>;
  const keys = Object.keys(l);
  return (
    keys.length === Object.keys(r).length && keys.every((k) => l[k] === r[k])
  );
};

const resolve = (
  table: Map<string, RuntimeRule>,
  op: string,
  left: NumberUnit,
  right: NumberUnit,
) => {
  const rule = table.get(key(left.__unitType, right.__unitType));
  const result = rule?.(left, right);
  if (!result) {
    throw new UnitError(
      `${op} does not support ${describe(left)} and ${describe(right)}`,
    );
  }
  return result;
};

export const multiplyUnits = (left: NumberUnit, right: NumberUnit) => {
  if (right.__unitType === 'RealNumber') return left;
  if (left.__unitType === 'RealNumber') return right;
  return resolve(multiplyTable, 'multiply', left, right);
};

export const divideUnits = (left: NumberUnit, right: NumberUnit) => {
  if (right.__unitType === 'RealNumber') return left;
  if (sameUnit(left, right)) {
    return { __unitType: 'RealNumber' } as const;
  }
  return resolve(divideTable, 'divide', left, right);
};

export const additiveUnit = (left: NumberUnit, right: NumberUnit) => {
  if (left.__unitType === 'RealNumber') return right;
  if (right.__unitType === 'RealNumber') return left;
  if (!sameUnit(left, right)) {
    throw new UnitError(
      `cannot add or subtract ${describe(left)} and ${describe(right)}`,
    );
  }
  return left;
};
