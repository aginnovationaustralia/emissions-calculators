/*
 * The default unit relationships, ported from the emissions calculators.
 *
 * Each rule is a pair: an interface describing it to the compiler, and a value implementing it.
 * The value is what gets passed to a unit system; its type carries the interface. Use them all
 * through `defaultMultiplyRules` / `defaultDivideRules`, or pick individual rules.
 *
 * Shared type variables (B in "MassPerMass<A, B> * Mass<B>") become runtime substance checks.
 */
import {
  divideRule,
  multiplyRule,
  Rule,
  RuleType,
  whenSame,
} from '../rules.js';
import type { Substance } from '../substances.js';
import { RealNumber, realNumber } from '../units.js';
import {
  Area,
  Days,
  Distance,
  Electricity,
  Energy,
  energy,
  EnergyPerHeadPerDay,
  energyPerHeadPerDay,
  EnergyPerMass,
  EnergyPerVolume,
  Head,
  mass,
  Mass,
  massDistance,
  MassDistance,
  massPerArea,
  MassPerArea,
  MassPerAreaPerDay,
  MassPerAreaPerYear,
  massPerAreaPerYear,
  massPerDay,
  MassPerDay,
  MassPerElectricity,
  MassPerEnergy,
  massPerEnergy,
  MassPerHead,
  massPerHead,
  massPerHeadPerDay,
  MassPerHeadPerDay,
  MassPerHeadPerYear,
  MassPerMass,
  massPerMass,
  MassPerMassDistance,
  MassPerTime,
  MassPerVolume,
  massPerVolume,
  MassPerYear,
  massPerYear,
  Time,
  Volume,
  volume,
  volumePerHeadPerDay,
  VolumePerHeadPerDay,
  VolumePerMass,
  Years,
} from './units.js';

/** MassPerMass<A, B> * Mass<B> = Mass<A> */
export interface MassPerMassTimesMass extends RuleType {
  rule: this['L'] extends MassPerMass<infer A, infer B>
    ? Rule<Mass<B>, Mass<A>>
    : never;
}
export const massPerMassTimesMass = multiplyRule<MassPerMassTimesMass>()(
  'MassPerMass',
  'Mass',
  (l: MassPerMass, r: Mass) =>
    whenSame(l.sdenom, r.substance, () => mass(l.snum)),
);

/** Mass<B> * MassPerMass<A, B> = Mass<A> */
export interface MassTimesMassPerMass extends RuleType {
  rule: this['L'] extends Mass<infer B>
    ? Rule<
        MassPerMass<Substance, B>,
        this['R'] extends MassPerMass<infer A, Substance> ? Mass<A> : never
      >
    : never;
}
export const massTimesMassPerMass = multiplyRule<MassTimesMassPerMass>()(
  'Mass',
  'MassPerMass',
  (l: Mass, r: MassPerMass) =>
    whenSame(l.substance, r.sdenom, () => mass(r.snum)),
);

/** EnergyPerVolume<S> * Volume<S> = Energy */
export interface EnergyPerVolumeTimesVolume extends RuleType {
  rule: this['L'] extends EnergyPerVolume<infer S>
    ? Rule<Volume<S>, Energy>
    : never;
}
export const energyPerVolumeTimesVolume =
  multiplyRule<EnergyPerVolumeTimesVolume>()(
    'EnergyPerVolume',
    'Volume',
    (l: EnergyPerVolume, r: Volume) =>
      whenSame(l.substance, r.substance, energy),
  );

/** MassPerEnergy<A> * EnergyPerVolume<B> = MassPerVolume<A, B> */
export interface MassPerEnergyTimesEnergyPerVolume extends RuleType {
  rule: this['L'] extends MassPerEnergy<infer A>
    ? Rule<
        EnergyPerVolume,
        this['R'] extends EnergyPerVolume<infer B> ? MassPerVolume<A, B> : never
      >
    : never;
}
export const massPerEnergyTimesEnergyPerVolume =
  multiplyRule<MassPerEnergyTimesEnergyPerVolume>()(
    'MassPerEnergy',
    'EnergyPerVolume',
    (l: MassPerEnergy, r: EnergyPerVolume) =>
      massPerVolume(l.substance, r.substance),
  );

