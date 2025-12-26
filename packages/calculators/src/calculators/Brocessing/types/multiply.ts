import { BaseOrigin, BinaryOrigin, TypedOrigin } from './origins';
import { KgPerKg, MassKg, NumberUnit, Substance } from './overloads';

export function multiply<
  SNum extends Substance,
  SDenom extends Substance,
  UL extends TypedOrigin<KgPerKg<SNum, SDenom>>,
  UR extends TypedOrigin<MassKg<SDenom>>,
>(left: UL, right: UR, baseOrigin?: BaseOrigin): BinaryOrigin<MassKg<SNum>>;
export function multiply<UL extends NumberUnit, UR extends NumberUnit>(
  left: TypedOrigin<UL>,
  right: TypedOrigin<UR>,
  baseOrigin?: BaseOrigin,
): BinaryOrigin<NumberUnit> {
  const baseOrDefault = baseOrigin || { valueType: 'intermediate' };
  // let unit: NumberUnit; // = new RealNumber(0);
  // if (isKgPerKg(left.unit) && isMassKg(right.unit)) {
  //   unit = massKg(left.unit.snum, left.unit.value.mul(right.unit.value));
  // }

  return {
    type: 'multiply',
    originType: 'binary',
    left,
    right,
    ...baseOrDefault,
  };
}
