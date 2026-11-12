/*
 * The library of units and rules, with no substances. Pick the rule modules you want and register
 * your own substances (or a substance pack) to build a unit system from exactly what you need:
 *
 *   import { createUnitSystem } from '@aginnovationaustralia/calculator-units';
 *   import { energyRules, materialRules } from '@aginnovationaustralia/calculator-units/units';
 *   import '@aginnovationaustralia/calculator-units/substances/greenhouse-gases';
 *
 *   const units = createUnitSystem(materialRules).extend(energyRules);
 *
 * Importing this entry point registers no substances, so on its own `Substance` is `string`.
 */
import { translate } from '../combinators.js';
import { Container, Method, RuleSet } from '../container.js';
import type { Substance } from '../substances.js';
import type * as Units from './units.js';
import { Mass } from './units.js';

export * from './rules.js';
export * from './units.js';

/** Any of the library's number units. */
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
  M extends Method,
>(
  from: Container<Mass<S1>, RS, M>,
  substance: S2,
): Container<Mass<S2>, RS, M> =>
  translate<Mass<S2>, Mass<S1>, RS, M>(
    { __unitType: 'Mass', substance, store: from.unit.store },
    from,
  );
