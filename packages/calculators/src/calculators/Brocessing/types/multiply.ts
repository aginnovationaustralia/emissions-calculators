import {
  BinaryOrigin,
  IntermediateOrNamedOrigin,
  TypedOrigin,
} from './origins';
import {
  Mass,
  MassPerMass,
  NumberUnit,
  Substance,
  isMass,
  isMassPerMass,
  mass,
  voidUnit,
} from './overloads';

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
