import { ConstantSelectionOrigin, RootOrigin, TypedOrigin } from './origins';
import { AnyUnit, NumberUnit, StringUnit } from './units';

/*
A generic function to select a constant from a constants object.
The constantName is the name of a key of the constants object. It contains a ConstantSelectionSource
with unit and values properties.
The keyInConstant value is a key in the values Record, so the Record must contain that key.
The constants parameter is a larger set of constants, that includes the constantName key.

The function should have generic constraints on the constantName and keyInRecord parameters, so that the function can be used to select any constant from any constants object.
*/
// export function selectConstant<
//   Constants extends object,
//   KC1 extends string & keyof Constants,
//   KC2 extends string & keyof Constants[KC1],
//   TSource extends ConstantSelectionSource<NumberUnit> & Constants[KC1][KC2],
//   KN extends string & keyof TSource['values'],
// >(
//   constants: Constants,
//   selector: TypedOrigin<StringUnit<KN>>,
//   firstConstantName: KC1,
//   secondConstantName: KC2,
// ): ConstantSelectionOrigin<TSource['unit']>;

// // One-level traversal: constants[firstConstantName]
// export function selectConstant<
//   Constants extends object,
//   KC extends string & keyof Constants,
//   TSource extends ConstantSelectionSource<NumberUnit> & Constants[KC],
//   KN extends string & keyof TSource['values'],
// >(
//   constants: Constants,
//   selector: TypedOrigin<StringUnit<KN>>,
//   firstConstantName: KC,
// ): ConstantSelectionOrigin<TSource['unit']>;

// // Implementation - must be compatible with both overloads
// export function selectConstant(
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   constants: any,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   selector: TypedOrigin<any>,
//   firstConstantName: string,
//   secondConstantName?: string,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
// ): ConstantSelectionOrigin<any> {
//   const s = selector.unit;

//   // Determine source based on whether we have one or two constant names
//   const source = secondConstantName
//     ? ((constants[firstConstantName] as Record<string, unknown>)[
//         secondConstantName
//       ] as ConstantSelectionSource<NumberUnit>)
//     : (constants[firstConstantName] as ConstantSelectionSource<NumberUnit>);

//   const selectors = (
//     secondConstantName
//       ? [firstConstantName, secondConstantName, selector]
//       : [firstConstantName, selector]
//   ) as (string | TypedOrigin<StringUnit>)[];

//   const sourceName = secondConstantName
//     ? `${firstConstantName}.${secondConstantName}`
//     : firstConstantName;

//   return {
//     valueType: 'constant',
//     name: `${sourceName}[${s}]`,
//     unit: source.unit,
//     originType: 'constant_selection',
//     selectors,
//   };
// }

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

/*
 *

For a shape of CommonConstants like this:

type FuelFactor = {
  ENERGY_CONTENT_FACTOR: number;
  SCOPE1_EF: {
    CO2: number;
    CH4: number;
    N2O: number;
  };
  SCOPE3_EF: number;
};


export type CommonConstants = {
  FUEL_ENERGYGJ: {
    STATIONARY: Record<keyof typeof StationaryFuelTypes, FuelFactor>;
  }
}

define a function 'selectConstant' that takes these parameters:
- the constants object
- a function which takes the value at the path specified by the key selectors and returns a value of type T
- up to 5 key selectors, each of which can be a string or a TypedOrigin

The return value should be of type RootOrigin<T>, with an originType of root and valueType of constant

*/

// 1-level: constants[CK1]
export function selectConstant<
  TOut extends NumberUnit,
  CK1 extends string,
  Constants extends Record<CK1, unknown>,
  TConstant extends Constants[CK1],
>(
  constants: Constants,
  getValue: (value: TConstant) => TOut,
  selector1: CK1 | TypedOrigin<StringUnit<CK1>>,
): ConstantSelectionOrigin<TOut>;

// 2-level: constants[CK1][CK2]
export function selectConstant<
  TOut extends NumberUnit,
  CK1 extends string,
  CK2 extends string,
  Constants extends Record<CK1, Record<CK2, unknown>>,
  TConstant extends Constants[CK1][CK2],