/** MassPerEnergy<S> * Energy = Mass<S> */
export interface MassPerEnergyTimesEnergy extends RuleType {
  rule: this['L'] extends MassPerEnergy<infer S>
    ? Rule<Energy, Mass<S>>
    : never;
}
export const massPerEnergyTimesEnergy =
  multiplyRule<MassPerEnergyTimesEnergy>()(
    'MassPerEnergy',
    'Energy',
    (l: MassPerEnergy, _r: Energy) => mass(l.substance),
  );

/** EnergyPerMass<S> * Mass<S> = Energy */
export interface EnergyPerMassTimesMass extends RuleType {
  rule: this['L'] extends EnergyPerMass<infer S>
    ? Rule<Mass<S>, Energy>
    : never;
}
export const energyPerMassTimesMass = multiplyRule<EnergyPerMassTimesMass>()(
  'EnergyPerMass',
  'Mass',
  (l: EnergyPerMass, r: Mass) => whenSame(l.substance, r.substance, energy),
);

/** MassPerArea<S> * Area = Mass<S> */
export interface MassPerAreaTimesArea extends RuleType {
  rule: this['L'] extends MassPerArea<infer S> ? Rule<Area, Mass<S>> : never;
}
export const massPerAreaTimesArea = multiplyRule<MassPerAreaTimesArea>()(
  'MassPerArea',
  'Area',
  (l: MassPerArea, _r: Area) => mass(l.substance),
);

/** MassPerTime<S> * Time = Mass<S> */
export interface MassPerTimeTimesTime extends RuleType {
  rule: this['L'] extends MassPerTime<infer S> ? Rule<Time, Mass<S>> : never;
}
export const massPerTimeTimesTime = multiplyRule<MassPerTimeTimesTime>()(
  'MassPerTime',
  'Time',
  (l: MassPerTime, _r: Time) => mass(l.substance),
);

/** MassPerVolume<A, B> * Volume<B> = Mass<A> */
export interface MassPerVolumeTimesVolume extends RuleType {
  rule: this['L'] extends MassPerVolume<infer A, infer B>
    ? Rule<Volume<B>, Mass<A>>
    : never;
}
export const massPerVolumeTimesVolume =
  multiplyRule<MassPerVolumeTimesVolume>()(
    'MassPerVolume',
    'Volume',
    (l: MassPerVolume, r: Volume) =>
      whenSame(l.volume, r.substance, () => mass(l.mass)),
  );

/** Electricity * MassPerElectricity<S> = Mass<S> */
export interface ElectricityTimesMassPerElectricity extends RuleType {
  rule: this['L'] extends Electricity
    ? Rule<
        MassPerElectricity,
        this['R'] extends MassPerElectricity<infer S> ? Mass<S> : never
      >
    : never;
}
export const electricityTimesMassPerElectricity =
  multiplyRule<ElectricityTimesMassPerElectricity>()(
    'Electricity',
    'MassPerElectricity',
    (_l: Electricity, r: MassPerElectricity) => mass(r.substance),
  );

/** MassPerHead<B> * MassPerMass<A, B> = MassPerHead<A> */
export interface MassPerHeadTimesMassPerMass extends RuleType {
  rule: this['L'] extends MassPerHead<infer B>
    ? Rule<
        MassPerMass<Substance, B>,
        this['R'] extends MassPerMass<infer A, Substance>
          ? MassPerHead<A>
          : never
      >
    : never;
}
export const massPerHeadTimesMassPerMass =
  multiplyRule<MassPerHeadTimesMassPerMass>()(
    'MassPerHead',
    'MassPerMass',
    (l: MassPerHead, r: MassPerMass) =>
      whenSame(l.substance, r.sdenom, () => massPerHead(r.snum)),
  );

