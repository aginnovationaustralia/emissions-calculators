/*
 * The default units, ported from the emissions calculators.
 *
 * Each unit holds its value in `store`. Rules only look at the other fields, which describe what
 * the number measures ("kg of CO2 per kg of Fuel"). Constructors take an optional initial value.
 *
 * Storage base units: kg, h, m, m2, L, J, kWh.
 */
import type { Substance } from '../substances.js';
import type { InitialValue } from '../units.js';
import { values, ValueStore } from '../value-store.js';

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

export type Energy = { __unitType: 'Energy'; store: ValueStore };
export type Area = { __unitType: 'Area'; store: ValueStore };
export type Time = { __unitType: 'Time'; store: ValueStore };
export type Electricity = { __unitType: 'Electricity'; store: ValueStore };
export type EnergyPerHeadPerDay = {
  __unitType: 'EnergyPerHeadPerDay';
  store: ValueStore;
};
export type Days = { __unitType: 'Days'; store: ValueStore };
export type Years = { __unitType: 'Years'; store: ValueStore };
export type Head = { __unitType: 'Head'; store: ValueStore };
export type Distance = { __unitType: 'Distance'; store: ValueStore };

export type Mass<S extends Substance = Substance> = {
  __unitType: 'Mass';
  substance: S;
  store: ValueStore;
};
export type Volume<S extends Substance = Substance> = {
  __unitType: 'Volume';
  substance: S;
  store: ValueStore;
};
export type MassPerEnergy<S extends Substance = Substance> = {
  __unitType: 'MassPerEnergy';
  substance: S;
  store: ValueStore;
};
export type MassPerElectricity<S extends Substance = Substance> = {
  __unitType: 'MassPerElectricity';
  substance: S;
  store: ValueStore;
};
export type EnergyPerVolume<S extends Substance = Substance> = {
  __unitType: 'EnergyPerVolume';
  substance: S;
  store: ValueStore;
};
export type EnergyPerMass<S extends Substance = Substance> = {
  __unitType: 'EnergyPerMass';
  substance: S;
  store: ValueStore;
};
export type MassPerArea<S extends Substance = Substance> = {
  __unitType: 'MassPerArea';
  substance: S;
  store: ValueStore;
};
export type MassPerAreaPerDay<S extends Substance = Substance> = {
  __unitType: 'MassPerAreaPerDay';
  substance: S;
  store: ValueStore;
};
export type MassPerAreaPerYear<S extends Substance = Substance> = {
  __unitType: 'MassPerAreaPerYear';
  substance: S;
  store: ValueStore;
};
export type MassPerYear<S extends Substance = Substance> = {
  __unitType: 'MassPerYear';
  substance: S;
  store: ValueStore;
};
export type MassPerTime<S extends Substance = Substance> = {
  __unitType: 'MassPerTime';
  substance: S;
  store: ValueStore;
};
export type MassPerDay<S extends Substance = Substance> = {
  __unitType: 'MassPerDay';
  substance: S;
  store: ValueStore;
};
export type MassPerHead<S extends Substance = Substance> = {
  __unitType: 'MassPerHead';
  substance: S;
  store: ValueStore;
};
export type MassPerHeadPerDay<S extends Substance = Substance> = {
  __unitType: 'MassPerHeadPerDay';
  substance: S;
  store: ValueStore;
};
export type MassPerHeadPerYear<S extends Substance = Substance> = {
  __unitType: 'MassPerHeadPerYear';
  substance: S;
  store: ValueStore;
};
export type VolumePerHeadPerDay<S extends Substance = Substance> = {
  __unitType: 'VolumePerHeadPerDay';
  substance: S;
  store: ValueStore;
};
export type CountPerArea<S extends Substance = Substance> = {
  __unitType: 'CountPerArea';
  substance: S;
  store: ValueStore;
};
export type MassDistance<S extends Substance = Substance> = {
  __unitType: 'MassDistance';
  substance: S;
  store: ValueStore;
};

export type MassPerMass<
  N extends Substance = Substance,
  D extends Substance = Substance,
> = { __unitType: 'MassPerMass'; snum: N; sdenom: D; store: ValueStore };
export type MassPerMassDistance<
  N extends Substance = Substance,
  D extends Substance = Substance,
> = {
  __unitType: 'MassPerMassDistance';
  snum: N;
  sdenom: D;
  store: ValueStore;
};
export type MassPerVolume<
  M extends Substance = Substance,
  V extends Substance = Substance,
> = { __unitType: 'MassPerVolume'; mass: M; volume: V; store: ValueStore };
export type VolumePerMass<
  V extends Substance = Substance,
  M extends Substance = Substance,
> = { __unitType: 'VolumePerMass'; volume: V; mass: M; store: ValueStore };

