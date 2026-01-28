import Decimal from 'decimal.js-light';
import { AnyUnit, NumberUnit, StringUnit, voidUnit, VoidUnit } from './units';

export type NamedValueType = 'input' | 'variable' | 'constant' | 'output';

export type NamedOrigin = {
  valueType: NamedValueType;
  name: string;
  references?: string[];
};
export type IntermediateOrigin = {
  valueType: 'intermediate';
};
export type IntermediateOrNamedOrigin = NamedOrigin | IntermediateOrigin;

export type BaseOrigin<U extends AnyUnit> = {
  unit: U | VoidUnit;
} & IntermediateOrNamedOrigin;

export type BinaryOrigin<U extends AnyUnit> = BaseOrigin<U> & {
  originType: 'binary';
  type: 'add' | 'subtract' | 'multiply' | 'divide';
  left: Origin<NumberUnit>;
  right: Origin<NumberUnit>;
};
export type UnaryOrigin<U extends AnyUnit> = BaseOrigin<U> & {
  originType: 'unary';
  from: Origin<NumberUnit>;
};
export type SummedOrigin<N extends NumberUnit> = BaseOrigin<N> & {
  originType: 'sum';
  from: Origin<NumberUnit>[];
};
export type ConstantSelectionSource<U extends NumberUnit> = {
  unit: U;
  values: Record<string, Decimal>;
};
export type ConstantSelectionOrigin<U extends NumberUnit> = BaseOrigin<U> &
  NamedOrigin & {
    originType: 'constant_selection';
    selectors: (TypedOrigin<StringUnit> | string)[];
  };

export type RootOrigin<U extends AnyUnit> = NamedOrigin & {
  unit: U;
  originType: 'root';
};
export const rootOrigin = <U extends AnyUnit>(
  unit: U,
  baseOrigin: NamedOrigin,
): RootOrigin<U> => {
  return {
    originType: 'root',
    unit,
    ...baseOrigin,
  };
};

export type EmptyOrigin = BaseOrigin<VoidUnit> & {
  unit: VoidUnit;
  originType: 'empty';
};
export const emptyOrigin = (baseOrigin?: NamedOrigin): EmptyOrigin => {
  const baseOrDefault = baseOrigin || { valueType: 'intermediate' };
  return {
    originType: 'empty',
    unit: voidUnit(),
    ...baseOrDefault,
  };
};

export type TypedOrigin<U extends AnyUnit> =
  | BinaryOrigin<U>
  | UnaryOrigin<U>
  | RootOrigin<U>
  | EmptyOrigin
  | SummedOrigin<U extends NumberUnit ? U : never>
  | ConstantSelectionOrigin<U extends NumberUnit ? U : never>;

export type MultiOrigin<U extends NumberUnit = NumberUnit> = SummedOrigin<U>;

export type Origin<U extends AnyUnit> =
  | TypedOrigin<U>
  | MultiOrigin<U extends NumberUnit ? U : never>;

export const populateBaseOrigin = (
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
