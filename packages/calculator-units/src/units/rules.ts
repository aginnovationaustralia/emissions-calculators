/*
 * The default unit relationships, ported from the emissions calculators.
 *
 * Each rule is a pattern: the left unit, the right unit and the result, with placeholders (A, B, C)
 * where any substance can go. The same placeholder in several places means the same substance, and
 * is checked at compile time and runtime. See ../patterns.ts.
 *
 * Use them all through `defaultMultiplyRules` / `defaultDivideRules`, by module (`materialRules`,
 * `energyRules`, ...), or pick individual rules.
 */
import { A, B, C, division, multiplication } from '../patterns.js';
import { realNumber } from '../units.js';
import {
  area,
  days,
  distance,
  electricity,
  energy,
  energyPerHeadPerDay,
  energyPerMass,
  energyPerVolume,
  head,
  mass,
  massDistance,
  massPerArea,
  massPerAreaPerDay,
  massPerAreaPerYear,
  massPerDay,
  massPerElectricity,
  massPerEnergy,
  massPerHead,
  massPerHeadPerDay,
  massPerHeadPerYear,
  massPerMass,
  massPerMassDistance,
  massPerTime,
  massPerVolume,
  massPerYear,
  time,
  volume,
  volumePerHeadPerDay,
  volumePerMass,
  years,
} from './units.js';

// -------- Multiplication --------

/** MassPerMass<A, B> * Mass<B> = Mass<A> */
export const massPerMassTimesMass = multiplication(
  massPerMass(A, B),
  mass(B),
  mass(A),
);

/** Mass<B> * MassPerMass<A, B> = Mass<A> */
export const massTimesMassPerMass = multiplication(
  mass(B),
  massPerMass(A, B),
  mass(A),
);

/** EnergyPerVolume<A> * Volume<A> = Energy */
export const energyPerVolumeTimesVolume = multiplication(
  energyPerVolume(A),
  volume(A),
  energy(),
);

/** MassPerEnergy<A> * EnergyPerVolume<B> = MassPerVolume<A, B> */
export const massPerEnergyTimesEnergyPerVolume = multiplication(
  massPerEnergy(A),
  energyPerVolume(B),
  massPerVolume(A, B),
);

/** MassPerEnergy<A> * Energy = Mass<A> */
export const massPerEnergyTimesEnergy = multiplication(
  massPerEnergy(A),
  energy(),
  mass(A),
);

/** EnergyPerMass<A> * Mass<A> = Energy */
export const energyPerMassTimesMass = multiplication(
  energyPerMass(A),
  mass(A),
  energy(),
);

/** MassPerArea<A> * Area = Mass<A> */
export const massPerAreaTimesArea = multiplication(
  massPerArea(A),
  area(),
  mass(A),
);

/** MassPerTime<A> * Time = Mass<A> */
export const massPerTimeTimesTime = multiplication(
  massPerTime(A),
  time(),
  mass(A),
);

/** MassPerVolume<A, B> * Volume<B> = Mass<A> */
export const massPerVolumeTimesVolume = multiplication(
  massPerVolume(A, B),
  volume(B),
  mass(A),
);

/** Electricity * MassPerElectricity<A> = Mass<A> */
export const electricityTimesMassPerElectricity = multiplication(
  electricity(),
  massPerElectricity(A),
  mass(A),
);

/** MassPerHead<B> * MassPerMass<A, B> = MassPerHead<A> */
export const massPerHeadTimesMassPerMass = multiplication(
  massPerHead(B),
  massPerMass(A, B),
  massPerHead(A),
);

/** MassPerHeadPerDay<B> * MassPerMass<A, B> = MassPerHeadPerDay<A> */
export const massPerHeadPerDayTimesMassPerMass = multiplication(
  massPerHeadPerDay(B),
  massPerMass(A, B),
  massPerHeadPerDay(A),
);

/** MassPerHeadPerDay<A> * Head = MassPerDay<A> */
export const massPerHeadPerDayTimesHead = multiplication(
  massPerHeadPerDay(A),
  head(),
  massPerDay(A),
);

/** MassPerHeadPerDay<A> * Days = MassPerHead<A> */
export const massPerHeadPerDayTimesDays = multiplication(
  massPerHeadPerDay(A),
  days(),
  massPerHead(A),
);

/** Head * MassPerHead<A> = Mass<A> */
export const headTimesMassPerHead = multiplication(
  head(),
  massPerHead(A),
  mass(A),
);

/** Head * MassPerHeadPerYear<A> = MassPerYear<A> */
export const headTimesMassPerHeadPerYear = multiplication(
  head(),
  massPerHeadPerYear(A),
  massPerYear(A),
);

/** MassPerHeadPerYear<A> * Years = MassPerHead<A> */
export const massPerHeadPerYearTimesYears = multiplication(
  massPerHeadPerYear(A),
  years(),
  massPerHead(A),
);

