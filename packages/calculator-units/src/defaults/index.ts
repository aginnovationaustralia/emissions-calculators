/*
 * The default substances, units and rules, as a starting point. Three ways to use them:
 *
 * 1. As is: `defaultUnitSystem`, with `DefaultContainer<U>` as the container type.
 * 2. As a base: `defaultUnitSystem.extend({ multiply: [myRule] })`.
 * 3. A la carte: `createUnitSystem({ multiply: [massPerMassTimesMass, ...] })` from the core entry,
 *    using only the rules you pick.
 *
 * Nothing here has side effects. Importing this entry point adds the default substances to
 * `SubstanceRegistry` (types only) and nothing else.
 */
import { Container } from '../container.js';
import { createUnitSystem, RuleSetOf, UnitSystem } from '../system.js';
import { defaultDivideRules, defaultMultiplyRules } from './rules.js';

export * from './rules.js';
export * from './units.js';

const system = createUnitSystem({
  multiply: defaultMultiplyRules,
  divide: defaultDivideRules,
});

/**
 * The type-level rules of the default system. Declared as an interface so types display as
 * `Container<Mass<'CO2e'>, DefaultRules>` rather than spelling out every rule.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DefaultRules extends RuleSetOf<typeof system> {}

export const defaultUnitSystem: UnitSystem<DefaultRules> = system;

/** A container created by `defaultUnitSystem`. */
export type DefaultContainer<U> = Container<U, DefaultRules>;
