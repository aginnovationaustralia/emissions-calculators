import {
  ContainerOf,
  createUnitSystem,
  divideRule,
  multiplyRule,
  RealNumber,
  Rule,
  RuleType,
  Substance,
  UnitError,
  values,
  ValueStore,
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
  MassPerHeadPerDay,
  massPerHeadPerDay,
  MassPerMass,
  massPerMass,
  massPerMassTimesMass,
  massTimesMassPerMass,
  relabelMass,
  years,
} from './index.js';

const { root, num } = defaultUnitSystem;
const valueOf = (c: { unit: { store: ValueStore } }) =>
  c.unit.store.value.toNumber();

describe('default unit system', () => {
  const charge = root(mass('Refrigerant', 10));
  const gwp = root(massPerMass('CO2e', 'Refrigerant', 1430));

  test('multiplies with a substance specific result', () => {
    const emissions = gwp.multiply(charge);
    expectType<Equal<typeof emissions, DefaultContainer<Mass<'CO2e'>>>>(true);
    expect(emissions.unit).toMatchObject({
      __unitType: 'Mass',
      substance: 'CO2e',
    });
    expect(valueOf(emissions)).toBe(14300);
  });

  test('is commutative where the rules say so', () => {
    const emissions = charge.multiply(gwp);
    expectType<Equal<typeof emissions, DefaultContainer<Mass<'CO2e'>>>>(true);
    expect(valueOf(emissions)).toBe(14300);
  });

  test('chains', () => {
    const result = root(massPerArea('N', 0.01))
      .divide(root(years(1)))
      .multiply(root(area(10_000)))
      .multiply(root(years(2)))
      .multiply(root(massPerMass('N2O', 'N', 44 / 28)))
      .multiply(root(massPerMass('CO2e', 'N2O', 273)))
      .multiply(num(0.5));
    expectType<Equal<typeof result, DefaultContainer<Mass<'CO2e'>>>>(true);
    expect(valueOf(result)).toBeCloseTo(100 * 2 * (44 / 28) * 273 * 0.5);
  });

  test('livestock chain', () => {
    const intake = root(massPerHeadPerDay('DryMatter', 12))
      .multiply(root(head(100)))
      .multiply(root(days(365)));
    expectType<Equal<typeof intake, DefaultContainer<Mass<'DryMatter'>>>>(true);
    expect(valueOf(intake)).toBe(12 * 100 * 365);
  });

  test('keeps substance generics intact in helpers', () => {
    const toCO2e = <S extends Substance>(
      m: DefaultContainer<Mass<S>>,
      factor: DefaultContainer<MassPerMass<'CO2e', S>>,
    ) => factor.multiply(m);
    const result = toCO2e(charge, gwp);
    expectType<Equal<typeof result, DefaultContainer<Mass<'CO2e'>>>>(true);
    expect(result.unit.substance).toBe('CO2e');
  });

  test('rejects combinations no rule allows', () => {
    const fuel = root(mass('Fuel', 3));
    const co2e = gwp.multiply(charge);
    // @ts-expect-error Mass<'Fuel'> is not Mass<'Refrigerant'>
    expect(() => gwp.multiply(fuel)).toThrow(UnitError);
    // @ts-expect-error Area * Days has no rule
    expect(() => root(area(1)).multiply(root(days(1)))).toThrow(UnitError);
    // @ts-expect-error can't add CO2e to Refrigerant
    expect(() => co2e.plus(charge)).toThrow(UnitError);
    // @ts-expect-error Mass<'CO2e'> / Mass<'Refrigerant'> is not dimensionless
    expect(() => co2e.divide(charge)).toThrow(UnitError);
  });

  test('checks substances at runtime past a cast', () => {
    const widened = root(mass('Fuel' as Substance, 3));
    // @ts-expect-error Mass<Substance> might not be Mass<'Refrigerant'>
    expect(() => gwp.multiply(widened)).toThrow(UnitError);
  });

  test('plus, minus, scaling and same unit division', () => {
    const co2e = gwp.multiply(charge);
    const total = co2e.plus(co2e).minus(num(1)).multiply(num(2));
    expectType<Equal<typeof total, DefaultContainer<Mass<'CO2e'>>>>(true);
    expect(valueOf(total)).toBe((14300 * 2 - 1) * 2);

    const ratio = co2e.divide(total);
    expectType<Equal<typeof ratio, DefaultContainer<RealNumber>>>(true);
    expect(ratio.unit.__unitType).toBe('RealNumber');
  });

  test('power, squared, min and max', () => {
    const x = root(mass('CO2', 3));
    const cubed = x.power(num(3));
    expectType<Equal<typeof cubed, DefaultContainer<RealNumber>>>(true);
    expect(valueOf(cubed)).toBe(27);

    const squared = x.squared();
    expectType<Equal<typeof squared, DefaultContainer<Mass<'CO2'>>>>(true);
    expect(valueOf(squared)).toBe(9);

    expect(valueOf(x.min(num(2)))).toBe(2);
    expect(valueOf(x.min(root(mass('CO2', 5))))).toBe(3);
    expect(valueOf(x.max(num(5)))).toBe(5);
    // @ts-expect-error limited by a different unit
    x.min(root(mass('CH4', 1)));
  });

  test('switchUnit relabels a value without a rule', () => {
    const relabelled = num(4)
      .squared()
      .switchUnit((u) => massPerHeadPerDay('DryMatter', u.store));
    expectType<
      Equal<typeof relabelled, DefaultContainer<MassPerHeadPerDay<'DryMatter'>>>
    >(true);
    expect(valueOf(relabelled)).toBe(16);
    expect(relabelled.origin.kind).toBe('binary');
  });

  test('relabelMass keeps the value and records the translation', () => {
    const milk = root(mass('Milk', 5));
    const asLiveweight = relabelMass(milk, 'Liveweight');
    expectType<
      Equal<typeof asLiveweight, DefaultContainer<Mass<'Liveweight'>>>
    >(true);
    expect(valueOf(asLiveweight)).toBe(5);
    expect(asLiveweight.origin).toEqual({ kind: 'translation', from: milk });
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
  store: ValueStore;
};
const massPerDistance = <S extends Substance>(
  substance: S,
  initialValue?: number,
): MassPerDistance<S> => ({
  __unitType: 'MassPerDistance',
  substance,
  store: values(initialValue),
});

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
      .root(massPerDistance('Diesel', 0.0003))
      .multiply(units.root(distance(1000)));
    expectType<Equal<typeof fuel, Container<Mass<'Diesel'>>>>(true);

    const back = fuel.divide(units.root(distance(1000)));
    expectType<Equal<typeof back, Container<MassPerDistance<'Diesel'>>>>(true);
    expect(back.unit).toMatchObject({
      __unitType: 'MassPerDistance',
      substance: 'Diesel',
    });

    const emissions = fuel.multiply(
      units.root(massPerMass('CO2e', 'Diesel', 3.2)),
    );
    expectType<Equal<typeof emissions, Container<Mass<'CO2e'>>>>(true);
    expect(valueOf(emissions)).toBeCloseTo(0.96);
  });

  test('the base system is unchanged', () => {
    const rate = defaultUnitSystem.root(massPerDistance('Diesel', 1));
    // @ts-expect-error the default system has no MassPerDistance rule
    expect(() => rate.multiply(defaultUnitSystem.root(distance(1)))).toThrow(
      UnitError,
    );
  });

  test('containers from the base system can be used with the extended one', () => {
    // Safe in both directions: an operation is typechecked against the left container's rules and
    // run with the left container's runtime rules, so the two always agree.
    const fromDefaults = defaultUnitSystem.root(mass('Refrigerant', 10));
    const gwp = units.root(massPerMass('CO2e', 'Refrigerant', 1430));
    const emissions = gwp.multiply(fromDefaults);
    expectType<Equal<typeof emissions, Container<Mass<'CO2e'>>>>(true);
    expect(emissions.unit.substance).toBe('CO2e');
    expect(fromDefaults.multiply(gwp).unit.substance).toBe('CO2e');
  });

  test('a rule for a pair that already has one is rejected', () => {
    expect(() =>
      defaultUnitSystem.extend({ multiply: [massPerMassTimesMass] }),
    ).toThrow(/More than one multiply rule for MassPerMass and Mass/);
  });
});

describe('choosing individual default rules', () => {
  test('only the chosen rules are available', () => {
    const units = createUnitSystem({ multiply: [massPerMassTimesMass] });
    const gwp = units.root(massPerMass('CO2e', 'Refrigerant', 1430));
    const charge = units.root(mass('Refrigerant', 10));
    expect(gwp.multiply(charge).unit.substance).toBe('CO2e');
    // @ts-expect-error massTimesMassPerMass wasn't chosen
    expect(() => charge.multiply(gwp)).toThrow(UnitError);

    const other = createUnitSystem({ multiply: [massTimesMassPerMass] });
    const reversed = other
      .root(mass('Refrigerant', 10))
      .multiply(other.root(massPerMass('CO2e', 'Refrigerant', 1430)));
    expect(reversed.unit.substance).toBe('CO2e');
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
