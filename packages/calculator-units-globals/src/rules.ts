/* eslint-disable @typescript-eslint/no-unused-vars */
import { UnitError } from './errors.js';
import {
  describeUnit,
  isRealNumber,
  NumberUnit,
  RealNumber,
  realNumber,
  sameUnit,
  UnitRegistry,
  UnitType,
} from './units.js';

/**
 * What a rule says about a particular left unit: which right unit it accepts, and the unit that
 * results.
 */
export type Rule<Right, Result> = { right: Right; result: Result };

/**
 * The type-level multiplication table. Each property is a rule, written as a conditional type over
 * the left unit `L` (and optionally the right unit `R`) that evaluates to a `Rule` when it applies
 * and `never` when it does not:
 *
 *   // MassPerMass<A, B> * Mass<B> = Mass<A>
 *   massPerMassTimesMass: L extends MassPerMass<infer A, infer B> ? Rule<Mass<B>, Mass<A>> : never;
 *
 * Add rules with module augmentation. Generic interfaces only merge when their type parameters are
 * identical, so augmentations must also be declared as `MultiplyRules<L, R>`. Property names only
 * exist so declarations can merge, but must be unique across everything in the program.
 */
export interface MultiplyRules<L, R> {
  // L * RealNumber = L
  scaleRight: Rule<RealNumber, L>;
  // RealNumber * R = R
  scaleLeft: L extends RealNumber ? Rule<NumberUnit, R> : never;
}

/** The type-level division table, shaped exactly like `MultiplyRules`. */
export interface DivideRules<L, R> {
  // L / RealNumber = L
  scaleRight: Rule<RealNumber, L>;
  // L / L = RealNumber
  sameUnit: Rule<L, RealNumber>;
}

// Both helpers distribute over the union of table entries, so entries that evaluated to `never`
// (rules that don't apply to `L`) drop out.
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

/** plus/minus: same unit on both sides, or a RealNumber on either side. */
export type AdditiveRight<L> = L extends RealNumber
  ? NumberUnit
  : L | RealNumber;
export type AdditiveResult<L, R> = L extends RealNumber ? R : L;

/*
 * Runtime rules live in one registry per loaded copy of this package. `defineMultiply` and
 * `defineDivide` add to it, normally as a side effect of importing the module that also augments
 * the type tables above.
 *
 * The callback is typed as returning `MultiplyResult` of the two (substance-erased) units, so a
 * runtime rule without a matching type rule fails to compile. The reverse can't be detected: a
 * type rule whose runtime half was never imported throws a `UnitError` on first use.
 */
type RuntimeRule = (
  left: NumberUnit,
  right: NumberUnit,
) => NumberUnit | undefined;

const multiplyTable = new Map<string, RuntimeRule>();
const divideTable = new Map<string, RuntimeRule>();

const key = (left: string, right: string) => `${left}|${right}`;

/**
 * Registers the runtime half of a multiplication rule. Registering the same pair twice replaces
 * the earlier rule.
 */
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

/** The division counterpart of `defineMultiply`. */
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

/** Returns `result()` when the two substances match, otherwise undefined. */
export const whenSame = <T>(a: string, b: string, result: () => T) =>
  a === b ? result() : undefined;

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
      `${op} does not support ${describeUnit(left)} and ${describeUnit(right)}`,
    );
  }
  return result;
};

export const multiplyUnits = (left: NumberUnit, right: NumberUnit) => {
  if (isRealNumber(right)) return left;
  if (isRealNumber(left)) return right;
  return resolve(multiplyTable, 'multiply', left, right);
};

export const divideUnits = (
  left: NumberUnit,
  right: NumberUnit,
): NumberUnit => {
  if (isRealNumber(right)) return left;
  if (sameUnit(left, right)) return realNumber();
  return resolve(divideTable, 'divide', left, right);
};

export const additiveUnit = (left: NumberUnit, right: NumberUnit) => {
  if (isRealNumber(left)) return right;
  if (isRealNumber(right)) return left;
  if (!sameUnit(left, right)) {
    throw new UnitError(
      `cannot add or subtract ${describeUnit(left)} and ${describeUnit(right)}`,
    );
  }
  return left;
};
