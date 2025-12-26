// import { AnyUnit, NumberUnit, StringUnit } from './values';

import Decimal from 'decimal.js-light';
import { AnyUnit, NumberUnit, StringUnit, UnitArray } from './overloads';

type NamedValueType = 'input' | 'variable' | 'constant';

export type BaseOrigin<U extends AnyUnit> = {
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
  from: UnitArray<NumberUnit>;
  //   unit: NumberUnit;
};
export type ConstantSelectionSource<U extends NumberUnit> = {
  unit: U;
  values: Record<string, Decimal>;
};
export type ConstantSelectionOrigin<
  U extends NumberUnit,
  S extends string = string,
> = BaseOrigin<U> & {
  originType: 'constant_selection';
  sourceName: string;
  selector: TypedOrigin<StringUnit<S>>;
  source: ConstantSelectionSource<U>;
};
// export const constantSelection = (
//   sourceName: string,
//   selector: Origin<StringUnit>,
//   baseOrigin: BaseOrigin<AnyUnit>,
// ): ConstantSelectionOrigin<AnyUnit> => {
//   return {
//     originType: 'constant_selection',
//     sourceName,
//     selector,
//     ...baseOrigin,
//   };
// };

export type RootOrigin<U extends AnyUnit> = BaseOrigin<U> & {
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

export type TypedOrigin<U extends AnyUnit> =
  | BinaryOrigin<U>
  | UnaryOrigin<U>
  | RootOrigin<U>
  | ConstantSelectionOrigin<U extends NumberUnit ? U : never>;

export type MultiOrigin<U extends NumberUnit = NumberUnit> = SummedOrigin<U>;
//   | ConstantSelectionOrigin

export type Origin<U extends AnyUnit> =
  | TypedOrigin<U>
  | MultiOrigin<U extends NumberUnit ? U : never>;

const evaluateBinary = (from: BinaryOrigin<NumberUnit>): Decimal => {
  const leftValue = evaluate(from.left);
  const rightValue = evaluate(from.right);

  switch (from.type) {
    case 'add':
      return leftValue.add(rightValue);
    case 'subtract':
      return leftValue.sub(rightValue);
    case 'multiply':
      return leftValue.mul(rightValue);
    case 'divide':
      return leftValue.div(rightValue);
    default:
      throw new Error(`Unknown binary operation: ${from.type}`);
  }
};

// REVISIT: Unit conversions should be replaced with unitless operations. Maybe we just need toCO2e ?
const evaluateUnary = (from: UnaryOrigin<NumberUnit>): Decimal => {
  //   const fromValue = evaluate(from.from);
  //   switch (from.type) {
  //     case 'toMassKg':
  //       return fromValue.toMassKg();
  //     case 'toMassTonnes':
  //       return fromValue.toMassTonnes();
  //     case 'toCO2e':
  //       return fromValue.toCO2e();
  //   }
  throw new Error(`Unknown unary operation: ${from.type}`);
};

const evaluateRoot = (from: RootOrigin<NumberUnit>): Decimal => {
  return from.unit.initialValue;
};

const evaluateConstantSelection = (
  from: ConstantSelectionOrigin<NumberUnit>,
): Decimal => {
  return from.source.values[from.selector.unit];
};

const evaluateSum = (from: SummedOrigin<NumberUnit>): Decimal => {
  return from.from.items.reduce(
    (acc, curr) => acc.add(evaluate(curr)),
    new Decimal(0),
  );
};

export const evaluate = (from: Origin<NumberUnit>): Decimal => {
  switch (from.originType) {
    case 'binary':
      return evaluateBinary(from);
    case 'unary':
      return evaluateUnary(from);
    case 'root':
      return evaluateRoot(from);
    case 'constant_selection':
      return evaluateConstantSelection(from);
    case 'sum':
      return evaluateSum(from);
  }
};