/** MassPerHeadPerDay<B> * MassPerMass<A, B> = MassPerHeadPerDay<A> */
export interface MassPerHeadPerDayTimesMassPerMass extends RuleType {
  rule: this['L'] extends MassPerHeadPerDay<infer B>
    ? Rule<
        MassPerMass<Substance, B>,
        this['R'] extends MassPerMass<infer A, Substance>
          ? MassPerHeadPerDay<A>
          : never
      >
    : never;
}
export const massPerHeadPerDayTimesMassPerMass =
  multiplyRule<MassPerHeadPerDayTimesMassPerMass>()(
    'MassPerHeadPerDay',
    'MassPerMass',
    (l: MassPerHeadPerDay, r: MassPerMass) =>
      whenSame(l.substance, r.sdenom, () => massPerHeadPerDay(r.snum)),
  );

/** MassPerHeadPerDay<S> * Head = MassPerDay<S> */
export interface MassPerHeadPerDayTimesHead extends RuleType {
  rule: this['L'] extends MassPerHeadPerDay<infer S>
    ? Rule<Head, MassPerDay<S>>
    : never;
}
export const massPerHeadPerDayTimesHead =
  multiplyRule<MassPerHeadPerDayTimesHead>()(
    'MassPerHeadPerDay',
    'Head',
    (l: MassPerHeadPerDay, _r: Head) => massPerDay(l.substance),
  );

/** MassPerHeadPerDay<S> * Days = MassPerHead<S> */
export interface MassPerHeadPerDayTimesDays extends RuleType {
  rule: this['L'] extends MassPerHeadPerDay<infer S>
    ? Rule<Days, MassPerHead<S>>
    : never;
}
export const massPerHeadPerDayTimesDays =
  multiplyRule<MassPerHeadPerDayTimesDays>()(
    'MassPerHeadPerDay',
    'Days',
    (l: MassPerHeadPerDay, _r: Days) => massPerHead(l.substance),
  );

/** Head * MassPerHead<S> = Mass<S> */
export interface HeadTimesMassPerHead extends RuleType {
  rule: this['L'] extends Head
    ? Rule<
        MassPerHead,
        this['R'] extends MassPerHead<infer S> ? Mass<S> : never
      >
    : never;
}
export const headTimesMassPerHead = multiplyRule<HeadTimesMassPerHead>()(
  'Head',
  'MassPerHead',
  (_l: Head, r: MassPerHead) => mass(r.substance),
);

/** Head * MassPerHeadPerYear<S> = MassPerYear<S> */
export interface HeadTimesMassPerHeadPerYear extends RuleType {
  rule: this['L'] extends Head
    ? Rule<
        MassPerHeadPerYear,
        this['R'] extends MassPerHeadPerYear<infer S> ? MassPerYear<S> : never
      >
    : never;
}
export const headTimesMassPerHeadPerYear =
  multiplyRule<HeadTimesMassPerHeadPerYear>()(
    'Head',
    'MassPerHeadPerYear',
    (_l: Head, r: MassPerHeadPerYear) => massPerYear(r.substance),
  );

/** MassPerHeadPerYear<S> * Years = MassPerHead<S> */
export interface MassPerHeadPerYearTimesYears extends RuleType {
  rule: this['L'] extends MassPerHeadPerYear<infer S>
    ? Rule<Years, MassPerHead<S>>
    : never;
}
export const massPerHeadPerYearTimesYears =
  multiplyRule<MassPerHeadPerYearTimesYears>()(
    'MassPerHeadPerYear',
    'Years',
    (l: MassPerHeadPerYear, _r: Years) => massPerHead(l.substance),
  );

/** MassPerEnergy<S> * EnergyPerMass<S> = RealNumber */
export interface MassPerEnergyTimesEnergyPerMass extends RuleType {
  rule: this['L'] extends MassPerEnergy<infer S>
    ? Rule<EnergyPerMass<S>, RealNumber>
    : never;
}
export const massPerEnergyTimesEnergyPerMass =
  multiplyRule<MassPerEnergyTimesEnergyPerMass>()(
    'MassPerEnergy',
    'EnergyPerMass',
    (l: MassPerEnergy, r: EnergyPerMass) =>
      whenSame(l.substance, r.substance, realNumber),
  );

