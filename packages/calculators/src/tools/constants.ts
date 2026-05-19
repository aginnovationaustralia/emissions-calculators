import { NamedConstants } from '@/constants/types';
import {
  ConstantSelectionContainer,
  Metadata,
  RootContainer,
} from './containers';
import { AnyUnit, NumberUnit, StringUnit } from './units';

export const constant = <U extends AnyUnit>(
  name: string,
  unit: U,
  baseOrigin?: Metadata,
): RootContainer<U> => {
  return new RootContainer(unit, {
    ...baseOrigin,
    name,
  });
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

The return value should be of type RootContainer<T>, with an originType of root and valueType of constant

*/

// 1-level: constants[CK1]
// Return type uses Extract<Path, NumberUnit> so we preserve the path's literal type
// (e.g. MassPerHeadPerDay<'DryMatter'>) instead of inferring an intersection with
// NumberUnit (e.g. MassPerHeadPerDay<'DryMatter'> & MassPerHeadPerDay<Substance>).
export function selectConstant<
  CK1 extends string,
  Constants extends Record<CK1, unknown> & NamedConstants,
>(
  constants: Constants,
  selector1: CK1 | RootContainer<StringUnit<CK1>>,
): ConstantSelectionContainer<Extract<Constants[CK1], NumberUnit>>;

// 2-level: constants[CK1][CK2]
export function selectConstant<
  CK1 extends string,
  CK2 extends string,
  Constants extends Record<CK1, Record<CK2, unknown>> & NamedConstants,
>(
  constants: Constants,
  selector1: CK1 | RootContainer<StringUnit<CK1>>,
  selector2: CK2 | RootContainer<StringUnit<CK2>>,
): ConstantSelectionContainer<Extract<Constants[CK1][CK2], NumberUnit>>;

// 3-level: constants[CK1][CK2][CK3]
export function selectConstant<
  CK1 extends string,
  CK2 extends string,
  CK3 extends string,
  Constants extends Record<CK1, Record<CK2, Record<CK3, unknown>>> &
    NamedConstants,
>(
  constants: Constants,
  selector1: CK1 | RootContainer<StringUnit<CK1>>,
  selector2: CK2 | RootContainer<StringUnit<CK2>>,
  selector3: CK3 | RootContainer<StringUnit<CK3>>,
): ConstantSelectionContainer<Extract<Constants[CK1][CK2][CK3], NumberUnit>>;

// 4-level: constants[CK1][CK2][CK3][CK4]
export function selectConstant<
  CK1 extends string,
  CK2 extends string,
  CK3 extends string,
  CK4 extends string,
  Constants extends Record<
    CK1,
    Record<CK2, Record<CK3, Record<CK4, unknown>>>
  > &
    NamedConstants,
>(
  constants: Constants,
  selector1: CK1 | RootContainer<StringUnit<CK1>>,
  selector2: CK2 | RootContainer<StringUnit<CK2>>,
  selector3: CK3 | RootContainer<StringUnit<CK3>>,
  selector4: CK4 | RootContainer<StringUnit<CK4>>,
): ConstantSelectionContainer<
  Extract<Constants[CK1][CK2][CK3][CK4], NumberUnit>
>;

// 5-level: constants[CK1][CK2][CK3][CK4][CK5]
export function selectConstant<
  CK1 extends string,
  CK2 extends string,
  CK3 extends string,
  CK4 extends string,
  CK5 extends string,
  Constants extends Record<
    CK1,
    Record<CK2, Record<CK3, Record<CK4, Record<CK5, unknown>>>>
  > &
    NamedConstants,
>(
  constants: Constants,
  selector1: CK1 | RootContainer<StringUnit<CK1>>,
  selector2: CK2 | RootContainer<StringUnit<CK2>>,
  selector3: CK3 | RootContainer<StringUnit<CK3>>,
  selector4: CK4 | RootContainer<StringUnit<CK4>>,
  selector5: CK5 | RootContainer<StringUnit<CK5>>,
): ConstantSelectionContainer<
  Extract<Constants[CK1][CK2][CK3][CK4][CK5], NumberUnit>
>;

// Implementation

export function selectConstant<TOut extends NumberUnit>(
  constants: Record<string, unknown> & { name: string },
  selector1: string | RootContainer<StringUnit>,
  selector2?: string | RootContainer<StringUnit>,
  selector3?: string | RootContainer<StringUnit>,
  selector4?: string | RootContainer<StringUnit>,
  selector5?: string | RootContainer<StringUnit>,
): ConstantSelectionContainer<TOut> {
  const selectors = [
    selector1,
    selector2,
    selector3,
    selector4,
    selector5,
  ].filter((s): s is string | RootContainer<StringUnit> => s !== undefined);

  // Traverse the constants object using the selectors
  let current: unknown = constants;
  for (const key of selectors) {
    current = (current as Record<string, unknown>)[
      typeof key === 'string' ? key : key.unit
    ];
  }

  return new ConstantSelectionContainer(
    current as TOut,
    selectors,
    `${constants.name}[${selectors.map((s) => (typeof s === 'string' ? s : s.unit)).join('.')}]`,
  );
}
