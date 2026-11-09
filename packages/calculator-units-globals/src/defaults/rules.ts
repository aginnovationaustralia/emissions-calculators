/*
 * The default unit relationships, ported from the emissions calculators.
 *
 * Importing this module augments the global rule tables in ../rules.ts and registers the matching
 * runtime rules. Both happen for the whole program/process, not just the importing module.
 */
import { defineDivide, defineMultiply, Rule, whenSame } from '../rules.js';
import type { Substance } from '../substances.js';
import {
  Area,
  Days,
  Distance,
  Electricity,
  energy,
  Energy,
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
  massPerAreaPerYear,
  MassPerAreaPerYear,
  massPerDay,
  MassPerDay,
  MassPerElectricity,
  massPerEnergy,
  MassPerEnergy,
  massPerHead,
  MassPerHead,
  massPerHeadPerDay,
  MassPerHeadPerDay,
  MassPerHeadPerYear,
  massPerMass,
  MassPerMass,
  MassPerMassDistance,
  MassPerTime,
  massPerVolume,
  MassPerVolume,
  massPerYear,
  MassPerYear,
  Time,
  volume,
  Volume,
  volumePerHeadPerDay,
  VolumePerHeadPerDay,
  VolumePerMass,
  Years,
} from './units.js';
import { RealNumber, realNumber } from '../units.js';