/** MassPerDay<S> * Days = Mass<S> */
export interface MassPerDayTimesDays extends RuleType {
  rule: this['L'] extends MassPerDay<infer S> ? Rule<Days, Mass<S>> : never;
}
export const massPerDayTimesDays = multiplyRule<MassPerDayTimesDays>()(
  'MassPerDay',
  'Days',
  (l: MassPerDay, _r: Days) => mass(l.substance),
);

/** MassPerHeadPerDay<B> * VolumePerMass<A, B> = VolumePerHeadPerDay<A> */
export interface MassPerHeadPerDayTimesVolumePerMass extends RuleType {
  rule: this['L'] extends MassPerHeadPerDay<infer B>
    ? Rule<
        VolumePerMass<Substance, B>,
        this['R'] extends VolumePerMass<infer A, Substance>
          ? VolumePerHeadPerDay<A>
          : never
      >
    : never;
}
export const massPerHeadPerDayTimesVolumePerMass =
  multiplyRule<MassPerHeadPerDayTimesVolumePerMass>()(
    'MassPerHeadPerDay',
    'VolumePerMass',
    (l: MassPerHeadPerDay, r: VolumePerMass) =>
      whenSame(l.substance, r.mass, () => volumePerHeadPerDay(r.volume)),
  );

/** VolumePerHeadPerDay<B> * MassPerVolume<A, B> = MassPerHeadPerDay<A> */
export interface VolumePerHeadPerDayTimesMassPerVolume extends RuleType {
  rule: this['L'] extends VolumePerHeadPerDay<infer B>
    ? Rule<
        MassPerVolume<Substance, B>,
        this['R'] extends MassPerVolume<infer A, Substance>
          ? MassPerHeadPerDay<A>
          : never
      >
    : never;
}
export const volumePerHeadPerDayTimesMassPerVolume =
  multiplyRule<VolumePerHeadPerDayTimesMassPerVolume>()(
    'VolumePerHeadPerDay',
    'MassPerVolume',
    (l: VolumePerHeadPerDay, r: MassPerVolume) =>
      whenSame(l.substance, r.volume, () => massPerHeadPerDay(r.mass)),
  );

/** MassPerAreaPerDay<S> * Days = MassPerArea<S> */
export interface MassPerAreaPerDayTimesDays extends RuleType {
  rule: this['L'] extends MassPerAreaPerDay<infer S>
    ? Rule<Days, MassPerArea<S>>
    : never;
}
export const massPerAreaPerDayTimesDays =
  multiplyRule<MassPerAreaPerDayTimesDays>()(
    'MassPerAreaPerDay',
    'Days',
    (l: MassPerAreaPerDay, _r: Days) => massPerArea(l.substance),
  );

/** MassPerAreaPerDay<S> * Area = MassPerDay<S> */
export interface MassPerAreaPerDayTimesArea extends RuleType {
  rule: this['L'] extends MassPerAreaPerDay<infer S>
    ? Rule<Area, MassPerDay<S>>
    : never;
}
export const massPerAreaPerDayTimesArea =
  multiplyRule<MassPerAreaPerDayTimesArea>()(
    'MassPerAreaPerDay',
    'Area',
    (l: MassPerAreaPerDay, _r: Area) => massPerDay(l.substance),
  );

/** MassPerAreaPerYear<S> * Area = MassPerYear<S> */
export interface MassPerAreaPerYearTimesArea extends RuleType {
  rule: this['L'] extends MassPerAreaPerYear<infer S>
    ? Rule<Area, MassPerYear<S>>
    : never;
}
export const massPerAreaPerYearTimesArea =
  multiplyRule<MassPerAreaPerYearTimesArea>()(
    'MassPerAreaPerYear',
    'Area',
    (l: MassPerAreaPerYear, _r: Area) => massPerYear(l.substance),
  );

/** MassPerAreaPerYear<S> * Years = MassPerArea<S> */
export interface MassPerAreaPerYearTimesYears extends RuleType {
  rule: this['L'] extends MassPerAreaPerYear<infer S>
    ? Rule<Years, MassPerArea<S>>
    : never;
}
export const massPerAreaPerYearTimesYears =
  multiplyRule<MassPerAreaPerYearTimesYears>()(
    'MassPerAreaPerYear',
    'Years',
    (l: MassPerAreaPerYear, _r: Years) => massPerArea(l.substance),
  );

