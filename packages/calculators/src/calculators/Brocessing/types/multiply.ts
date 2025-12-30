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
  Substance,
  Volume,
  isMass,
  isMassPerMass,
  mass,
  voidUnit,
} from './units';

// kg CO2e per kg Refrigerant * kg Refrigerant = kg CO2e
export function multiply<
  SNum extends Substance,
  SDenom extends Substance,
  UL extends TypedOrigin<MassPerMass<SNum, SDenom>>,
  UR extends TypedOrigin<Mass<SDenom>>,
>(
  left: UL,
  right: UR,
  baseOrigin?: IntermediateOrNamedOrigin,
): BinaryOrigin<Mass<SNum>>;

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
  S extends Substance,
  UL extends TypedOrigin<MassPerEnergy<S>>,
  UR extends TypedOrigin<Energy>,
>(
  left: UL,
  right: UR,
  baseOrigin?: IntermediateOrNamedOrigin,
): BinaryOrigin<Mass<S>>;

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
