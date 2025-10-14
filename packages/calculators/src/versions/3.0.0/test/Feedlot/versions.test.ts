import { validateCalculatorInput } from '../../calculators';
import { calculateEntireFeedlot } from '../../Feedlot/calculator';
import { FeedlotInputSchema } from '../../types/Feedlot/input';
import { testContext, V2_0_0 } from '../common/context';
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
  const context = testContext(V2_0_0, 'Feedlot');
  const emissions = calculateEntireFeedlot(validatedInput, context);

  test('scope 3 purchaseLivestock should be accurate', () => {
    expect(emissions.scope3.purchaseLivestock).toBeCloseTo(2201.1, P);
  });
});
