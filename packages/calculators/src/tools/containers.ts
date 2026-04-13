import Decimal from 'decimal.js-light';
import { formatUnit } from './format';
import {
  AnyUnit,
  Area,
  Days,
  Electricity,
  energy,
  Energy,
  EnergyPerMass,
  EnergyPerVolume,
  Head,
  isArea,
  isDays,
  isElectricity,
  isEnergy,
  isEnergyPerMass,
  isEnergyPerVolume,
  isHead,
  isMass,
  isMassPerArea,
  isMassPerDay,
  isMassPerElectricity,
  isMassPerEnergy,
  isMassPerHeadPerDay,
  isMassPerMass,
  isMassPerTime,
  isMassPerVolume,
  isRealNumber,
  isTime,
  isVoid,
  isVolume,
  isVolumePerHeadPerDay,
  isVolumePerMass,
  mass,
  Mass,
  massPerArea,
  MassPerArea,
  massPerDay,
  MassPerDay,
  MassPerElectricity,
  MassPerEnergy,
  massPerHeadPerDay,
  MassPerHeadPerDay,
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
  volumePerHeadPerDay,
  VolumePerHeadPerDay,
  VolumePerMass,
} from './units';

// Helpers for multiply overload return types (extract from container unit)
type ExtractMassPerEnergySubstance<U> =
  U extends MassPerEnergy<infer S> ? S : never;
type ExtractMassPerAreaSubstance<U> =
  U extends MassPerArea<infer S> ? S : never;
type ExtractMassPerTimeSubstance<U> =
  U extends MassPerTime<infer S> ? S : never;
type ExtractMassSubstance<U> = U extends Mass<infer S> ? S : never;
type ExtractMassPerHeadPerDaySubstance<U> =
  U extends MassPerHeadPerDay<infer S> ? S : never;
type ExtractMassPerDaySubstance<U> = U extends MassPerDay<infer S> ? S : never;

export function isNamedOrigin(x: Metadata) {
  return x && 'name' in x && !!x.name;
}

export type Metadata =
  | {
      name?: string;
      references?: string[];
    }
  | undefined;

type NamedMetadata = Metadata & {
  name: string;
};

export class BaseContainer<U extends AnyUnit, M extends Metadata = Metadata> {
  unit: U;
  // unit: U | VoidUnit;
  core: M;

  constructor(unit: U, baseOrigin: M) {
    this.unit = unit;

    this.core = baseOrigin;
  }

  attach(metadata: Metadata) {
    this.core = {
      ...this.core,
      ...metadata,
    };

    return this;
  }

  named(name: string) {
    this.core = {
      ...this.core,
      name,
    };

    // REVISIT: calling named() mutates this, it has the potential to modify reused containers (like one)
    return this;
  }

