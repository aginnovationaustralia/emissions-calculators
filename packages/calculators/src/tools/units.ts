import Decimal from 'decimal.js-light';

export type Substance =
  | 'CO2'
  | 'CH4'
  | 'N2O'
  | 'N'
  | 'CO2e'
  | 'Refrigerant'
  | 'Fuel'
  | 'FluidWaste'
  | 'Oxygen'
  | 'Urea'
  | 'DryMatter'
  | 'CropResidue'
  | 'Yield';

type NumberUnitBase = { value: Decimal };

export type MassPerMass<
  SNum extends Substance,
  SDenom extends Substance,
> = NumberUnitBase & {
  __unitType: 'MassPerMass';
  snum: SNum;
  sdenom: SDenom;
};
export const massPerMass = <SNum extends Substance, SDenom extends Substance>(
  snum: SNum,
  sdenom: SDenom,
  initialValue?: Decimal,
): MassPerMass<SNum, SDenom> => {
  return {
    __unitType: 'MassPerMass',
    snum,
    sdenom,
    value: initialValue ?? new Decimal(0),
  };
};

export type MassCO2ePerMassRefrigerant = MassPerMass<'CO2e', 'Refrigerant'>;
export const massCO2ePerMassRefrigerant = (
  initialValue?: Decimal,
): MassCO2ePerMassRefrigerant => {
  return massPerMass('CO2e', 'Refrigerant', initialValue);
};

export const isMassPerMass = (
  unit: NumberUnit,
): unit is MassPerMass<Substance, Substance> => {
  return unit.__unitType === 'MassPerMass';
};

export type Mass<T extends Substance> = NumberUnitBase & {
  __unitType: 'Mass';
  substance: T;
};
export const mass = <S extends Substance>(
  substance: S,
  initialValue?: Decimal,
): Mass<S> => {
  return {
    __unitType: 'Mass',
    substance,
    value: initialValue ?? new Decimal(0),
  };
};
export const isMass = (unit: NumberUnit): unit is Mass<Substance> => {
  return unit.__unitType === 'Mass';
};
export type Volume<S extends Substance> = NumberUnitBase & {
  __unitType: 'Volume';
  substance: S;
};
export const volume = <S extends Substance>(
  substance: S,
  initialValue?: Decimal,
): Volume<S> => {
  return {
    __unitType: 'Volume',
    substance,
    value: initialValue ?? new Decimal(0),
  };
};
export const isVolume = (unit: NumberUnit): unit is Volume<Substance> => {
  return unit.__unitType === 'Volume';
};

export type Energy = NumberUnitBase & {
  __unitType: 'Energy';
};
export const energy = (initialValue?: Decimal): Energy => {
  return {
    __unitType: 'Energy',
    value: initialValue ?? new Decimal(0),
  };
};
export const isEnergy = (unit: NumberUnit): unit is Energy => {
  return unit.__unitType === 'Energy';
};
export type Area = NumberUnitBase & {
  __unitType: 'Area';
};
export const area = (initialValue?: Decimal): Area => {
  return {
    __unitType: 'Area',
    value: initialValue ?? new Decimal(0),
  };
};
export const isArea = (unit: NumberUnit): unit is Area => {
  return unit.__unitType === 'Area';
};

export type MassPerEnergy<T extends Substance> = NumberUnitBase & {
  __unitType: 'MassPerEnergy';
  substance: T;
};
export const massPerEnergy = <S extends Substance>(
  substance: S,
  initialValue?: Decimal,
): MassPerEnergy<S> => {
  return {
    __unitType: 'MassPerEnergy',
    substance,
    value: initialValue ?? new Decimal(0),
  };
};
export const isMassPerEnergy = (
  unit: NumberUnit,
): unit is MassPerEnergy<Substance> => {
  return unit.__unitType === 'MassPerEnergy';
};

