import { AnyUnit, NumberUnit, StringUnit, VoidUnit } from './units';

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

// export type BaseOrigin<U extends AnyUnit> = {
//   unit: U | VoidUnit;
// } & IntermediateOrNamedOrigin;

export class BaseContainer<
  U extends AnyUnit,
  C extends NamedOrigin | IntermediateOrigin = IntermediateOrigin,
> {
  unit: U | VoidUnit;
  // unit: U | VoidUnit;
  core: C;

  constructor(unit: U | VoidUnit, baseOrigin?: Partial<C>) {
    this.unit = unit;

    this.core = populateBaseOrigin(baseOrigin);
  }
}

// export type BinaryOrigin<U extends AnyUnit> = BaseOrigin<U> & {
//   originType: 'binary';
//   type: 'add' | 'subtract' | 'multiply' | 'divide';
//   left: Origin<NumberUnit>;
//   right: Origin<NumberUnit>;
// };

export class BinaryContainer<U extends AnyUnit> extends BaseContainer<
  U,
  IntermediateOrNamedOrigin
> {
  originType: 'binary';
  type: 'add' | 'subtract' | 'multiply' | 'divide';
  left: Container<NumberUnit>;
  right: Container<NumberUnit>;

  constructor(
    unit: U | VoidUnit,
    type: 'add' | 'subtract' | 'multiply' | 'divide',
    left: Container<NumberUnit>,
    right: Container<NumberUnit>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ) {
    super(unit, baseOrigin);
    this.originType = 'binary';
    this.type = type;
    this.left = left;
    this.right = right;
  }
}

// export type UnaryOrigin<U extends AnyUnit> = BaseOrigin<U> & {
//   originType: 'unary';
//   from: Origin<NumberUnit>;
// };

export class UnaryContainer<U extends AnyUnit> extends BaseContainer<
  U,
  IntermediateOrNamedOrigin
> {
  originType: 'unary';
  from: Container<NumberUnit>;

  constructor(
    unit: U | VoidUnit,
    from: Container<NumberUnit>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ) {
    super(unit, baseOrigin);
    this.originType = 'unary';
    this.from = from;
  }
}

// export type SummedOrigin<N extends NumberUnit> = BaseOrigin<N> & {
//   originType: 'sum';
//   from: Origin<NumberUnit>[];
// };

export class SummedContainer<N extends NumberUnit> extends BaseContainer<
  N,
  IntermediateOrNamedOrigin
> {
  originType: 'sum';
  from: Container<NumberUnit>[];

  constructor(
    unit: N | VoidUnit,
    from: TypedContainer<NumberUnit>[],
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ) {
    super(unit, baseOrigin);
    this.originType = 'sum';
    this.from = from;
  }
}

// export type ConstantSelectionOrigin<U extends NumberUnit> = BaseOrigin<U> &
//   NamedOrigin & {
//     originType: 'constant_selection';
//     selectors: (TypedOrigin<StringUnit> | string)[];
//   };

export class ConstantSelectionContainer<
  U extends NumberUnit,
> extends BaseContainer<U, NamedOrigin> {
  originType: 'constant_selection';
  selectors: (Container<StringUnit> | string)[];

  constructor(
    unit: U | VoidUnit,
    selectors: (Container<StringUnit> | string)[],
    name: string,
  ) {
    super(unit, { name, valueType: 'constant' });
    this.originType = 'constant_selection';
    this.selectors = selectors;
  }
}

// export type RootOrigin<U extends AnyUnit> = NamedOrigin & {
//   unit: U;
//   originType: 'root';
// };

export class RootContainer<U extends AnyUnit> extends BaseContainer<
  U,
  IntermediateOrNamedOrigin
> {
  originType: 'root';

  constructor(
    unit: U | VoidUnit,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ) {
    super(unit, baseOrigin);
    this.originType = 'root';
  }
}

// export const rootOrigin = <U extends AnyUnit>(
//   unit: U,
//   baseOrigin: NamedOrigin,
// ): RootOrigin<U> => {
//   return {
//     originType: 'root',
//     unit,
//     ...baseOrigin,
//   };
// };

export type TypedContainer<U extends AnyUnit> =
  | BinaryContainer<U>
  | UnaryContainer<U>
  | RootContainer<U>
  // | RootContainer<U extends string ? U : never>
  // | EmptyContainer<U>
  | SummedContainer<U extends NumberUnit ? U : never>
  | ConstantSelectionContainer<U extends NumberUnit ? U : never>;
// export type TypedOrigin<U extends AnyUnit> =
//   | BinaryOrigin<U>
//   | UnaryOrigin<U>
//   | RootOrigin<U>
//   | EmptyOrigin
//   | SummedOrigin<U extends NumberUnit ? U : never>
//   | ConstantSelectionOrigin<U extends NumberUnit ? U : never>;

// export type MultiOrigin<U extends NumberUnit = NumberUnit> = SummedOrigin<U>;
export type MultiContainer<U extends NumberUnit = NumberUnit> =
  SummedContainer<U>;

// export type Origin<U extends AnyUnit> =
//   | TypedOrigin<U>
//   | MultiOrigin<U extends NumberUnit ? U : never>;
export type Container<U extends AnyUnit> =
  | TypedContainer<U>
  | MultiContainer<U extends NumberUnit ? U : never>;

export const populateBaseOriginNonGeneric = (
  baseOrigin?: Partial<NamedOrigin | IntermediateOrigin>,
): NamedOrigin | IntermediateOrigin => {
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

/** Type guard: when C is generic, TS can't narrow C from runtime checks, but we can narrow the *value* to NamedOrigin-like. */
function isPartialNamedOriginWithName(
  x: Partial<NamedOrigin | IntermediateOrigin> | undefined,
): x is Partial<NamedOrigin> & { name: string } {
  return !!x && 'name' in x && !!x.name;
}

export const populateBaseOrigin = <C extends NamedOrigin | IntermediateOrigin>(
  baseOrigin?: Partial<C>,
): C => {
  // Cast to union so the type guard can narrow; safe because C extends NamedOrigin | IntermediateOrigin
  const base = baseOrigin as
    | Partial<NamedOrigin | IntermediateOrigin>
    | undefined;
  if (isPartialNamedOriginWithName(base)) {
    return {
      name: base.name,
      valueType: base.valueType ?? 'variable',
      references: base.references,
    } as C;
  }
  return { valueType: 'intermediate' } as C;
};
