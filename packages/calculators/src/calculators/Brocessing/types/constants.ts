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
The constantName is the name of a key of the constants object. It contains a ConstantSelectionSource
with unit and values properties.
The keyInConstant value is a key in the values Record, so the Record must contain that key.
The constants parameter is a larger set of constants, that includes the constantName key.

The function should have generic constraints on the constantName and keyInRecord parameters, so that the function can be used to select any constant from any constants object.
*/
export const selectConstant = <
  Constants extends object,
  KC extends string & keyof Constants,
  TSource extends ConstantSelectionSource<NumberUnit> & Constants[KC],
  KN extends string & keyof TSource['values'],
>(
  constants: Constants,
  constantName: KC,
  selector: TypedOrigin<StringUnit<KN>>,
): ConstantSelectionOrigin<TSource['unit'], KN> => {
  const s = selector.unit;
  const source = constants[constantName] as TSource;

  return {
    valueType: 'constant',
    name: `${constantName}[${s}]`,
    unit: source.unit,
    originType: 'constant_selection',
    sourceName: constantName,
    selector,
    source,
  };
};