export type EnergyPerVolume<S extends Substance> = NumberUnitBase & {
  __unitType: 'EnergyPerVolume';
  substance: S;
};
export const energyPerVolume = <S extends Substance>(
  substance: S,
  initialValue?: Decimal,
): EnergyPerVolume<S> => {
  return {
    __unitType: 'EnergyPerVolume',
    substance,
    value: initialValue ?? new Decimal(0),
  };
};
export const isEnergyPerVolume = (
  unit: NumberUnit,
): unit is EnergyPerVolume<Substance> => {
  return unit.__unitType === 'EnergyPerVolume';
};

export type MassPerVolume<
  SMass extends Substance,
  SVolume extends Substance,
> = NumberUnitBase & {
  __unitType: 'MassPerVolume';
  mass: SMass;
  volume: SVolume;
};
export const massPerVolume = <
  SMass extends Substance,
  SVolume extends Substance,
>(
  mass: SMass,
  volume: SVolume,
  initialValue?: Decimal,
): MassPerVolume<SMass, SVolume> => {
  return {
    __unitType: 'MassPerVolume',
    mass,
    volume,
    value: initialValue ?? new Decimal(0),
  };
};
export const isMassPerVolume = (
  unit: NumberUnit,
): unit is MassPerVolume<Substance, Substance> => {
  return unit.__unitType === 'MassPerVolume';
};

export type MassPerArea<S extends Substance> = NumberUnitBase & {
  __unitType: 'MassPerArea';
  substance: S;
};
export const massPerArea = <S extends Substance>(
  substance: S,
  initialValue?: Decimal,
): MassPerArea<S> => {
  return {
    __unitType: 'MassPerArea',
    substance,
    value: initialValue ?? new Decimal(0),
  };
};
export const isMassPerArea = (
  unit: NumberUnit,
): unit is MassPerArea<Substance> => {
  return unit.__unitType === 'MassPerArea';
};

export type RealNumber = NumberUnitBase & {
  __unitType: 'RealNumber';
};
export const realNumber = (initialValue?: Decimal): RealNumber => {
  return {
    __unitType: 'RealNumber',
    value: initialValue ?? new Decimal(0),
  };
};
export const isRealNumber = (unit: NumberUnit): unit is RealNumber => {
  return unit.__unitType === 'RealNumber';
};

export type VoidUnit = {
  __unitType: 'Void';
  value: Decimal;
};

export const voidUnit = () => ({
  __unitType: 'Void' as const,
  value: new Decimal(0),
});

export const isVoid = (unit: AnyUnit): unit is VoidUnit => {
  return (
    typeof unit === 'object' &&
    '__unitType' in unit &&
    unit.__unitType === 'Void'
  );
};

export type NumberUnit =
  | MassPerMass<Substance, Substance>
  | Mass<Substance>
  | MassPerEnergy<Substance>
  | MassPerVolume<Substance, Substance>
  | MassPerArea<Substance>
  | EnergyPerVolume<Substance>
  | Volume<Substance>
  | Energy
  | Area
  | VoidUnit
  | RealNumber;

export type StringUnit<V extends string = string> = V;

export const stringUnit = <V extends string = string>(
  value: V,
): StringUnit<V> => {
  return value;
};

export const isStringUnit = (unit: AnyUnit): unit is StringUnit => {
  return typeof unit === 'string';
};

export type AnyUnit = NumberUnit | StringUnit | VoidUnit;

export function formatUnit(unit: AnyUnit): string {
  if (isVoid(unit)) {
    return 'Void';
  }
  if (isStringUnit(unit)) {
    return `string: (${unit})`;
  }

  switch (unit.__unitType) {
    case 'MassPerMass':
      return `Mass(${unit.snum}) / Mass(${unit.sdenom})`;
    case 'Mass':
      return `Mass(${unit.substance})`;
    case 'Volume':
      return `Volume(${unit.substance})`;
    case 'Energy':
      return 'energy';
    case 'RealNumber':
      return 'real number';
    case 'MassPerEnergy':
      return `Mass(${unit.substance}) / Energy`;
    case 'EnergyPerVolume':
      return `Energy / Volume(${unit.substance})`;
    case 'MassPerVolume':
      return `Mass(${unit.mass}) / Volume(${unit.volume})`;
    case 'MassPerArea':
      return `Mass(${unit.substance}) / Area`;
    case 'Area':
      return 'Area';
  }
}
