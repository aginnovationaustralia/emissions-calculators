import {
  entriesFromObject,
  ObjectEntry,
  objectFromEntries,
} from '@/calculators/common/tools';
import Decimal from 'decimal.js-light';
import { formatUnit } from './format';
import { IfElseContainer } from './if-else';
import { InputContainer } from './inputs';
import { Method1And2Container, Method2Container } from './multi';
import { QualityTable } from './quality';
import { SwitchContainer } from './switch';
import {
  AnyUnit,
  Area,
  BooleanUnit,
  Days,
  Distance,
  Electricity,
  energy,
  Energy,
  energyPerHeadPerDay,
  EnergyPerHeadPerDay,
  EnergyPerMass,
  EnergyPerVolume,
  Head,
  isArea,
  isDays,
  isDistance,
  isElectricity,
  isEnergy,
  isEnergyPerHeadPerDay,
  isEnergyPerMass,
  isEnergyPerVolume,
  isHead,
  isMass,
  isMassDistance,
  isMassPerArea,
  isMassPerAreaPerDay,
  isMassPerAreaPerYear,
  isMassPerDay,
  isMassPerElectricity,
  isMassPerEnergy,
  isMassPerHead,
  isMassPerHeadPerDay,
  isMassPerMass,
  isMassPerMassDistance,
  isMassPerTime,
  isMassPerVolume,
  isMassPerYear,
  isRealNumber,
  isTime,
  isVoid,
  isVolume,
  isVolumePerHeadPerDay,
  isVolumePerMass,
  isYears,
  mass,
  Mass,
  massDistance,
  MassDistance,
  massPerArea,
  MassPerArea,
  MassPerAreaPerDay,
  massPerAreaPerYear,
  MassPerAreaPerYear,
  massPerDay,
  MassPerDay,
  MassPerElectricity,
  massPerEnergy,
  MassPerEnergy,
  massPerHead,
  MassPerHead,
  massPerHeadPerDay,
  MassPerHeadPerDay,
  massPerMass,
  MassPerMass,
  MassPerMassDistance,
  MassPerTime,
  massPerVolume,
  MassPerVolume,
  massPerYear,
  MassPerYear,
  NumberUnit,
  realNumber,
  RealNumber,
  StringUnit,
  Substance,
  Time,
  voidUnit,
  volume,
  Volume,
  volumePerHeadPerDay,
  VolumePerHeadPerDay,
  VolumePerMass,
  Years,
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
      quality?: QualityTable;
    }
  | undefined;

type NamedMetadata = Metadata & {
  name: string;
};

/**
 * Picks the unit of the result when adding or subtracting two units. Void and RealNumber both
 * adopt the other side's unit: void is the result of summing an empty list, so it must not erase
 * the unit (and e.g. the gas of a Mass) of whatever it is combined with.
 */
const additiveUnit = (
  left: NumberUnit,
  right: NumberUnit,
  op: 'add' | 'subtract',
): NumberUnit => {
  if (isVoid(left)) {
    return right;
  }
  if (isVoid(right)) {
    return left;
  }
  if (isRealNumber(left)) {
    return right;
  }
  if (isRealNumber(right)) {
    return left;
  }
  if (left.__unitType !== right.__unitType) {
    // eslint-disable-next-line no-console
    console.error(
      `${op} does not support ${formatUnit(left)} and ${formatUnit(right)}`,
    );
    return realNumber();
  }
  return left;
};

export class BaseContainer<U extends AnyUnit, M extends Metadata = Metadata> {
  unit: U;
  core: M;

  constructor(unit: U, baseOrigin: M) {
    this.unit = unit;

    this.core = baseOrigin;
  }

