import { isProportion, NumberSchemaTweaker } from './inputs';
import {
  CountPerArea,
  EnergyPerMass,
  EnergyPerVolume,
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
  NumberUnit,
  Substance,
  Volume,
  VolumePerHeadPerDay,
  VolumePerMass,
} from './units';

// Base unit name strings - defined once here and reused across the static
// and dynamic display strings below, so each word only appears once in the file.
const KILOGRAMS = 'kilograms';
const KILOGRAM = 'kilogram';
const TONNES = 'tonnes';
const LITRES = 'litres';
const LITRE = 'litre';
const CUBIC_METRES = 'cubic metres';
const CUBIC_METRE = 'cubic metre';
const SQUARE_METRES = 'square metres';
const SQUARE_METRE = 'square metre';
const HECTARES = 'hectares';
const HECTARE = 'hectare';
const METRES = 'metres';
const KILOMETRES = 'kilometres';
const JOULES = 'joules';
const JOULE = 'joule';
const KILOWATT_HOURS = 'kilowatt-hours';
const KILOWATT_HOUR = 'kilowatt-hour';
const MEGAWATT_HOURS = 'megawatt-hours';
const HEAD = 'head';
const DAY = 'day';
const DAYS = 'days';
const YEAR = 'year';
const YEARS = 'years';
const HOUR = 'hour';
const HOURS = 'hours';
const UNITLESS = 'unitless';
const NUMBER = 'number';
const PERCENTAGE = 'percentage';
const HEAD_PER_DAY = `${HEAD} per ${DAY}`;
const HEAD_PER_YEAR = `${HEAD} per ${YEAR}`;

type OrderStrings = Record<number, string>;

const Area: OrderStrings = {
  1: SQUARE_METRES,
  10000: HECTARES,
};

const Days: OrderStrings = {
  1: DAYS,
};

const Distance: OrderStrings = {
  1: METRES,
  1000: KILOMETRES,
};

const Electricity: OrderStrings = {
  1: KILOWATT_HOURS,
  1000: MEGAWATT_HOURS,
};

const Energy: OrderStrings = {
  1: JOULES,
};

const EnergyPerHeadPerDay: OrderStrings = {
  1: `${JOULES} per ${HEAD_PER_DAY}`,
};

const Head: OrderStrings = {
  1: HEAD,
};

const RealNumber: OrderStrings = {
  0.01: PERCENTAGE,
  1: NUMBER,
};

const Time: OrderStrings = {
  1: HOURS,
};

const Void: OrderStrings = {
  1: UNITLESS,
};

const Years: OrderStrings = {
  1: YEARS,
};

type NumberUnitTypes = NumberUnit['__unitType'];

// Any unit type with a substance (or two) has its display string built dynamically,
// so it can include the substance's display name. See the *String functions below.
type DynamicUnitTypes =
  | 'CountPerArea'
  | 'EnergyPerMass'
  | 'EnergyPerVolume'
  | 'Mass'
  | 'MassDistance'
  | 'MassPerArea'
  | 'MassPerAreaPerDay'
  | 'MassPerAreaPerYear'
  | 'MassPerDay'
  | 'MassPerElectricity'
  | 'MassPerEnergy'
  | 'MassPerHead'
  | 'MassPerHeadPerDay'
  | 'MassPerHeadPerYear'
  | 'MassPerMass'
  | 'MassPerMassDistance'
  | 'MassPerTime'
  | 'MassPerVolume'
  | 'MassPerYear'
  | 'Volume'
  | 'VolumePerHeadPerDay'
  | 'VolumePerMass';

type UnitsWithScaledStrings = Exclude<NumberUnitTypes, DynamicUnitTypes>;

const bigMap: Record<UnitsWithScaledStrings, OrderStrings> = {
  Area,
  Days,
  Distance,
  Electricity,
  Energy,
  EnergyPerHeadPerDay,
  Head,
  RealNumber,
  Time,
  Void,
  Years,
};

export const getDisplayUnit = <U extends NumberUnit>(
  factory: (n: number) => U,
  schemaTweaker?: NumberSchemaTweaker,
): string => {
  const unitExample = factory(1);
  const scaledValue = unitExample.store.toNumber();

  const lookup = lookupDisplayUnit(unitExample, scaledValue);
  if (!lookup) {
    throw new Error(
      `No display unit found for unit type ${unitExample.__unitType} and scaled value ${scaledValue}`,
    );
  }

  // NOTE: Detect a unit is a simple number and restricted to 0 to 1. This is common and worth improving in this way
  if (lookup === NUMBER && schemaTweaker === isProportion) {
    return '0-1';
  }
  return lookup;
};

