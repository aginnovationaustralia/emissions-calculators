import { AnyUnit, NumberUnit } from './values';

type NamedValueType = 'input' | 'variable' | 'constant';

type BaseOrigin =
  | {
      valueType: NamedValueType;
      name: string;
    }
  | {
      valueType: 'intermediate';
    };

export type BinaryOrigin<U extends AnyUnit> = BaseOrigin & {
  type: 'add' | 'subtract' | 'multiply' | 'divide';
  left: Origin<NumberUnit>;
  right: Origin<NumberUnit>;
  unit: U;
};
export type UnaryOrigin<U extends AnyUnit> = BaseOrigin & {
  type: 'toMassKg' | 'toMassTonnes' | 'toCO2e';
  from: Origin<NumberUnit>;
  unit: U;
};
export type SummedOrigin = BaseOrigin & {
  type: 'sum';
  from: Origin<NumberUnit>[];
  unit: NumberUnit;
};
export type MultiOrigin = SummedOrigin;

export type Origin<U extends AnyUnit = AnyUnit> =
  | BinaryOrigin<U>
  | UnaryOrigin<U>
  | MultiOrigin;
