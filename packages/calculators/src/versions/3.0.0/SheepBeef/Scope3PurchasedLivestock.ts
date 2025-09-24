import {
  SHEEP_CLASSES_BREEDING_API,
  SHEEP_CLASSES_TRADING_API,
} from '../constants/constants';
import { ExecutionContext } from '../executionContext';
import { BeefPurchase } from '../types/Beef/beefpurchase.input';
import { LivestockSourceLocation } from '../types/livestock';
import { BeefClassesAPI, SheepClassesAPI } from '../types/types';

/**
 *
 * @param headPurchased Number of head purchased
 * @param purchasedWeight Purchased liveweight (dataInputSheepD36)
 * @param source
 */
function purchasedBeefLivestock(
  headPurchased: number,
  purchasedWeight: number,
  source: LivestockSourceLocation,
  context: ExecutionContext,
) {
  // (purchasedLivestockEmissionsB17)
  const emissionFactor =
    context.constants.LIVESTOCK_SOURCE_EMISSIONFACTOR[source];
  const liveweight = headPurchased * purchasedWeight;

  // (purchasedLivestockEmissionsB18)
  const scope3Kg = liveweight * emissionFactor;

  // (Scope 3 Emissions tonnes CO2-e)
  const scope3KgTonnes = scope3Kg / 1000;

  return scope3KgTonnes;
}

// done once for each ram, wethers, etc
export function calculatePurchasedBeefEmissions(
  beef: {
    [type in (typeof BeefClassesAPI)[number]]: BeefPurchase[];
  },
  context: ExecutionContext,
) {
  const beefScope3Total = Object.keys(beef).reduce((acc, type) => {
    const b = beef[type as (typeof BeefClassesAPI)[number]];

    const totalPurchasedEmissions = b.reduce((accB, p) => {
      return (
        accB +
        purchasedBeefLivestock(
          p.head,
          p.purchaseWeight,
          p.purchaseSource,
          context,
        )
      );
    }, 0);

    return acc + totalPurchasedEmissions;
  }, 0);

  return beefScope3Total;
}

// done once for each ram, wethers, etc
export function calculatePurchasedSheepEmissions(
  sheep: {
    [type in (typeof SheepClassesAPI)[number]]: {
      head: number;
      purchaseWeight: number;
    }[];
  },
  sheepMerinoPercent: number,
  context: ExecutionContext,
) {
  const sheepCrossBredPercent = 100 - sheepMerinoPercent; // (dataInputSheepE39)

  const sheepLiveweight: {
    [type in (typeof SheepClassesAPI)[number]]: number;
  } = SheepClassesAPI.reduce(
    (acc, type) => {
      const cls = sheep[type];

      const totalLiveweight = cls.reduce((accC, curC) => {
        return accC + curC.head * curC.purchaseWeight;
      }, 0);

      return {
        ...acc,
        [type]: totalLiveweight,
      };
    },
    {} as { [type in (typeof SheepClassesAPI)[number]]: number },
  );

  // (dataInputSheepN36)
  const purchasedBreedingHerd = Object.keys(sheepLiveweight)
    .filter((sc) =>
      SHEEP_CLASSES_BREEDING_API.includes(
        sc as (typeof SheepClassesAPI)[number],
      ),
    )
    .reduce(
      (acc, sc) =>
        acc + sheepLiveweight[sc as (typeof SheepClassesAPI)[number]],
      0,
    );

  const purchasedTradeSheep = Object.keys(sheepLiveweight)
    .filter((sc) =>
      SHEEP_CLASSES_TRADING_API.includes(
        sc as (typeof SheepClassesAPI)[number],
      ),
    )
    .reduce(
      (acc, sc) =>
        acc + sheepLiveweight[sc as (typeof SheepClassesAPI)[number]],
      0,
    );

  const { constants } = context;

  // (purchasedLivestockEmissionsD23)
  const merinoTotalLiveweight =
    (sheepMerinoPercent / 100) * (purchasedBreedingHerd + purchasedTradeSheep);
  // (purchasedLivestockEmissionsF23)
  const merinoScope3Kg =
    merinoTotalLiveweight * constants.SHEEP_EMISSIONFACTOR.MERINO;
  const merinoScope3Tonnes = merinoScope3Kg / 1000;
  // (purchasedLivestockEmissionsD24)
  const crossbredTotalLiveweight =
    (sheepCrossBredPercent / 100) *
    (purchasedBreedingHerd + purchasedTradeSheep);
  const crossbredScope3Kg =
    crossbredTotalLiveweight * constants.SHEEP_EMISSIONFACTOR.CROSSBRED;
  const crossbredScope3Tonnes = crossbredScope3Kg / 1000;
  const sheepTotalScope3Tonnes = merinoScope3Tonnes + crossbredScope3Tonnes;

  return sheepTotalScope3Tonnes;
}
