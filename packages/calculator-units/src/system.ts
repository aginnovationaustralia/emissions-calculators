import { Decimal } from './decimal.js';
import {
  Algebra,
  Container,
  createNode,
  Method,
  RuleSet,
} from './container.js';
import { UnitError } from './errors.js';
import type { Metadata } from './metadata.js';
import type {
  DivideRule,
  MultiplyRule,
  RuleTypeOf,
  SameUnit,
  ScaleLeft,
  ScaleRight,
} from './rules.js';
import {
  AnyUnit,
  describeUnit,
  isRealNumber,
  NumberUnit,
  RealNumber,
  realNumber,
  sameUnit,
  StringUnit,
} from './units.js';
import { ValueStore } from './value-store.js';

/** Rules every unit system has, whether or not any others are given. */
export type BuiltInRules = {
  multiply: ScaleRight | ScaleLeft;
  divide: ScaleRight | SameUnit;
};

/**
 * A set of rules that belong together, e.g. `energyRules` from `/units`, or a consumer's own. Build a
 * system from modules with `createUnitSystem(module).extend(another)`. Declare your own with
 * `as const` so the types of its rules are kept.
 */
export type RuleModule = {
  multiply?: readonly MultiplyRule[];
  divide?: readonly DivideRule[];
};

type Rules = RuleModule;

/** Options for a user supplied value. Everything except `method` is stored as metadata. */
export type InputOptions<M extends Method = Method> = Metadata & {
  name: string;
  /**
   * Which calculation method the value is for, one of the system's methods. Defaults to method 1.
   * A value for any other method is an alternative to the default calculation, so it is also
   * carried on the method 2 track.
   */
  method?: M;
};

/** A key for `select`: a literal key, or a string container whose value is the key. */
export type Selector<
  K extends string,
  RS extends RuleSet,
  M extends Method = Method,
> = K | Container<StringUnit<K>, RS, M>;

/**
 * A set of rules and the means to create containers that follow them. There is no global state:
 * a container can only do what the system that created it allows, at compile time and at runtime.
 *
 * `M` is the calculation methods inputs can be for, all four unless narrowed with `withMethods`.
 */
export interface UnitSystem<RS extends RuleSet, M extends Method = Method> {
  readonly multiplyRules: readonly MultiplyRule[];
  readonly divideRules: readonly DivideRule[];

  /** A container holding `unit` (and, for number units, the value in its store), with no history. */
  root<U extends AnyUnit>(unit: U, meta?: Metadata): Container<U, RS, M>;

  /** A dimensionless container. */
  num(
    value: number | Decimal | ValueStore,
    meta?: Metadata,
  ): Container<RealNumber, RS, M>;

  /** A named root container, e.g. a published factor. */
  constant<U extends AnyUnit>(
    name: string,
    unit: U,
    meta?: Metadata,
  ): Container<U, RS, M>;

  /**
   * A value supplied by the user. For a method 2 input, the store's method 1 value is moved to its
   * method 2 track, so derived values carry it as method 2.
   */
  input<U extends AnyUnit>(
    unit: U,
    options: InputOptions<M>,
  ): Container<U, RS, M>;

  /**
   * Looks up a unit in a nested table of units by up to five keys. Keys can be string containers,
   * which are kept as part of the result's history. The result is named after the table's `name`
   * (if it has one) and the keys, e.g. `COMMON[GWP.CH4]`.
   */
  select<
    K1 extends string,
    T extends Record<K1, NumberUnit> & { name?: string },
  >(
    table: T,
    k1: Selector<K1, RS, M>,
  ): Container<Extract<T[K1], NumberUnit>, RS, M>;
  select<
    K1 extends string,
    K2 extends string,
    T extends Record<K1, Record<K2, NumberUnit>> & { name?: string },
  >(
    table: T,
    k1: Selector<K1, RS, M>,
    k2: Selector<K2, RS, M>,
  ): Container<Extract<T[K1][K2], NumberUnit>, RS, M>;
  select<
    K1 extends string,
    K2 extends string,
    K3 extends string,
    T extends Record<K1, Record<K2, Record<K3, NumberUnit>>> & {
      name?: string;
    },
  >(
    table: T,
    k1: Selector<K1, RS, M>,
    k2: Selector<K2, RS, M>,
    k3: Selector<K3, RS, M>,
  ): Container<Extract<T[K1][K2][K3], NumberUnit>, RS, M>;
  select<
    K1 extends string,
    K2 extends string,
    K3 extends string,
    K4 extends string,
    T extends Record<K1, Record<K2, Record<K3, Record<K4, NumberUnit>>>> & {
      name?: string;
    },
  >(
    table: T,
    k1: Selector<K1, RS, M>,
    k2: Selector<K2, RS, M>,
    k3: Selector<K3, RS, M>,
    k4: Selector<K4, RS, M>,
  ): Container<Extract<T[K1][K2][K3][K4], NumberUnit>, RS, M>;
  select<
    K1 extends string,
    K2 extends string,
    K3 extends string,
    K4 extends string,
    K5 extends string,
    T extends Record<
      K1,
      Record<K2, Record<K3, Record<K4, Record<K5, NumberUnit>>>>
    > & { name?: string },
  >(
    table: T,
    k1: Selector<K1, RS, M>,
    k2: Selector<K2, RS, M>,
    k3: Selector<K3, RS, M>,
    k4: Selector<K4, RS, M>,
    k5: Selector<K5, RS, M>,
  ): Container<Extract<T[K1][K2][K3][K4][K5], NumberUnit>, RS, M>;

