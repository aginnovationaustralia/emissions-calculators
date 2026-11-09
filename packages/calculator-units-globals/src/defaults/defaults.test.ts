import {
  Container,
  defineDivide,
  defineMultiply,
  num,
  realNumber,
  RealNumber,
  root,
  Rule,
  Substance,
  UnitError,
} from '../index.js';
import { Equal, expectType } from '../test-helpers.js';
import {
  area,
  days,
  distance,
  Distance,
  head,
  Mass,
  mass,
  massPerArea,
  massPerHeadPerDay,
  MassPerMass,
  massPerMass,
  years,
} from './index.js';

describe('default rules', () => {
  const charge = root(mass('Refrigerant'), 10);
  const gwp = root(massPerMass('CO2e', 'Refrigerant'), 1430);

  test('multiplies with a substance specific result', () => {
    const emissions = gwp.multiply(charge);
    expectType<Equal<typeof emissions, Container<Mass<'CO2e'>>>>(true);
    expect(emissions.unit).toEqual(mass('CO2e'));
    expect(emissions.value.toNumber()).toBe(14300);
  });

  test('is commutative where the rules say so', () => {
    const emissions = charge.multiply(gwp);
    expectType<Equal<typeof emissions, Container<Mass<'CO2e'>>>>(true);
    expect(emissions.value.toNumber()).toBe(14300);
  });

  test('chains', () => {
    const result = root(massPerArea('N'), 0.01)
      .divide(root(years(), 1))
      .multiply(root(area(), 10_000))
      .multiply(root(years(), 2))
      .multiply(root(massPerMass('N2O', 'N'), 44 / 28))
      .multiply(root(massPerMass('CO2e', 'N2O'), 273))
      .multiply(num(0.5));
    expectType<Equal<typeof result, Container<Mass<'CO2e'>>>>(true);
    expect(result.value.toNumber()).toBeCloseTo(
      100 * 2 * (44 / 28) * 273 * 0.5,
    );
  });

  test('livestock chain', () => {
    const intake = root(massPerHeadPerDay('DryMatter'), 12)
      .multiply(root(head(), 100))
      .multiply(root(days(), 365));
    expectType<Equal<typeof intake, Container<Mass<'DryMatter'>>>>(true);
    expect(intake.value.toNumber()).toBe(12 * 100 * 365);
  });

  test('keeps substance generics intact in helpers', () => {
    const toCO2e = <S extends Substance>(
      m: Container<Mass<S>>,
      factor: Container<MassPerMass<'CO2e', S>>,
    ) => factor.multiply(m);
    const result = toCO2e(charge, gwp);
    expectType<Equal<typeof result, Container<Mass<'CO2e'>>>>(true);
    expect(result.unit).toEqual(mass('CO2e'));
  });

  test('rejects combinations no rule allows', () => {
    const fuel = root(mass('Fuel'), 3);
    const co2e = gwp.multiply(charge);
    // @ts-expect-error Mass<'Fuel'> is not Mass<'Refrigerant'>
    expect(() => gwp.multiply(fuel)).toThrow(UnitError);
    // @ts-expect-error Area * Days has no rule
    expect(() => root(area(), 1).multiply(root(days(), 1))).toThrow(UnitError);
    // @ts-expect-error can't add CO2e to Refrigerant
    expect(() => co2e.plus(charge)).toThrow(UnitError);
    // @ts-expect-error Mass<'CO2e'> / Mass<'Refrigerant'> is not dimensionless
    expect(() => co2e.divide(charge)).toThrow(UnitError);
  });

  test('checks substances at runtime past a cast', () => {
    const widened = root(mass('Fuel' as Substance), 3);
    // @ts-expect-error Mass<Substance> might not be Mass<'Refrigerant'>
    expect(() => gwp.multiply(widened)).toThrow(UnitError);
  });

  test('plus, minus, scaling and same unit division', () => {
    const co2e = gwp.multiply(charge);
    const total = co2e.plus(co2e).minus(num(1)).multiply(num(2));
    expectType<Equal<typeof total, Container<Mass<'CO2e'>>>>(true);
    expect(total.value.toNumber()).toBe((14300 * 2 - 1) * 2);

    const ratio = co2e.divide(total);
    expectType<Equal<typeof ratio, Container<RealNumber>>>(true);
    expect(ratio.unit).toEqual(realNumber());
  });

  test('records provenance', () => {
    const emissions = gwp
      .multiply(charge, { name: 'Refrigerant emissions' })
      .reference('Eq 1');
    expect(emissions.meta).toEqual({
      name: 'Refrigerant emissions',
      references: ['Eq 1'],
    });
    expect(emissions.origin).toMatchObject({
      kind: 'binary',
      operation: 'multiply',
      left: gwp,
      right: charge,
    });
  });
});

