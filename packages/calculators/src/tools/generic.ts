import type {
  Area,
  CountPerArea,
  Days,
  Distance,
  Electricity,
  Energy,
  EnergyPerHeadPerDay,
  EnergyPerMass,
  EnergyPerVolume,
  Head,
  Mass,
  MassDistance,
  MassPerArea,
  MassPerAreaPerDay,
  MassPerAreaPerYear,
  MassPerDay,
  MassPerElectricity,
  MassPerEnergy,
  MassPerHead,
  MassPerHeadPerDay,
  MassPerHeadPerYear,
  MassPerMass,
  MassPerMassDistance,
  MassPerTime,
  MassPerVolume,
  MassPerYear,
  RealNumber,
  Time,
  VoidUnit,
  Volume,
  VolumePerHeadPerDay,
  VolumePerMass,
  Years,
  BooleanUnit,
  StringUnit,
} from './units';

/**
 * The constraint used by every substance-parameterised unit. Calculators supply their own
 * vocabulary of literal substance names (VEERG uses `Substance` in units.ts); the tools only need
 * the names to be string literals so that mismatches are caught by `NoInfer` checks.
 */
export type AnySubstance = string;

/**
 * Every number unit, with the substance-parameterised units drawn from the substance vocabulary
 * `S`. A calculator can define its own number unit type with its own vocabulary, e.g.
 * `type NgerNumberUnit = GenericNumberUnit<NgerSubstance>`.
 */
export type GenericNumberUnit<S extends AnySubstance> =
  | MassPerMass<S, S>
  | Mass<S>
  | MassPerEnergy<S>
  | EnergyPerMass<S>
  | EnergyPerHeadPerDay
  | MassPerVolume<S, S>
  | MassPerArea<S>
  | MassPerAreaPerDay<S>
  | MassPerAreaPerYear<S>
  | MassPerYear<S>
  | MassPerTime<S>
  | MassPerElectricity<S>
  | MassPerHeadPerDay<S>
  | MassPerHeadPerYear<S>
  | MassPerDay<S>
  | VolumePerHeadPerDay<S>
  | MassPerHead<S>
  | VolumePerMass<S, S>
  | CountPerArea<S>
  | Days
  | Years
  | Head
  | EnergyPerVolume<S>
  | Volume<S>
  | Energy
  | Area
  | Electricity
  | Time
  | Distance
  | MassDistance<S>
  | MassPerMassDistance<S, S>
  | VoidUnit
  | RealNumber;

/**
 * A number unit of any substance vocabulary. This is the constraint the shared tools (containers,
 * constants, sums etc.) use, so that they work with every calculator's units.
 */
export type AnyNumberUnit = GenericNumberUnit<AnySubstance>;

export type AnyUnit = AnyNumberUnit | StringUnit | BooleanUnit;