/** MassPerEnergy<A> * EnergyPerMass<A> = RealNumber */
export const massPerEnergyTimesEnergyPerMass = multiplication(
  massPerEnergy(A),
  energyPerMass(A),
  realNumber(),
);

/** MassPerDay<A> * Days = Mass<A> */
export const massPerDayTimesDays = multiplication(
  massPerDay(A),
  days(),
  mass(A),
);

/** MassPerHeadPerDay<B> * VolumePerMass<A, B> = VolumePerHeadPerDay<A> */
export const massPerHeadPerDayTimesVolumePerMass = multiplication(
  massPerHeadPerDay(B),
  volumePerMass(A, B),
  volumePerHeadPerDay(A),
);

/** VolumePerHeadPerDay<B> * MassPerVolume<A, B> = MassPerHeadPerDay<A> */
export const volumePerHeadPerDayTimesMassPerVolume = multiplication(
  volumePerHeadPerDay(B),
  massPerVolume(A, B),
  massPerHeadPerDay(A),
);

/** MassPerAreaPerDay<A> * Days = MassPerArea<A> */
export const massPerAreaPerDayTimesDays = multiplication(
  massPerAreaPerDay(A),
  days(),
  massPerArea(A),
);

/** MassPerAreaPerDay<A> * Area = MassPerDay<A> */
export const massPerAreaPerDayTimesArea = multiplication(
  massPerAreaPerDay(A),
  area(),
  massPerDay(A),
);

/** MassPerAreaPerYear<A> * Area = MassPerYear<A> */
export const massPerAreaPerYearTimesArea = multiplication(
  massPerAreaPerYear(A),
  area(),
  massPerYear(A),
);

/** MassPerAreaPerYear<A> * Years = MassPerArea<A> */
export const massPerAreaPerYearTimesYears = multiplication(
  massPerAreaPerYear(A),
  years(),
  massPerArea(A),
);

/** MassPerAreaPerYear<B> * MassPerMass<A, B> = MassPerAreaPerYear<A> */
export const massPerAreaPerYearTimesMassPerMass = multiplication(
  massPerAreaPerYear(B),
  massPerMass(A, B),
  massPerAreaPerYear(A),
);

/** MassPerYear<B> * MassPerMass<A, B> = MassPerYear<A> */
export const massPerYearTimesMassPerMass = multiplication(
  massPerYear(B),
  massPerMass(A, B),
  massPerYear(A),
);

/** MassPerYear<A> * Years = Mass<A> */
export const massPerYearTimesYears = multiplication(
  massPerYear(A),
  years(),
  mass(A),
);

/** Mass<A> * Distance = MassDistance<A> */
export const massTimesDistance = multiplication(
  mass(A),
  distance(),
  massDistance(A),
);

/** MassPerMassDistance<A, B> * Distance = MassPerMass<A, B> */
export const massPerMassDistanceTimesDistance = multiplication(
  massPerMassDistance(A, B),
  distance(),
  massPerMass(A, B),
);

/** MassPerMassDistance<A, B> * MassDistance<B> = Mass<A> */
export const massPerMassDistanceTimesMassDistance = multiplication(
  massPerMassDistance(A, B),
  massDistance(B),
  mass(A),
);

/** MassPerHeadPerDay<A> * EnergyPerMass<A> = EnergyPerHeadPerDay */
export const massPerHeadPerDayTimesEnergyPerMass = multiplication(
  massPerHeadPerDay(A),
  energyPerMass(A),
  energyPerHeadPerDay(),
);

/** MassPerVolume<B, C> * MassPerMass<A, B> = MassPerVolume<A, C> */
export const massPerVolumeTimesMassPerMass = multiplication(
  massPerVolume(B, C),
  massPerMass(A, B),
  massPerVolume(A, C),
);

// -------- Division --------

/** Mass<A> / Area = MassPerArea<A> */
export const massDividedByArea = division(mass(A), area(), massPerArea(A));

/** Mass<A> / MassPerMass<A, B> = Mass<B> */
export const massDividedByMassPerMass = division(
  mass(A),
  massPerMass(A, B),
  mass(B),
);

/** MassPerArea<A> / Years = MassPerAreaPerYear<A> */
export const massPerAreaDividedByYears = division(
  massPerArea(A),
  years(),
  massPerAreaPerYear(A),
);

/** EnergyPerHeadPerDay / EnergyPerMass<A> = MassPerHeadPerDay<A> */
export const energyPerHeadPerDayDividedByEnergyPerMass = division(
  energyPerHeadPerDay(),
  energyPerMass(A),
  massPerHeadPerDay(A),
);

/** MassPerHead<A> / Days = MassPerHeadPerDay<A> */
export const massPerHeadDividedByDays = division(
  massPerHead(A),
  days(),
  massPerHeadPerDay(A),
);

