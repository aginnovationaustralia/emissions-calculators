import { InorganicFertiliserType } from '@/constants/enums';
import { testContext } from '@/test/Grains/context';
import { nv } from '@/tools/inputs';
import { calculateScope3Fertiliser } from '../scope3/15.4-fertiliser/calculate';
import {
  HasFertiliserInput,
  HasFertiliserInputSchema,
} from '../scope1/5-fertiliser/fertiliser.input';

const scope3For = (fertiliserType: InorganicFertiliserType) =>
  calculateScope3Fertiliser(
    HasFertiliserInputSchema.parse({
      fertiliser: {
        productionSystem: 'Irrigated crop',
        inorganic: {
          calculationMethodScope1: '1',
          applications: [
            {
              calculationMethodScope3: '1',
              fertiliserType,
              massAppliedKg: nv(1000),
              massPurchasedKg: nv(1000),
            },
          ],
        },
        organic: { applications: [] },
      },
    } satisfies HasFertiliserInput),
    testContext(),
  ).unit.store.value.toNumber();

describe('Ammonium Sulfate fertiliser type', () => {
  it('matches Sulphate of Ammonia (SOA), which is the same product', () => {
    expect(scope3For('Ammonium Sulfate')).toEqual(
      scope3For('Sulphate of Ammonia (SOA)'),
    );
  });

  it('uses the same constants as Sulphate of Ammonia (SOA)', () => {
    const { INORGANIC_FERTILISER_FRACTIONS } = testContext().constants.CROP;

    expect(INORGANIC_FERTILISER_FRACTIONS['Ammonium Sulfate']).toBe(
      INORGANIC_FERTILISER_FRACTIONS['Sulphate of Ammonia (SOA)'],
    );
  });
});
