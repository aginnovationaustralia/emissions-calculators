import {
  ContainerOf,
  createUnitSystem,
  multiplyRule,
  divideRule,
  realNumber,
  RealNumber,
  Rule,
  RuleType,
  Substance,
  UnitError,
} from '../index.js';
import { Equal, expectType } from '../test-helpers.js';
import {
  area,
  DefaultContainer,
  defaultUnitSystem,
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
  massPerMassTimesMass,
  massTimesMassPerMass,
  years,
} from './index.js';

const { root, num } = defaultUnitSystem;

describe('default unit system', () => {
  const charge = root(mass('Refrigerant'), 10);
  const gwp = root(massPerMass('CO2e', 'Refrigerant'), 1430);

  test('multiplies with a substance specific result', () => {
    const emissions = gwp.multiply(charge);
    expectType<Equal<typeof emissions, DefaultContainer<Mass<'CO2e'>>>>(true);
    expect(emissions.unit).toEqual(mass('CO2e'));
    expect(emissions.value.toNumber()).toBe(14300);
  });

  test('is commutative where the rules say so', () => {
    const emissions = charge.multiply(gwp);
    expectType<Equal<typeof emissions, DefaultContainer<Mass<'CO2e'>>>>(true);
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
    expectType<Equal<typeof result, DefaultContainer<Mass<'CO2e'>>>>(true);
    expect(result.value.toNumber()).toBeCloseTo(
      100 * 2 * (44 / 28) * 273 * 0.5,
    );
  });

  test('livestock chain', () => {
    const intake = root(massPerHeadPerDay('DryMatter'), 12)
      .multiply(root(head(), 100))
      .multiply(root(days(), 365));
    expectType<Equal<typeof intake, DefaultContainer<Mass<'DryMatter'>>>>(true);
    expect(intake.value.toNumber()).toBe(12 * 100 * 365);
  });

  test('keeps substance generics intact in helpers', () => {
    const toCO2e = <S extends Substance>(
      m: DefaultContainer<Mass<S>>,
      factor: DefaultContainer<MassPerMass<'CO2e', S>>,
    ) => factor.multiply(m);
    const result = toCO2e(charge, gwp);
    expectType<Equal<typeof result, DefaultContainer<Mass<'CO2e'>>>>(true);
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
    expectType<Equal<typeof total, DefaultContainer<Mass<'CO2e'>>>>(true);
    expect(total.value.toNumber()).toBe((14300 * 2 - 1) * 2);

    const ratio = co2e.divide(total);
    expectType<Equal<typeof ratio, DefaultContainer<RealNumber>>>(true);
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
 * Consumer extensions: a substance, a unit and two rules, layered on the defaults.
 */
declare module '../substances.js' {
  interface SubstanceRegistry {
    Diesel: true;
  }
}

type MassPerDistance<S extends Substance = Substance> = {
  __unitType: 'MassPerDistance';
  substance: S;
};
const massPerDistance = <S extends Substance>(
  substance: S,
): MassPerDistance<S> => ({ __unitType: 'MassPerDistance', substance });

interface MassPerDistanceTimesDistance extends RuleType {
  rule: this['L'] extends MassPerDistance<infer S>
    ? Rule<Distance, Mass<S>>
    : never;
}
const massPerDistanceTimesDistance =
  multiplyRule<MassPerDistanceTimesDistance>()(
    'MassPerDistance',
    'Distance',
    (l: MassPerDistance, _r: Distance) => mass(l.substance),
  );

interface MassDividedByDistance extends RuleType {
  rule: this['L'] extends Mass<infer S>
    ? Rule<Distance, MassPerDistance<S>>
    : never;
}
const massDividedByDistance = divideRule<MassDividedByDistance>()(
  'Mass',
  'Distance',
  (l: Mass, _r: Distance) => massPerDistance(l.substance),
);

describe('extending the defaults', () => {
  const units = defaultUnitSystem.extend({
    multiply: [massPerDistanceTimesDistance],
    divide: [massDividedByDistance],
  });
  type Container<U> = ContainerOf<typeof units, U>;

  test('consumer units chain into default rules', () => {
    const fuel = units
      .root(massPerDistance('Diesel'), 0.0003)
      .multiply(units.root(distance(), 1000));
    expectType<Equal<typeof fuel, Container<Mass<'Diesel'>>>>(true);

    const back = fuel.divide(units.root(distance(), 1000));
    expectType<Equal<typeof back, Container<MassPerDistance<'Diesel'>>>>(true);
    expect(back.unit).toEqual(massPerDistance('Diesel'));

    const emissions = fuel.multiply(
      units.root(massPerMass('CO2e', 'Diesel'), 3.2),
    );
    expectType<Equal<typeof emissions, Container<Mass<'CO2e'>>>>(true);
    expect(emissions.value.toNumber()).toBeCloseTo(0.96);
  });

  test('the base system is unchanged', () => {
    const rate = defaultUnitSystem.root(massPerDistance('Diesel'), 1);
    // @ts-expect-error the default system has no MassPerDistance rule
    expect(() => rate.multiply(defaultUnitSystem.root(distance(), 1))).toThrow(
      UnitError,
    );
  });

  test('containers from the base system can be used with the extended one', () => {
    // Safe in both directions: an operation is typechecked against the left container's rules and
    // run with the left container's runtime rules, so the two always agree.
    const fromDefaults = defaultUnitSystem.root(mass('Refrigerant'), 10);
    const gwp = units.root(massPerMass('CO2e', 'Refrigerant'), 1430);
    const emissions = gwp.multiply(fromDefaults);
    expectType<Equal<typeof emissions, Container<Mass<'CO2e'>>>>(true);
    expect(emissions.unit).toEqual(mass('CO2e'));
    expect(fromDefaults.multiply(gwp).unit).toEqual(mass('CO2e'));
  });

  test('a rule for a pair that already has one is rejected', () => {
    expect(() =>
      defaultUnitSystem.extend({ multiply: [massPerMassTimesMass] }),
    ).toThrow(/More than one multiply rule for MassPerMass and Mass/);
  });
});

describe('choosing individual default rules', () => {
  const units = createUnitSystem({ multiply: [massPerMassTimesMass] });

  test('only the chosen rules are available', () => {
    const gwp = units.root(massPerMass('CO2e', 'Refrigerant'), 1430);
    const charge = units.root(mass('Refrigerant'), 10);
    expect(gwp.multiply(charge).unit).toEqual(mass('CO2e'));
    // @ts-expect-error massTimesMassPerMass wasn't chosen
    expect(() => charge.multiply(gwp)).toThrow(UnitError);
    expect(
      createUnitSystem({ multiply: [massTimesMassPerMass] })
        .root(mass('Refrigerant'), 10)
        .multiply(
          createUnitSystem({ multiply: [massTimesMassPerMass] }).root(
            massPerMass('CO2e', 'Refrigerant'),
            1430,
          ),
        ).unit,
    ).toEqual(mass('CO2e'));
  });
});

describe('rule definitions', () => {
  test('a runtime rule must agree with its type', () => {
    interface MassTimesDistance extends RuleType {
      rule: this['L'] extends Mass<infer S>
        ? Rule<Distance, MassPerDistance<S>>
        : never;
    }
    multiplyRule<MassTimesDistance>()(
      'Mass',
      'Distance',
      // @ts-expect-error returns Mass, but the rule type says MassPerDistance
      (l: Mass, _r: Distance) => mass(l.substance),
    );
  });
});
