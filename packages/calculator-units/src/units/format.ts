/*
 * Display names for units, e.g. "kg CO2/kg Fuel".
 *
 * `formatUnit` formats every unit this package knows: string, boolean, RealNumber, Void and the
 * units in this library. A calculator with units of its own narrows with `isKnownPackageUnit`
 * and formats only those:
 *
 *   type MyUnit = KnownPackageUnit | Widget;
 *
 *   const formatMyUnit = (unit: MyUnit) =>
 *     isKnownPackageUnit(unit) ? formatUnit(unit) : formatWidget(unit);
 */
import type { Substance } from '../substances.js';
import {
  AnyUnit,
  BooleanUnit,
  isBooleanUnit,
  isNumberUnit,
  isStringUnit,
  RealNumber,
  StringUnit,
  VoidUnit,
} from '../units.js';
import type { DefaultNumberUnit } from './index.js';

export type FormatUnitOptions = {
  /** How substances are named. Defaults to the substance itself, e.g. "CO2". */
  substanceName?: (substance: Substance) => string;
};

/** Every number unit this package knows: RealNumber, Void and the units in this library. */
export type KnownPackageNumberUnit = DefaultNumberUnit | RealNumber | VoidUnit;

/** Every unit this package knows: the core units and the units in this library. */
export type KnownPackageUnit =
  KnownPackageNumberUnit | StringUnit | BooleanUnit;
type KnownUnitType = KnownPackageNumberUnit['__unitType'];
type UnitOfType<K extends KnownUnitType> = Extract<
  KnownPackageNumberUnit,
  { __unitType: K }
>;

/**
 * A formatter for each known unit type. Typed as a mapped type over `KnownUnitType`, so adding a
 * unit to `DefaultNumberUnit` without a formatter here is a type error.
 */
const formatters: {
  [K in KnownUnitType]: (
    unit: UnitOfType<K>,
    name: (substance: Substance) => string,
  ) => string;
} = {
  Void: () => 'Void',
  RealNumber: () => 'real number',
  Energy: () => 'J',
  Area: () => 'm^2',
  Time: () => 'h',
  Electricity: () => 'kWh',
  EnergyPerHeadPerDay: () => 'J/head/day',
  Days: () => 'days',
  Years: () => 'years',
  Head: () => 'head',
  Distance: () => 'm',
  Mass: (u, name) => `kg ${name(u.substance)}`,
  Volume: (u, name) => `L ${name(u.substance)}`,
  MassPerEnergy: (u, name) => `kg ${name(u.substance)}/J`,
  MassPerElectricity: (u, name) => `kg ${name(u.substance)}/kWh`,
  EnergyPerVolume: (u, name) => `J/L ${name(u.substance)}`,
  EnergyPerMass: (u, name) => `J/kg ${name(u.substance)}`,
  MassPerArea: (u, name) => `kg ${name(u.substance)}/m^2`,
  MassPerAreaPerDay: (u, name) => `kg ${name(u.substance)}/m^2/day`,
  MassPerAreaPerYear: (u, name) => `kg ${name(u.substance)}/m^2/year`,
  MassPerYear: (u, name) => `kg ${name(u.substance)}/year`,
  MassPerTime: (u, name) => `kg ${name(u.substance)}/h`,
  MassPerDay: (u, name) => `kg ${name(u.substance)}/day`,
  MassPerHead: (u, name) => `kg ${name(u.substance)}/head`,
  MassPerHeadPerDay: (u, name) => `kg ${name(u.substance)}/head/day`,
  MassPerHeadPerYear: (u, name) => `kg ${name(u.substance)}/head/year`,
  VolumePerHeadPerDay: (u, name) => `L ${name(u.substance)}/head/day`,
  CountPerArea: () => 'm^-2',
  MassDistance: (u, name) => `kgm ${name(u.substance)}`,
  MassPerMass: (u, name) => `kg ${name(u.snum)}/kg ${name(u.sdenom)}`,
  MassPerMassDistance: (u, name) => `kg ${name(u.snum)}/kgm ${name(u.sdenom)}`,
  MassPerVolume: (u, name) => `kg ${name(u.mass)}/L ${name(u.volume)}`,
  VolumePerMass: (u, name) => `L ${name(u.volume)}/kg ${name(u.mass)}`,
};

/**
 * True when this package knows the unit, so `formatUnit` can format it. Narrows a union of package
 * and local units to the local units in its `false` branch.
 */
export const isKnownPackageUnit = (unit: AnyUnit): unit is KnownPackageUnit =>
  !isNumberUnit(unit) ||
  Object.prototype.hasOwnProperty.call(formatters, unit.__unitType);

const formatKnown = <K extends KnownUnitType>(
  type: K,
  unit: UnitOfType<K>,
  name: (substance: Substance) => string,
): string => formatters[type](unit, name);

/**
 * The display name of a unit this package knows, e.g. "kg CO2". Check other units with
 * `isKnownPackageUnit` first (see above).
 */
export function formatUnit(
  unit: KnownPackageUnit,
  options: FormatUnitOptions = {},
): string {
  if (isStringUnit(unit)) {
    return `string: (${unit})`;
  }
  if (isBooleanUnit(unit)) {
    return 'boolean';
  }
  const name = options.substanceName ?? ((substance: Substance) => substance);
  return formatKnown(unit.__unitType, unit, name);
}
