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
  //   unit: U;
};
export type UnaryOrigin<U extends AnyUnit> = BaseOrigin<U> & {
  originType: 'unary';
  // type: 'output';
  from: Origin<NumberUnit>;
  //   unit: U;
};
export type SummedOrigin<N extends NumberUnit> = BaseOrigin<N> & {
  originType: 'sum';
  from: Origin<NumberUnit>[];
  //   unit: NumberUnit;
};
export type ConstantSelectionSource<U extends NumberUnit> = {
  unit: U;
  values: Record<string, Decimal>;
};
export type ConstantSelectionOrigin<
  U extends NumberUnit,
  // S extends string = string,
> = BaseOrigin<U> &
  NamedOrigin & {
    originType: 'constant_selection';
    // sourceName: string;
    selectors: (TypedOrigin<StringUnit> | string)[];
    // source: ConstantSelectionSource<U>;
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
// export type TransformOrigin<
//   U extends StringUnit<V>,
//   V extends string = string,
//   I extends string = string,
//   // IO extends TypedOrigin<StringUnit<I>> = TypedOrigin<StringUnit<I>>,
// > = BaseOrigin<U> & {
//   originType: 'transform';
//   // value: V;
//   transform: (i: StringUnit<I>) => U;
//   from: RootOrigin<StringUnit<I>>;
// };

// export const transform = <
//   U extends StringUnit<V>,
//   V extends string = string,
//   I extends string = string,
//   // IO extends Origin<StringUnit<I>> = Origin<StringUnit<I>>,
// >(
//   // value: V,
//   unit: U,
//   transform: (i: StringUnit<I>) => U,
//   from: RootOrigin<StringUnit<I>>,
//   baseOrigin?: IntermediateOrNamedOrigin,
// ): TransformOrigin<U, V, I> => {
//   const baseOrDefault = baseOrigin || { valueType: 'intermediate' };
//   return {
//     originType: 'transform',
//     unit,
//     // value,
//     transform,
//     from,
//     ...baseOrDefault,
//   };
// };

export type TypedOrigin<U extends AnyUnit> =
  | BinaryOrigin<U>
  | UnaryOrigin<U>
  | RootOrigin<U>
  | EmptyOrigin
  | SummedOrigin<U extends NumberUnit ? U : never>
  | ConstantSelectionOrigin<U extends NumberUnit ? U : never>;
// | TransformOrigin<U extends StringUnit ? U : never>;

export type MultiOrigin<U extends NumberUnit = NumberUnit> = SummedOrigin<U>;
//   | ConstantSelectionOrigin

export type Origin<U extends AnyUnit> =
  | TypedOrigin<U>
  | MultiOrigin<U extends NumberUnit ? U : never>;

// const evaluateBinary = (from: BinaryOrigin<NumberUnit>): Decimal => {
//   const leftValue = evaluate(from.left);
//   const rightValue = evaluate(from.right);

//   switch (from.type) {
//     case 'add':
//       return leftValue.add(rightValue);
//     case 'subtract':
//       return leftValue.sub(rightValue);
//     case 'multiply':
//       return leftValue.mul(rightValue);
//     case 'divide':
//       return leftValue.div(rightValue);
//     default:
//       throw new Error(`Unknown binary operation: ${from.type}`);
//   }
// };

// // REVISIT: Unit conversions should be replaced with unitless operations. Maybe we just need toCO2e ?
// const evaluateUnary = (from: UnaryOrigin<NumberUnit>): Decimal => {
//   return evaluate(from.from);
// };

// const evaluateRoot = (from: RootOrigin<NumberUnit>): Decimal => {
//   return from.unit.initialValue;
// };

// const evaluateConstantSelection = (
//   from: ConstantSelectionOrigin<NumberUnit>,
// ): Decimal => {
//   return from.source.values[from.selector.unit];
// };

// const evaluateSum = (from: SummedOrigin<NumberUnit>): Decimal => {
//   return from.from.items.reduce(
//     (acc, curr) => acc.add(evaluate(curr)),
//     new Decimal(0),
//   );
// };

// const evaluateTransform = (_from: TransformOrigin<StringUnit>): Decimal => {
//   // TODO: Necessary?
//   return new Decimal(0);
// };

// export const evaluate = (from: Origin<NumberUnit>): Decimal => {
//   switch (from.originType) {
//     case 'binary':
//       return evaluateBinary(from);
//     case 'unary':
//       return evaluateUnary(from);
//     case 'root':
//       return evaluateRoot(from);
//     case 'constant_selection':
//       return evaluateConstantSelection(from);
//     case 'sum':
//       return evaluateSum(from);
//     case 'transform':
//       return evaluateTransform(from);
//   }
// };

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
