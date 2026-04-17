import Decimal from 'decimal.js-light';

export type Substance =
  | 'Carbon'
  | 'Chemical'
  | 'Inorganic Fertiliser'
  | 'Organic Fertiliser'
  | 'CO2'
  | 'CH4'
  | 'N2O'
  | 'N'
  | 'Volatilised N'
  | 'Mineralised N'
  | 'CO2e'
  | 'Refrigerant'
  | 'Fuel'
  | 'FluidWaste'
  | 'Oxygen'
  | 'Urea'
  | 'DryMatter'
  | 'CrudeProtein'
  | 'CropResidue'
  | 'Yield'
  | 'Lime'
  | 'Solid Waste'
  | 'Milk'
  | 'Milk Solids'
  | 'Liveweight'
  | 'Purchased Feed'
  | 'Purchased Mineral Supplement'
  | 'Volatile Solids'
  | 'COD'
  | 'Packaging';

export type NumberUnitBase = { value: Decimal };

/* SI unit definitions

Selected base units for storage of values:
Mass: kilograms (kg)
Time: seconds (s)
Length: metres (m)
Area: square metres (m2)
Volume: litres (L)
Energy: joules (J)
Electricity: kilowatt hours (kWh)

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

export type Time = NumberUnitBase & {
  __unitType: 'Time';
};
export const time = (initialValueSeconds?: number | Decimal): Time => {
  return {
    __unitType: 'Time',
    value: new Decimal(initialValueSeconds ?? 0),
  };
};
export const isTime = (unit: NumberUnit): unit is Time => {
  return unit.__unitType === 'Time';
};

export type Electricity = NumberUnitBase & {
  __unitType: 'Electricity';
};
export const electricity = (
  initialValueKWh?: number | Decimal,
): Electricity => {
  return {
    __unitType: 'Electricity',
    value: new Decimal(initialValueKWh ?? 0),
  };
};
export const isElectricity = (unit: NumberUnit): unit is Electricity => {
  return unit.__unitType === 'Electricity';
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

export type MassPerElectricity<S extends Substance> = NumberUnitBase & {
  __unitType: 'MassPerElectricity';
  substance: S;
};
export const massPerElectricity = <S extends Substance>(
  substance: S,
  initialValueKgPerKWh?: number | Decimal,
): MassPerElectricity<S> => {
  return {
    __unitType: 'MassPerElectricity',
    substance,
    value: new Decimal(initialValueKgPerKWh ?? 0),
  };
};

export const isMassPerElectricity = (
  unit: NumberUnit,
): unit is MassPerElectricity<Substance> => {
  return unit.__unitType === 'MassPerElectricity';
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

export type EnergyPerMass<S extends Substance> = NumberUnitBase & {
  __unitType: 'EnergyPerMass';
  substance: S;
};
export const energyPerMass = <S extends Substance>(
  substance: S,
  initialValueJoulesPerKg?: number | Decimal,
): EnergyPerMass<S> => {
  return {
    __unitType: 'EnergyPerMass',
    substance,
    value: new Decimal(initialValueJoulesPerKg ?? 0),
  };
};
export const isEnergyPerMass = (
  unit: NumberUnit,
): unit is EnergyPerMass<Substance> => {
  return unit.__unitType === 'EnergyPerMass';
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

export type MassPerTime<S extends Substance> = NumberUnitBase & {
  __unitType: 'MassPerTime';
  substance: S;
};
export const massPerTime = <S extends Substance>(
  substance: S,
  initialValueKgPerSecond?: number | Decimal,
): MassPerTime<S> => {
  return {
    __unitType: 'MassPerTime',
    substance,
    value: new Decimal(initialValueKgPerSecond ?? 0),
  };
};
export const isMassPerTime = (
  unit: NumberUnit,
): unit is MassPerTime<Substance> => {
  return unit.__unitType === 'MassPerTime';
};

export type MassPerHeadPerDay<S extends Substance> = NumberUnitBase & {
  __unitType: 'MassPerHeadPerDay';
  substance: S;
};
export const massPerHeadPerDay = <S extends Substance>(
  substance: S,
  initialValueKgPerHeadPerDay?: number | Decimal,
): MassPerHeadPerDay<S> => {
  return {
    __unitType: 'MassPerHeadPerDay',
    substance,
    value: new Decimal(initialValueKgPerHeadPerDay ?? 0),
  };
};
export const isMassPerHeadPerDay = (
  unit: NumberUnit,
): unit is MassPerHeadPerDay<Substance> => {
  return unit.__unitType === 'MassPerHeadPerDay';
};

export type VolumePerHeadPerDay<S extends Substance> = NumberUnitBase & {
  __unitType: 'VolumePerHeadPerDay';
  substance: S;
};
export const volumePerHeadPerDay = <S extends Substance>(
  substance: S,
  initialValueLitresPerHeadPerDay?: number | Decimal,
): VolumePerHeadPerDay<S> => {
  return {
    __unitType: 'VolumePerHeadPerDay',
    substance,
    value: new Decimal(initialValueLitresPerHeadPerDay ?? 0),
  };
};
export const isVolumePerHeadPerDay = (
  unit: NumberUnit,
): unit is VolumePerHeadPerDay<Substance> => {
  return unit.__unitType === 'VolumePerHeadPerDay';
};

export type VolumePerMass<
  SV extends Substance,
  SM extends Substance,
> = NumberUnitBase & {
  __unitType: 'VolumePerMass';
  volume: SV;
  mass: SM;
};
export const volumePerMass = <SV extends Substance, SM extends Substance>(
  volume: SV,
  mass: SM,
  initialValueLitresPerKg?: number | Decimal,
): VolumePerMass<SV, SM> => {
  return {
    __unitType: 'VolumePerMass',
    volume,
    mass,
    value: new Decimal(initialValueLitresPerKg ?? 0),
  };
};
export const isVolumePerMass = (
  unit: NumberUnit,
): unit is VolumePerMass<Substance, Substance> => {
  return unit.__unitType === 'VolumePerMass';
};

export type MassPerDay<S extends Substance> = NumberUnitBase & {
  __unitType: 'MassPerDay';
  substance: S;
};
export const massPerDay = <S extends Substance>(
  substance: S,
  initialValueKgPerDays?: number | Decimal,
): MassPerDay<S> => {
  return {
    __unitType: 'MassPerDay',
    substance,
    value: new Decimal(initialValueKgPerDays ?? 0),
  };
};
export const isMassPerDay = (
  unit: NumberUnit,
): unit is MassPerDay<Substance> => {
  return unit.__unitType === 'MassPerDay';
};

export type Days = NumberUnitBase & {
  __unitType: 'Days';
};
export const days = (initialValueDays?: number | Decimal): Days => {
  return {
    __unitType: 'Days',
    value: new Decimal(initialValueDays ?? 0),
  };
};
export const isDays = (unit: NumberUnit): unit is Days => {
  return unit.__unitType === 'Days';
};

export type Head = NumberUnitBase & {
  __unitType: 'Head';
};
export const head = (initialValueHeads?: number | Decimal): Head => {
  return {
    __unitType: 'Head',
    value: new Decimal(initialValueHeads ?? 0),
  };
};
export const isHead = (unit: NumberUnit): unit is Head => {
  return unit.__unitType === 'Head';
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
export const percentage = (initialValue?: number | Decimal): RealNumber => {
  return realNumber(initialValue ? new Decimal(initialValue).div(100) : 0);
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
  | EnergyPerMass<Substance>
  | MassPerVolume<Substance, Substance>
  | MassPerArea<Substance>
  | MassPerTime<Substance>
  | MassPerElectricity<Substance>
  | MassPerHeadPerDay<Substance>
  | MassPerDay<Substance>
  | VolumePerHeadPerDay<Substance>
  | VolumePerMass<Substance, Substance>
  | Days
  | Head
  | EnergyPerVolume<Substance>
  | Volume<Substance>
  | Energy
  | Area
  | Electricity
  | Time
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
