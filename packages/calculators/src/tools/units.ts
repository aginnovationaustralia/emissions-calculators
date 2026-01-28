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

/* SI unit definitions

Selected base units for storage of values:
Mass: kilograms (kg)
Time: seconds (s)
Length: metres (m)
Area: square metres (m2)
Volume: litres (L)
Energy: joules (J)

See https://en.wikipedia.org/wiki/International_System_of_Units#SI_base_units
*/

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
  initialValueRatio?: number | Decimal,
): MassPerMass<SNum, SDenom> => {
  return {
    __unitType: 'MassPerMass',
    snum,
    sdenom,
    value: new Decimal(initialValueRatio ?? 0),
  };
};

export type MassCO2ePerMassRefrigerant = MassPerMass<'CO2e', 'Refrigerant'>;
export const massCO2ePerMassRefrigerant = (
  initialValueRatio?: number | Decimal,
): MassCO2ePerMassRefrigerant => {
  return massPerMass('CO2e', 'Refrigerant', initialValueRatio);
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
  initialValueKg?: number | Decimal,
): Mass<S> => {
  return {
    __unitType: 'Mass',
    substance,
    value: new Decimal(initialValueKg ?? 0),
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
  initialValueLitres?: number | Decimal,
): Volume<S> => {
  return {
    __unitType: 'Volume',
    substance,
    value: new Decimal(initialValueLitres ?? 0),
  };
};
export const isVolume = (unit: NumberUnit): unit is Volume<Substance> => {
  return unit.__unitType === 'Volume';
};

export type Energy = NumberUnitBase & {
  __unitType: 'Energy';
};
export const energy = (initialValueJoules?: number | Decimal): Energy => {
  return {
    __unitType: 'Energy',
    value: new Decimal(initialValueJoules ?? 0),
  };
};
export const isEnergy = (unit: NumberUnit): unit is Energy => {
  return unit.__unitType === 'Energy';
};
export type Area = NumberUnitBase & {
  __unitType: 'Area';
};
export const area = (initialValueMetresSquared?: number | Decimal): Area => {
  return {
    __unitType: 'Area',
    value: new Decimal(initialValueMetresSquared ?? 0),
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
  initialValueKgPerJoules?: number | Decimal,
): MassPerEnergy<S> => {
  return {
    __unitType: 'MassPerEnergy',
    substance,
    value: new Decimal(initialValueKgPerJoules ?? 0),
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
  initialValueJoulesPerLitre?: number | Decimal,
): EnergyPerVolume<S> => {
  return {
    __unitType: 'EnergyPerVolume',
    substance,
    value: new Decimal(initialValueJoulesPerLitre ?? 0),
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
  initialValueKgPerLitre?: number | Decimal,
): MassPerVolume<SMass, SVolume> => {
  return {
    __unitType: 'MassPerVolume',
    mass,
    volume,
    value: new Decimal(initialValueKgPerLitre ?? 0),
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
  initialValueKgPerSquareMetre?: number | Decimal,
): MassPerArea<S> => {
  return {
    __unitType: 'MassPerArea',
    substance,
    value: new Decimal(initialValueKgPerSquareMetre ?? 0),
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
export const realNumber = (initialValue?: number | Decimal): RealNumber => {
  return {
    __unitType: 'RealNumber',
    value: new Decimal(initialValue ?? 0),
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

export type AnyUnit = NumberUnit | StringUnit;

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
