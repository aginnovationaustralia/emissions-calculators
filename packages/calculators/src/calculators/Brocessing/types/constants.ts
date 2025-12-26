import {
  ConstantSelectionOrigin,
  ConstantSelectionSource,
  TypedOrigin,
} from './origins';
import { NumberUnit, StringUnit } from './overloads';
import { AnyUnit, CanPrint } from './values';

export interface HasValue<T extends AnyUnit & CanPrint> {
  name: string;
  value: T;
}

/*
A generic function to select a constant from a constants object.
The constantName is the name of a key of the constants object. It contains a Record<string, number>.
The keyInConstant value is a key in that Record, so the Record must contain that key.
The constants parameter is a larger set of constants, that includes the constantName key.

The function should have generic constraints on the constantName and keyInRecord parameters, so that the function can be used to select any constant from any constants object.
*/
export const selectConstant = <
  Constants extends object,
  KC extends string & keyof Constants,
  KN extends string & keyof Constants[KC],
  U extends NumberUnit,
  TSource extends ConstantSelectionSource<U> & Constants[KC][KN],
  //   TSource extends Constants[KC] &
  //     (Constants[KC] extends Record<string, V> ? Record<string, V> : never),
>(
  constants: Constants,
  constantName: KC,
  selector: TypedOrigin<StringUnit<KN>>,
): ConstantSelectionOrigin<U, KN> => {
  const s = selector.unit;
  const source: TSource = constants[constantName] as TSource;
  //   const value: V = source[s] as V;

  return {
    // ConstantSelectionOrigin
    valueType: 'constant',
    name: `${constantName}[${s}]`,
    unit: source.unit, // new KgCO2ePerKgRefrigerant(new Decimal(138)),
    originType: 'constant_selection',
    sourceName: constantName,
    selector,
    source,
  };
};