/** MassPerAreaPerYear<B> * MassPerMass<A, B> = MassPerAreaPerYear<A> */
export interface MassPerAreaPerYearTimesMassPerMass extends RuleType {
  rule: this['L'] extends MassPerAreaPerYear<infer B>
    ? Rule<
        MassPerMass<Substance, B>,
        this['R'] extends MassPerMass<infer A, Substance>
          ? MassPerAreaPerYear<A>
          : never
      >
    : never;
}
export const massPerAreaPerYearTimesMassPerMass =
  multiplyRule<MassPerAreaPerYearTimesMassPerMass>()(
    'MassPerAreaPerYear',
    'MassPerMass',
    (l: MassPerAreaPerYear, r: MassPerMass) =>
      whenSame(l.substance, r.sdenom, () => massPerAreaPerYear(r.snum)),
  );

/** MassPerYear<B> * MassPerMass<A, B> = MassPerYear<A> */
export interface MassPerYearTimesMassPerMass extends RuleType {
  rule: this['L'] extends MassPerYear<infer B>
    ? Rule<
        MassPerMass<Substance, B>,
        this['R'] extends MassPerMass<infer A, Substance>
          ? MassPerYear<A>
          : never
      >
    : never;
}
export const massPerYearTimesMassPerMass =
  multiplyRule<MassPerYearTimesMassPerMass>()(
    'MassPerYear',
    'MassPerMass',
    (l: MassPerYear, r: MassPerMass) =>
      whenSame(l.substance, r.sdenom, () => massPerYear(r.snum)),
  );

/** MassPerYear<S> * Years = Mass<S> */
export interface MassPerYearTimesYears extends RuleType {
  rule: this['L'] extends MassPerYear<infer S> ? Rule<Years, Mass<S>> : never;
}
export const massPerYearTimesYears = multiplyRule<MassPerYearTimesYears>()(
  'MassPerYear',
  'Years',
  (l: MassPerYear, _r: Years) => mass(l.substance),
);

/** Mass<S> * Distance = MassDistance<S> */
export interface MassTimesDistance extends RuleType {
  rule: this['L'] extends Mass<infer S>
    ? Rule<Distance, MassDistance<S>>
    : never;
}
export const massTimesDistance = multiplyRule<MassTimesDistance>()(
  'Mass',
  'Distance',
  (l: Mass, _r: Distance) => massDistance(l.substance),
);

/** MassPerMassDistance<A, B> * Distance = MassPerMass<A, B> */
export interface MassPerMassDistanceTimesDistance extends RuleType {
  rule: this['L'] extends MassPerMassDistance<infer A, infer B>
    ? Rule<Distance, MassPerMass<A, B>>
    : never;
}
export const massPerMassDistanceTimesDistance =
  multiplyRule<MassPerMassDistanceTimesDistance>()(
    'MassPerMassDistance',
    'Distance',
    (l: MassPerMassDistance, _r: Distance) => massPerMass(l.snum, l.sdenom),
  );

/** MassPerMassDistance<A, B> * MassDistance<B> = Mass<A> */
export interface MassPerMassDistanceTimesMassDistance extends RuleType {
  rule: this['L'] extends MassPerMassDistance<infer A, infer B>
    ? Rule<MassDistance<B>, Mass<A>>
    : never;
}
export const massPerMassDistanceTimesMassDistance =
  multiplyRule<MassPerMassDistanceTimesMassDistance>()(
    'MassPerMassDistance',
    'MassDistance',
    (l: MassPerMassDistance, r: MassDistance) =>
      whenSame(l.sdenom, r.substance, () => mass(l.snum)),
  );