  /**
   * A new system with this system's rules plus the given ones. Throws if a new rule handles the
   * same pair of unit types as an existing one.
   */
  extend<
    const MR extends readonly MultiplyRule[] = [],
    const DR extends readonly DivideRule[] = [],
  >(rules: {
    multiply?: MR;
    divide?: DR;
  }): UnitSystem<
    {
      multiply: RS['multiply'] | RuleTypeOf<MR[number]>;
      divide: RS['divide'] | RuleTypeOf<DR[number]>;
    },
    M
  >;

  /** The methods inputs can be for, at runtime. */
  readonly methods: readonly M[];

  /**
   * The same rules, with inputs limited to some of the calculation methods, e.g.
   * `defaultUnitSystem.withMethods('1', '2')`. Its containers have the narrower `M`, so they can't
   * be mixed with containers of other methods, and an input for any other method throws.
   */
  withMethods<N extends M>(...methods: [N, ...N[]]): UnitSystem<RS, N>;
}

/** The container type for a unit system: `ContainerOf<typeof units, Mass<'CO2e'>>`. */
export type ContainerOf<Sys, U> =
  Sys extends UnitSystem<infer RS, infer M> ? Container<U, RS, M> : never;

/** The type-level rules of a unit system, e.g. to give them a short name with an interface. */
export type RuleSetOf<Sys> =
  Sys extends UnitSystem<infer RS, Method> ? RS : never;

/** The calculation methods of a unit system's inputs. */
export type MethodsOf<Sys> =
  Sys extends UnitSystem<RuleSet, infer M> ? M : never;

const ALL_METHODS: readonly Method[] = ['1', '2', '3', '4'];

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
    left: NumberUnit,
    right: NumberUnit,
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

const keyOf = (selector: Selector<string, RuleSet>) =>
  typeof selector === 'string' ? selector : selector.unit;

const buildSystem = (
  rules: Required<Rules>,
  methods: readonly Method[] = ALL_METHODS,
): UnitSystem<RuleSet> => {
  const algebra = createAlgebra(rules);
  const root = <U extends AnyUnit>(unit: U, meta?: Metadata) =>
    createNode<U, RuleSet>(algebra, unit, { kind: 'root' }, meta);

  return {
    multiplyRules: rules.multiply,
    divideRules: rules.divide,
    methods,
    root,
    num: (value, meta) => root(realNumber(value), meta),
    constant: (name, unit, meta) => root(unit, { ...meta, name }),
    input: (unit, { method = '1', ...meta }) => {
      if (!methods.includes(method)) {
        throw new UnitError(
          `${meta.name} is for method ${method}, but this system only has methods ${methods.join(', ')}`,
        );
      }
      if (method !== '1' && typeof unit === 'object') {
        // Copy the store so the caller's unit isn't changed
        const store = new ValueStore(unit.store.seed);
        store.applyMethod2();
        return createNode(
          algebra,
          { ...unit, store },
          { kind: 'input', method },
          meta,
        );
      }
      return createNode(algebra, unit, { kind: 'input', method }, meta);
    },
    select: (
      table: Record<string, unknown> & { name?: string },
      ...selectors: Selector<string, RuleSet>[]
    ) => {
      let current: unknown = table;
      for (const selector of selectors) {
        current = (current as Record<string, unknown>)[keyOf(selector)];
      }
      const path = selectors.map(keyOf).join('.');
      return createNode(
        algebra,
        current as NumberUnit,
        { kind: 'selection', selectors },
        { name: table.name ? `${table.name}[${path}]` : path },
      );
    },
    extend: (more) =>
      buildSystem(
        {
          multiply: [...rules.multiply, ...(more.multiply ?? [])],
          divide: [...rules.divide, ...(more.divide ?? [])],
        },
        methods,
      ),
    withMethods: (...narrowed) => {
      const outside = narrowed.filter((m) => !methods.includes(m));
      if (outside.length > 0) {
        throw new UnitError(
          `This system has no method ${outside.join(', ')} to narrow to`,
        );
      }
      return buildSystem(rules, narrowed) as never;
    },
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
  });
