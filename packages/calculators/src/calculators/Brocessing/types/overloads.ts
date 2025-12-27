import Decimal from 'decimal.js-light';
import { BaseOrigin, Origin, SummedOrigin } from './origins';

export type Substance = 'CO2' | 'CH4' | 'N2O' | 'CO2e' | 'Refrigerant';

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
    initialValue: initialValue ?? new Decimal(0),
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
    initialValue: initialValue ?? new Decimal(0),
  };
};
export const isMass = (unit: NumberUnit): unit is Mass<Substance> => {
  return unit.__unitType === 'Mass';
};

type NumberUnitBase = { initialValue: Decimal };

type VoidUnit = {
  __unitType: 'Void';
  initialValue: Decimal;
};

export const voidUnit = () => ({
  __unitType: 'Void' as const,
  initialValue: new Decimal(0),
});

export type NumberUnit =
  | MassPerMass<Substance, Substance>
  | Mass<Substance>
  | VoidUnit;

export type StringUnit<V extends string = string> = V;

export type AnyUnit = NumberUnit | StringUnit;

// Use function overloading to define different units that can be multiplied
// For example, MassPerMass<SNum extends Substance, SDenom extends Substance> can be multiplied by Mass<SDenom>

export type UnitArray<U extends AnyUnit, O extends Origin<U> = Origin<U>> = {
  unit: U;
  items: O[];
};

export const sum = <N extends NumberUnit>(
  values: UnitArray<N>,
  baseOrigin?: BaseOrigin<N>,
): SummedOrigin<N> => {
  const baseOrDefault = baseOrigin || { valueType: 'intermediate' };
  return {
    originType: 'sum',
    from: values,
    unit: values.unit,
    ...baseOrDefault,
  };
};
