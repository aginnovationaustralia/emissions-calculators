/*
 * The default units, ported from the emissions calculators.
 *
 * Units are plain descriptors. The value lives on the container, so a unit is purely a fact about
 * what the number measures ("kg of CO2 per kg of Fuel"), which rules can pattern match on.
 *
 * Storage base units: kg, h, m, m2, L, J, kWh.
 */
import type { Substance } from '../substances.js';

/*
 * The default substances. Declared here, in the file every default unit depends on, so they are in
 * scope exactly when the defaults are imported and never for a blank slate.
 */
declare module '../substances.js' {
  interface SubstanceRegistry {
    Carbon: true;
    Chemical: true;
    'Inorganic Fertiliser': true;
    'Organic Fertiliser': true;
    CO2: true;
    CH4: true;
    N2O: true;
    N: true;
    'Volatilised N': true;
    CO2e: true;
    Refrigerant: true;
    Fuel: true;
    'Greasy Wool': true;
    'Clean Wool': true;
    FluidWaste: true;
    Oxygen: true;
    Urea: true;
    DryMatter: true;
    CrudeProtein: true;
    CropResidue: true;
    Yield: true;
    Lime: true;
    'Solid Waste': true;
    Milk: true;
    'Milk Solids': true;
    Liveweight: true;
    'Purchased Feed': true;
    'Purchased Mineral Supplement': true;
    'Volatile Solids': true;
    COD: true;
    Packaging: true;
    'Organic Amendment': true;
    Trees: true;
    'Freight Goods': true;
    Eggs: true;
    Fish: true;
  }
}

export type Energy = { __unitType: 'Energy' };
export type Area = { __unitType: 'Area' };
export type Time = { __unitType: 'Time' };
export type Electricity = { __unitType: 'Electricity' };
export type EnergyPerHeadPerDay = { __unitType: 'EnergyPerHeadPerDay' };
export type Days = { __unitType: 'Days' };
export type Years = { __unitType: 'Years' };
export type Head = { __unitType: 'Head' };
export type Distance = { __unitType: 'Distance' };

export type Mass<S extends Substance = Substance> = {
  __unitType: 'Mass';
  substance: S;
};
export type Volume<S extends Substance = Substance> = {
  __unitType: 'Volume';
  substance: S;
};
export type MassPerEnergy<S extends Substance = Substance> = {
  __unitType: 'MassPerEnergy';
  substance: S;
};
export type MassPerElectricity<S extends Substance = Substance> = {
  __unitType: 'MassPerElectricity';
  substance: S;
};
export type EnergyPerVolume<S extends Substance = Substance> = {
  __unitType: 'EnergyPerVolume';
  substance: S;
};
export type EnergyPerMass<S extends Substance = Substance> = {
  __unitType: 'EnergyPerMass';
  substance: S;
};
export type MassPerArea<S extends Substance = Substance> = {
  __unitType: 'MassPerArea';
  substance: S;
};
export type MassPerAreaPerDay<S extends Substance = Substance> = {
  __unitType: 'MassPerAreaPerDay';
  substance: S;
};
export type MassPerAreaPerYear<S extends Substance = Substance> = {
  __unitType: 'MassPerAreaPerYear';
  substance: S;
};
export type MassPerYear<S extends Substance = Substance> = {
  __unitType: 'MassPerYear';
  substance: S;
};
export type MassPerTime<S extends Substance = Substance> = {
  __unitType: 'MassPerTime';
  substance: S;
};
export type MassPerDay<S extends Substance = Substance> = {
  __unitType: 'MassPerDay';
  substance: S;
};
export type MassPerHead<S extends Substance = Substance> = {
  __unitType: 'MassPerHead';
  substance: S;
};
export type MassPerHeadPerDay<S extends Substance = Substance> = {
  __unitType: 'MassPerHeadPerDay';
  substance: S;
};
export type MassPerHeadPerYear<S extends Substance = Substance> = {
  __unitType: 'MassPerHeadPerYear';
  substance: S;
};
export type VolumePerHeadPerDay<S extends Substance = Substance> = {
  __unitType: 'VolumePerHeadPerDay';
  substance: S;
};
export type CountPerArea<S extends Substance = Substance> = {
  __unitType: 'CountPerArea';
  substance: S;
};
export type MassDistance<S extends Substance = Substance> = {
  __unitType: 'MassDistance';
  substance: S;
};

export type MassPerMass<
  N extends Substance = Substance,
  D extends Substance = Substance,
> = { __unitType: 'MassPerMass'; snum: N; sdenom: D };
export type MassPerMassDistance<
  N extends Substance = Substance,
  D extends Substance = Substance,
> = { __unitType: 'MassPerMassDistance'; snum: N; sdenom: D };
export type MassPerVolume<
  M extends Substance = Substance,
  V extends Substance = Substance,
