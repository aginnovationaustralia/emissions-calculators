import { AquacultureFisheryInputSchema } from '@/calculators/Aquaculture/types/aquaculture-fishery.input';
import { WildCatchFisheryInputSchema } from '@/calculators/WildCatchFisheries/types/wild-catch-fishery.input';
import { PurchasedFeedAquacultureTypes } from '@/constants/enums';
import { nv } from '@/tools/inputs';
import {
  HasAquaculturePurchasedFeedInputSchema,
  HasPurchasedFeedInputSchema,
} from './has-purchased-feed.input';

const barleyGrain = {
  type: 'Barley grain',
  region: 'Australia',
  amountTonnes: nv(1),
};
const meatMeal = { type: 'Meat Meal', amountTonnes: nv(1) };
const customEmissionsFactor = {
  amountTonnes: nv(1),
  method2EmissionFactor: nv(0.5),
};

describe.each([
  ['Wild catch fisheries', WildCatchFisheryInputSchema],
  ['Aquaculture', AquacultureFisheryInputSchema],
])('%s purchased feed', (_, fisherySchema) => {
  const purchasedFeedSchema = fisherySchema.shape.purchasedFeed;

  test('uses the aquaculture purchased feed schema', () => {
    expect(purchasedFeedSchema).toBe(
      HasAquaculturePurchasedFeedInputSchema.shape.purchasedFeed,
    );
  });

  test.each(PurchasedFeedAquacultureTypes)('accepts %s', (type) => {
    expect(
      purchasedFeedSchema.safeParse([{ type, amountTonnes: nv(1) }]).success,
    ).toBe(true);
  });

  test('accepts a custom emissions factor (Method 2)', () => {
    expect(purchasedFeedSchema.safeParse([customEmissionsFactor]).success).toBe(
      true,
    );
  });

  test('rejects regional livestock feed', () => {
    expect(purchasedFeedSchema.safeParse([barleyGrain]).success).toBe(false);
  });

  test('rejects regionless livestock feed', () => {
    expect(purchasedFeedSchema.safeParse([meatMeal]).success).toBe(false);
  });
});

describe('livestock purchased feed', () => {
  test('still accepts livestock, aquaculture and Method 2 feed', () => {
    expect(
      HasPurchasedFeedInputSchema.safeParse({
        purchasedFeed: [
          barleyGrain,
          meatMeal,
          { type: 'Squid', amountTonnes: nv(1) },
          customEmissionsFactor,
        ],
      }).success,
    ).toBe(true);
  });
});
