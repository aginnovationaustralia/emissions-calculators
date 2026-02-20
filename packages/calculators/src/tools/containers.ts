import {
  AnyUnit,
  Area,
  Electricity,
  energy,
  Energy,
  EnergyPerVolume,
  formatUnit,
  isArea,
  isElectricity,
  isEnergy,
  isEnergyPerVolume,
  isMass,
  isMassPerArea,
  isMassPerElectricity,
  isMassPerEnergy,
  isMassPerMass,
  isRealNumber,
  isVoid,
  isVolume,
  mass,
  Mass,
  massPerArea,
  MassPerArea,
  MassPerElectricity,
  MassPerEnergy,
  MassPerMass,
  MassPerTime,
  MassPerVolume,
  NumberUnit,
  realNumber,
  RealNumber,
  StringUnit,
  Substance,
  Time,
  voidUnit,
  Volume,
} from './units';

// Helpers for multiply overload return types (extract from container unit)
type ExtractMassPerEnergySubstance<U> =
  U extends MassPerEnergy<infer S> ? S : never;
type ExtractMassPerAreaSubstance<U> =
  U extends MassPerArea<infer S> ? S : never;
type ExtractMassPerTimeSubstance<U> =
  U extends MassPerTime<infer S> ? S : never;
type ExtractMassSubstance<U> = U extends Mass<infer S> ? S : never;

export type NamedValueType =
  | 'input'
  | 'variable'
  | 'constant'
  | 'output'
  | 'value';

export type NamedOrigin = {
  valueType: NamedValueType;
  name: string;
  references?: string[];
};
export type IntermediateOrigin = {
  valueType: 'intermediate';
};
export type IntermediateOrNamedOrigin = NamedOrigin | IntermediateOrigin;