declare module '../rules.js' {
  interface MultiplyRules<L, R> {
    // MassPerMass<A, B> * Mass<B> = Mass<A>
    massPerMassTimesMass: L extends MassPerMass<infer A, infer B>
      ? Rule<Mass<B>, Mass<A>>
      : never;
    // Mass<B> * MassPerMass<A, B> = Mass<A>
    massTimesMassPerMass: L extends Mass<infer B>
      ? Rule<
          MassPerMass<Substance, B>,
          R extends MassPerMass<infer A, Substance> ? Mass<A> : never
        >
      : never;
    // EnergyPerVolume<S> * Volume<S> = Energy
    energyPerVolumeTimesVolume: L extends EnergyPerVolume<infer S>
      ? Rule<Volume<S>, Energy>
      : never;
    // MassPerEnergy<A> * EnergyPerVolume<B> = MassPerVolume<A, B>
    massPerEnergyTimesEnergyPerVolume: L extends MassPerEnergy<infer A>
      ? Rule<
          EnergyPerVolume,
          R extends EnergyPerVolume<infer B> ? MassPerVolume<A, B> : never
        >
      : never;
    // MassPerEnergy<S> * Energy = Mass<S>
    massPerEnergyTimesEnergy: L extends MassPerEnergy<infer S>
      ? Rule<Energy, Mass<S>>
      : never;
    // EnergyPerMass<S> * Mass<S> = Energy
    energyPerMassTimesMass: L extends EnergyPerMass<infer S>
      ? Rule<Mass<S>, Energy>
      : never;
    // MassPerArea<S> * Area = Mass<S>
    massPerAreaTimesArea: L extends MassPerArea<infer S>
      ? Rule<Area, Mass<S>>
      : never;
    // MassPerTime<S> * Time = Mass<S>
    massPerTimeTimesTime: L extends MassPerTime<infer S>
      ? Rule<Time, Mass<S>>
      : never;
    // MassPerVolume<A, B> * Volume<B> = Mass<A>
    massPerVolumeTimesVolume: L extends MassPerVolume<infer A, infer B>
      ? Rule<Volume<B>, Mass<A>>
      : never;
    // Electricity * MassPerElectricity<S> = Mass<S>
    electricityTimesMassPerElectricity: L extends Electricity
      ? Rule<
          MassPerElectricity,
          R extends MassPerElectricity<infer S> ? Mass<S> : never
        >
      : never;
    // MassPerHead<B> * MassPerMass<A, B> = MassPerHead<A>
    massPerHeadTimesMassPerMass: L extends MassPerHead<infer B>
      ? Rule<
          MassPerMass<Substance, B>,
          R extends MassPerMass<infer A, Substance> ? MassPerHead<A> : never
        >
      : never;
    // MassPerHeadPerDay<B> * MassPerMass<A, B> = MassPerHeadPerDay<A>
    massPerHeadPerDayTimesMassPerMass: L extends MassPerHeadPerDay<infer B>
      ? Rule<
          MassPerMass<Substance, B>,
          R extends MassPerMass<infer A, Substance>
            ? MassPerHeadPerDay<A>
            : never
        >
      : never;
    // MassPerHeadPerDay<S> * Head = MassPerDay<S>
    massPerHeadPerDayTimesHead: L extends MassPerHeadPerDay<infer S>
      ? Rule<Head, MassPerDay<S>>
      : never;
    // MassPerHeadPerDay<S> * Days = MassPerHead<S>
    massPerHeadPerDayTimesDays: L extends MassPerHeadPerDay<infer S>
      ? Rule<Days, MassPerHead<S>>
      : never;
    // Head * MassPerHead<S> = Mass<S>
    headTimesMassPerHead: L extends Head
      ? Rule<MassPerHead, R extends MassPerHead<infer S> ? Mass<S> : never>
      : never;
    // Head * MassPerHeadPerYear<S> = MassPerYear<S>
    headTimesMassPerHeadPerYear: L extends Head
      ? Rule<
          MassPerHeadPerYear,
          R extends MassPerHeadPerYear<infer S> ? MassPerYear<S> : never
        >
      : never;
    // MassPerHeadPerYear<S> * Years = MassPerHead<S>
    massPerHeadPerYearTimesYears: L extends MassPerHeadPerYear<infer S>
      ? Rule<Years, MassPerHead<S>>
      : never;
    // MassPerEnergy<S> * EnergyPerMass<S> = RealNumber
    massPerEnergyTimesEnergyPerMass: L extends MassPerEnergy<infer S>
      ? Rule<EnergyPerMass<S>, RealNumber>
      : never;
    // MassPerDay<S> * Days = Mass<S>
    massPerDayTimesDays: L extends MassPerDay<infer S>
      ? Rule<Days, Mass<S>>
      : never;
    // MassPerHeadPerDay<B> * VolumePerMass<A, B> = VolumePerHeadPerDay<A>
    massPerHeadPerDayTimesVolumePerMass: L extends MassPerHeadPerDay<infer B>
      ? Rule<
          VolumePerMass<Substance, B>,
          R extends VolumePerMass<infer A, Substance>
            ? VolumePerHeadPerDay<A>
            : never
        >
      : never;
    // VolumePerHeadPerDay<B> * MassPerVolume<A, B> = MassPerHeadPerDay<A>
    volumePerHeadPerDayTimesMassPerVolume: L extends VolumePerHeadPerDay<
      infer B
    >
      ? Rule<
          MassPerVolume<Substance, B>,
          R extends MassPerVolume<infer A, Substance>
            ? MassPerHeadPerDay<A>
            : never
        >
      : never;
    // MassPerAreaPerDay<S> * Days = MassPerArea<S>
    massPerAreaPerDayTimesDays: L extends MassPerAreaPerDay<infer S>
      ? Rule<Days, MassPerArea<S>>
      : never;
    // MassPerAreaPerDay<S> * Area = MassPerDay<S>
    massPerAreaPerDayTimesArea: L extends MassPerAreaPerDay<infer S>
      ? Rule<Area, MassPerDay<S>>
      : never;
    // MassPerAreaPerYear<S> * Area = MassPerYear<S>
    massPerAreaPerYearTimesArea: L extends MassPerAreaPerYear<infer S>
      ? Rule<Area, MassPerYear<S>>
      : never;
    // MassPerAreaPerYear<S> * Years = MassPerArea<S>
    massPerAreaPerYearTimesYears: L extends MassPerAreaPerYear<infer S>
      ? Rule<Years, MassPerArea<S>>
      : never;
    // MassPerAreaPerYear<B> * MassPerMass<A, B> = MassPerAreaPerYear<A>
    massPerAreaPerYearTimesMassPerMass: L extends MassPerAreaPerYear<infer B>
      ? Rule<
          MassPerMass<Substance, B>,
          R extends MassPerMass<infer A, Substance>
            ? MassPerAreaPerYear<A>
            : never
        >
      : never;
    // MassPerYear<B> * MassPerMass<A, B> = MassPerYear<A>
    massPerYearTimesMassPerMass: L extends MassPerYear<infer B>
      ? Rule<
          MassPerMass<Substance, B>,
          R extends MassPerMass<infer A, Substance> ? MassPerYear<A> : never
        >
      : never;
    // MassPerYear<S> * Years = Mass<S>
    massPerYearTimesYears: L extends MassPerYear<infer S>
      ? Rule<Years, Mass<S>>
      : never;
    // Mass<S> * Distance = MassDistance<S>
    massTimesDistance: L extends Mass<infer S>
      ? Rule<Distance, MassDistance<S>>
      : never;
    // MassPerMassDistance<A, B> * Distance = MassPerMass<A, B>
    massPerMassDistanceTimesDistance: L extends MassPerMassDistance<
      infer A,
      infer B
    >
      ? Rule<Distance, MassPerMass<A, B>>
      : never;
    // MassPerMassDistance<A, B> * MassDistance<B> = Mass<A>
    massPerMassDistanceTimesMassDistance: L extends MassPerMassDistance<
      infer A,
      infer B
    >
      ? Rule<MassDistance<B>, Mass<A>>
      : never;
    // MassPerHeadPerDay<S> * EnergyPerMass<S> = EnergyPerHeadPerDay
    massPerHeadPerDayTimesEnergyPerMass: L extends MassPerHeadPerDay<infer S>
      ? Rule<EnergyPerMass<S>, EnergyPerHeadPerDay>
      : never;
    // MassPerVolume<B, V> * MassPerMass<A, B> = MassPerVolume<A, V>
    massPerVolumeTimesMassPerMass: L extends MassPerVolume<infer B, infer V>
      ? Rule<
          MassPerMass<Substance, B>,
          R extends MassPerMass<infer A, Substance>
            ? MassPerVolume<A, V>
            : never
        >
      : never;
  }

