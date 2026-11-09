import type { RealNumber, UnitLike } from './units.js';

/**
 * What a rule says about a particular left unit: which right unit it accepts, and the unit that
 * results.
 */
export type Rule<Right, Result> = { right: Right; result: Result };

/**
 * The type half of a rule, written as an interface whose `rule` property is computed from
 * `this['L']` (the left unit) and `this['R']` (the right unit). It evaluates to a `Rule` when it
 * applies to the left unit and to `never` when it doesn't:
 *
 *   // MassPerMass<A, B> * Mass<B> = Mass<A>
 *   interface MassPerMassTimesMass extends RuleType {
 *     rule: this['L'] extends MassPerMass<infer A, infer B> ? Rule<Mass<B>, Mass<A>> : never;
 *   }
 *
 * The `this` lookups make the interface behave like a type-level function of L and R, which plain
 * type aliases can't be passed around as. `ApplyRule` supplies L and R by intersection.
 */
export interface RuleType {
  readonly L: unknown;
  readonly R: unknown;
  readonly rule: unknown;
}

/** Evaluates rule type(s) `F` for a left and right unit. Distributes over a union of rules. */
export type ApplyRule<F, L, R> = F extends RuleType
  ? (F & { readonly L: L; readonly R: R })['rule']
  : never;

type AcceptedRight<Entry> =
  Entry extends Rule<infer Right, unknown> ? Right : never;

type ProducedResult<Entry, R> =
  Entry extends Rule<infer Right, infer Result>
    ? [R] extends [Right]
      ? Result
      : never
    : never;

/** Union of every right unit that some rule in `F` accepts for left unit `L`. */
export type RightOf<F, L, R> = AcceptedRight<ApplyRule<F, L, R>>;

/** The resulting unit of combining `L` and `R` under the rules `F`, or `never`. */
export type ResultOf<F, L, R> = ProducedResult<ApplyRule<F, L, R>, R>;

/** L * RealNumber = L, and L / RealNumber = L */
export interface ScaleRight extends RuleType {
  rule: Rule<RealNumber, this['L']>;
}

/** RealNumber * R = R */
export interface ScaleLeft extends RuleType {
  rule: this['L'] extends RealNumber ? Rule<UnitLike, this['R']> : never;
}

/** L / L = RealNumber */
export interface SameUnit extends RuleType {
  rule: Rule<this['L'], RealNumber>;
}

/** plus/minus: the same unit on both sides, or a RealNumber on either side. */
export type AdditiveRight<L> = L extends RealNumber ? UnitLike : L | RealNumber;
export type AdditiveResult<L, R> = L extends RealNumber ? R : L;

type RuntimeApply = (left: never, right: never) => UnitLike | undefined;

/**
 * A complete rule: the runtime implementation plus, in the phantom `__rule` property, its type.
 * Rules are plain values. They only take effect when passed to `createUnitSystem` or `extend`, so
 * the types a container allows always match the rules it runs with.
 */
export type MultiplyRule<F extends RuleType = RuleType> = {
  readonly operation: 'multiply';
  readonly left: string;
  readonly right: string;
  readonly apply: RuntimeApply;
  readonly __rule?: F;
};

export type DivideRule<F extends RuleType = RuleType> = {
  readonly operation: 'divide';
  readonly left: string;
  readonly right: string;
  readonly apply: RuntimeApply;
  readonly __rule?: F;
};

export type RuleTypeOf<T> =
  T extends MultiplyRule<infer F>
    ? F
    : T extends DivideRule<infer F>
      ? F
      : never;

/**
 * Pairs a rule type with its runtime implementation. Curried so the rule type can be given
 * explicitly while the unit types are inferred from the callback's parameter annotations:
 *
 *   export const massPerMassTimesMass = multiplyRule<MassPerMassTimesMass>()(
 *     'MassPerMass',
 *     'Mass',
 *     (l: MassPerMass, r: Mass) => whenSame(l.sdenom, r.substance, () => mass(l.snum)),
 *   );
 *
 * The callback must return what the rule type says the result is, so a runtime rule can't
 * disagree with its type. Return undefined when the units don't line up (usually a substance
 * mismatch), which raises a `UnitError`.
 */
export const multiplyRule =
  <F extends RuleType>() =>
  <L extends UnitLike, R extends UnitLike>(
    left: L['__unitType'],
    right: R['__unitType'],
    apply: (left: L, right: R) => ResultOf<F, L, R> | undefined,
  ): MultiplyRule<F> => ({
    operation: 'multiply',
    left,
    right,
    apply: apply as unknown as RuntimeApply,
  });

/** The division counterpart of `multiplyRule`. */
export const divideRule =
  <F extends RuleType>() =>
  <L extends UnitLike, R extends UnitLike>(
    left: L['__unitType'],
    right: R['__unitType'],
    apply: (left: L, right: R) => ResultOf<F, L, R> | undefined,
  ): DivideRule<F> => ({
    operation: 'divide',
    left,
    right,
    apply: apply as unknown as RuntimeApply,
  });

/** Returns `result()` when the two substances match, otherwise undefined. */
export const whenSame = <T>(a: string, b: string, result: () => T) =>
  a === b ? result() : undefined;
