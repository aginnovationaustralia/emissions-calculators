export type Substance = 'CO2' | 'CH4' | 'N2O' | 'CO2e' | 'Refrigerant';

import Decimal from 'decimal.js-light';

export interface DecimalValue {
  value(): Decimal;
}

export class BooleanUnit implements CanPrint {
  private readonly __unitType: 'BooleanUnit' = 'BooleanUnit' as const;

  private _value: boolean;

  constructor(value: boolean) {
    this._value = value;
  }

  printValue() {
    return this._value.toString();
  }

  printWithUnits() {
    return this._value.toString();
  }
}

export class StringUnit implements CanPrint {
  private readonly __unitType: 'StringUnit' = 'StringUnit' as const;

  private _value: string;

  constructor(value: string) {
    this._value = value;
  }

  printValue() {
    return this._value;
  }

  printWithUnits() {
    return this._value;
  }
}

export type AnyUnit = NumberUnit | BooleanUnit | StringUnit;

export interface CanPrint {
  printValue(): string;
  printWithUnits(): string;
}

export abstract class UnitWithDecimal implements DecimalValue, CanPrint {
  protected _value: Decimal;

  constructor(value?: Decimal) {
    this._value = value ?? new Decimal(0);
  }

  value() {
    return this._value;
  }

  printValue() {
    return this._value.toString();
  }

  abstract printWithUnits(): string;
}

export type NumberUnit = CanPrint &
  (MassKg<Substance> | MassTonnes<Substance> | KgPerKg<Substance, Substance>);
//   (MassKg<Substance> | EnergyKWh | RealNumber | TonnesPerKWh<Substance>);

export type CanCallWith<
  K extends string,
  U extends NumberUnit,
  O extends NumberUnit,
> = {
  [key in K]: (other: U) => O;
};

export type CanAdd<U extends NumberUnit, O extends NumberUnit> = CanCallWith<
  'add',
  U,
  O
>;

export type CanMultiply<
  U extends NumberUnit,
  O extends NumberUnit,
> = CanCallWith<'multiply', U, O>;

export type CanSubtract<
  U extends NumberUnit,
  O extends NumberUnit,
> = CanCallWith<'subtract', U, O>;

export type CanDivide<U extends NumberUnit, O extends NumberUnit> = CanCallWith<
  'divide',
  U,
  O
>;

type MathOps<TSelf extends NumberUnit> = CanAdd<TSelf, TSelf> &
  CanMultiply<RealNumber, TSelf> &
  CanSubtract<TSelf, TSelf> &
  CanDivide<RealNumber, TSelf>;

export class RealNumber extends UnitWithDecimal implements MathOps<RealNumber> {
  private readonly __unitType: 'RealNumber' = 'RealNumber' as const;

  value() {
    return this._value;
  }

  subtract(other: RealNumber) {
    return new RealNumber(this._value.sub(other.value()));
  }

  add(other: RealNumber) {
    return new RealNumber(this._value.add(other.value()));
  }

  multiply(other: RealNumber) {
    return new RealNumber(this._value.mul(other.value()));
  }

  divide(other: RealNumber): RealNumber {
    return new RealNumber(this._value.div(other.value()));
  }

  printWithUnits() {
    return `${this._value.toString()}`;
  }
}

export class MassKg<T extends Substance>
  extends UnitWithDecimal
  implements MathOps<MassKg<T>>
{
  private readonly __unitType: 'MassKg' = 'MassKg' as const;

  private _substanceM: T;

  constructor(substance: T, valueKg?: Decimal) {
    super(valueKg);
    this._substanceM = substance;
  }

  subtract(other: MassKg<T>) {
    return new MassKg(this._substanceM, this._value.sub(other.value()));
  }

  add(other: MassKg<T>): MassKg<T> {
    return new MassKg(this._substanceM, this._value.add(other.value()));
  }

  multiply(other: RealNumber): MassKg<T> {
    return new MassKg(this._substanceM, this._value.mul(other.value()));
  }

  divide(other: RealNumber): MassKg<T> {
    return new MassKg(this._substanceM, this._value.div(other.value()));
  }

  toMassTonnes() {
    return new MassTonnes(this._substanceM, this._value.div(new Decimal(1000)));
  }

  convertToCO2e() {
    // TODO: check gas type
    return new MassKg('CO2e', this._value.mul(new Decimal(25)));
  }

  printWithUnits() {
    return `${this._value.toString()} kg ${this._substanceM}`;
  }
}

export class MassTonnes<T extends Substance>
  extends UnitWithDecimal
  implements MathOps<MassTonnes<T>>
{
  private readonly __unitType: 'MassTonnes' = 'MassTonnes' as const;

  private _substanceM: T;

  constructor(substance: T, valueKg?: Decimal) {
    super(valueKg);
    this._substanceM = substance;
  }

  subtract(other: MassTonnes<T>) {
    return new MassTonnes(this._substanceM, this._value.sub(other.value()));
  }

  add(other: MassTonnes<T>): MassTonnes<T> {
    return new MassTonnes(this._substanceM, this._value.add(other.value()));
  }

  multiply(other: RealNumber): MassTonnes<T> {
    return new MassTonnes(this._substanceM, this._value.mul(other.value()));
  }

  divide(other: RealNumber): MassTonnes<T> {
    return new MassTonnes(this._substanceM, this._value.div(other.value()));
  }

  convertToCO2e() {
    // TODO: check gas type
    return new MassTonnes('CO2e', this._value.mul(new Decimal(25)));
  }

  printWithUnits() {
    return `${this._value.toString()} kg ${this._substanceM}`;
  }
}

export class MassTonnesCO2e extends MassTonnes<'CO2e'> {
  constructor(valueKg?: Decimal) {
    super('CO2e', valueKg);
  }
}

export class KgPerKg<SNum extends Substance, SDenom extends Substance>
  extends UnitWithDecimal
  implements MathOps<KgPerKg<SNum, SDenom>>
{
  private readonly __unitType: 'KgCO2ePerKg' = 'KgCO2ePerKg' as const;

  private _numerator: SNum;
  private _denominator: SDenom;

  constructor(numerator: SNum, denominator: SDenom, value?: Decimal) {
    super(value);
    this._numerator = numerator;
    this._denominator = denominator;
  }

  add(other: KgPerKg<SNum, SDenom>) {
    return new KgPerKg(
      this._numerator,
      this._denominator,
      this._value.add(other.value()),
    );
  }

  subtract(other: KgPerKg<SNum, SDenom>) {
    return new KgPerKg(
      this._numerator,
      this._denominator,
      this._value.sub(other.value()),
    );
  }

  multiply(other: RealNumber): KgPerKg<SNum, SDenom> {
    return new KgPerKg(
      this._numerator,
      this._denominator,
      this._value.mul(other.value()),
    );
  }

  divide(other: RealNumber): KgPerKg<SNum, SDenom> {
    return new KgPerKg(
      this._numerator,
      this._denominator,
      this._value.div(other.value()),
    );
  }

  toMassKg(massKg: MassKg<SDenom>) {
    return new MassKg(this._numerator, this._value.mul(massKg.value()));
  }

  printWithUnits() {
    return `${this._value.toString()} kg ${this._numerator} / kg ${
      this._denominator
    }`;
  }
}

export class KgCO2ePerKgRefrigerant extends KgPerKg<'CO2e', 'Refrigerant'> {
  constructor(value?: Decimal) {
    super('CO2e', 'Refrigerant', value);
  }
}
