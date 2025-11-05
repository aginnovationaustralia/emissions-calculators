import { ExecutionContext } from '../executionContext';
import { Feed } from '../types/Pork/feed.input';
import { ConstantsForPorkCalculator } from './constants';

export function calculateScope3PurchasedFeed(
  feeds: Feed[],
  context: ExecutionContext<ConstantsForPorkCalculator>,
) {
  const { constants } = context;

  const totalGHG = feeds.reduce((accTotal, feed) => {
    const totalGHGWithoutOther = Object.keys(feed.ingredients).reduce(
      (acc, key) => {
        const ingredientKey = key as keyof Feed['ingredients'];

        return (
          acc +
          (feed.ingredients[ingredientKey] ?? 0) *
            feed.feedPurchased *
            (constants.PORK.FEED_INGREDIENT_EF[ingredientKey] ?? 0)
        );
      },
      0,
    );

    const totalGHGIngredient =
      totalGHGWithoutOther +
      feed.additionalIngredients * feed.feedPurchased * feed.emissionsIntensity;

    // (embeddedEmissionsF10)
    return accTotal + totalGHGIngredient;
  }, 0);

  return totalGHG;
}
