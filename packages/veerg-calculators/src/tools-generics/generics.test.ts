import {
  area,
  Container,
  days,
  distance,
  head,
  Mass,
  mass,
  massPerArea,
  massPerHeadPerDay,
  MassPerMass,
  massPerMass,
  num,
  root,
  Substance,
  UnitError,
  years,
} from '.';
import { massPerDistance, MassPerDistance } from './example/consumer-units';

// Compile-time assertions. ts-jest typechecks this file, so a wrong type fails the suite.
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
const expectType = <T extends true>(_: T) => _;
const unitOf = <U>(c: Container<U>) => c.unit;

describe('tools-generics', () => {
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
    expect(emissions.unit).toEqual(mass('CO2e'));
  });

  test('chains', () => {
    // kg N / ha / yr * ha * yr * (kg N2O / kg N) * (kg CO2e / kg N2O)
    const rate = root(massPerArea('N'), 0.01).divide(root(years(), 1));
    const result = rate
      .multiply(root(area(), 10_000))
      .multiply(root(years(), 2))
      .multiply(root(massPerMass('N2O', 'N'), 44 / 28))
      .multiply(root(massPerMass('CO2e', 'N2O'), 273))
      .multiply(num(0.5));
    expectType<Equal<typeof result, Container<Mass<'CO2e'>>>>(true);
    expect(result.unit).toEqual(mass('CO2e'));
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

  test('checks substances at runtime when the types are widened', () => {
    // e.g. a substance that came from user input. The compiler rejects Mass<Substance> here, so this
    // only happens past a cast, which the runtime rule still catches.
    const widened = root(mass('Fuel' as Substance), 3);
    // @ts-expect-error Mass<Substance> might not be Mass<'Refrigerant'>
    expect(() => gwp.multiply(widened)).toThrow(UnitError);
  });

  test('plus, minus and RealNumber scaling keep the unit', () => {
    const co2e = gwp.multiply(charge);
    const total = co2e.plus(co2e).minus(num(1)).multiply(num(2));
    expectType<Equal<typeof total, Container<Mass<'CO2e'>>>>(true);
    expect(total.value.toNumber()).toBe((14300 * 2 - 1) * 2);
  });

  test('same unit division is dimensionless', () => {
    const ratio = charge.divide(charge);
    expect(unitOf(ratio)).toEqual({ __unitType: 'RealNumber' });
  });

  test('consumer defined substances, units and rules', () => {
    const burn = root(massPerDistance('Diesel'), 0.0003);
    const fuel = burn.multiply(root(distance(), 1000));
    expectType<Equal<typeof fuel, Container<Mass<'Diesel'>>>>(true);
    expect(fuel.unit).toEqual(mass('Diesel'));

    const back = fuel.divide(root(distance(), 1000));
    expectType<Equal<typeof back, Container<MassPerDistance<'Diesel'>>>>(true);
    expect(back.unit).toEqual(massPerDistance('Diesel'));

    // Consumer units chain into default rules
    const emissions = fuel.multiply(root(massPerMass('CO2e', 'Diesel'), 3.2));
    expectType<Equal<typeof emissions, Container<Mass<'CO2e'>>>>(true);
    expect(emissions.value.toNumber()).toBeCloseTo(0.96);
  });

  test('records provenance', () => {
    const emissions = gwp.multiply(charge, { name: 'Refrigerant emissions' });
    expect(emissions.meta.name).toBe('Refrigerant emissions');
    expect(emissions.origin).toMatchObject({
      kind: 'binary',
      operation: 'multiply',
      left: gwp,
      right: charge,
    });
  });
});
