/*
 * The default unit relationships, ported from the overloads on `BaseContainer` in tools/containers.ts.
 *
 * This file uses the same mechanism a consumer would: it augments the rule tables declared in
 * rules.ts and registers the matching runtime rules. Nothing in container.ts knows about any of this.
 *
 * Each rule has a comment in the `L * R = Result` notation, a type rule, and a runtime rule with the
 * same name. Shared type variables (B in "MassPerMass<A, B> * Mass<B>") become runtime substance
 * checks.
 */
import { defineDivide, defineMultiply, Rule } from './rules';
import type { Substance } from './substances';
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
  NumberUnit,
  RealNumber,
  realNumber,
  Time,
  volume,
  Volume,
  volumePerHeadPerDay,
  VolumePerHeadPerDay,
  VolumePerMass,
  Years,
} from './units';

declare module './rules' {
  interface MultiplyRules<L, R> {
    // L * RealNumber = L
    scaleRight: Rule<RealNumber, L>;
    // RealNumber * R = R
    scaleLeft: L extends RealNumber ? Rule<NumberUnit, R> : never;
    // MassPerMass<A, B> * Mass<B> = Mass<A>
    massPerMassByMass: L extends MassPerMass<infer A, infer B>
      ? Rule<Mass<B>, Mass<A>>
      : never;
    // Mass<B> * MassPerMass<A, B> = Mass<A>
    massByMassPerMass: L extends Mass<infer B>
      ? Rule<
          MassPerMass<Substance, B>,
          R extends MassPerMass<infer A, Substance> ? Mass<A> : never
        >
      : never;
    // EnergyPerVolume<S> * Volume<S> = Energy
    energyPerVolumeByVolume: L extends EnergyPerVolume<infer S>
      ? Rule<Volume<S>, Energy>
      : never;
    // MassPerEnergy<A> * EnergyPerVolume<B> = MassPerVolume<A, B>
    massPerEnergyByEnergyPerVolume: L extends MassPerEnergy<infer A>
      ? Rule<
          EnergyPerVolume,
          R extends EnergyPerVolume<infer B> ? MassPerVolume<A, B> : never
        >
      : never;
    // MassPerEnergy<S> * Energy = Mass<S>
    massPerEnergyByEnergy: L extends MassPerEnergy<infer S>
      ? Rule<Energy, Mass<S>>
      : never;
    // EnergyPerMass<S> * Mass<S> = Energy
    energyPerMassByMass: L extends EnergyPerMass<infer S>
      ? Rule<Mass<S>, Energy>
      : never;
    // MassPerArea<S> * Area = Mass<S>
    massPerAreaByArea: L extends MassPerArea<infer S>
      ? Rule<Area, Mass<S>>
      : never;
    // MassPerTime<S> * Time = Mass<S>
    massPerTimeByTime: L extends MassPerTime<infer S>
      ? Rule<Time, Mass<S>>
      : never;
    // MassPerVolume<A, B> * Volume<B> = Mass<A>
    massPerVolumeByVolume: L extends MassPerVolume<infer A, infer B>
      ? Rule<Volume<B>, Mass<A>>
      : never;
    // Electricity * MassPerElectricity<S> = Mass<S>
    electricityByMassPerElectricity: L extends Electricity
      ? Rule<
          MassPerElectricity,
          R extends MassPerElectricity<infer S> ? Mass<S> : never
        >
      : never;
    // MassPerHead<B> * MassPerMass<A, B> = MassPerHead<A>
    massPerHeadByMassPerMass: L extends MassPerHead<infer B>
      ? Rule<
          MassPerMass<Substance, B>,
          R extends MassPerMass<infer A, Substance> ? MassPerHead<A> : never
        >
      : never;
    // MassPerHeadPerDay<B> * MassPerMass<A, B> = MassPerHeadPerDay<A>
    massPerHeadPerDayByMassPerMass: L extends MassPerHeadPerDay<infer B>
      ? Rule<
          MassPerMass<Substance, B>,
          R extends MassPerMass<infer A, Substance>
            ? MassPerHeadPerDay<A>
            : never
        >
      : never;
    // MassPerHeadPerDay<S> * Head = MassPerDay<S>
    massPerHeadPerDayByHead: L extends MassPerHeadPerDay<infer S>
      ? Rule<Head, MassPerDay<S>>
      : never;
    // MassPerHeadPerDay<S> * Days = MassPerHead<S>
    massPerHeadPerDayByDays: L extends MassPerHeadPerDay<infer S>
      ? Rule<Days, MassPerHead<S>>
      : never;
    // Head * MassPerHead<S> = Mass<S>
    headByMassPerHead: L extends Head
      ? Rule<MassPerHead, R extends MassPerHead<infer S> ? Mass<S> : never>
      : never;
    // Head * MassPerHeadPerYear<S> = MassPerYear<S>
    headByMassPerHeadPerYear: L extends Head
      ? Rule<
          MassPerHeadPerYear,
          R extends MassPerHeadPerYear<infer S> ? MassPerYear<S> : never
        >
      : never;
    // MassPerHeadPerYear<S> * Years = MassPerHead<S>
    massPerHeadPerYearByYears: L extends MassPerHeadPerYear<infer S>
      ? Rule<Years, MassPerHead<S>>
      : never;
    // MassPerEnergy<S> * EnergyPerMass<S> = RealNumber
    massPerEnergyByEnergyPerMass: L extends MassPerEnergy<infer S>
      ? Rule<EnergyPerMass<S>, RealNumber>
      : never;
    // MassPerDay<S> * Days = Mass<S>
    massPerDayByDays: L extends MassPerDay<infer S>
      ? Rule<Days, Mass<S>>
      : never;
    // MassPerHeadPerDay<B> * VolumePerMass<A, B> = VolumePerHeadPerDay<A>
    massPerHeadPerDayByVolumePerMass: L extends MassPerHeadPerDay<infer B>
      ? Rule<
          VolumePerMass<Substance, B>,
          R extends VolumePerMass<infer A, Substance>
            ? VolumePerHeadPerDay<A>
            : never
        >
      : never;
    // VolumePerHeadPerDay<B> * MassPerVolume<A, B> = MassPerHeadPerDay<A>
    volumePerHeadPerDayByMassPerVolume: L extends VolumePerHeadPerDay<infer B>
      ? Rule<
          MassPerVolume<Substance, B>,
          R extends MassPerVolume<infer A, Substance>
            ? MassPerHeadPerDay<A>
            : never
        >
      : never;
    // MassPerAreaPerDay<S> * Days = MassPerArea<S>
    massPerAreaPerDayByDays: L extends MassPerAreaPerDay<infer S>
      ? Rule<Days, MassPerArea<S>>
      : never;
    // MassPerAreaPerDay<S> * Area = MassPerDay<S>
    massPerAreaPerDayByArea: L extends MassPerAreaPerDay<infer S>
      ? Rule<Area, MassPerDay<S>>
      : never;
    // MassPerAreaPerYear<S> * Area = MassPerYear<S>
    massPerAreaPerYearByArea: L extends MassPerAreaPerYear<infer S>
      ? Rule<Area, MassPerYear<S>>
      : never;
    // MassPerAreaPerYear<S> * Years = MassPerArea<S>
    massPerAreaPerYearByYears: L extends MassPerAreaPerYear<infer S>
      ? Rule<Years, MassPerArea<S>>
      : never;
    // MassPerAreaPerYear<B> * MassPerMass<A, B> = MassPerAreaPerYear<A>
    massPerAreaPerYearByMassPerMass: L extends MassPerAreaPerYear<infer B>
      ? Rule<
          MassPerMass<Substance, B>,
          R extends MassPerMass<infer A, Substance>
            ? MassPerAreaPerYear<A>
            : never
        >
      : never;
    // MassPerYear<B> * MassPerMass<A, B> = MassPerYear<A>
    massPerYearByMassPerMass: L extends MassPerYear<infer B>
      ? Rule<
          MassPerMass<Substance, B>,
          R extends MassPerMass<infer A, Substance> ? MassPerYear<A> : never
        >
      : never;
    // MassPerYear<S> * Years = Mass<S>
    massPerYearByYears: L extends MassPerYear<infer S>
      ? Rule<Years, Mass<S>>
      : never;
    // Mass<S> * Distance = MassDistance<S>
    massByDistance: L extends Mass<infer S>
      ? Rule<Distance, MassDistance<S>>
      : never;
    // MassPerMassDistance<A, B> * Distance = MassPerMass<A, B>
    massPerMassDistanceByDistance: L extends MassPerMassDistance<
      infer A,
      infer B
    >
      ? Rule<Distance, MassPerMass<A, B>>
      : never;
    // MassPerMassDistance<A, B> * MassDistance<B> = Mass<A>
    massPerMassDistanceByMassDistance: L extends MassPerMassDistance<
      infer A,
      infer B
    >
      ? Rule<MassDistance<B>, Mass<A>>
      : never;
    // MassPerHeadPerDay<S> * EnergyPerMass<S> = EnergyPerHeadPerDay
    massPerHeadPerDayByEnergyPerMass: L extends MassPerHeadPerDay<infer S>
      ? Rule<EnergyPerMass<S>, EnergyPerHeadPerDay>
      : never;
    // MassPerVolume<B, V> * MassPerMass<A, B> = MassPerVolume<A, V>
    massPerVolumeByMassPerMass: L extends MassPerVolume<infer B, infer V>
      ? Rule<
          MassPerMass<Substance, B>,
          R extends MassPerMass<infer A, Substance>
            ? MassPerVolume<A, V>
            : never
        >
      : never;
  }

