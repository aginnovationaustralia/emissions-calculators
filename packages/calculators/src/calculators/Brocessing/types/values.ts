export type Substance = 'CO2' | 'CH4' | 'N2O';

import Decimal from 'decimal.js-light';

export interface DecimalValue {
  value(): Decimal;
}

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

export type NumberUnit = CanPrint & MassKg<Substance>;
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

  convertToCO2e() {
    // TODO: check gas type
    return new MassKg('CO2', this._value.mul(new Decimal(25)));
  }

  printWithUnits() {
    return `${this._value.toString()} kg ${this._substanceM}`;
  }
}