const substanceDisplayNames: Record<Substance, string> = {
  Carbon: 'carbon',
  Chemical: 'chemical',
  'Inorganic Fertiliser': 'inorganic fertiliser',
  'Organic Fertiliser': 'organic fertiliser',
  CO2: 'CO2',
  CH4: 'CH4',
  N2O: 'N2O',
  N: 'nitrogen',
  'Volatilised N': 'volatilised nitrogen',
  CO2e: 'CO2e',
  Refrigerant: 'refrigerant',
  Fuel: 'fuel',
  'Greasy Wool': 'greasy wool',
  'Clean Wool': 'clean wool',
  FluidWaste: 'fluid waste',
  Oxygen: 'oxygen',
  Urea: 'urea',
  DryMatter: 'dry matter',
  CrudeProtein: 'crude protein',
  CropResidue: 'crop residue',
  Yield: 'yield',
  Lime: 'lime',
  'Solid Waste': 'solid waste',
  Milk: 'milk',
  'Milk Solids': 'milk solids',
  Liveweight: 'liveweight',
  'Purchased Feed': 'purchased feed',
  'Purchased Mineral Supplement': 'purchased mineral supplement',
  'Volatile Solids': 'volatile solids',
  COD: 'COD',
  Packaging: 'packaging',
  'Organic Amendment': 'organic amendment',
  Trees: 'trees',
  'Freight Goods': 'freight goods',
  Eggs: 'eggs',
  Fish: 'fish',
};

const substanceDisplayName = (substance: Substance): string =>
  substanceDisplayNames[substance];

/**
 * Builds a "<unitName> <substance> per <perUnitName>[ <perSubstance>]" display string.
 * Covers the two common shapes used by the per-X dynamic unit strings below:
 * one substance (e.g. "kilograms dry matter per hectare"), or two
 * (e.g. "kilograms dry matter per litre milk").
 */
const perString = (
  unitName: string,
  substance: Substance,
  perUnitName: string,
  perSubstance?: Substance,
): string => {
  const perPart = perSubstance
    ? `${perUnitName} ${substanceDisplayName(perSubstance)}`
    : perUnitName;
  return `${unitName} ${substanceDisplayName(substance)} per ${perPart}`;
};

const massString = <U extends Mass<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return `${KILOGRAMS} ${substanceDisplayName(unit.substance)}`;
  } else if (scaledValue === 1000) {
    return `${TONNES} ${substanceDisplayName(unit.substance)}`;
  }
  return undefined;
};

const volumeString = <U extends Volume<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return `${LITRES} ${substanceDisplayName(unit.substance)}`;
  } else if (scaledValue === 1000) {
    return `${CUBIC_METRES} ${substanceDisplayName(unit.substance)}`;
  }
  return undefined;
};

const massPerMassString = <U extends MassPerMass<Substance, Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.snum, KILOGRAM, unit.sdenom);
  }
  return undefined;
};

const massPerHeadPerDayString = <U extends MassPerHeadPerDay<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.substance, HEAD_PER_DAY);
  }
  return undefined;
};

const massPerHeadPerYearString = <U extends MassPerHeadPerYear<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.substance, HEAD_PER_YEAR);
  }
  return undefined;
};

const massPerEnergyString = <U extends MassPerEnergy<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.substance, JOULE);
  }
  return undefined;
};

const volumePerHeadPerDayString = <U extends VolumePerHeadPerDay<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(LITRES, unit.substance, HEAD_PER_DAY);
  }
  return undefined;
};

const energyPerMassString = <U extends EnergyPerMass<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return `${JOULES} per ${KILOGRAM} ${substanceDisplayName(unit.substance)}`;
  }
  return undefined;
};

const energyPerVolumeString = <U extends EnergyPerVolume<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return `${JOULES} per ${LITRE} ${substanceDisplayName(unit.substance)}`;
  }
  return undefined;
};

const massPerAreaString = <U extends MassPerArea<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.substance, SQUARE_METRE);
  } else if (scaledValue === 0.1) {
    return perString(TONNES, unit.substance, HECTARE);
  }
  return undefined;
};

const massPerAreaPerDayString = <U extends MassPerAreaPerDay<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.substance, `${SQUARE_METRE} per ${DAY}`);
  }
  return undefined;
};