/*
 * Consumer extensions: a substance, a unit and two rules, added to the global registries.
 */
type MassPerDistance<S extends Substance = Substance> = {
  __unitType: 'MassPerDistance';
  substance: S;
};
const massPerDistance = <S extends Substance>(
  substance: S,
): MassPerDistance<S> => ({ __unitType: 'MassPerDistance', substance });

declare module '../substances.js' {
  interface SubstanceRegistry {
    Diesel: true;
  }
}

declare module '../units.js' {
  interface UnitRegistry {
    MassPerDistance: MassPerDistance;
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
declare module '../rules.js' {
  interface MultiplyRules<L, R> {
    // MassPerDistance<S> * Distance = Mass<S>
    massPerDistanceTimesDistance: L extends MassPerDistance<infer S>
      ? Rule<Distance, Mass<S>>
      : never;
  }
  interface DivideRules<L, R> {
    // Mass<S> / Distance = MassPerDistance<S>
    massDividedByDistance: L extends Mass<infer S>
      ? Rule<Distance, MassPerDistance<S>>
      : never;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

describe('extending the defaults', () => {
  test('a type rule without its runtime rule compiles, then throws', () => {
    // The augmentation above is in scope everywhere, but nothing has registered the runtime half
    // yet. This is point 1: the types and the runtime are maintained separately.
    const rate = root(massPerDistance('Diesel'), 0.0003);
    expect(() => rate.multiply(root(distance(), 1000))).toThrow(UnitError);
  });

  test('consumer units chain into default rules once registered', () => {
    defineMultiply('MassPerDistance', 'Distance', (l) => mass(l.substance));
    defineDivide('Mass', 'Distance', (l) => massPerDistance(l.substance));

    const fuel = root(massPerDistance('Diesel'), 0.0003).multiply(
      root(distance(), 1000),
    );
    expectType<Equal<typeof fuel, Container<Mass<'Diesel'>>>>(true);

    const back = fuel.divide(root(distance(), 1000));
    expectType<Equal<typeof back, Container<MassPerDistance<'Diesel'>>>>(true);
    expect(back.unit).toEqual(massPerDistance('Diesel'));

    const emissions = fuel.multiply(root(massPerMass('CO2e', 'Diesel'), 3.2));
    expectType<Equal<typeof emissions, Container<Mass<'CO2e'>>>>(true);
    expect(emissions.value.toNumber()).toBeCloseTo(0.96);
  });

  test('registering a pair again silently replaces the rule', () => {
    defineMultiply('MassPerMass', 'Mass', () => undefined);
    const gwp = root(massPerMass('CO2e', 'Refrigerant'), 1430);
    // Every container in the process is affected, not just this test's
    expect(() => gwp.multiply(root(mass('Refrigerant'), 1))).toThrow(UnitError);
    defineMultiply('MassPerMass', 'Mass', (l, r) =>
      l.sdenom === r.substance ? mass(l.snum) : undefined,
    );
  });

  test('a runtime rule must agree with the type rules', () => {
    // @ts-expect-error no type rule says Mass * Area gives anything
    defineMultiply('Mass', 'Area', (l) => mass(l.substance));
  });
});
