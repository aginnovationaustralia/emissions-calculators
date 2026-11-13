/*
 * The defaults the AIA emissions calculators use: every unit and rule module from `/units`, the
 * agricultural and greenhouse gas substance packs, and a ready-made unit system. Three ways to use
 * them:
 *
 * 1. As is: `defaultUnitSystem`, with `DefaultContainer<U>` as the container type.
 * 2. As a base: `defaultUnitSystem.extend({ multiply: [myRule] })`.
 * 3. A la carte: import from `/units` instead, and build a system from the rule modules you want
 *    and the substances you register. Nothing then registers the agricultural substances.
 *
 * Nothing here has side effects. Importing this entry point adds the agricultural and greenhouse
 * gas substances to `SubstanceRegistry` (types only) and nothing else.
 */
import { Container } from '../container.js';
import { createUnitSystem, RuleSetOf, UnitSystem } from '../system.js';
import { defaultDivideRules, defaultMultiplyRules } from '../units/index.js';

export * from '../units/index.js';
// Type exports, so the declarations of this entry point load the substance packs
export type {
  AgriculturalSubstance,
  GreenhouseGas,
} from '../substances/agriculture.js';

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