  /** NOTE: this style of clone from the base class is only possible right now while there are no private fields in
   * derived classes.
   * */
  protected clone(): this {
    return Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this),
    ) as this;
  }

  attach(metadata: Metadata) {
    const clone = this.clone();
    clone.core = {
      ...this.core,
      ...metadata,
    };

    return clone;
  }

  named(name: string) {
    const clone = this.clone();
    clone.core = {
      ...this.core,
      name,
    };

    return clone;
  }

  reference(reference: string) {
    const clone = this.clone();
    clone.core = {
      ...this.core,
      references: [...(this.core?.references ?? []), reference],
    };

    return clone;
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
    right: Container<Mass<NoInfer<S2>>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<S1>>;
  // Mass<S2> * MassPerMass<S1,S2> → Mass<S1>
  // NOTE: `right`'s denominator is wrapped in `NoInfer` so S2 is inferred ONLY from `this`.
  // Reusing S2 as a plain (uninferred-from-one-side) type parameter here does NOT enforce a
  // match: TS infers S2 from both `this` and `right` independently, then unions the candidates
  // (e.g. 'CO2' | 'Carbon'), and both original arguments remain structurally assignable to that
  // wider union - so a mismatched call silently succeeds. `NoInfer` forces S2 to come from `this`
  // alone, so `right`'s actual denominator is checked against that fixed S2 and a mismatch is a
  // real "argument not assignable" error.
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<Mass<S2>>,
    right: Container<MassPerMass<S1, NoInfer<S2>>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<S1>>;
  // EnergyPerVolume<S> * Volume<S> → Energy
  multiply<S extends Substance>(
    this: BaseContainer<EnergyPerVolume<S>>,
    right: Container<Volume<NoInfer<S>>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Energy>;
  // MassPerEnergy<S1> * EnergyPerVolume<S2> → MassPerVolume<S1, S2>
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerEnergy<S1>>,
    right: Container<EnergyPerVolume<S2>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerVolume<S1, S2>>;
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
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerVolume<S1, S2>>,
    right: Container<Volume<NoInfer<S2>>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<S1>>;
  // Electricity * MassPerElectricity<S> → Mass<S>
  multiply<S extends Substance>(
    this: BaseContainer<Electricity>,
    right: Container<MassPerElectricity<S>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<S>>;
  // MassPerHead<S1> * MassPerMass<S2, S1> = MassPerHead<S2>
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerHead<S1>>,
    right: Container<MassPerMass<S2, NoInfer<S1>>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerHead<S2>>;
  // MassPerHeadPerDay<S1> * MassPerMass<S2, S1> = MassPerHeadPerDay<S2>
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerHeadPerDay<S1>>,
    right: Container<MassPerMass<S2, NoInfer<S1>>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerHeadPerDay<S2>>;
  // MassPerHeadPerDay<S1> * Head = MassPerDay<S1>
  multiply<S extends Substance, UL extends MassPerHeadPerDay<S>>(
    this: BaseContainer<UL>,
    right: Container<Head>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerDay<ExtractMassPerHeadPerDaySubstance<UL>>>;
  // MassPerHeadPerDay<S1> * Day = MassPerHead<S1>
  multiply<S extends Substance, UL extends MassPerHeadPerDay<S>>(
    this: BaseContainer<UL>,
    right: Container<Days>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerHead<ExtractMassPerHeadPerDaySubstance<UL>>>;
  // Head * MassPerHead<S> = Mass<S>
  multiply<S extends Substance>(
    this: BaseContainer<Head>,
    right: Container<MassPerHead<S>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<S>>;
  // MassPerEnergy<S1> * EnergyPerMass<S1> = RealNumber
  multiply<S extends Substance>(
    this: BaseContainer<MassPerEnergy<S>>,
    right: Container<EnergyPerMass<NoInfer<S>>>,
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
    right: Container<VolumePerMass<S2, NoInfer<S1>>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<VolumePerHeadPerDay<S2>>;
  // VolumePerHeadPerDay<S1> * MassPerVolume<S2, S1> = MassPerHeadPerDay<S2>
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<VolumePerHeadPerDay<S1>>,
    right: Container<MassPerVolume<S2, NoInfer<S1>>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerHeadPerDay<S2>>;
  // MassPerAreaPerDay<S> * Days = MassPerArea<S>
  multiply<S extends Substance>(
    this: BaseContainer<MassPerAreaPerDay<S>>,
    right: Container<Days>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerArea<S>>;
  // MassPerAreaPerDay<S> * Area = MassPerDay<S>
  multiply<S extends Substance>(
    this: BaseContainer<MassPerAreaPerDay<S>>,
    right: Container<Area>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerDay<S>>;
  // MassPerAreaPerYear<S1> * Area → MassPerYear<S1>
  multiply<S extends Substance>(
    this: BaseContainer<MassPerAreaPerYear<S>>,
    right: Container<Area>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerYear<S>>;
  // MassPerYear<S1> * <MassPerMass<S2, S1>> = MassPerYear<S2>
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerYear<S1>>,
    right: Container<MassPerMass<S2, NoInfer<S1>>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerYear<S2>>;
  // MassPerYear<S1> * Years = MassPerYear<S1>
  multiply<S1 extends Substance>(
    this: BaseContainer<MassPerYear<S1>>,
    right: Container<Years>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<S1>>;
  // Mass<S> * Distance = MassDistance<S>
  multiply<S extends Substance>(
    this: BaseContainer<Mass<S>>,
    right: Container<Distance>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassDistance<S>>;
  // MassPerMassDistance<S1, S2> * Distance = MassPerMass<S1, S2>
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerMassDistance<S1, S2>>,
    right: Container<Distance>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerMass<S1, S2>>;
  // MassPerMassDistance<S1, S2> * MassDistance<S2> = Mass<S1>
  multiply<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerMassDistance<S1, S2>>,
    right: Container<MassDistance<NoInfer<S2>>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<S1>>;
  // MassPerHeadPerDay<S> * EnergyPerMass<S> = EnergyPerHeadPerDay
  multiply<S extends Substance>(
    this: BaseContainer<MassPerHeadPerDay<S>>,
    right: Container<EnergyPerMass<NoInfer<S>>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<EnergyPerHeadPerDay>;
  // MassPerVolume<S1, SVol> * MassPerMass<S2, S1> = MassPerVolume<S2, SVol>
  multiply<S1 extends Substance, S2 extends Substance, SVol extends Substance>(
    this: BaseContainer<MassPerVolume<S1, SVol>>,
    right: Container<MassPerMass<S2, S1>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerVolume<S2, SVol>>;
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
      } else if (isMassPerEnergy(leftUnit) && isEnergyPerVolume(rightUnit)) {
        unit = massPerVolume(leftUnit.substance, rightUnit.substance);
      } else if (isMassPerHeadPerDay(leftUnit) && isEnergyPerMass(rightUnit)) {
        unit = energyPerHeadPerDay();
      } else if (isMassPerTime(leftUnit) && isTime(rightUnit)) {
        unit = mass(leftUnit.substance);
      } else if (isMassPerHead(leftUnit) && isMassPerMass(rightUnit)) {
        unit = massPerHead(rightUnit.snum);
      } else if (isMassPerHeadPerDay(leftUnit) && isMassPerMass(rightUnit)) {
        unit = massPerHeadPerDay(rightUnit.snum);
      } else if (isMassPerHeadPerDay(leftUnit) && isHead(rightUnit)) {
        unit = massPerDay(leftUnit.substance);
      } else if (isMassPerHeadPerDay(leftUnit) && isDays(rightUnit)) {
        unit = massPerHead(leftUnit.substance);
      } else if (isMassPerDay(leftUnit) && isDays(rightUnit)) {
        unit = mass(leftUnit.substance);
      } else if (isMassPerHeadPerDay(leftUnit) && isVolumePerMass(rightUnit)) {
        unit = volumePerHeadPerDay(rightUnit.volume);
      } else if (isMassPerAreaPerDay(leftUnit) && isDays(rightUnit)) {
        unit = massPerArea(leftUnit.substance);
      } else if (isMassPerAreaPerDay(leftUnit) && isArea(rightUnit)) {
        unit = massPerDay(leftUnit.substance);
      } else if (
        isVolumePerHeadPerDay(leftUnit) &&
        isMassPerVolume(rightUnit)
      ) {
        unit = massPerHeadPerDay(rightUnit.mass);
      } else if (isHead(leftUnit) && isMassPerHead(rightUnit)) {
        unit = mass(rightUnit.substance);
      } else if (isMassPerEnergy(leftUnit) && isEnergyPerMass(rightUnit)) {
        unit = realNumber();
      } else if (isMassPerVolume(leftUnit) && isVolume(rightUnit)) {
        unit = mass(leftUnit.mass);
      } else if (isMassPerAreaPerYear(leftUnit) && isYears(rightUnit)) {
        unit = massPerArea(leftUnit.substance);
      } else if (isMassPerAreaPerYear(leftUnit) && isMassPerMass(rightUnit)) {
        unit = massPerAreaPerYear(rightUnit.snum);
      } else if (isMassPerYear(leftUnit) && isYears(rightUnit)) {
        unit = mass(leftUnit.substance);
      } else if (isMassPerAreaPerYear(leftUnit) && isArea(rightUnit)) {
        unit = massPerYear(leftUnit.substance);
      } else if (isMassPerYear(leftUnit) && isMassPerMass(rightUnit)) {
        unit = massPerYear(rightUnit.snum);
      } else if (isMass(leftUnit) && isDistance(rightUnit)) {
        unit = massDistance(leftUnit.substance);
      } else if (isMassPerMassDistance(leftUnit) && isDistance(rightUnit)) {
        unit = massPerMass(leftUnit.snum, leftUnit.sdenom);
      } else if (isMassPerMassDistance(leftUnit) && isMassDistance(rightUnit)) {
        unit = mass(leftUnit.snum);
      } else if (isRealNumber(leftUnit)) {
        unit = { ...rightUnit };
      } else if (isMassPerVolume(leftUnit) && isMassPerMass(rightUnit)) {
        unit = massPerVolume(rightUnit.snum, leftUnit.volume);
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
      unit.store = leftUnit.store.multiply(rightUnit.store);
    }

    return new BinaryContainer(
      unit,
      'multiply',
      this as unknown as NumberContainer<NumberUnit>,
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
    right: Container<NoInfer<UL>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<RealNumber>;

  // Mass<Substance> / Area → MassPerArea<Substance>
  divide<UL extends Mass<Substance>>(
    this: BaseContainer<UL>,
    right: Container<Area>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerArea<ExtractMassSubstance<UL>>>;

  // Mass<S1> / MassPerMass<S1, S2> = Mass<S2>
  divide<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<Mass<S1>>,
    right: Container<MassPerMass<NoInfer<S1>, S2>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Mass<S2>>;

  // MassPerArea<S1> / Years = MassPerAreaPerYear<S1>
  divide<S extends Substance>(
    this: BaseContainer<MassPerArea<S>>,
    right: Container<Years>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerAreaPerYear<S>>;

  // EnergyPerHeadPerDay<S> / EnergyPerMass<S> = MassPerHeadPerDay<S>
  divide<S extends Substance>(
    this: BaseContainer<EnergyPerHeadPerDay>,
    right: Container<EnergyPerMass<S>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerHeadPerDay<S>>;

  // MassPerHead<S> / Days = MassPerHeadPerDay<S>
  divide<S extends Substance>(
    this: BaseContainer<MassPerHead<S>>,
    right: Container<Days>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerHeadPerDay<S>>;

  // MassPerHeadPerDay<S1> / MassPerMass<S1, S2> = MassPerHeadPerDay<S2>
  divide<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerHeadPerDay<S1>>,
    right: Container<MassPerMass<NoInfer<S1>, S2>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerHeadPerDay<S2>>;

  // Mass<S1> / MassPerVolume<S1, S2> = Volume<S2>
  divide<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<Mass<S1>>,
    right: Container<MassPerVolume<S1, S2>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<Volume<S2>>;

  // MassPerEnergy<S1> / MassPerMass<S1, S2> => MassPerEnergy<S2>
  divide<S1 extends Substance, S2 extends Substance>(
    this: BaseContainer<MassPerEnergy<S1>>,
    right: Container<MassPerMass<NoInfer<S1>, S2>>,
    baseOrigin?: Metadata,
  ): BinaryContainer<MassPerEnergy<S2>>;

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
        unit = massPerHeadPerDay(rightUnit.sdenom);
      } else if (
        isEnergyPerHeadPerDay(leftUnit) &&
        isEnergyPerMass(rightUnit)
      ) {
        unit = massPerHeadPerDay(rightUnit.substance);
      } else if (isMass(leftUnit) && isMassPerMass(rightUnit)) {
        unit = mass(rightUnit.sdenom);
      } else if (leftUnit.__unitType === rightUnit.__unitType) {
        unit = realNumber();
      } else if (isMassPerArea(leftUnit) && isYears(rightUnit)) {
        unit = massPerAreaPerYear(leftUnit.substance);
      } else if (isMassPerHead(leftUnit) && isDays(rightUnit)) {
        unit = massPerHeadPerDay(leftUnit.substance);
      } else if (isMass(leftUnit) && isMassPerVolume(rightUnit)) {
        unit = volume(rightUnit.volume);
      } else if (isMassPerEnergy(leftUnit) && isMassPerMass(rightUnit)) {
        unit = massPerEnergy(rightUnit.sdenom);
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
      unit.store = leftUnit.store.divide(rightUnit.store);
    }
    return new BinaryContainer(
      unit as UL,
      'divide',
      this as unknown as NumberContainer<UL>,
      right,
      baseOrigin,
    );
  }

  minus<UL extends NumberUnit>(
    this: BaseContainer<UL>,
    right: Container<RealNumber>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL>;

  minus<UL extends NumberUnit>(
    this: BaseContainer<RealNumber>,
    right: Container<UL>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL>;

  minus<UL extends NumberUnit>(
    this: BaseContainer<UL>,
    right: Container<UL>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL>;

  minus(
    this: BaseContainer<NumberUnit>,
    right: Container<NumberUnit>,
    baseOrigin?: Metadata,
  ): BinaryContainer<NumberUnit> {
    const leftUnit = this.unit;
    const rightUnit = right.unit;
    const unit: NumberUnit = {
      ...additiveUnit(leftUnit, rightUnit, 'subtract'),
      store: leftUnit.store.minus(rightUnit.store),
    };

    return new BinaryContainer(
      unit,
      'subtract',
      this as unknown as NumberContainer<NumberUnit>,
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

  plus(
    this: BaseContainer<NumberUnit>,
    right: Container<NumberUnit>,
    baseOrigin?: Metadata,
  ): BinaryContainer<NumberUnit> {
    const leftUnit = this.unit;
    const rightUnit = right.unit;
    const unit: NumberUnit = {
      ...additiveUnit(leftUnit, rightUnit, 'add'),
      store: leftUnit.store.plus(rightUnit.store),
    };

    return new BinaryContainer(
      unit,
      'add',
      this as unknown as NumberContainer<NumberUnit>,
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

    // For arbitrary power operations, units are hard to predict, so we just return a RealNumber
    const unit = realNumber(leftUnit.store.power(rightUnit.store));

    return new BinaryContainer(
      unit,
      'power',
      this as unknown as NumberContainer<RealNumber>,
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
      store: this.unit.store.squared(),
    };
    const right = num(2);

    return new BinaryContainer(
      unit,
      'power',
      this as unknown as NumberContainer<UL>,
      right,
      baseOrigin,
    );
  }

  /**
   * Takes the minimum of this value or the one given.
   * @param this the unit being limited
   * @param right the limit value
   * @param baseOrigin the base origin of the new container
   * @returns a new container with the limited value
   */
  min<UL extends NumberUnit>(
    this: BaseContainer<UL>,
    right: NumberContainer<UL | RealNumber>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL> {
    const limit = right.unit.store.value;
    const unit = {
      ...this.unit,
      store: this.unit.store.min(limit),
    };
    return new BinaryContainer(
      unit,
      'min',
      this as unknown as NumberContainer<UL>,
      right,
      baseOrigin,
    );
  }

  /**
   * Takes the minimum of this value or the one given.
   * @param this the unit being constrained
   * @param right the max value
   * @param baseOrigin the base origin of the new container
   * @returns a new container with the maximum value
   */
  max<UL extends NumberUnit>(
    this: BaseContainer<UL>,
    right: NumberContainer<UL | RealNumber>,
    baseOrigin?: Metadata,
  ): BinaryContainer<UL> {
    const limit = right.unit.store.value;
    const unit = {
      ...this.unit,
      store: this.unit.store.max(limit),
    };
    return new BinaryContainer(
      unit,
      'max',
      this as unknown as NumberContainer<UL>,
      right,
      baseOrigin,
    );
  }
}

/**
 * Takes the minimum of 2 values. This is a very thin wrapper around `BaseContainer.min`,
 * to make it slightly easier to read than using the dot notation directly on a container
 * @param this the unit being limited
 * @param right the limit value
 * @param baseOrigin the base origin of the new container
 * @returns a new container with the limited value
 */
export const min = <U extends NumberUnit>(
  value1: NumberContainer<U>,
  value2: NumberContainer<U | RealNumber>,
): BinaryContainer<U> => value1.min(value2);

/**
 * Takes the minimum of 2 values. This is a very thin wrapper around `BaseContainer.min`,
 * to make it slightly easier to read than using the dot notation directly on a container
 * @param this the unit being limited
 * @param right the limit value
 * @param baseOrigin the base origin of the new container
 * @returns a new container with the limited value
 */
export const max = <U extends NumberUnit>(
  value1: NumberContainer<U>,
  value2: NumberContainer<U | RealNumber>,
): BinaryContainer<U> => value1.max(value2);

export class BinaryContainer<U extends AnyUnit> extends BaseContainer<U> {
  originType: 'binary';
  type: 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'min' | 'max';
  left: NumberContainer<NumberUnit>;
  right: NumberContainer<NumberUnit>;

  constructor(
    unit: U,
    type: 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'min' | 'max',
    left: NumberContainer<NumberUnit>,
    right: NumberContainer<NumberUnit>,
    baseOrigin: Metadata,
  ) {
    super(unit, baseOrigin);
    this.originType = 'binary';
    this.type = type;
    this.left = left;
    this.right = right;
  }

  switchUnit<
    UN extends (U extends NumberUnit ? U : never),
    V extends NumberUnit,
  >(converter: (from: UN) => V): BinaryContainer<V> {
    const newUnit = converter(this.unit as unknown as UN);
    return new BinaryContainer(
      newUnit,
      this.type,
      this.left,
      this.right,
      this.core,
    );
  }
}

export class SummedContainer<N extends NumberUnit> extends BaseContainer<N> {
  originType: 'sum';
  from: NumberContainer<NumberUnit>[];

  constructor(
    unit: N,
    from: NumberContainer<NumberUnit>[],
    baseOrigin: Metadata,
  ) {
    super(unit, baseOrigin);
    this.originType = 'sum';
    this.from = from;
  }

  switchUnit<
    UN extends (N extends NumberUnit ? N : never),
    V extends NumberUnit,
  >(converter: (from: UN) => V): SummedContainer<V> {
    const newUnit = converter(this.unit as unknown as UN);
    return new SummedContainer(newUnit, this.from, this.core);
  }
}

export class ConstantSelectionContainer<
  U extends NumberUnit,
> extends BaseContainer<U, NamedMetadata> {
  originType: 'constant_selection';
  selectors: (StringContainer<StringUnit> | string)[];

  constructor(
    unit: U,
    selectors: (StringContainer<StringUnit> | string)[],
    name: string,
  ) {
    super(unit, { name });
    this.originType = 'constant_selection';
    this.selectors = selectors;
  }

  switchUnit<
    UN extends (U extends NumberUnit ? U : never),
    V extends NumberUnit,
  >(converter: (from: UN) => V): ConstantSelectionContainer<V> {
    const newUnit = converter(this.unit as unknown as UN);
    return new ConstantSelectionContainer(
      newUnit,
      this.selectors,
      this.core.name,
    );
  }
}

export class RootContainer<U extends AnyUnit> extends BaseContainer<U> {
  originType: 'root';

  constructor(unit: U, baseOrigin?: Metadata) {
    super(unit, baseOrigin);
    this.originType = 'root';
  }

  switchUnit<
    UN extends (U extends NumberUnit ? U : never),
    V extends NumberUnit,
  >(converter: (from: UN) => V): RootContainer<V> {
    const newUnit = converter(this.unit as unknown as UN);
    return new RootContainer(newUnit, this.core);
  }
}

export const root = <U extends AnyUnit>(
  unit: U,
  baseOrigin?: Metadata,
): RootContainer<U> => new RootContainer(unit, baseOrigin);

export class BracketedContainer<U extends NumberUnit> extends BaseContainer<U> {
  originType: 'bracketed';
  inner: Container<NumberUnit>;
  constructor(unit: U, inner: Container<NumberUnit>, baseOrigin?: Metadata) {
    super(unit, baseOrigin);
    this.originType = 'bracketed';
    this.inner = inner;
  }

  switchUnit<
    UN extends (U extends NumberUnit ? U : never),
    V extends NumberUnit,
  >(converter: (from: UN) => V): BracketedContainer<V> {
    const newUnit = converter(this.unit as unknown as UN);
    return new BracketedContainer(newUnit, this.inner, this.core);
  }
}

export const br = <U extends NumberUnit>(
  inner: Container<U>,
): BracketedContainer<U> => new BracketedContainer(inner.unit, inner);

export class TranslationContainer<
  TIn extends StringUnit | NumberUnit | BooleanUnit,
  TOut extends StringUnit | NumberUnit,
> extends BaseContainer<TOut> {
  originType: 'translation';
  from: Container<TIn>;
  constructor(unit: TOut, from: Container<TIn>, baseOrigin?: Metadata) {
    super(unit, baseOrigin);
    this.originType = 'translation';
    this.from = from;
  }

  switchUnit<
    UN extends (TOut extends NumberUnit ? TOut : never),
    V extends NumberUnit,
  >(converter: (from: UN) => V): TranslationContainer<TIn, V> {
    const newUnit = converter(this.unit as unknown as UN);
    return new TranslationContainer(newUnit, this.from, this.core);
  }
}

export const translate = <
  TIn extends StringUnit | NumberUnit | BooleanUnit,
  TOut extends StringUnit | NumberUnit,
>(
  newValue: TOut,
  from: Container<TIn>,
): TranslationContainer<TIn, TOut> => new TranslationContainer(newValue, from);

/**
 * Treats a mass of one substance as the same mass of another, keeping the original value and
 * provenance. Container arithmetic refuses to combine different substances, so use this only
 * where that equivalence is a deliberate modelling choice (e.g. a mass based allocation between
 * different products), never to get around a genuine unit mismatch.
 */
export const relabelMass = <S1 extends Substance, S2 extends Substance>(
  from: Container<Mass<S1>>,
  substance: S2,
): TranslationContainer<Mass<S1>, Mass<S2>> =>
  translate<Mass<S1>, Mass<S2>>(
    { __unitType: 'Mass', substance, store: from.unit.store },
    from,
  );

export const num = (value: number | Decimal): RootContainer<RealNumber> =>
  new RootContainer(realNumber(value));

export type NumberContainer<U extends NumberUnit> =
  | BracketedContainer<U>
  | BinaryContainer<U>
  | InputContainer<U>
  | RootContainer<U>
  | Method1And2Container<U>
  | Method2Container<U>
  | SummedContainer<U>
  | ConstantSelectionContainer<U>
  | SwitchContainer<StringUnit, U>
  | IfElseContainer<U>
  | TranslationContainer<StringUnit | NumberUnit | BooleanUnit, U>;

export type StringContainer<U extends StringUnit> =
  | InputContainer<U>
  | RootContainer<U>
  | TranslationContainer<StringUnit | NumberUnit | BooleanUnit, U>;

export type BooleanContainer<U extends BooleanUnit = BooleanUnit> =
  InputContainer<U> | RootContainer<U>;

export type TypedContainer<U extends AnyUnit> = [U] extends [NumberUnit]
  ? NumberContainer<U>
  : [U] extends [StringUnit]
    ? StringContainer<U>
    : [U] extends [BooleanUnit]
      ? BooleanContainer<U>
      : | NumberContainer<Extract<U, NumberUnit>>
        | StringContainer<Extract<U, StringUnit>>
        | BooleanContainer<Extract<U, BooleanUnit>>;

export type MultiContainer<U extends NumberUnit = NumberUnit> =
  SummedContainer<U>;

export type Container<U extends AnyUnit> = [U] extends [NumberUnit]
  ? NumberContainer<U> | MultiContainer<U>
  : TypedContainer<U>;

export type AsAnyContainer<C extends Container<AnyUnit>> = Container<C['unit']>;
export type ValuesAsAnyContainer<Input extends object> = {
  [K in keyof Input]: Input[K] extends Container<AnyUnit>
    ? AsAnyContainer<Input[K]>
    : Input[K] extends object
      ? ValuesAsAnyContainer<Input[K]>
      : Input[K];
};

type MultiplyAllValuesByResult<
  T extends { [K in keyof T]: Container<NumberUnit> },
> = {
  [K in keyof T]: T[K] extends Container<infer U extends NumberUnit>
    ? BinaryContainer<U>
    : never;
};

export function multiplyAllValuesBy<
  T extends { [K in keyof T]: Container<NumberUnit> },
>(object: T, factor: Container<RealNumber>): MultiplyAllValuesByResult<T> {
  return objectFromEntries(
    entriesFromObject(object).map(
      ([key, value]) =>
        [key, value.multiply(factor)] as ObjectEntry<
          MultiplyAllValuesByResult<T>
        >,
    ),
  );
}