const massPerAreaPerYearString = <U extends MassPerAreaPerYear<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.substance, `${SQUARE_METRE} per ${YEAR}`);
  }
  return undefined;
};

const massPerYearString = <U extends MassPerYear<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.substance, YEAR);
  }
  return undefined;
};

const massPerTimeString = <U extends MassPerTime<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.substance, HOUR);
  }
  return undefined;
};

const massPerElectricityString = <U extends MassPerElectricity<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.substance, KILOWATT_HOUR);
  }
  return undefined;
};

const massPerDayString = <U extends MassPerDay<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.substance, DAY);
  }
  return undefined;
};

const massPerHeadString = <U extends MassPerHead<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.substance, HEAD);
  }
  return undefined;
};

const massPerVolumeString = <U extends MassPerVolume<Substance, Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(KILOGRAMS, unit.mass, LITRE, unit.volume);
  } else if (scaledValue === 0.001) {
    return perString(KILOGRAMS, unit.mass, CUBIC_METRE, unit.volume);
  }
  return undefined;
};

const volumePerMassString = <U extends VolumePerMass<Substance, Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return perString(LITRES, unit.volume, KILOGRAM, unit.mass);
  }
  return undefined;
};

const countPerAreaString = <U extends CountPerArea<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return `${unit.substance.toLowerCase()} per ${SQUARE_METRE}`;
  } else if (scaledValue === 0.0001) {
    return `${unit.substance.toLowerCase()} per ${HECTARE}`;
  }
  return undefined;
};

const massDistanceString = <U extends MassDistance<Substance>>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return `${KILOGRAM} ${substanceDisplayName(unit.substance)} ${METRES}`;
  }
  return undefined;
};

const massPerMassDistanceString = <
  U extends MassPerMassDistance<Substance, Substance>,
>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  if (scaledValue === 1) {
    return `${perString(KILOGRAMS, unit.snum, KILOGRAM, unit.sdenom)} ${METRES}`;
  }
  return undefined;
};

const lookupDisplayUnit = <U extends NumberUnit>(
  unit: U,
  scaledValue: number,
): string | undefined => {
  const unitType = unit.__unitType;
  if (unitType === 'Mass') {
    return massString(unit, scaledValue);
  } else if (unitType === 'Volume') {
    return volumeString(unit, scaledValue);
  } else if (unitType === 'MassPerMass') {
    return massPerMassString(unit, scaledValue);
  } else if (unitType === 'MassPerHeadPerDay') {
    return massPerHeadPerDayString(unit, scaledValue);
  } else if (unitType === 'MassPerHeadPerYear') {
    return massPerHeadPerYearString(unit, scaledValue);
  } else if (unitType === 'MassPerEnergy') {
    return massPerEnergyString(unit, scaledValue);
  } else if (unitType === 'VolumePerHeadPerDay') {
    return volumePerHeadPerDayString(unit, scaledValue);
  } else if (unitType === 'EnergyPerMass') {
    return energyPerMassString(unit, scaledValue);
  } else if (unitType === 'EnergyPerVolume') {
    return energyPerVolumeString(unit, scaledValue);
  } else if (unitType === 'MassPerArea') {
    return massPerAreaString(unit, scaledValue);
  } else if (unitType === 'MassPerAreaPerDay') {
    return massPerAreaPerDayString(unit, scaledValue);
  } else if (unitType === 'MassPerAreaPerYear') {
    return massPerAreaPerYearString(unit, scaledValue);
  } else if (unitType === 'MassPerYear') {
    return massPerYearString(unit, scaledValue);
  } else if (unitType === 'MassPerTime') {
    return massPerTimeString(unit, scaledValue);
  } else if (unitType === 'MassPerElectricity') {
    return massPerElectricityString(unit, scaledValue);
  } else if (unitType === 'MassPerDay') {
    return massPerDayString(unit, scaledValue);
  } else if (unitType === 'MassPerHead') {
    return massPerHeadString(unit, scaledValue);
  } else if (unitType === 'MassPerVolume') {
    return massPerVolumeString(unit, scaledValue);
  } else if (unitType === 'VolumePerMass') {
    return volumePerMassString(unit, scaledValue);
  } else if (unitType === 'CountPerArea') {
    return countPerAreaString(unit, scaledValue);
  } else if (unitType === 'MassDistance') {
    return massDistanceString(unit, scaledValue);
  } else if (unitType === 'MassPerMassDistance') {
    return massPerMassDistanceString(unit, scaledValue);
  } else {
    return bigMap[unitType]?.[scaledValue];
  }
};