  interface DivideRules<L, R> {
    // Mass<S> / Area = MassPerArea<S>
    massDividedByArea: L extends Mass<infer S>
      ? Rule<Area, MassPerArea<S>>
      : never;
    // Mass<A> / MassPerMass<A, B> = Mass<B>
    massDividedByMassPerMass: L extends Mass<infer A>
      ? Rule<
          MassPerMass<A, Substance>,
          R extends MassPerMass<Substance, infer B> ? Mass<B> : never
        >
      : never;
    // MassPerArea<S> / Years = MassPerAreaPerYear<S>
    massPerAreaDividedByYears: L extends MassPerArea<infer S>
      ? Rule<Years, MassPerAreaPerYear<S>>
      : never;
    // EnergyPerHeadPerDay / EnergyPerMass<S> = MassPerHeadPerDay<S>
    energyPerHeadPerDayDividedByEnergyPerMass: L extends EnergyPerHeadPerDay
      ? Rule<
          EnergyPerMass,
          R extends EnergyPerMass<infer S> ? MassPerHeadPerDay<S> : never
        >
      : never;
    // MassPerHead<S> / Days = MassPerHeadPerDay<S>
    massPerHeadDividedByDays: L extends MassPerHead<infer S>
      ? Rule<Days, MassPerHeadPerDay<S>>
      : never;
    // MassPerHeadPerDay<A> / MassPerMass<A, B> = MassPerHeadPerDay<B>
    massPerHeadPerDayDividedByMassPerMass: L extends MassPerHeadPerDay<infer A>
      ? Rule<
          MassPerMass<A, Substance>,
          R extends MassPerMass<Substance, infer B>
            ? MassPerHeadPerDay<B>
            : never
        >
      : never;
    // Mass<A> / MassPerVolume<A, B> = Volume<B>
    massDividedByMassPerVolume: L extends Mass<infer A>
      ? Rule<
          MassPerVolume<A, Substance>,
          R extends MassPerVolume<Substance, infer B> ? Volume<B> : never
        >
      : never;
    // MassPerEnergy<A> / MassPerMass<A, B> = MassPerEnergy<B>
    massPerEnergyDividedByMassPerMass: L extends MassPerEnergy<infer A>
      ? Rule<
          MassPerMass<A, Substance>,
          R extends MassPerMass<Substance, infer B> ? MassPerEnergy<B> : never
        >
      : never;
  }
}