/** MassPerHeadPerDay<S> * EnergyPerMass<S> = EnergyPerHeadPerDay */
export interface MassPerHeadPerDayTimesEnergyPerMass extends RuleType {
  rule: this['L'] extends MassPerHeadPerDay<infer S>
    ? Rule<EnergyPerMass<S>, EnergyPerHeadPerDay>
    : never;
}
export const massPerHeadPerDayTimesEnergyPerMass =
  multiplyRule<MassPerHeadPerDayTimesEnergyPerMass>()(
    'MassPerHeadPerDay',
    'EnergyPerMass',
    (l: MassPerHeadPerDay, r: EnergyPerMass) =>
      whenSame(l.substance, r.substance, energyPerHeadPerDay),
  );

/** MassPerVolume<B, V> * MassPerMass<A, B> = MassPerVolume<A, V> */
export interface MassPerVolumeTimesMassPerMass extends RuleType {
  rule: this['L'] extends MassPerVolume<infer B, infer V>
    ? Rule<
        MassPerMass<Substance, B>,
        this['R'] extends MassPerMass<infer A, Substance>
          ? MassPerVolume<A, V>
          : never
      >
    : never;
}
export const massPerVolumeTimesMassPerMass =
  multiplyRule<MassPerVolumeTimesMassPerMass>()(
    'MassPerVolume',
    'MassPerMass',
    (l: MassPerVolume, r: MassPerMass) =>
      whenSame(l.mass, r.sdenom, () => massPerVolume(r.snum, l.volume)),
  );

/** Mass<S> / Area = MassPerArea<S> */
export interface MassDividedByArea extends RuleType {
  rule: this['L'] extends Mass<infer S> ? Rule<Area, MassPerArea<S>> : never;
}
export const massDividedByArea = divideRule<MassDividedByArea>()(
  'Mass',
  'Area',
  (l: Mass, _r: Area) => massPerArea(l.substance),
);

/** Mass<A> / MassPerMass<A, B> = Mass<B> */
export interface MassDividedByMassPerMass extends RuleType {
  rule: this['L'] extends Mass<infer A>
    ? Rule<
        MassPerMass<A, Substance>,
        this['R'] extends MassPerMass<Substance, infer B> ? Mass<B> : never
      >
    : never;
}
export const massDividedByMassPerMass = divideRule<MassDividedByMassPerMass>()(
  'Mass',
  'MassPerMass',
  (l: Mass, r: MassPerMass) =>
    whenSame(l.substance, r.snum, () => mass(r.sdenom)),
);

/** MassPerArea<S> / Years = MassPerAreaPerYear<S> */
export interface MassPerAreaDividedByYears extends RuleType {
  rule: this['L'] extends MassPerArea<infer S>
    ? Rule<Years, MassPerAreaPerYear<S>>
    : never;
}
export const massPerAreaDividedByYears =
  divideRule<MassPerAreaDividedByYears>()(
    'MassPerArea',
    'Years',
    (l: MassPerArea, _r: Years) => massPerAreaPerYear(l.substance),
  );

/** EnergyPerHeadPerDay / EnergyPerMass<S> = MassPerHeadPerDay<S> */
export interface EnergyPerHeadPerDayDividedByEnergyPerMass extends RuleType {
  rule: this['L'] extends EnergyPerHeadPerDay
    ? Rule<
        EnergyPerMass,
        this['R'] extends EnergyPerMass<infer S> ? MassPerHeadPerDay<S> : never
      >
    : never;
}
export const energyPerHeadPerDayDividedByEnergyPerMass =
  divideRule<EnergyPerHeadPerDayDividedByEnergyPerMass>()(
    'EnergyPerHeadPerDay',
    'EnergyPerMass',
    (_l: EnergyPerHeadPerDay, r: EnergyPerMass) =>
      massPerHeadPerDay(r.substance),
  );

/** MassPerHead<S> / Days = MassPerHeadPerDay<S> */
export interface MassPerHeadDividedByDays extends RuleType {
  rule: this['L'] extends MassPerHead<infer S>
    ? Rule<Days, MassPerHeadPerDay<S>>
    : never;
}
export const massPerHeadDividedByDays = divideRule<MassPerHeadDividedByDays>()(
  'MassPerHead',
  'Days',
  (l: MassPerHead, _r: Days) => massPerHeadPerDay(l.substance),
);