> = { __unitType: 'MassPerVolume'; mass: M; volume: V };
export type VolumePerMass<
  V extends Substance = Substance,
  M extends Substance = Substance,
> = { __unitType: 'VolumePerMass'; volume: V; mass: M };

// Constructors. These only build descriptors; values are attached by a unit system's `root`.
export const energy = (): Energy => ({ __unitType: 'Energy' });
export const area = (): Area => ({ __unitType: 'Area' });
export const time = (): Time => ({ __unitType: 'Time' });
export const electricity = (): Electricity => ({ __unitType: 'Electricity' });
export const energyPerHeadPerDay = (): EnergyPerHeadPerDay => ({
  __unitType: 'EnergyPerHeadPerDay',
});
export const days = (): Days => ({ __unitType: 'Days' });
export const years = (): Years => ({ __unitType: 'Years' });
export const head = (): Head => ({ __unitType: 'Head' });
export const distance = (): Distance => ({ __unitType: 'Distance' });

export const mass = <S extends Substance>(substance: S): Mass<S> => ({
  __unitType: 'Mass',
  substance,
});
export const volume = <S extends Substance>(substance: S): Volume<S> => ({
  __unitType: 'Volume',
  substance,
});
export const massPerEnergy = <S extends Substance>(
  substance: S,
): MassPerEnergy<S> => ({ __unitType: 'MassPerEnergy', substance });
export const massPerElectricity = <S extends Substance>(
  substance: S,
): MassPerElectricity<S> => ({ __unitType: 'MassPerElectricity', substance });
export const energyPerVolume = <S extends Substance>(
  substance: S,
): EnergyPerVolume<S> => ({ __unitType: 'EnergyPerVolume', substance });
export const energyPerMass = <S extends Substance>(
  substance: S,
): EnergyPerMass<S> => ({ __unitType: 'EnergyPerMass', substance });
export const massPerArea = <S extends Substance>(
  substance: S,
): MassPerArea<S> => ({ __unitType: 'MassPerArea', substance });
export const massPerAreaPerDay = <S extends Substance>(
  substance: S,
): MassPerAreaPerDay<S> => ({ __unitType: 'MassPerAreaPerDay', substance });
export const massPerAreaPerYear = <S extends Substance>(
  substance: S,
): MassPerAreaPerYear<S> => ({ __unitType: 'MassPerAreaPerYear', substance });
export const massPerYear = <S extends Substance>(
  substance: S,
): MassPerYear<S> => ({ __unitType: 'MassPerYear', substance });
export const massPerTime = <S extends Substance>(
  substance: S,
): MassPerTime<S> => ({ __unitType: 'MassPerTime', substance });
export const massPerDay = <S extends Substance>(
  substance: S,
): MassPerDay<S> => ({
  __unitType: 'MassPerDay',
  substance,
});
export const massPerHead = <S extends Substance>(
  substance: S,
): MassPerHead<S> => ({ __unitType: 'MassPerHead', substance });
export const massPerHeadPerDay = <S extends Substance>(
  substance: S,
): MassPerHeadPerDay<S> => ({ __unitType: 'MassPerHeadPerDay', substance });
export const massPerHeadPerYear = <S extends Substance>(
  substance: S,
): MassPerHeadPerYear<S> => ({ __unitType: 'MassPerHeadPerYear', substance });
export const volumePerHeadPerDay = <S extends Substance>(
  substance: S,
): VolumePerHeadPerDay<S> => ({ __unitType: 'VolumePerHeadPerDay', substance });
export const countPerArea = <S extends Substance>(
  substance: S,
): CountPerArea<S> => ({ __unitType: 'CountPerArea', substance });
export const massDistance = <S extends Substance>(
  substance: S,
): MassDistance<S> => ({ __unitType: 'MassDistance', substance });

export const massPerMass = <N extends Substance, D extends Substance>(
  snum: N,
  sdenom: D,
): MassPerMass<N, D> => ({ __unitType: 'MassPerMass', snum, sdenom });
export const massPerMassDistance = <N extends Substance, D extends Substance>(
  snum: N,
  sdenom: D,
): MassPerMassDistance<N, D> => ({
  __unitType: 'MassPerMassDistance',
  snum,
  sdenom,
});
export const massPerVolume = <M extends Substance, V extends Substance>(
  massSubstance: M,
  volumeSubstance: V,
): MassPerVolume<M, V> => ({
  __unitType: 'MassPerVolume',
  mass: massSubstance,
  volume: volumeSubstance,
});
export const volumePerMass = <V extends Substance, M extends Substance>(
  volumeSubstance: V,
  massSubstance: M,
): VolumePerMass<V, M> => ({
  __unitType: 'VolumePerMass',
  volume: volumeSubstance,
  mass: massSubstance,
});