  interface DivideRules<L, R> {
    // L / RealNumber = L
    scaleRight: Rule<RealNumber, L>;
    // L / L = RealNumber
    sameUnit: Rule<L, RealNumber>;
    // Mass<S> / Area = MassPerArea<S>
    massByArea: L extends Mass<infer S> ? Rule<Area, MassPerArea<S>> : never;
    // Mass<A> / MassPerMass<A, B> = Mass<B>
    massByMassPerMass: L extends Mass<infer A>
      ? Rule<
          MassPerMass<A, Substance>,
          R extends MassPerMass<Substance, infer B> ? Mass<B> : never
        >
      : never;
    // MassPerArea<S> / Years = MassPerAreaPerYear<S>
    massPerAreaByYears: L extends MassPerArea<infer S>
      ? Rule<Years, MassPerAreaPerYear<S>>
      : never;
    // EnergyPerHeadPerDay / EnergyPerMass<S> = MassPerHeadPerDay<S>
    energyPerHeadPerDayByEnergyPerMass: L extends EnergyPerHeadPerDay
      ? Rule<
          EnergyPerMass,
          R extends EnergyPerMass<infer S> ? MassPerHeadPerDay<S> : never
        >
      : never;
    // MassPerHead<S> / Days = MassPerHeadPerDay<S>
    massPerHeadByDays: L extends MassPerHead<infer S>
      ? Rule<Days, MassPerHeadPerDay<S>>
      : never;
    // MassPerHeadPerDay<A> / MassPerMass<A, B> = MassPerHeadPerDay<B>
    massPerHeadPerDayByMassPerMass: L extends MassPerHeadPerDay<infer A>
      ? Rule<
          MassPerMass<A, Substance>,
          R extends MassPerMass<Substance, infer B>
            ? MassPerHeadPerDay<B>
            : never
        >
      : never;
    // Mass<A> / MassPerVolume<A, B> = Volume<B>
    massByMassPerVolume: L extends Mass<infer A>
      ? Rule<
          MassPerVolume<A, Substance>,
          R extends MassPerVolume<Substance, infer B> ? Volume<B> : never
        >
      : never;
    // MassPerEnergy<A> / MassPerMass<A, B> = MassPerEnergy<B>
    massPerEnergyByMassPerMass: L extends MassPerEnergy<infer A>
      ? Rule<
          MassPerMass<A, Substance>,
          R extends MassPerMass<Substance, infer B> ? MassPerEnergy<B> : never
        >
      : never;
  }
}