/** MassPerHeadPerDay<A> / MassPerMass<A, B> = MassPerHeadPerDay<B> */
export interface MassPerHeadPerDayDividedByMassPerMass extends RuleType {
  rule: this['L'] extends MassPerHeadPerDay<infer A>
    ? Rule<
        MassPerMass<A, Substance>,
        this['R'] extends MassPerMass<Substance, infer B>
          ? MassPerHeadPerDay<B>
          : never
      >
    : never;
}
export const massPerHeadPerDayDividedByMassPerMass =
  divideRule<MassPerHeadPerDayDividedByMassPerMass>()(
    'MassPerHeadPerDay',
    'MassPerMass',
    (l: MassPerHeadPerDay, r: MassPerMass) =>
      whenSame(l.substance, r.snum, () => massPerHeadPerDay(r.sdenom)),
  );

/** Mass<A> / MassPerVolume<A, B> = Volume<B> */
export interface MassDividedByMassPerVolume extends RuleType {
  rule: this['L'] extends Mass<infer A>
    ? Rule<
        MassPerVolume<A, Substance>,
        this['R'] extends MassPerVolume<Substance, infer B> ? Volume<B> : never
      >
    : never;
}
export const massDividedByMassPerVolume =
  divideRule<MassDividedByMassPerVolume>()(
    'Mass',
    'MassPerVolume',
    (l: Mass, r: MassPerVolume) =>
      whenSame(l.substance, r.mass, () => volume(r.volume)),
  );

/** MassPerEnergy<A> / MassPerMass<A, B> = MassPerEnergy<B> */
export interface MassPerEnergyDividedByMassPerMass extends RuleType {
  rule: this['L'] extends MassPerEnergy<infer A>
    ? Rule<
        MassPerMass<A, Substance>,
        this['R'] extends MassPerMass<Substance, infer B>
          ? MassPerEnergy<B>
          : never
      >
    : never;
}
export const massPerEnergyDividedByMassPerMass =
  divideRule<MassPerEnergyDividedByMassPerMass>()(
    'MassPerEnergy',
    'MassPerMass',
    (l: MassPerEnergy, r: MassPerMass) =>
      whenSame(l.substance, r.snum, () => massPerEnergy(r.sdenom)),
  );

/** Every default multiplication rule. */
export const defaultMultiplyRules = [
  massPerMassTimesMass,
  massTimesMassPerMass,
  energyPerVolumeTimesVolume,
  massPerEnergyTimesEnergyPerVolume,
  massPerEnergyTimesEnergy,
  energyPerMassTimesMass,
  massPerAreaTimesArea,
  massPerTimeTimesTime,
  massPerVolumeTimesVolume,
  electricityTimesMassPerElectricity,
  massPerHeadTimesMassPerMass,
  massPerHeadPerDayTimesMassPerMass,
  massPerHeadPerDayTimesHead,
  massPerHeadPerDayTimesDays,
  headTimesMassPerHead,
  headTimesMassPerHeadPerYear,
  massPerHeadPerYearTimesYears,
  massPerEnergyTimesEnergyPerMass,
  massPerDayTimesDays,
  massPerHeadPerDayTimesVolumePerMass,
  volumePerHeadPerDayTimesMassPerVolume,
  massPerAreaPerDayTimesDays,
  massPerAreaPerDayTimesArea,
  massPerAreaPerYearTimesArea,
  massPerAreaPerYearTimesYears,
  massPerAreaPerYearTimesMassPerMass,
  massPerYearTimesMassPerMass,
  massPerYearTimesYears,
  massTimesDistance,
  massPerMassDistanceTimesDistance,
  massPerMassDistanceTimesMassDistance,
  massPerHeadPerDayTimesEnergyPerMass,
  massPerVolumeTimesMassPerMass,
] as const;

/** Every default division rule. */
export const defaultDivideRules = [
  massDividedByArea,
  massDividedByMassPerMass,
  massPerAreaDividedByYears,
  energyPerHeadPerDayDividedByEnergyPerMass,
  massPerHeadDividedByDays,
  massPerHeadPerDayDividedByMassPerMass,
  massDividedByMassPerVolume,
  massPerEnergyDividedByMassPerMass,
] as const;