// Constructors
export const energy = (initialValue?: InitialValue): Energy => ({
  __unitType: 'Energy',
  store: values(initialValue),
});
export const area = (initialValue?: InitialValue): Area => ({
  __unitType: 'Area',
  store: values(initialValue),
});
export const time = (initialValue?: InitialValue): Time => ({
  __unitType: 'Time',
  store: values(initialValue),
});
export const electricity = (initialValue?: InitialValue): Electricity => ({
  __unitType: 'Electricity',
  store: values(initialValue),
});
export const energyPerHeadPerDay = (
  initialValue?: InitialValue,
): EnergyPerHeadPerDay => ({
  __unitType: 'EnergyPerHeadPerDay',
  store: values(initialValue),
});
export const days = (initialValue?: InitialValue): Days => ({
  __unitType: 'Days',
  store: values(initialValue),
});
export const years = (initialValue?: InitialValue): Years => ({
  __unitType: 'Years',
  store: values(initialValue),
});
export const head = (initialValue?: InitialValue): Head => ({
  __unitType: 'Head',
  store: values(initialValue),
});
export const distance = (initialValue?: InitialValue): Distance => ({
  __unitType: 'Distance',
  store: values(initialValue),
});

export const mass = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): Mass<S> => ({
  __unitType: 'Mass',
  substance,
  store: values(initialValue),
});
export const volume = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): Volume<S> => ({
  __unitType: 'Volume',
  substance,
  store: values(initialValue),
});
export const massPerEnergy = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerEnergy<S> => ({
  __unitType: 'MassPerEnergy',
  substance,
  store: values(initialValue),
});
export const massPerElectricity = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerElectricity<S> => ({
  __unitType: 'MassPerElectricity',
  substance,
  store: values(initialValue),
});
export const energyPerVolume = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): EnergyPerVolume<S> => ({
  __unitType: 'EnergyPerVolume',
  substance,
  store: values(initialValue),
});
export const energyPerMass = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): EnergyPerMass<S> => ({
  __unitType: 'EnergyPerMass',
  substance,
  store: values(initialValue),
});
export const massPerArea = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerArea<S> => ({
  __unitType: 'MassPerArea',
  substance,
  store: values(initialValue),
});
export const massPerAreaPerDay = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerAreaPerDay<S> => ({
  __unitType: 'MassPerAreaPerDay',
  substance,
  store: values(initialValue),
});
export const massPerAreaPerYear = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerAreaPerYear<S> => ({
  __unitType: 'MassPerAreaPerYear',
  substance,
  store: values(initialValue),
});
export const massPerYear = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerYear<S> => ({
  __unitType: 'MassPerYear',
  substance,
  store: values(initialValue),
});
export const massPerTime = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerTime<S> => ({
  __unitType: 'MassPerTime',
  substance,
  store: values(initialValue),
});
export const massPerDay = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerDay<S> => ({
  __unitType: 'MassPerDay',
  substance,
  store: values(initialValue),
});
export const massPerHead = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerHead<S> => ({
  __unitType: 'MassPerHead',
  substance,
  store: values(initialValue),
});
export const massPerHeadPerDay = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerHeadPerDay<S> => ({
  __unitType: 'MassPerHeadPerDay',
  substance,
  store: values(initialValue),
});
export const massPerHeadPerYear = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerHeadPerYear<S> => ({
  __unitType: 'MassPerHeadPerYear',
  substance,
  store: values(initialValue),
});
export const volumePerHeadPerDay = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): VolumePerHeadPerDay<S> => ({
  __unitType: 'VolumePerHeadPerDay',
  substance,
  store: values(initialValue),
});
export const countPerArea = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): CountPerArea<S> => ({
  __unitType: 'CountPerArea',
  substance,
  store: values(initialValue),
});
export const massDistance = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassDistance<S> => ({
  __unitType: 'MassDistance',
  substance,
  store: values(initialValue),
});

export const massPerMass = <N extends Substance, D extends Substance>(
  snum: N,
  sdenom: D,
  initialValue?: InitialValue,
): MassPerMass<N, D> => ({
  __unitType: 'MassPerMass',
  snum,
  sdenom,
  store: values(initialValue),
});
export const massPerMassDistance = <N extends Substance, D extends Substance>(
  snum: N,
  sdenom: D,
  initialValue?: InitialValue,
): MassPerMassDistance<N, D> => ({
  __unitType: 'MassPerMassDistance',
  snum,
  sdenom,
  store: values(initialValue),
});
export const massPerVolume = <M extends Substance, V extends Substance>(
  massSubstance: M,
  volumeSubstance: V,
  initialValue?: InitialValue,
): MassPerVolume<M, V> => ({
  __unitType: 'MassPerVolume',
  mass: massSubstance,
  volume: volumeSubstance,
  store: values(initialValue),
});
export const volumePerMass = <V extends Substance, M extends Substance>(
  volumeSubstance: V,
  massSubstance: M,
  initialValue?: InitialValue,
): VolumePerMass<V, M> => ({
  __unitType: 'VolumePerMass',
  volume: volumeSubstance,
  mass: massSubstance,
  store: values(initialValue),
});
