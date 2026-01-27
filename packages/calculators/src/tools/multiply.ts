import {
  BinaryOrigin,
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
  energy,
  formatUnit,
  isArea,
  isEnergy,
  isEnergyPerVolume,
  isMass,
  isMassPerArea,
  isMassPerEnergy,
  isMassPerMass,
  isRealNumber,
  isVoid,
  isVolume,
  mass,
  voidUnit,
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
  unit: infer U extends NumberUnit;
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
  const baseOrDefault = populateBaseOrigin(baseOrigin);
  // Determine the result unit based on the operand types
  let unit: NumberUnit | VoidUnit;
  if (isVoid(left.unit) || isVoid(right.unit)) {
    unit = voidUnit();
  } else {
    if (isMassPerMass(left.unit) && isMass(right.unit)) {
      unit = mass(left.unit.snum);
    } else if (isMassPerArea(left.unit) && isArea(right.unit)) {
      unit = mass(left.unit.substance);
    } else if (isMassPerEnergy(left.unit) && isEnergy(right.unit)) {
      unit = mass(left.unit.substance);
    } else if (isEnergyPerVolume(left.unit) && isVolume(right.unit)) {
      unit = energy();
    } else {
      if (!isRealNumber(right.unit)) {
        // eslint-disable-next-line no-console
        console.error(
          `multiply does not support ${formatUnit(left.unit)} * ${formatUnit(right.unit)}`,
        );
      }
      // For RealNumber multiplication, preserve the left operand's unit
      unit = left.unit;
    }
    unit.value = left.unit.value.mul(right.unit.value);
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

const populateBaseOrigin = (
  baseOrigin?: Partial<IntermediateOrNamedOrigin>,
): IntermediateOrNamedOrigin => {
  if (baseOrigin) {
    if ('name' in baseOrigin && baseOrigin.name) {
      return {
        name: baseOrigin.name,
        valueType: baseOrigin.valueType ?? 'variable',
        references: baseOrigin.references,
      };
    }
  }
  return {
    valueType: 'intermediate',
  };
};
