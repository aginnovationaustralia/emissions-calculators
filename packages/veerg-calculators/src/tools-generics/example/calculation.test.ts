import { Container, Mass, mass, massPerMass, RealNumber, root } from '..';
import { calculateFarmEmissions } from './calculation';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
const expectType = <T extends true>(_: T) => _;

describe('example calculation', () => {
  const result = calculateFarmEmissions({
    freightKm: 200,
    fertilisedHectares: 50,
    nitrogenKgPerHa: 100,
    herdSize: 100,
    dryMatterKgPerHeadPerDay: 12,
    methaneReductionPercent: 10,
  });

  test('infers specific units for every output', () => {
    expectType<Equal<typeof result.freight, Container<Mass<'CO2e'>>>>(true);
    expectType<Equal<typeof result.fertiliser, Container<Mass<'CO2e'>>>>(true);
    expectType<Equal<typeof result.enteric, Container<Mass<'CO2e'>>>>(true);
    expectType<Equal<typeof result.total, Container<Mass<'CO2e'>>>>(true);
    expectType<Equal<typeof result.entericShare, Container<RealNumber>>>(true);
    expect(result.total.unit).toEqual(mass('CO2e'));
  });

  test('computes values', () => {
    // 200 km * 0.25 kg/km * 3.2
    expect(result.freight.value.toNumber()).toBeCloseTo(160);
    // 50 ha * 100 kg N/ha * 0.01 * 44/28 * 273
    expect(result.fertiliser.value.toNumber()).toBeCloseTo(
      5000 * 0.01 * (44 / 28) * 273,
    );
    // 100 head * 12 kg/day * 365 days * 0.0207 * 0.9 * 28
    expect(result.enteric.value.toNumber()).toBeCloseTo(
      100 * 12 * 365 * 0.0207 * 0.9 * 28,
    );
    expect(result.total.value.toNumber()).toBeCloseTo(
      result.freight.value
        .plus(result.fertiliser.value)
        .plus(result.enteric.value)
        .toNumber(),
    );
  });

  test('keeps provenance for reporting', () => {
    expect(result.total.meta.name).toBe('Total farm emissions');
    expect(result.freight.meta.references).toEqual(['Example 1.1']);
  });

  test('typical mistakes do not compile', () => {
    const methane = root(mass('CH4'), 1);
    const nitrousOxide = root(mass('N2O'), 1);
    const gwpN2O = root(massPerMass('CO2e', 'N2O'), 273);

    // @ts-expect-error adding CH4 to a CO2e total
    expect(() => result.total.plus(methane)).toThrow();
    // @ts-expect-error applying the N2O GWP to methane
    expect(() => methane.multiply(gwpN2O)).toThrow();
    // @ts-expect-error intensity CO2e / CH4 has no rule
    expect(() => result.total.divide(methane)).toThrow();

    expect(nitrousOxide.multiply(gwpN2O).unit).toEqual(mass('CO2e'));
  });
});
