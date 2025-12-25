// import { AnyUnit, NumberUnit, StringUnit } from './values';

import { AnyUnit, NumberUnit, StringUnit } from './overloads';

type NamedValueType = 'input' | 'variable' | 'constant';

export type BaseOrigin<U extends AnyUnit = AnyUnit> = {
  unit: U;
} & (
  | {
      valueType: NamedValueType;
      name: string;
    }
  | {
      valueType: 'intermediate';
    }
);

export type BinaryOrigin<U extends AnyUnit> = BaseOrigin<U> & {
  originType: 'binary';
  type: 'add' | 'subtract' | 'multiply' | 'divide';
  left: Origin<NumberUnit>;
  right: Origin<NumberUnit>;
  //   unit: U;
};
export type UnaryOrigin<U extends AnyUnit> = BaseOrigin<U> & {
  originType: 'unary';
  type: 'toMassKg' | 'toMassTonnes' | 'toCO2e';
  from: Origin<NumberUnit>;
  //   unit: U;
};
export type SummedOrigin<N extends NumberUnit> = BaseOrigin<N> & {
  originType: 'sum';
  from: Origin<NumberUnit>[];
  //   unit: NumberUnit;
};
export type ConstantSelectionOrigin<U extends AnyUnit = AnyUnit> =
  BaseOrigin<U> & {
    originType: 'constant_selection';
    sourceName: string;
    selector: Origin<StringUnit>;
  };
export const constantSelection = (
  sourceName: string,
  selector: Origin<StringUnit>,
  baseOrigin: BaseOrigin,
): ConstantSelectionOrigin => {
  return {
    originType: 'constant_selection',
    sourceName,
    selector,
    ...baseOrigin,
  };
};

export type RootOrigin<U extends AnyUnit = AnyUnit> = BaseOrigin<U> & {
  originType: 'root';
};
export const rootOrigin = <U extends AnyUnit>(
  baseOrigin: BaseOrigin<U>,
): RootOrigin<U> => {
  return {
    originType: 'root',
    ...baseOrigin,
  };
};

export type TypedOrigin<U extends AnyUnit = AnyUnit> =
  | BinaryOrigin<U>
  | UnaryOrigin<U>
  | RootOrigin<U>
  | ConstantSelectionOrigin<U>;

export type MultiOrigin<U extends NumberUnit = NumberUnit> = SummedOrigin<U>;
//   | ConstantSelectionOrigin

export type Origin<U extends AnyUnit = AnyUnit> =
  | TypedOrigin<U>
  | MultiOrigin<U extends NumberUnit ? U : never>;
