import type Decimal from 'decimal.js-light';
import {
  Algebra,
  Container,
  createRoot,
  Metadata,
  RuleSet,
} from './container.js';
import { UnitError } from './errors.js';
import type {
  DivideRule,
  MultiplyRule,
  RuleTypeOf,
  SameUnit,
  ScaleLeft,
  ScaleRight,
} from './rules.js';
import {
  describeUnit,
  isRealNumber,
  RealNumber,
  realNumber,
  sameUnit,
  UnitLike,
} from './units.js';

/** Rules every unit system has, whether or not any others are given. */
export type BuiltInRules = {
  multiply: ScaleRight | ScaleLeft;
  divide: ScaleRight | SameUnit;
};

type Rules = {
  multiply?: readonly MultiplyRule[];
  divide?: readonly DivideRule[];
};

/**
 * A set of rules and the means to create containers that follow them. There is no global state:
 * a container can only do what the system that created it allows, at compile time and at runtime.
 */
export interface UnitSystem<RS extends RuleSet> {
  readonly multiplyRules: readonly MultiplyRule[];
  readonly divideRules: readonly DivideRule[];

  /** A container holding `value` in `unit`, with no history. */
  root<U extends UnitLike>(
    unit: U,
    value: number | Decimal,
    meta?: Metadata,
  ): Container<U, RS>;

  /** A dimensionless container. */
  num(value: number | Decimal, meta?: Metadata): Container<RealNumber, RS>;

  /**
   * A new system with this system's rules plus the given ones. Throws if a new rule handles the
   * same pair of unit types as an existing one.
   */
  extend<
    const M extends readonly MultiplyRule[] = [],
    const D extends readonly DivideRule[] = [],
  >(rules: {
    multiply?: M;
    divide?: D;
  }): UnitSystem<{
    multiply: RS['multiply'] | RuleTypeOf<M[number]>;
    divide: RS['divide'] | RuleTypeOf<D[number]>;
  }>;
}

/** The container type for a unit system: `ContainerOf<typeof units, Mass<'CO2e'>>`. */
export type ContainerOf<Sys, U> =
  Sys extends UnitSystem<infer RS> ? Container<U, RS> : never;

/** The type-level rules of a unit system, e.g. to give them a short name with an interface. */
export type RuleSetOf<Sys> = Sys extends UnitSystem<infer RS> ? RS : never;

type RuntimeRule = MultiplyRule | DivideRule;

const key = (left: string, right: string) => `${left}|${right}`;

const tableOf = (rules: readonly RuntimeRule[]) => {
  const table = new Map<string, RuntimeRule>();
  for (const rule of rules) {
    const k = key(rule.left, rule.right);
    if (table.has(k)) {
      throw new UnitError(
        `More than one ${rule.operation} rule for ${rule.left} and ${rule.right}`,
      );
    }
    table.set(k, rule);
  }
  return table;
};

const createAlgebra = (rules: Required<Rules>): Algebra => {
  const multiplyTable = tableOf(rules.multiply);
  const divideTable = tableOf(rules.divide);

  const resolve = (
    table: Map<string, RuntimeRule>,
    operation: string,
    left: UnitLike,
    right: UnitLike,
  ) => {
    const rule = table.get(key(left.__unitType, right.__unitType));
    const result = rule?.apply(left as never, right as never);
    if (!result) {
      throw new UnitError(
        `${operation} does not support ${describeUnit(left)} and ${describeUnit(right)}`,
      );
    }
    return result;
  };

  return {
    multiply: (left, right) => {
      if (isRealNumber(right)) return left;
      if (isRealNumber(left)) return right;
      return resolve(multiplyTable, 'multiply', left, right);
    },
    divide: (left, right) => {
      if (isRealNumber(right)) return left;
      if (sameUnit(left, right)) return realNumber();
      return resolve(divideTable, 'divide', left, right);
    },
    additive: (left, right) => {
      if (isRealNumber(left)) return right;
      if (isRealNumber(right)) return left;
      if (!sameUnit(left, right)) {
        throw new UnitError(
          `cannot add or subtract ${describeUnit(left)} and ${describeUnit(right)}`,
        );
      }
      return left;
    },
  };
};

const buildSystem = (rules: Required<Rules>): UnitSystem<RuleSet> => {
  const algebra = createAlgebra(rules);
  const root = <U extends UnitLike>(
    unit: U,
    value: number | Decimal,
    meta?: Metadata,
  ) => createRoot<U, RuleSet>(algebra, unit, value, meta);

  return {
    multiplyRules: rules.multiply,
    divideRules: rules.divide,
    root,
    num: (value, meta) => root(realNumber(), value, meta),
    extend: (more) =>
      buildSystem({
        multiply: [...rules.multiply, ...(more.multiply ?? [])],
        divide: [...rules.divide, ...(more.divide ?? [])],
      }) as never,
  };
};

/**
 * Creates a unit system from exactly the rules given, plus the built-in RealNumber scaling,
 * same-unit division and same-unit addition. With no arguments it is a blank slate.
 */
export const createUnitSystem = <
  const M extends readonly MultiplyRule[] = [],
  const D extends readonly DivideRule[] = [],
>(
  rules: { multiply?: M; divide?: D } = {},
): UnitSystem<{
  multiply: BuiltInRules['multiply'] | RuleTypeOf<M[number]>;
  divide: BuiltInRules['divide'] | RuleTypeOf<D[number]>;
}> =>
  buildSystem({
    multiply: rules.multiply ?? [],
    divide: rules.divide ?? [],
  }) as never;