>(
  constants: Constants,
  getValue: (value: TConstant) => TOut,
  selector1: CK1 | TypedOrigin<StringUnit<CK1>>,
  selector2: CK2 | TypedOrigin<StringUnit<CK2>>,
): ConstantSelectionOrigin<TOut>;

// 3-level: constants[CK1][CK2][CK3]
export function selectConstant<
  TOut extends NumberUnit,
  CK1 extends string,
  CK2 extends string,
  CK3 extends string,
  Constants extends Record<CK1, Record<CK2, Record<CK3, unknown>>>,
  TConstant extends Constants[CK1][CK2][CK3],
>(
  constants: Constants,
  getValue: (value: TConstant) => TOut,
  selector1: CK1 | TypedOrigin<StringUnit<CK1>>,
  selector2: CK2 | TypedOrigin<StringUnit<CK2>>,
  selector3: CK3 | TypedOrigin<StringUnit<CK3>>,
): ConstantSelectionOrigin<TOut>;

// 4-level: constants[CK1][CK2][CK3][CK4]
export function selectConstant<
  TOut extends NumberUnit,
  CK1 extends string,
  CK2 extends string,
  CK3 extends string,
  CK4 extends string,
  Constants extends Record<CK1, Record<CK2, Record<CK3, Record<CK4, unknown>>>>,
  TConstant extends Constants[CK1][CK2][CK3][CK4],
>(
  constants: Constants,
  getValue: (value: TConstant) => TOut,
  selector1: CK1 | TypedOrigin<StringUnit<CK1>>,
  selector2: CK2 | TypedOrigin<StringUnit<CK2>>,
  selector3: CK3 | TypedOrigin<StringUnit<CK3>>,
  selector4: CK4 | TypedOrigin<StringUnit<CK4>>,
): ConstantSelectionOrigin<TOut>;

// 5-level: constants[CK1][CK2][CK3][CK4][CK5]
export function selectConstant<
  TOut extends NumberUnit,
  CK1 extends string,
  CK2 extends string,
  CK3 extends string,
  CK4 extends string,
  CK5 extends string,
  Constants extends Record<
    CK1,
    Record<CK2, Record<CK3, Record<CK4, Record<CK5, unknown>>>>
  >,
  TConstant extends Constants[CK1][CK2][CK3][CK4][CK5],
>(
  constants: Constants,
  getValue: (value: TConstant) => TOut,
  selector1: CK1 | TypedOrigin<StringUnit<CK1>>,
  selector2: CK2 | TypedOrigin<StringUnit<CK2>>,
  selector3: CK3 | TypedOrigin<StringUnit<CK3>>,
  selector4: CK4 | TypedOrigin<StringUnit<CK4>>,
  selector5: CK5 | TypedOrigin<StringUnit<CK5>>,
): ConstantSelectionOrigin<TOut>;

// Implementation

export function selectConstant<TOut extends NumberUnit>(
  constants: Record<string, unknown>,
  getValue: (value: unknown) => TOut,
  selector1: string | TypedOrigin<StringUnit>,
  selector2?: string | TypedOrigin<StringUnit>,
  selector3?: string | TypedOrigin<StringUnit>,
  selector4?: string | TypedOrigin<StringUnit>,
  selector5?: string | TypedOrigin<StringUnit>,
): ConstantSelectionOrigin<TOut> {
  const selectors = [
    selector1,
    selector2,
    selector3,
    selector4,
    selector5,
  ].filter((s): s is string | TypedOrigin<StringUnit> => s !== undefined);
  // .map((s) => (typeof s === 'string' ? s : s.unit));

  // Traverse the constants object using the selectors
  let current: unknown = constants;
  for (const key of selectors) {
    current = (current as Record<string, unknown>)[
      typeof key === 'string' ? key : key.unit
    ];
  }

  const value = getValue(current);

  return {
    valueType: 'constant',
    name: selectors.join('.'),
    unit: value,
    originType: 'constant_selection',
    selectors,
  };
}
