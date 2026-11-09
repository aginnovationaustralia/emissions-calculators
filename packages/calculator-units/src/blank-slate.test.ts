/*
 * A unit system built from nothing, importing only the core entry point.
 *
 * This file is excluded from the main tsconfig and typechecked alone by tsconfig.blank-slate.json,
 * so none of the defaults (in particular the default substances) are in scope, just as for a
 * consumer that never imports `/defaults`.
 */
import {
  ContainerOf,
  createUnitSystem,
  multiplyRule,
  Rule,
  RuleType,
  Substance,
  UnitError,
  values,
  ValueStore,
} from './index.js';
import { Equal, expectType } from './test-helpers.js';

// No substances are declared, so any string is accepted
expectType<Equal<Substance, string>>(true);

type Litres<S extends string = string> = {
  __unitType: 'Litres';
  liquid: S;
  store: ValueStore;
};
type Dollars = { __unitType: 'Dollars'; store: ValueStore };
type DollarsPerLitre<S extends string = string> = {
  __unitType: 'DollarsPerLitre';
  liquid: S;
  store: ValueStore;
};

const litres = <S extends string>(liquid: S, value?: number): Litres<S> => ({
  __unitType: 'Litres',
  liquid,
  store: values(value),
});
const dollars = (value?: number): Dollars => ({
  __unitType: 'Dollars',
  store: values(value),
});
const dollarsPerLitre = <S extends string>(
  liquid: S,
  value?: number,
): DollarsPerLitre<S> => ({
  __unitType: 'DollarsPerLitre',
  liquid,
  store: values(value),
});

// DollarsPerLitre<S> * Litres<S> = Dollars
interface PriceTimesVolume extends RuleType {
  rule: this['L'] extends DollarsPerLitre<infer S>
    ? Rule<Litres<S>, Dollars>
    : never;
}
const priceTimesVolume = multiplyRule<PriceTimesVolume>()(
  'DollarsPerLitre',
  'Litres',
  (l: DollarsPerLitre, r: Litres) =>
    l.liquid === r.liquid ? dollars() : undefined,
);

describe('blank slate', () => {
  test('a system with no rules still scales and adds', () => {
    const units = createUnitSystem();
    const doubled = units.root(litres('Milk', 2)).multiply(units.num(2));
    expectType<
      Equal<typeof doubled, ContainerOf<typeof units, Litres<'Milk'>>>
    >(true);
    expect(doubled.plus(doubled).unit.store.value.toNumber()).toBe(8);
    // @ts-expect-error no rules at all
    expect(() => doubled.multiply(doubled)).toThrow(UnitError);
  });

  test('a system built from only the consumer rules', () => {
    const units = createUnitSystem({ multiply: [priceTimesVolume] });
    type Container<U> = ContainerOf<typeof units, U>;

    const cost = units
      .root(dollarsPerLitre('Milk', 1.5))
      .multiply(units.root(litres('Milk', 1000)));
    expectType<Equal<typeof cost, Container<Dollars>>>(true);
    expect(cost.unit.__unitType).toBe('Dollars');
    expect(cost.unit.store.value.toNumber()).toBe(1500);

    const milkPrice = units.root(dollarsPerLitre('Milk', 1.5));
    const fuel = units.root(litres('Fuel', 1));
    // @ts-expect-error price of milk times a volume of fuel
    expect(() => milkPrice.multiply(fuel)).toThrow(UnitError);
  });
});
