import { testContext } from '@/test/Grains/context';
import { nv } from '@/tools/inputs';
import { calculateScope3Fertiliser } from '../scope3/15.4-fertiliser/calculate';
import {
  HasFertiliserInput,
  HasFertiliserInputSchema,
} from '../scope1/5-fertiliser/fertiliser.input';
import { InorganicFertiliserInput } from '../scope1/5-fertiliser/inorganic-fertiliser.input';

const urea = (calculationMethodScope3: '1' | '2'): InorganicFertiliserInput =>
  calculationMethodScope3 === '1'
    ? {
        calculationMethodScope3,
        fertiliserType: 'Urea',
        massAppliedKg: nv(1000),
        massPurchasedKg: nv(1000),
      }
    : {
        calculationMethodScope3,
        fertiliserType: 'Urea',
        massAppliedKg: nv(1000),
        massPurchasedKg: nv(1000),
        customScope3EmissionFactor: nv(0.5),
      };

const otherFertiliser: InorganicFertiliserInput = {
  calculationMethodScope3: '2',
  fertiliserType: 'Other Fertilisers',
  massAppliedKg: nv(1000),
  massPurchasedKg: nv(1000),
  customScope3EmissionFactor: nv(0.5),
  customNitrogenFraction: nv(0.3),
  customUreaFraction: nv(0.2),
};

const calculate = (applications: InorganicFertiliserInput[]) =>
  calculateScope3Fertiliser(
    HasFertiliserInputSchema.parse({
      fertiliser: {
        productionSystem: 'Irrigated crop',
        inorganic: { calculationMethodScope1: '1', applications },
        organic: { applications: [] },
      },
    } satisfies HasFertiliserInput),
    testContext(),
  ).unit.store;

describe('15.4.1 Purchased fertiliser with supplier emission factors', () => {
  it('keeps a method 1 value for a known fertiliser type reported via method 2', () => {
    const store = calculate([urea('2')]);

    expect(store.valueMethod1?.toNumber()).toEqual(1500);
    expect(store.valueMethod2?.toNumber()).toEqual(500);
  });

  it('keeps the method 1 total complete when method 1 and method 2 applications are mixed', () => {
    const allMethod1 = calculate([urea('1'), urea('1')]);
    const mixed = calculate([urea('1'), urea('2')]);

    expect(mixed.valueMethod1?.toNumber()).toEqual(
      allMethod1.valueMethod1?.toNumber(),
    );
    expect(mixed.valueMethod2?.toNumber()).toEqual(2000);
  });

  it('has no method 1 value for Other Fertilisers, which have no default emission factor', () => {
    const store = calculate([otherFertiliser]);

    expect(store.valueMethod1).toBeUndefined();
    expect(store.valueMethod2?.toNumber()).toEqual(500);
  });
});
