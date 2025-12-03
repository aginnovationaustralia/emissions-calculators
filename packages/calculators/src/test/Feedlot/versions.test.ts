import { calculateEntireFeedlot } from '@/calculators/Feedlot/calculator';
import { validateCalculatorInput } from '@/calculators/validate';
import { FeedlotInputSchema } from '@/types/Feedlot/input';
import { testContext } from '../common/context';
import { feedlotTestData } from './feedlot.data';

const P = 7;

describe('checking Feedlot purchases transformation to array', () => {
  const feedlot = feedlotTestData.feedlots[0];
  const feedlotDataWithPurchase = {
    ...feedlotTestData,
    feedlots: [
      {
        ...feedlot,
        purchases: {
          ...feedlot.purchases,
          bullsGt1: feedlot.purchases.bullsGt1!.slice(0, 1),
        },
      },
    ],
  };

  const validatedInput = validateCalculatorInput(
    FeedlotInputSchema,
    feedlotDataWithPurchase,
  );

  if (!validatedInput.valid) {
    throw validatedInput.error;
  }

  const context = testContext('Feedlot');
  const emissions = calculateEntireFeedlot(validatedInput.result, context);

  test('scope 3 purchaseLivestock should be accurate', () => {
    expect(emissions.scope3.purchaseLivestock).toBeCloseTo(2201.1, P);
  });
});