/** Type guard: when C is generic, TS can't narrow C from runtime checks, but we can narrow the *value* to NamedOrigin-like. */
export function isPartialNamedOriginWithName(
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

export class BaseContainer<
  U extends AnyUnit,
  C extends NamedOrigin | IntermediateOrigin = IntermediateOrNamedOrigin,
> {
  unit: U;
  // unit: U | VoidUnit;
  core: C;

  constructor(unit: U, baseOrigin?: Partial<C>) {
    this.unit = unit;

    this.core = populateBaseOrigin(baseOrigin);
  }

  attachContext({ references }: { references: string[] }) {
    if (isPartialNamedOriginWithName(this.core)) {
      this.core = {
        ...this.core,
        references: this.core.references?.concat(references) ?? references,
      };
    } else {
      throw new Error('Cannot attach references to non-named origin');
    }

    return this;
  }

  /**
   * Multiply this container's value by `right`. Only valid when this container's unit is a NumberUnit
   * (e.g. MassPerArea, Mass, etc.). The generic U on BaseContainer remains AnyUnit so that containers
   * with StringUnit (e.g. for constant selection keys) can still extend BaseContainer; consider
   * narrowing to U extends NumberUnit for classes that only ever hold numeric units.
   */
  // unit * RealNumber → preserve this.unit
  multiply<UL extends NumberUnit>(
    this: BaseContainer<UL, C>,
    right: Container<RealNumber>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<UL>;
  // RealNumber * unit → preserve this.unit
  multiply<UR extends NumberUnit>(
    this: BaseContainer<RealNumber, C>,
    right: Container<UR>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<UR>;
  // MassPerMass<S1,S2> * Mass<S2> → Mass<S1>
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerMass<S1, S2>, C>,
    right: Container<Mass<S2>>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<Mass<S1>>;
  // Mass<S2> * MassPerMass<S1,S2> → Mass<S1> (only when right's denominator S2Right equals this's substance S2)
  multiply<
    S1 extends Substance,
    S2 extends Substance,
    S2Right extends Substance,
  >(
    this: BaseContainer<Mass<S2>, C>,
    right: Container<MassPerMass<S1, S2Right>>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): [S2Right] extends [S2]
    ? [S2] extends [S2Right]
      ? BinaryContainer<Mass<S1>>
      : never
    : never;
  // EnergyPerVolume<S> * Volume<S> → Energy
  multiply<S extends Substance>(
    this: BaseContainer<EnergyPerVolume<S>, C>,
    right: Container<Volume<S>>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<Energy>;
  // MassPerEnergy * Energy → Mass<substance>
  multiply<UL extends MassPerEnergy<Substance>>(
    this: BaseContainer<UL, C>,
    right: Container<Energy>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<Mass<ExtractMassPerEnergySubstance<UL>>>;
  // MassPerArea * Area → Mass<substance>
  multiply<UL extends MassPerArea<Substance>>(
    this: BaseContainer<UL, C>,
    right: Container<Area>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<Mass<ExtractMassPerAreaSubstance<UL>>>;
  // MassPerTime * Area → Mass<substance>
  multiply<UL extends MassPerTime<Substance>>(
    this: BaseContainer<UL, C>,
    right: Container<Time>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<Mass<ExtractMassPerTimeSubstance<UL>>>;
  // MassPerVolume * Volume → Mass<substance>
  multiply<
    S1 extends Substance,
    S2 extends Substance,
    UL extends MassPerVolume<S1, S2>,
  >(
    this: BaseContainer<UL, C>,
    right: Container<Volume<S2>>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<Mass<S1>>;
  // Electricity * MassPerElectricity<S> → Mass<S>
  multiply<S extends Substance>(
    this: BaseContainer<Electricity, C>,
    right: Container<MassPerElectricity<S>>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<Mass<S>>;
  // Fallback implementation
  multiply(
    this: BaseContainer<NumberUnit, C>,
    right: Container<NumberUnit>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<NumberUnit> {
    const leftUnit = this.unit;
    const rightUnit = right.unit;
    let unit: NumberUnit;
    if (isVoid(leftUnit) || isVoid(rightUnit)) {
      unit = voidUnit();
    } else {
      // REVISIT: data structure and utilities for capturing operations
      if (isMassPerMass(leftUnit) && isMass(rightUnit)) {
        unit = mass(leftUnit.snum);
      } else if (isMass(leftUnit) && isMassPerMass(rightUnit)) {
        unit = mass(rightUnit.snum);
      } else if (isMassPerArea(leftUnit) && isArea(rightUnit)) {
        unit = mass(leftUnit.substance);
      } else if (isMassPerEnergy(leftUnit) && isEnergy(rightUnit)) {
        unit = mass(leftUnit.substance);
      } else if (isElectricity(leftUnit) && isMassPerElectricity(rightUnit)) {
        unit = mass(rightUnit.substance);
      } else if (isEnergyPerVolume(leftUnit) && isVolume(rightUnit)) {
        unit = energy();
      } else {
        if (!isRealNumber(rightUnit)) {
          // eslint-disable-next-line no-console
          console.error(
            `multiply does not support ${formatUnit(leftUnit)} * ${formatUnit(
              rightUnit,
            )}`,
          );
        }
        unit = { ...leftUnit };
      }
      unit.value = leftUnit.value.mul(rightUnit.value);
    }
    return new BinaryContainer(
      unit,
      'multiply',
      this as unknown as Container<NumberUnit>,
      right,
      baseOrigin,
    );
  }
  // Implement divide operation, following the same pattern as multiply
  // start out with an overload for NumberUnit divided by RealNumber → RealNumber and Mass<Substance> divided by Area → MassPerArea<Substance>
  divide<UL extends NumberUnit>(
    this: BaseContainer<UL, C>,
    right: Container<RealNumber>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<UL>;

  divide<UL extends Mass<Substance>>(
    this: BaseContainer<UL, C>,
    right: Container<Area>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<MassPerArea<ExtractMassSubstance<UL>>>;

  divide<UL extends NumberUnit>(
    this: BaseContainer<NumberUnit, C>,
    right: Container<NumberUnit>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<UL> {
    const leftUnit = this.unit;
    const rightUnit = right.unit;
    let unit: NumberUnit;
    if (isVoid(leftUnit) || isVoid(rightUnit)) {
      unit = voidUnit();
    } else {
      if (isMass(leftUnit) && isArea(rightUnit)) {
        unit = massPerArea(leftUnit.substance);
      } else {
        if (!isRealNumber(rightUnit)) {
          // eslint-disable-next-line no-console
          console.error(
            `divide does not support ${formatUnit(leftUnit)} / ${formatUnit(
              rightUnit,
            )}`,
          );
        }
        unit = leftUnit;
      }
      unit.value = leftUnit.value.div(rightUnit.value);
    }
    return new BinaryContainer(
      unit as UL,
      'divide',
      this as unknown as Container<UL>,
      right,
      baseOrigin,
    );
  }

  // Implement minus operation where this container's unit is a NumberUnit, and also this and right must have identical units.
  minus<UL extends NumberUnit>(
    this: BaseContainer<UL, C>,
    right: Container<UL>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<UL> {
    return new BinaryContainer(
      this.unit,
      'subtract',
      this as unknown as Container<NumberUnit>,
      right,
      baseOrigin,
    );
  }

  // add overloads to plus so that a RealNumber can be added to a NumberUnit
  plus<UL extends NumberUnit>(
    this: BaseContainer<UL, C>,
    right: Container<RealNumber>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<UL>;

  plus<UL extends NumberUnit>(
    this: BaseContainer<RealNumber, C>,
    right: Container<UL>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<UL>;

  plus<UL extends NumberUnit>(
    this: BaseContainer<UL, C>,
    right: Container<UL>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<UL>;

  plus<UL extends NumberUnit>(
    this: BaseContainer<NumberUnit, C>,
    right: Container<NumberUnit>,
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ): BinaryContainer<UL> {
    const leftUnit = this.unit;
    const rightUnit = right.unit;
    let unit: NumberUnit;
    if (isVoid(leftUnit) || isVoid(rightUnit)) {
      unit = voidUnit();
    } else {
      if (isRealNumber(leftUnit) && !isRealNumber(rightUnit)) {
        unit = rightUnit;
      } else if (!isRealNumber(leftUnit) && isRealNumber(rightUnit)) {
        unit = leftUnit;
      } else {
        unit = realNumber(leftUnit.value.add(rightUnit.value));
      }

      unit.value = leftUnit.value.add(rightUnit.value);
    }
    return new BinaryContainer(
      unit as UL,
      'add',
      this as unknown as Container<NumberUnit>,
      right,
      baseOrigin,
    );
  }
}

export class BinaryContainer<U extends AnyUnit> extends BaseContainer<
  U,
  IntermediateOrNamedOrigin
> {
  originType: 'binary';
  type: 'add' | 'subtract' | 'multiply' | 'divide';
  left: Container<NumberUnit>;
  right: Container<NumberUnit>;

  constructor(
    unit: U,
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

export class SummedContainer<N extends NumberUnit> extends BaseContainer<
  N,
  IntermediateOrNamedOrigin
> {
  originType: 'sum';
  from: Container<NumberUnit>[];

  constructor(
    unit: N,
    from: TypedContainer<NumberUnit>[],
    baseOrigin?: Partial<IntermediateOrNamedOrigin>,
  ) {
    super(unit, baseOrigin);
    this.originType = 'sum';
    this.from = from;
  }
}

export class ConstantSelectionContainer<
  U extends NumberUnit,
> extends BaseContainer<U, NamedOrigin> {
  originType: 'constant_selection';
  selectors: (Container<StringUnit> | string)[];

  constructor(
    unit: U,
    selectors: (Container<StringUnit> | string)[],
    name: string,
  ) {
    super(unit, { name, valueType: 'constant' });
    this.originType = 'constant_selection';
    this.selectors = selectors;
  }
}

export class RootContainer<U extends AnyUnit> extends BaseContainer<
  U,
  IntermediateOrNamedOrigin
> {
  originType: 'root';

  constructor(unit: U, baseOrigin?: Partial<IntermediateOrNamedOrigin>) {
    super(unit, baseOrigin);
    this.originType = 'root';
  }
}

export const num = (value: number): RootContainer<RealNumber> =>
  new RootContainer(realNumber(value));

export const value = <N extends NumberUnit>(v: N): RootContainer<N> =>
  new RootContainer(v, { valueType: 'value' });

export type TypedContainer<U extends AnyUnit> =
  | BinaryContainer<U>
  | RootContainer<U>
  | SummedContainer<U extends NumberUnit ? U : never>
  | ConstantSelectionContainer<U extends NumberUnit ? U : never>;

export type MultiContainer<U extends NumberUnit = NumberUnit> =
  SummedContainer<U>;

export type Container<U extends AnyUnit> =
  | TypedContainer<U>
  | MultiContainer<U extends NumberUnit ? U : never>;
