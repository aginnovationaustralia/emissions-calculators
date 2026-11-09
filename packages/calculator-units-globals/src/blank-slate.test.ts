/*
 * Units and rules built from nothing, importing only the core entry point.
 *
 * This file is excluded from the main tsconfig and typechecked alone by tsconfig.blank-slate.json,
 * so none of the defaults are in scope, just as for a consumer that never imports `/defaults`.
 * (jest gives each test file its own module registry, so the runtime registry starts empty too.)
 */
import {
  Container,
  defineMultiply,
  num,
  root,
  Rule,
  Substance,
  UnitError,
} from './index.js';
import { Equal, expectType } from './test-helpers.js';

// No substances are declared, so any string is accepted
expectType<Equal<Substance, string>>(true);

type Litres<S extends string = string> = { __unitType: 'Litres'; liquid: S };
type Dollars = { __unitType: 'Dollars' };
type DollarsPerLitre<S extends string = string> = {
  __unitType: 'DollarsPerLitre';
  liquid: S;
};

const litres = <S extends string>(liquid: S): Litres<S> => ({
  __unitType: 'Litres',
  liquid,
});
const dollars = (): Dollars => ({ __unitType: 'Dollars' });
const dollarsPerLitre = <S extends string>(liquid: S): DollarsPerLitre<S> => ({
  __unitType: 'DollarsPerLitre',
  liquid,
});

declare module './units.js' {
  interface UnitRegistry {
    Litres: Litres;
    Dollars: Dollars;
    DollarsPerLitre: DollarsPerLitre;
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
declare module './rules.js' {
  interface MultiplyRules<L, R> {
    // DollarsPerLitre<S> * Litres<S> = Dollars
    dollarsPerLitreTimesLitres: L extends DollarsPerLitre<infer S>
      ? Rule<Litres<S>, Dollars>
      : never;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

defineMultiply('DollarsPerLitre', 'Litres', (l, r) =>
  l.liquid === r.liquid ? dollars() : undefined,
);

describe('blank slate', () => {
  test('RealNumber scaling and addition are built in', () => {
    const doubled = root(litres('Milk'), 2).multiply(num(2));
    expectType<Equal<typeof doubled, Container<Litres<'Milk'>>>>(true);
    expect(doubled.plus(doubled).value.toNumber()).toBe(8);
  });

  test('only the consumer rules are available', () => {
    const cost = root(dollarsPerLitre('Milk'), 1.5).multiply(
      root(litres('Milk'), 1000),
    );
    expectType<Equal<typeof cost, Container<Dollars>>>(true);
    expect(cost.unit).toEqual(dollars());
    expect(cost.value.toNumber()).toBe(1500);

    const milkPrice = root(dollarsPerLitre('Milk'), 1.5);
    const fuel = root(litres('Fuel'), 1);
    // @ts-expect-error price of milk times a volume of fuel
    expect(() => milkPrice.multiply(fuel)).toThrow(UnitError);
  });
});