/** MassPerHeadPerDay<A> / MassPerMass<A, B> = MassPerHeadPerDay<B> */
export const massPerHeadPerDayDividedByMassPerMass = division(
  massPerHeadPerDay(A),
  massPerMass(A, B),
  massPerHeadPerDay(B),
);

/** Mass<A> / MassPerVolume<A, B> = Volume<B> */
export const massDividedByMassPerVolume = division(
  mass(A),
  massPerVolume(A, B),
  volume(B),
);

/** MassPerEnergy<A> / MassPerMass<A, B> = MassPerEnergy<B> */
export const massPerEnergyDividedByMassPerMass = division(
  massPerEnergy(A),
  massPerMass(A, B),
  massPerEnergy(B),
);

// ---------------------------------------------------------------------------------------------
// Rule modules. Each is a set of rules that belong together, to build a unit system from:
//
//   createUnitSystem(materialRules).extend(energyRules)
//
// A module's rules may use units from other modules (e.g. livestock rules use Days and
// EnergyPerMass), but no two modules handle the same pair of units, so any combination can be used.

/** Mass and volume of substances, and the ratios between them: MassPerMass, MassPerVolume, VolumePerMass. */
export const materialRules = {
  multiply: [
    massPerMassTimesMass,
    massTimesMassPerMass,
    massPerVolumeTimesVolume,
    massPerVolumeTimesMassPerMass,
  ],
  divide: [massDividedByMassPerMass, massDividedByMassPerVolume],
} as const;

/** Energy and electricity: energy content factors (per mass, per volume) and emission factors (per energy, per electricity). */
export const energyRules = {
  multiply: [
    energyPerVolumeTimesVolume,
    massPerEnergyTimesEnergyPerVolume,
    massPerEnergyTimesEnergy,
    energyPerMassTimesMass,
    electricityTimesMassPerElectricity,
    massPerEnergyTimesEnergyPerMass,
  ],
  divide: [massPerEnergyDividedByMassPerMass],
} as const;

/** Rates over time: MassPerTime, MassPerDay, MassPerYear. */
export const timeRules = {
  multiply: [
    massPerTimeTimesTime,
    massPerDayTimesDays,
    massPerYearTimesMassPerMass,
    massPerYearTimesYears,
  ],
  divide: [],
} as const;

/** Rates over an area: MassPerArea, MassPerAreaPerDay, MassPerAreaPerYear. */
export const landRules = {
  multiply: [
    massPerAreaTimesArea,
    massPerAreaPerDayTimesDays,
    massPerAreaPerDayTimesArea,
    massPerAreaPerYearTimesArea,
    massPerAreaPerYearTimesYears,
    massPerAreaPerYearTimesMassPerMass,
  ],
  divide: [massDividedByArea, massPerAreaDividedByYears],
} as const;

/** Rates per head of livestock: MassPerHead, MassPerHeadPerDay, MassPerHeadPerYear, EnergyPerHeadPerDay, VolumePerHeadPerDay. */
export const livestockRules = {
  multiply: [
    massPerHeadTimesMassPerMass,
    massPerHeadPerDayTimesMassPerMass,
    massPerHeadPerDayTimesHead,
    massPerHeadPerDayTimesDays,
    headTimesMassPerHead,
    headTimesMassPerHeadPerYear,
    massPerHeadPerYearTimesYears,
    massPerHeadPerDayTimesVolumePerMass,
    volumePerHeadPerDayTimesMassPerVolume,
    massPerHeadPerDayTimesEnergyPerMass,
  ],
  divide: [
    energyPerHeadPerDayDividedByEnergyPerMass,
    massPerHeadDividedByDays,
    massPerHeadPerDayDividedByMassPerMass,
  ],
} as const;

/** Freight: MassDistance and MassPerMassDistance. */
export const transportRules = {
  multiply: [
    massTimesDistance,
    massPerMassDistanceTimesDistance,
    massPerMassDistanceTimesMassDistance,
  ],
  divide: [],
} as const;

/** Every rule module. */
export const ruleModules = {
  material: materialRules,
  energy: energyRules,
  time: timeRules,
  land: landRules,
  livestock: livestockRules,
  transport: transportRules,
} as const;

/** Every default multiplication rule, from every module. */
export const defaultMultiplyRules = [
  ...materialRules.multiply,
  ...energyRules.multiply,
  ...timeRules.multiply,
  ...landRules.multiply,
  ...livestockRules.multiply,
  ...transportRules.multiply,
] as const;

/** Every default division rule, from every module. */
export const defaultDivideRules = [
  ...materialRules.divide,
  ...energyRules.divide,
  ...timeRules.divide,
  ...landRules.divide,
  ...livestockRules.divide,
  ...transportRules.divide,
] as const;
