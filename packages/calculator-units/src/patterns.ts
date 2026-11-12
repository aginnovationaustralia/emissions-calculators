/*
 * Rules written as patterns: the left unit, the right unit and the result, with placeholders where
 * any substance can go. The same placeholder in several places means the same substance:
 *
 *   // VolumePerMass<A, B> * Mass<B> = Volume<A>
 *   multiplication(volumePerMass(A, B), mass(B), volume(A));
 *
 * The rule's type and its runtime check both come from the pattern, so there is no rule type to
 * write and no apply callback. Use `multiplyRule` / `divideRule` for anything a pattern can't
 * express.
 */
import { UnitError } from './errors.js';
import {
  divideRule,
  DivideRule,
  multiplyRule,
  MultiplyRule,
  Rule,
  RuleType,
} from './rules.js';
import type { Substance } from './substances.js';
import type { NumberUnit } from './units.js';

declare const placeholderId: unique symbol;

/** Stands in for any substance in a rule pattern. Placeholders with the same id must match. */
export type Placeholder<Id extends string = string> = Substance & {
  readonly [placeholderId]: Id;
};

const PREFIX = '\u0000placeholder:';

/** A placeholder for a rule pattern. `A`, `B` and `C` are ready made. */
export const placeholder = <Id extends string>(id: Id): Placeholder<Id> =>
  `${PREFIX}${id}` as unknown as Placeholder<Id>;

export const A: Placeholder<'A'> = placeholder('A');
export const B: Placeholder<'B'> = placeholder('B');
export const C: Placeholder<'C'> = placeholder('C');

const isPlaceholder = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith(PREFIX);

// -------- Types --------

type IdOf<T> = T extends { readonly [placeholderId]: infer Id extends string }
  ? Id
  : never;
type HasPlaceholder<T> = [IdOf<T>] extends [never] ? false : true;

/** The pattern with each placeholder as any substance: the units it can match. */
type Erase<P> = {
  [K in keyof P]: HasPlaceholder<P[K]> extends true ? Substance : P[K];
};

/** The substance each placeholder in pattern `P` matched in unit `U`. */
type Bind<P, U> = {
  [K in keyof P as IdOf<P[K]>]: K extends keyof U ? U[K] : never;
};

/** The pattern with its placeholders replaced by what they matched; unmatched ones are any substance. */
type Fill<P, Bindings> = {
  [K in keyof P]: HasPlaceholder<P[K]> extends true
    ? IdOf<P[K]> extends keyof Bindings
      ? Bindings[IdOf<P[K]>]
      : Substance
    : P[K];
} extends infer Filled
  ? { [K in keyof Filled]: Filled[K] }
  : never;

/**
 * The rule type of a pattern. The right unit it accepts comes from what the left unit matched; the
 * result from what both matched.
 */
export interface PatternRule<Left, Right, Result> extends RuleType {
  rule: this['L'] extends Erase<Left>
    ? Rule<
        Fill<Right, Bind<Left, this['L']>>,
        Fill<Result, Bind<Left, this['L']> & Bind<Right, this['R']>>
      >
    : never;
}

// -------- Runtime --------

const fieldsOf = (unit: NumberUnit) =>
  Object.entries(unit).filter(([key]) => key !== 'store');

const placeholdersIn = (unit: NumberUnit) =>
  fieldsOf(unit)
    .map(([, value]) => value)
    .filter(isPlaceholder);

/** Matches a unit against a pattern, recording what each placeholder matched. */
const match = (
  pattern: NumberUnit,
  unit: NumberUnit,
  bindings: Map<string, unknown>,
) =>
  fieldsOf(pattern).every(([key, expected]) => {
    const actual = (unit as Record<string, unknown>)[key];
    if (!isPlaceholder(expected)) {
      return actual === expected;
    }
    if (bindings.has(expected)) {
      return bindings.get(expected) === actual;
    }
    bindings.set(expected, actual);
    return true;
  });

const patternApply =
  (left: NumberUnit, right: NumberUnit, result: NumberUnit) =>
  (l: NumberUnit, r: NumberUnit): NumberUnit | undefined => {
    const bindings = new Map<string, unknown>();
    if (!match(left, l, bindings) || !match(right, r, bindings)) {
      return undefined;
    }
    return Object.fromEntries(
      fieldsOf(result).map(([key, value]) => [
        key,
        isPlaceholder(value) ? bindings.get(value) : value,
      ]),
    ) as NumberUnit;
  };

const checkPattern = (
  left: NumberUnit,
  right: NumberUnit,
  result: NumberUnit,
) => {
  const bound = new Set([...placeholdersIn(left), ...placeholdersIn(right)]);
  const unbound = placeholdersIn(result).filter((p) => !bound.has(p));
  if (unbound.length > 0) {
    throw new UnitError(
      `The result of a ${left.__unitType} and ${right.__unitType} rule uses placeholders that neither side has: ${unbound.map((p) => p.slice(PREFIX.length)).join(', ')}`,
    );
  }
};

/** A multiplication rule from a pattern: `left * right = result`. */
export const multiplication = <
  Left extends NumberUnit,
  Right extends NumberUnit,
  Result extends NumberUnit,
>(
  left: Left,
  right: Right,
  result: Result,
): MultiplyRule<PatternRule<Left, Right, Result>> => {
  checkPattern(left, right, result);
  return multiplyRule<PatternRule<Left, Right, Result>>()(
    left.__unitType,
    right.__unitType,
    patternApply(left, right, result) as never,
  );
};

/** A division rule from a pattern: `left / right = result`. */
export const division = <
  Left extends NumberUnit,
  Right extends NumberUnit,
  Result extends NumberUnit,
>(
  left: Left,
  right: Right,
  result: Result,
): DivideRule<PatternRule<Left, Right, Result>> => {
  checkPattern(left, right, result);
  return divideRule<PatternRule<Left, Right, Result>>()(
    left.__unitType,
    right.__unitType,
    patternApply(left, right, result) as never,
  );
};
