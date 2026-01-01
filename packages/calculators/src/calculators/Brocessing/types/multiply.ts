import {
  BinaryOrigin,
  IntermediateOrNamedOrigin,
  TypedOrigin,
} from './origins';
import {
  Energy,
  EnergyPerVolume,
  Mass,
  MassPerEnergy,
  MassPerMass,
  NumberUnit,
  RealNumber,
  Substance,
  Volume,
  isMass,
  isMassPerMass,
  mass,
  voidUnit,
} from './units';

// Helper types to extract substance from origin types
type ExtractMassPerMassNumerator<T> = T extends {
  unit: MassPerMass<infer SNum, Substance>;
}
  ? SNum
  : never;
type ExtractMassPerEnergySubstance<T> = T extends {
  unit: MassPerEnergy<infer S>;
}
  ? S
  : never;

// Multiply by a simple real number, preserving unit
export function multiply<
  U extends NumberUnit,
  UL extends TypedOrigin<U>,
  UR extends TypedOrigin<RealNumber>,
>(left: UL, right: UR, baseOrigin?: IntermediateOrNamedOrigin): BinaryOrigin<U>;

// kg CO2e per kg Refrigerant * kg Refrigerant = kg CO2e
export function multiply<
  UL extends TypedOrigin<MassPerMass<Substance, Substance>>,
  UR extends TypedOrigin<Mass<Substance>>,
>(
  left: UL,
  right: UR,
  baseOrigin?: IntermediateOrNamedOrigin,
): BinaryOrigin<Mass<ExtractMassPerMassNumerator<UL>>>;

// GJ per litre Fuel * litres Fuel = GJ
export function multiply<
  S extends Substance,
  UL extends TypedOrigin<EnergyPerVolume<S>>,
  UR extends TypedOrigin<Volume<S>>,
>(
  left: UL,
  right: UR,
  baseOrigin?: IntermediateOrNamedOrigin,
): BinaryOrigin<Energy>;

// kg CO2e per GJ * GJ = kg CO2e
export function multiply<
  UL extends TypedOrigin<MassPerEnergy<Substance>>,
  UR extends TypedOrigin<Energy>,
>(
  left: UL,
  right: UR,
  baseOrigin?: IntermediateOrNamedOrigin,
): BinaryOrigin<Mass<ExtractMassPerEnergySubstance<UL>>>;

export function multiply<UL extends NumberUnit, UR extends NumberUnit>(
  left: TypedOrigin<UL>,
  right: TypedOrigin<UR>,
  baseOrigin?: IntermediateOrNamedOrigin,
): BinaryOrigin<NumberUnit> {
  const baseOrDefault = baseOrigin || { valueType: 'intermediate' };
  let unit: NumberUnit = voidUnit();
  if (isMassPerMass(left.unit) && isMass(right.unit)) {
    unit = mass(left.unit.snum);
  }

  return {
    type: 'multiply',
    originType: 'binary',
    left,
    right,
    unit,
    ...baseOrDefault,
  };
}
