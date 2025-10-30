import { ExecutionContext } from '../executionContext';
import { PoultryFeed } from '../types/Poultry/feed.input';
import { BroilerGroup } from '../types/Poultry/group.input';
import { ConstantsForPoultryCalculator } from './constants';

const INGREDIENTS = [
  'wheat',
  'barley',
  'sorghum',
  'soybean',
  'millrun',
] as const;

export function feedEmissions(
  feed: PoultryFeed,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const { constants } = context;

  // (Embedded_Emissions_F3)
  const totalIngredients = INGREDIENTS.reduce((acc, ingredient) => {
    return (
      acc +
      constants.POULTRY.FEED_INGREDIENTS_GHG[ingredient] *
        (feed.ingredients[ingredient] ?? 0) *
        feed.feedPurchased
    );
  }, 0);

  // (Embedded_Emissions_F27)

  return (
    totalIngredients +
    feed.additionalIngredient * feed.feedPurchased * feed.emissionIntensity
  );
}

export function calculateScope3PurchasedFeed(
  feeds: PoultryFeed[],
  customFeed: number,
  customFeedEmissionIntensity: number,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  return (
    feeds.reduce((acc, feed) => {
      return acc + feedEmissions(feed, context);
    }, 0) +
    customFeed * customFeedEmissionIntensity
  );
}

export function calculateScope3BroilersPurchasedFeed(
  groups: BroilerGroup[],
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  return groups.reduce((acc, group) => {
    return (
      acc +
      calculateScope3PurchasedFeed(
        group.feed,
        group.customFeedPurchased,
        group.customFeedEmissionIntensity,
        context,
      )
    );
  }, 0);
}