// Runtime rules, registered in the global registry as a side effect of importing this module.
// RealNumber scaling and same-unit division are built in.
defineMultiply('MassPerMass', 'Mass', (l, r) =>
  whenSame(l.sdenom, r.substance, () => mass(l.snum)),
);
defineMultiply('Mass', 'MassPerMass', (l, r) =>
  whenSame(l.substance, r.sdenom, () => mass(r.snum)),
);
defineMultiply('EnergyPerVolume', 'Volume', (l, r) =>
  whenSame(l.substance, r.substance, energy),
);
defineMultiply('MassPerEnergy', 'EnergyPerVolume', (l, r) =>
  massPerVolume(l.substance, r.substance),
);
defineMultiply('MassPerEnergy', 'Energy', (l) => mass(l.substance));
defineMultiply('EnergyPerMass', 'Mass', (l, r) =>
  whenSame(l.substance, r.substance, energy),
);
defineMultiply('MassPerArea', 'Area', (l) => mass(l.substance));
defineMultiply('MassPerTime', 'Time', (l) => mass(l.substance));
defineMultiply('MassPerVolume', 'Volume', (l, r) =>
  whenSame(l.volume, r.substance, () => mass(l.mass)),
);
defineMultiply('Electricity', 'MassPerElectricity', (_, r) =>
  mass(r.substance),
);
defineMultiply('MassPerHead', 'MassPerMass', (l, r) =>
  whenSame(l.substance, r.sdenom, () => massPerHead(r.snum)),
);
defineMultiply('MassPerHeadPerDay', 'MassPerMass', (l, r) =>
  whenSame(l.substance, r.sdenom, () => massPerHeadPerDay(r.snum)),
);
defineMultiply('MassPerHeadPerDay', 'Head', (l) => massPerDay(l.substance));
defineMultiply('MassPerHeadPerDay', 'Days', (l) => massPerHead(l.substance));
defineMultiply('Head', 'MassPerHead', (_, r) => mass(r.substance));
defineMultiply('Head', 'MassPerHeadPerYear', (_, r) =>
  massPerYear(r.substance),
);
defineMultiply('MassPerHeadPerYear', 'Years', (l) => massPerHead(l.substance));
defineMultiply('MassPerEnergy', 'EnergyPerMass', (l, r) =>
  whenSame(l.substance, r.substance, realNumber),
);
defineMultiply('MassPerDay', 'Days', (l) => mass(l.substance));
defineMultiply('MassPerHeadPerDay', 'VolumePerMass', (l, r) =>
  whenSame(l.substance, r.mass, () => volumePerHeadPerDay(r.volume)),
);
defineMultiply('VolumePerHeadPerDay', 'MassPerVolume', (l, r) =>
  whenSame(l.substance, r.volume, () => massPerHeadPerDay(r.mass)),
);
defineMultiply('MassPerAreaPerDay', 'Days', (l) => massPerArea(l.substance));
defineMultiply('MassPerAreaPerDay', 'Area', (l) => massPerDay(l.substance));
defineMultiply('MassPerAreaPerYear', 'Area', (l) => massPerYear(l.substance));
defineMultiply('MassPerAreaPerYear', 'Years', (l) => massPerArea(l.substance));
defineMultiply('MassPerAreaPerYear', 'MassPerMass', (l, r) =>
  whenSame(l.substance, r.sdenom, () => massPerAreaPerYear(r.snum)),
);
defineMultiply('MassPerYear', 'MassPerMass', (l, r) =>
  whenSame(l.substance, r.sdenom, () => massPerYear(r.snum)),
);
defineMultiply('MassPerYear', 'Years', (l) => mass(l.substance));
defineMultiply('Mass', 'Distance', (l) => massDistance(l.substance));
defineMultiply('MassPerMassDistance', 'Distance', (l) =>
  massPerMass(l.snum, l.sdenom),
);
defineMultiply('MassPerMassDistance', 'MassDistance', (l, r) =>
  whenSame(l.sdenom, r.substance, () => mass(l.snum)),
);
defineMultiply('MassPerHeadPerDay', 'EnergyPerMass', (l, r) =>
  whenSame(l.substance, r.substance, energyPerHeadPerDay),
);
defineMultiply('MassPerVolume', 'MassPerMass', (l, r) =>
  whenSame(l.mass, r.sdenom, () => massPerVolume(r.snum, l.volume)),
);

defineDivide('Mass', 'Area', (l) => massPerArea(l.substance));
defineDivide('Mass', 'MassPerMass', (l, r) =>
  whenSame(l.substance, r.snum, () => mass(r.sdenom)),
);
defineDivide('MassPerArea', 'Years', (l) => massPerAreaPerYear(l.substance));
defineDivide('EnergyPerHeadPerDay', 'EnergyPerMass', (_, r) =>
  massPerHeadPerDay(r.substance),
);
defineDivide('MassPerHead', 'Days', (l) => massPerHeadPerDay(l.substance));
defineDivide('MassPerHeadPerDay', 'MassPerMass', (l, r) =>
  whenSame(l.substance, r.snum, () => massPerHeadPerDay(r.sdenom)),
);
defineDivide('Mass', 'MassPerVolume', (l, r) =>
  whenSame(l.substance, r.mass, () => volume(r.volume)),
);
defineDivide('MassPerEnergy', 'MassPerMass', (l, r) =>
  whenSame(l.substance, r.snum, () => massPerEnergy(r.sdenom)),
);
