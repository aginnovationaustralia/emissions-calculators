import {
  ConstantSelectionOrigin,
  ConstantSelectionSource,
  RootOrigin,
  TypedOrigin,
} from './origins';
import { AnyUnit, NumberUnit, StringUnit } from './overloads';

/*
A generic function to select a constant from a constants object.
The constantName is the name of a key of the constants object. It contains a ConstantSelectionSource
with unit and values properties.
The keyInConstant value is a key in the values Record, so the Record must contain that key.
The constants parameter is a larger set of constants, that includes the constantName key.

The function should have generic constraints on the constantName and keyInRecord parameters, so that the function can be used to select any constant from any constants object.
*/
export function selectConstant<
  Constants extends object,
  KC1 extends string & keyof Constants,
  KC2 extends string & keyof Constants[KC1],
  TSource extends ConstantSelectionSource<NumberUnit> & Constants[KC1][KC2],
  KN extends string & keyof TSource['values'],
>(
  constants: Constants,
  selector: TypedOrigin<StringUnit<KN>>,
  firstConstantName: KC1,
  secondConstantName: KC2,
): ConstantSelectionOrigin<TSource['unit'], KN>;

// One-level traversal: constants[firstConstantName]
export function selectConstant<
  Constants extends object,
  KC extends string & keyof Constants,
  TSource extends ConstantSelectionSource<NumberUnit> & Constants[KC],
  KN extends string & keyof TSource['values'],
>(
  constants: Constants,
  selector: TypedOrigin<StringUnit<KN>>,
  firstConstantName: KC,
): ConstantSelectionOrigin<TSource['unit'], KN>;

// Implementation - must be compatible with both overloads
export function selectConstant(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constants: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector: TypedOrigin<any>,
  firstConstantName: string,
  secondConstantName?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ConstantSelectionOrigin<any, any> {
  const s = selector.unit;

  // Determine source based on whether we have one or two constant names
  const source = secondConstantName
    ? ((constants[firstConstantName] as Record<string, unknown>)[
        secondConstantName
      ] as ConstantSelectionSource<NumberUnit>)
    : (constants[firstConstantName] as ConstantSelectionSource<NumberUnit>);

  const sourceName = secondConstantName
    ? `${firstConstantName}.${secondConstantName}`
    : firstConstantName;

  return {
    valueType: 'constant',
    name: `${sourceName}[${s}]`,
    unit: source.unit,
    originType: 'constant_selection',
    sourceName,
    selector,
    source,
  };
}

export const constant = <U extends AnyUnit>(
  name: string,
  unit: U,
): RootOrigin<U> => {
  return {
    name,
    unit,
    originType: 'root',
    valueType: 'constant',
  };
};
