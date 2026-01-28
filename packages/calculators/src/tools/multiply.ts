import {
  BinaryOrigin,
  Container,
  IntermediateOrNamedOrigin,
  TypedOrigin,
} from './origins';
import {
  Area,
  Energy,
  EnergyPerVolume,
  Mass,
  MassPerArea,
  MassPerEnergy,
  MassPerMass,
  NumberUnit,
  RealNumber,
  Substance,
  VoidUnit,
  Volume,
} from './units';

// Helper types to extract substance from origin types
export type ExtractMassPerMassNumerator<T> = T extends {
  unit: VoidUnit | MassPerMass<infer SNum, Substance>;
}
  ? SNum
  : never;
type ExtractMassPerEnergySubstance<T> = T extends {
  unit: MassPerEnergy<infer S>;
}
  ? S
  : never;
// Extract the unit type from an origin (for preserving unit when multiplying by RealNumber)
type ExtractOriginUnit<T> = T extends {
  unit: VoidUnit | (infer U extends NumberUnit);
}
  ? U
  : never;
type ExtractMassPerAreaSubstance<T> = T extends {
  unit: MassPerArea<infer S>;
}
  ? S
  : never;

// Multiply by a simple real number, preserving unit
export function multiply<
  UL extends TypedOrigin<NumberUnit>,
  UR extends TypedOrigin<RealNumber>,
>(
  left: UL,
  right: UR,
  baseOrigin?: Partial<IntermediateOrNamedOrigin>,
): BinaryOrigin<ExtractOriginUnit<UL>>;

// kg CO2e per kg Refrigerant * kg Refrigerant = kg CO2e
export function multiply<
  S1 extends Substance,
  S2 extends Substance,
  UL extends TypedOrigin<MassPerMass<S1, S2>>,
  UR extends TypedOrigin<Mass<S2>>,
>(
  left: UL,
  right: UR,
  baseOrigin?: Partial<IntermediateOrNamedOrigin>,
): BinaryOrigin<Mass<ExtractMassPerMassNumerator<UL>>>;

// GJ per litre Fuel * litres Fuel = GJ
export function multiply<
  S extends Substance,
  UL extends TypedOrigin<EnergyPerVolume<S>>,
  UR extends TypedOrigin<Volume<S>>,
>(
  left: UL,
  right: UR,
  baseOrigin?: Partial<IntermediateOrNamedOrigin>,
): BinaryOrigin<Energy>;

// kg CO2e per GJ * GJ = kg CO2e
export function multiply<
  UL extends TypedOrigin<MassPerEnergy<Substance>>,
  UR extends TypedOrigin<Energy>,
>(
  left: UL,
  right: UR,
  baseOrigin?: Partial<IntermediateOrNamedOrigin>,
): BinaryOrigin<Mass<ExtractMassPerEnergySubstance<UL>>>;

// kg Urea / ha * ha = kg Urea
export function multiply<
  UL extends TypedOrigin<MassPerArea<Substance>>,
  UR extends TypedOrigin<Area>,
>(
  left: UL,
  right: UR,
  baseOrigin?: Partial<IntermediateOrNamedOrigin>,
): BinaryOrigin<Mass<ExtractMassPerAreaSubstance<UL>>>;

export function multiply<UL extends NumberUnit, UR extends NumberUnit>(
  left: TypedOrigin<UL>,
  right: TypedOrigin<UR>,
  baseOrigin?: Partial<IntermediateOrNamedOrigin>,
): BinaryOrigin<NumberUnit | VoidUnit> {
  // Delegate to BaseContainer#multiply. Cast to the implementation signature so overload
  // resolution succeeds when left is a union (TypedContainer = union of container classes).
  type MultiplyImpl = {
    multiply(
      right: Container<NumberUnit>,
      baseOrigin?: Partial<IntermediateOrNamedOrigin>,
    ): BinaryOrigin<NumberUnit | VoidUnit>;
  };
  return (left as MultiplyImpl).multiply(right as Container<NumberUnit>, baseOrigin);
}