  /**
   * Multiply this container's value by `right`. Only valid when this container's unit is a NumberUnit
   * (e.g. MassPerArea, Mass, etc.). The generic U on BaseContainer remains AnyUnit so that containers
   * with StringUnit (e.g. for constant selection keys) can still extend BaseContainer; consider
   * narrowing to U extends NumberUnit for classes that only ever hold numeric units.
   */
  // RealNumber * RealNumber → RealNumber
  multiply<UL extends RealNumber>(
    this: BaseContainer<UL>,
    right: Container<RealNumber>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL>;
  // unit * RealNumber → preserve this.unit
  multiply<UL extends NumberUnit>(
    this: BaseContainer<UL>,
    right: Container<RealNumber>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL>;
  // RealNumber * unit → preserve this.unit
  multiply<UR extends NumberUnit>(
    this: BaseContainer<RealNumber>,
    right: Container<UR>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UR>;
  // MassPerMass<S1,S2> * Mass<S2> → Mass<S1>
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerMass<S1, S2>>,
    right: Container<Mass<S2>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<S1>>;
  // Mass<S2> * MassPerMass<S1,S2> → Mass<S1> (only when right's denominator S2Right equals this's substance S2)
  multiply<
    S1 extends Substance,
    S2 extends Substance,
    S2Right extends Substance,
  >(
    this: BaseContainer<Mass<S2>>,
    right: Container<MassPerMass<S1, S2Right>>,
    baseOrigin?: Metadata,
  ): [S2Right] extends [S2]
    ? [S2] extends [S2Right]
      ? BinaryContainer<Mass<S1>>
      : never
    : never;
  // EnergyPerVolume<S> * Volume<S> → Energy
  multiply<S extends Substance>(
    this: BaseContainer<EnergyPerVolume<S>>,
    right: Container<Volume<S>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Energy>;
  // MassPerEnergy * Energy → Mass<substance>
  multiply<UL extends MassPerEnergy<Substance>>(
    this: BaseContainer<UL>,
    right: Container<Energy>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<ExtractMassPerEnergySubstance<UL>>>;
  // EnergyPerMass * Mass → Energy
  multiply<S extends Substance, UL extends EnergyPerMass<S>>(
    this: BaseContainer<UL>,
    right: Container<Mass<S>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Energy>;
  // MassPerArea * Area → Mass<substance>
  multiply<UL extends MassPerArea<Substance>>(
    this: BaseContainer<UL>,
    right: Container<Area>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<ExtractMassPerAreaSubstance<UL>>>;
  // MassPerTime * Area → Mass<substance>
  multiply<UL extends MassPerTime<Substance>>(
    this: BaseContainer<UL>,
    right: Container<Time>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<ExtractMassPerTimeSubstance<UL>>>;
  // MassPerVolume * Volume → Mass<substance>
  multiply<
    S1 extends Substance,
    S2 extends Substance,
    // UL extends MassPerVolume<S1, S2>, // TODO: CHECK THAT THIS WORKED
  >(
    this: BaseContainer<MassPerVolume<S1, S2>>, // BaseContainer<UL>,
    right: Container<Volume<S2>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<S1>>;
  // Electricity * MassPerElectricity<S> → Mass<S>
  multiply<S extends Substance>(
    this: BaseContainer<Electricity>,
    right: Container<MassPerElectricity<S>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<S>>;
  // MassPerHeadPerDay<S1> * MassPerMass<S2, S1> = MassPerHeadPerDay<S2>
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerHeadPerDay<S1>>,
    right: Container<MassPerMass<S2, S1>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerHeadPerDay<S2>>;
  // MassPerHeadPerDay<S1> * Head = MassPerDay<S1>
  multiply<S extends Substance, UL extends MassPerHeadPerDay<S>>(
    this: BaseContainer<UL>,
    right: Container<Head>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerDay<ExtractMassPerHeadPerDaySubstance<UL>>>;
  // MassPerEnergy<S1> * EnergyPerMass<S1> = RealNumber
  multiply<S extends Substance>(
    this: BaseContainer<MassPerEnergy<S>>,
    right: Container<EnergyPerMass<S>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<RealNumber>;
  // MassPerDay<S1> * Days = Mass<S1>
  multiply<S extends Substance, UL extends MassPerDay<S>>(
    this: BaseContainer<UL>,
    right: Container<Days>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<ExtractMassPerDaySubstance<UL>>>;
  // MassPerHeadPerDay<S1> * VolumePerMass<S2, S1> = VolumePerHeadPerDay<S2>
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerHeadPerDay<S1>>,
    right: Container<VolumePerMass<S2, S1>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<VolumePerHeadPerDay<S2>>;
  // VolumePerHeadPerDay<S1> * MassPerVolume<S2, S1> = MassPerHeadPerDay<S2>
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<VolumePerHeadPerDay<S1>>,
    right: Container<MassPerVolume<S2, S1>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerHeadPerDay<S2>>;
  // Fallback implementation
  multiply(
    this: BaseContainer<NumberUnit>,
    right: Container<NumberUnit>,
    baseOrigin?: Metadata,
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
      } else if (isEnergyPerMass(leftUnit) && isMass(rightUnit)) {
        unit = energy();
      } else if (isElectricity(leftUnit) && isMassPerElectricity(rightUnit)) {
        unit = mass(rightUnit.substance);
      } else if (isEnergyPerVolume(leftUnit) && isVolume(rightUnit)) {
        unit = energy();
      } else if (isMassPerTime(leftUnit) && isTime(rightUnit)) {
        unit = mass(leftUnit.substance);
      } else if (isMassPerHeadPerDay(leftUnit) && isMassPerMass(rightUnit)) {
        unit = massPerHeadPerDay(rightUnit.snum);
      } else if (isMassPerHeadPerDay(leftUnit) && isHead(rightUnit)) {
        unit = massPerDay(leftUnit.substance);
      } else if (isMassPerDay(leftUnit) && isDays(rightUnit)) {
        unit = mass(leftUnit.substance);
      } else if (isMassPerHeadPerDay(leftUnit) && isEnergyPerMass(rightUnit)) {
        unit = massPerDay(leftUnit.substance);
      } else if (isMassPerHeadPerDay(leftUnit) && isVolumePerMass(rightUnit)) {
        unit = volumePerHeadPerDay(leftUnit.substance);
      } else if (
        isVolumePerHeadPerDay(leftUnit) &&
        isMassPerVolume(rightUnit)
      ) {
        unit = massPerHeadPerDay(rightUnit.mass);
      } else if (isMassPerEnergy(leftUnit) && isEnergyPerMass(rightUnit)) {
        unit = realNumber();
      } else if (isMassPerVolume(leftUnit) && isVolume(rightUnit)) {
        unit = mass(leftUnit.mass);
      } else if (isRealNumber(leftUnit)) {
        unit = { ...rightUnit };
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
  // NumberUnit / RealNumber → NumberUnit
  divide<UL extends NumberUnit>(
    this: BaseContainer<UL>,
    right: Container<RealNumber>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL>;

  // NumberUnit / NumberUnit → RealNumber
  divide<UL extends NumberUnit>(
    this: BaseContainer<UL>,
    right: Container<UL>,
    baseOrigin?: Metadata,
  ): BinaryContainer<RealNumber>;

  // Mass<Substance> / Area → MassPerArea<Substance>
  divide<UL extends Mass<Substance>>(
    this: BaseContainer<UL>,
    right: Container<Area>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerArea<ExtractMassSubstance<UL>>>;

  divide<
    S1 extends Substance,
    S2 extends Substance,
    UL extends MassPerHeadPerDay<S1>,
  >(
    this: BaseContainer<UL>,
    right: Container<MassPerMass<S1, S2>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerHeadPerDay<S2>>;

  divide<UL extends NumberUnit>(
    this: BaseContainer<NumberUnit>,
    right: Container<NumberUnit>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL> {
    const leftUnit = this.unit;
    const rightUnit = right.unit;
    let unit: NumberUnit;
    if (isVoid(leftUnit) || isVoid(rightUnit)) {
      unit = voidUnit();
    } else {
      if (isMass(leftUnit) && isArea(rightUnit)) {
        unit = massPerArea(leftUnit.substance);
      } else if (isMassPerHeadPerDay(leftUnit) && isMassPerMass(rightUnit)) {
        unit = massPerHeadPerDay(rightUnit.snum);
      } else if (leftUnit.__unitType === rightUnit.__unitType) {
        unit = realNumber();
      } else {
        if (!isRealNumber(rightUnit)) {
          // eslint-disable-next-line no-console
          console.error(
            `divide does not support ${formatUnit(leftUnit)} / ${formatUnit(
              rightUnit,
            )}`,
          );
        }
        unit = { ...leftUnit };
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
    this: BaseContainer<UL>,
    right: Container<UL>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL> {
    let unit: NumberUnit;
    if (isVoid(this.unit)) {
      unit = voidUnit();
    } else if (isVoid(right.unit)) {
      unit = this.unit;
    } else {
      unit = this.unit;
    }

    const newUnit = {
      ...unit,
      value: this.unit.value.sub(right.unit.value),
    };
    return new BinaryContainer(
      newUnit as UL,
      'subtract',
      this as unknown as Container<NumberUnit>,
      right,
      baseOrigin,
    );
  }

  // add overloads to plus so that a RealNumber can be added to a NumberUnit
  plus<UL extends NumberUnit>(
    this: BaseContainer<UL>,
    right: Container<RealNumber>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL>;

  plus<UL extends NumberUnit>(
    this: BaseContainer<RealNumber>,
    right: Container<UL>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL>;

  plus<UL extends NumberUnit>(
    this: BaseContainer<UL>,
    right: Container<UL>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL>;

  plus<UL extends NumberUnit>(
    this: BaseContainer<NumberUnit>,
    right: Container<NumberUnit>,
    baseOrigin?: Metadata,
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
      } else if (leftUnit.__unitType === rightUnit.__unitType) {
        unit = { ...leftUnit };
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

  power<UL extends NumberUnit>(
    this: BaseContainer<UL>,
    right: Container<RealNumber>,
    baseOrigin?: Metadata,
  ): BinaryContainer<RealNumber> {
    const leftUnit = this.unit;
    const rightUnit = right.unit;

    const unit = realNumber(leftUnit.value.pow(rightUnit.value));

    return new BinaryContainer(
      unit,
      'power',
      this as unknown as Container<RealNumber>,
      right,
      baseOrigin,
    );
  }

  squared<UL extends NumberUnit>(
    this: BaseContainer<UL>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL> {
    const unit = {
      ...this.unit,
      value: this.unit.value.pow(2),
    };
    const right = num(2);

    return new BinaryContainer(
      unit,
      'power',
      this as unknown as Container<UL>,
      right,
      baseOrigin,
    );
  }
}

export class BinaryContainer<U extends AnyUnit> extends BaseContainer<U> {
  originType: 'binary';
  type: 'add' | 'subtract' | 'multiply' | 'divide' | 'power';
  left: Container<NumberUnit>;
  right: Container<NumberUnit>;

  constructor(
    unit: U,
    type: 'add' | 'subtract' | 'multiply' | 'divide' | 'power',
    left: Container<NumberUnit>,
    right: Container<NumberUnit>,
    baseOrigin: Metadata,
  ) {
    super(unit, baseOrigin);
    this.originType = 'binary';
    this.type = type;
    this.left = left;
    this.right = right;
  }

  switchUnit<UN extends U extends NumberUnit ? U : never, V extends NumberUnit>(
    converter: (from: UN) => V,
  ): BinaryContainer<V> {
    const newUnit = converter(this.unit as unknown as UN);
    //@ts-expect-error Force switch of units
    this.unit = newUnit;

    return this as unknown as BinaryContainer<V>;
  }
}

export class SummedContainer<N extends NumberUnit> extends BaseContainer<N> {
  originType: 'sum';
  from: Container<NumberUnit>[];

  constructor(
    unit: N,
    from: TypedContainer<NumberUnit>[],
    baseOrigin: Metadata,
  ) {
    super(unit, baseOrigin);
    this.originType = 'sum';
    this.from = from;
  }

  switchUnit<UN extends N extends NumberUnit ? N : never, V extends NumberUnit>(
    converter: (from: UN) => V,
  ): SummedContainer<V> {
    const newUnit = converter(this.unit as unknown as UN);
    //@ts-expect-error Force switch of units
    this.unit = newUnit;

    return this as unknown as SummedContainer<V>;
  }
}

export class ConstantSelectionContainer<
  U extends NumberUnit,
> extends BaseContainer<U, NamedMetadata> {
  originType: 'constant_selection';
  selectors: (Container<StringUnit> | string)[];

  constructor(
    unit: U,
    selectors: (Container<StringUnit> | string)[],
    name: string,
  ) {
    super(unit, { name });
    this.originType = 'constant_selection';
    this.selectors = selectors;
  }

  switchUnit<UN extends U extends NumberUnit ? U : never, V extends NumberUnit>(
    converter: (from: UN) => V,
  ): ConstantSelectionContainer<V> {
    const newUnit = converter(this.unit as unknown as UN);
    //@ts-expect-error Force switch of units
    this.unit = newUnit;

    return this as unknown as ConstantSelectionContainer<V>;
  }
}

export class RootContainer<U extends AnyUnit> extends BaseContainer<U> {
  originType: 'root';

  constructor(unit: U, baseOrigin?: Metadata) {
    super(unit, baseOrigin);
    this.originType = 'root';
  }

  switchUnit<UN extends U extends NumberUnit ? U : never, V extends NumberUnit>(
    converter: (from: UN) => V,
  ): RootContainer<V> {
    const newUnit = converter(this.unit as unknown as UN);
    //@ts-expect-error Force switch of units
    this.unit = newUnit;

    return this as unknown as RootContainer<V>;
  }
}

export const root = <U extends AnyUnit>(
  unit: U,
  baseOrigin?: Metadata,
): RootContainer<U> => new RootContainer(unit, baseOrigin);

export class BracketedContainer<U extends AnyUnit> extends BaseContainer<U> {
  originType: 'bracketed';
  inner: Container<AnyUnit>;
  constructor(unit: U, inner: Container<AnyUnit>, baseOrigin?: Metadata) {
    super(unit, baseOrigin);
    this.originType = 'bracketed';
    this.inner = inner;
  }

  switchUnit<UN extends U extends NumberUnit ? U : never, V extends NumberUnit>(
    converter: (from: UN) => V,
  ): BracketedContainer<V> {
    const newUnit = converter(this.unit as unknown as UN);
    //@ts-expect-error Force switch of units
    this.unit = newUnit;

    return this as unknown as BracketedContainer<V>;
  }
}

export const br = <U extends AnyUnit>(
  inner: Container<U>,
): BracketedContainer<U> => new BracketedContainer(inner.unit, inner);

export const num = (value: number | Decimal): RootContainer<RealNumber> =>
  new RootContainer(realNumber(value));

export const value = <N extends NumberUnit>(v: N): RootContainer<N> =>
  new RootContainer(v);

export type TypedContainer<U extends AnyUnit> =
  | BracketedContainer<U>
  | BinaryContainer<U>
  | RootContainer<U>
  | SummedContainer<U extends NumberUnit ? U : never>
  | ConstantSelectionContainer<U extends NumberUnit ? U : never>;

export type MultiContainer<U extends NumberUnit = NumberUnit> =
  SummedContainer<U>;

export type Container<U extends AnyUnit> =
  | TypedContainer<U>
  | MultiContainer<U extends NumberUnit ? U : never>;