/** Returns `result` when the two substances match, otherwise undefined (a runtime unit error). */
const when = <T>(a: Substance, b: Substance, result: () => T) =>
  a === b ? result() : undefined;

// Runtime rules, in the same order as the type rules above. RealNumber scaling and same-unit
// division are built into rules.ts.
defineMultiply('MassPerMass', 'Mass', (l, r) =>
  when(l.sdenom, r.substance, () => mass(l.snum)),
);
defineMultiply('Mass', 'MassPerMass', (l, r) =>
  when(l.substance, r.sdenom, () => mass(r.snum)),
);
defineMultiply('EnergyPerVolume', 'Volume', (l, r) =>
  when(l.substance, r.substance, energy),
);
defineMultiply('MassPerEnergy', 'EnergyPerVolume', (l, r) =>
  massPerVolume(l.substance, r.substance),
);
defineMultiply('MassPerEnergy', 'Energy', (l) => mass(l.substance));
defineMultiply('EnergyPerMass', 'Mass', (l, r) =>
  when(l.substance, r.substance, energy),
);
defineMultiply('MassPerArea', 'Area', (l) => mass(l.substance));
defineMultiply('MassPerTime', 'Time', (l) => mass(l.substance));
defineMultiply('MassPerVolume', 'Volume', (l, r) =>
  when(l.volume, r.substance, () => mass(l.mass)),
);
defineMultiply('Electricity', 'MassPerElectricity', (_, r) =>
  mass(r.substance),
);
defineMultiply('MassPerHead', 'MassPerMass', (l, r) =>
  when(l.substance, r.sdenom, () => massPerHead(r.snum)),
);
defineMultiply('MassPerHeadPerDay', 'MassPerMass', (l, r) =>
  when(l.substance, r.sdenom, () => massPerHeadPerDay(r.snum)),
);
defineMultiply('MassPerHeadPerDay', 'Head', (l) => massPerDay(l.substance));
defineMultiply('MassPerHeadPerDay', 'Days', (l) => massPerHead(l.substance));
defineMultiply('Head', 'MassPerHead', (_, r) => mass(r.substance));
defineMultiply('Head', 'MassPerHeadPerYear', (_, r) =>
  massPerYear(r.substance),
);
defineMultiply('MassPerHeadPerYear', 'Years', (l) => massPerHead(l.substance));
defineMultiply('MassPerEnergy', 'EnergyPerMass', (l, r) =>
  when(l.substance, r.substance, realNumber),
);
defineMultiply('MassPerDay', 'Days', (l) => mass(l.substance));
defineMultiply('MassPerHeadPerDay', 'VolumePerMass', (l, r) =>
  when(l.substance, r.mass, () => volumePerHeadPerDay(r.volume)),
);
defineMultiply('VolumePerHeadPerDay', 'MassPerVolume', (l, r) =>
  when(l.substance, r.volume, () => massPerHeadPerDay(r.mass)),
);
defineMultiply('MassPerAreaPerDay', 'Days', (l) => massPerArea(l.substance));
defineMultiply('MassPerAreaPerDay', 'Area', (l) => massPerDay(l.substance));
defineMultiply('MassPerAreaPerYear', 'Area', (l) => massPerYear(l.substance));
defineMultiply('MassPerAreaPerYear', 'Years', (l) => massPerArea(l.substance));
defineMultiply('MassPerAreaPerYear', 'MassPerMass', (l, r) =>
  when(l.substance, r.sdenom, () => massPerAreaPerYear(r.snum)),
);
defineMultiply('MassPerYear', 'MassPerMass', (l, r) =>
  when(l.substance, r.sdenom, () => massPerYear(r.snum)),
);
defineMultiply('MassPerYear', 'Years', (l) => mass(l.substance));
defineMultiply('Mass', 'Distance', (l) => massDistance(l.substance));
defineMultiply('MassPerMassDistance', 'Distance', (l) =>
  massPerMass(l.snum, l.sdenom),
);
defineMultiply('MassPerMassDistance', 'MassDistance', (l, r) =>
  when(l.sdenom, r.substance, () => mass(l.snum)),
);
defineMultiply('MassPerHeadPerDay', 'EnergyPerMass', (l, r) =>
  when(l.substance, r.substance, energyPerHeadPerDay),
);
defineMultiply('MassPerVolume', 'MassPerMass', (l, r) =>
  when(l.mass, r.sdenom, () => massPerVolume(r.snum, l.volume)),
);

defineDivide('Mass', 'Area', (l) => massPerArea(l.substance));
defineDivide('Mass', 'MassPerMass', (l, r) =>
  when(l.substance, r.snum, () => mass(r.sdenom)),
);
defineDivide('MassPerArea', 'Years', (l) => massPerAreaPerYear(l.substance));
defineDivide('EnergyPerHeadPerDay', 'EnergyPerMass', (_, r) =>
  massPerHeadPerDay(r.substance),
);
defineDivide('MassPerHead', 'Days', (l) => massPerHeadPerDay(l.substance));
defineDivide('MassPerHeadPerDay', 'MassPerMass', (l, r) =>
  when(l.substance, r.snum, () => massPerHeadPerDay(r.sdenom)),
);
defineDivide('Mass', 'MassPerVolume', (l, r) =>
  when(l.substance, r.mass, () => volume(r.volume)),
);
defineDivide('MassPerEnergy', 'MassPerMass', (l, r) =>
  when(l.substance, r.snum, () => massPerEnergy(r.sdenom)),
);
