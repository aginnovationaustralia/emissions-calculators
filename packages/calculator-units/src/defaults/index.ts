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
import { translate } from '../combinators.js';
import { Container, RuleSet } from '../container.js';
import type { Substance } from '../substances.js';
import { createUnitSystem, RuleSetOf, UnitSystem } from '../system.js';
import { defaultDivideRules, defaultMultiplyRules } from './rules.js';
import type * as Units from './units.js';
import { Mass } from './units.js';

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

/** Any of the default number units. */
export type DefaultNumberUnit =
  | Units.Energy
  | Units.Area
  | Units.Time
  | Units.Electricity
  | Units.EnergyPerHeadPerDay
  | Units.Days
  | Units.Years
  | Units.Head
  | Units.Distance
  | Units.Mass
  | Units.Volume
  | Units.MassPerEnergy
  | Units.MassPerElectricity
  | Units.EnergyPerVolume
  | Units.EnergyPerMass
  | Units.MassPerArea
  | Units.MassPerAreaPerDay
  | Units.MassPerAreaPerYear
  | Units.MassPerYear
  | Units.MassPerTime
  | Units.MassPerDay
  | Units.MassPerHead
  | Units.MassPerHeadPerDay
  | Units.MassPerHeadPerYear
  | Units.VolumePerHeadPerDay
  | Units.CountPerArea
  | Units.MassDistance
  | Units.MassPerMass
  | Units.MassPerMassDistance
  | Units.MassPerVolume
  | Units.VolumePerMass;

/**
 * Treats a mass of one substance as the same mass of another, keeping the value and history. Unit
 * rules refuse to combine different substances, so use this only where that equivalence is a
 * deliberate modelling choice (e.g. a mass based allocation between products), never to get around
 * a genuine unit mismatch.
 */
export const relabelMass = <
  S1 extends Substance,
  S2 extends Substance,
  RS extends RuleSet,
>(
  from: Container<Mass<S1>, RS>,
  substance: S2,
): Container<Mass<S2>, RS> =>
  translate<Mass<S2>, Mass<S1>, RS>(
    { __unitType: 'Mass', substance, store: from.unit.store },
    from,
  );
