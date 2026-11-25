import { ExecutionContext } from '@/calculators/executionContext';
import { extendedRegionToState } from '@/constants/translations';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { captureMethod1Or2Value } from '@/tools/multi';
import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { selectSwitch } from '@/tools/switch';
import { Liveweight, MassPerMass, voidUnit } from '@/tools/units';
import { emissionFactorIsMethod2, liveweightIsMethod2 } from './base.input';
import {
  HasPurchasedLivestockInputTransformed,
  PurchasedLivestockInputTransformed,
} from './input';

type ConstantsForPurchasedLivestock = HasConstants<
  | 'COMMON'
  | 'LIVESTOCK'
  | 'POULTRY'
  | 'BEEF_PASTURE'
  | 'DAIRY'
  | 'PIGS'
  | 'SHEEP'
>;

function getEmissionsFactorForOtherLivestock(
  purchase: Extract<
    PurchasedLivestockInputTransformed,
    { type: 'Other'; livestockType: unknown }
  >,
  constants: ConstantsForPurchasedLivestock,
) {
  const averageBeefEF = selectConstant(
    constants.LIVESTOCK,
    'PURCHASED_EF',
    'beefAverage',
  );

  const averageSheepEF = selectConstant(
    constants.LIVESTOCK,
    'PURCHASED_EF',
    'sheepAverage',
  );
  const scalingFactor = selectConstant(
    constants.LIVESTOCK,
    'OTHER_LIVESTOCK_EF_PROPORTION',
    purchase.livestockType,
  ).named('Scaling factor');

  return selectSwitch(purchase.livestockType, {
    'Emus/ostriches': scalingFactor.multiply(averageSheepEF),
    'Mules/asses': scalingFactor.multiply(averageBeefEF),
    Alpacas: scalingFactor.multiply(averageSheepEF),
    Buffalo: scalingFactor.multiply(averageBeefEF),
    Camels: scalingFactor.multiply(averageBeefEF),
    Deer: scalingFactor.multiply(averageSheepEF),
    Goats: scalingFactor.multiply(averageSheepEF),
    Horses: scalingFactor.multiply(averageBeefEF),
  });
}

/**
 * Beef emission factors are state-specific. The origin state comes from `region` when the purchase
 * uses method 1 liveweight, and from `state` when it supplies its own liveweight.
 */
function getEmissionsFactorForBeef(
  purchase: Extract<
    PurchasedLivestockInputTransformed,
    { type: 'Beef'; category: unknown }
  >,
  constants: ConstantsForPurchasedLivestock,
) {
  const state =
    'region' in purchase
      ? extendedRegionToState(purchase.region)
      : purchase.state;
  return selectConstant(
    constants.LIVESTOCK,
    'PURCHASED_EF_BY_STATE',
    state,
    purchase.category,
  );
}

/** Prime lamb vs mutton, derived from `class` - see `purchased-sheep.input.ts`. */
const sheepPurchaseCategoryFromClass = (
  purchase: Extract<
    PurchasedLivestockInputTransformed,
    { type: 'Sheep'; class: unknown }
  >,
) =>
  purchase.class.unit === 'lambsHoggets' ? 'sheepPrimeLamb' : 'sheepMutton';

/** Sheep emission factors are state-specific, looked up from the origin state. */
function getEmissionsFactorForSheep(
  purchase: Extract<
    PurchasedLivestockInputTransformed,
    { type: 'Sheep'; class: unknown }
  >,
  constants: ConstantsForPurchasedLivestock,
) {
  return selectConstant(
    constants.LIVESTOCK,
    'PURCHASED_EF_BY_STATE',
    purchase.state,
    sheepPurchaseCategoryFromClass(purchase),
  );
}

/**
 * Every livestock type has its own independent method 1 / method 2 split for
 * emission factor and liveweight (see `purchased-beef.input.ts` for the
 * shared pattern). `emissionFactorIsMethod2` is generic over which type's
 * union it's narrowing, so checking it once up front - before the
 * type-specific switch below - covers all six types' method 2 override in
 * one place, rather than needing a per-type wrapper function.
 */
function getEmissionFactor(
  purchase: PurchasedLivestockInputTransformed,
  constants: ConstantsForPurchasedLivestock,
): Container<MassPerMass<'CO2e', 'Liveweight'>> {
  if (emissionFactorIsMethod2(purchase)) {
    return captureMethod1Or2Value(voidUnit(), purchase.method2EmissionFactor);
  }

  switch (purchase.type) {
    case 'Beef':
      return captureMethod1Or2Value(
        getEmissionsFactorForBeef(purchase, constants),
        undefined,
      );

    case 'Dairy':
    case 'Pig':
      return captureMethod1Or2Value(
        selectConstant(constants.LIVESTOCK, 'PURCHASED_EF', purchase.category),
        undefined,
      );

    case 'Other':
      return captureMethod1Or2Value(
        getEmissionsFactorForOtherLivestock(purchase, constants),
        undefined,
      );

    case 'Poultry':
      return captureMethod1Or2Value(
        selectConstant(constants.POULTRY, 'PURCHASED_LIVESTOCK_EF'),
        undefined,
      );

    case 'Sheep':
      return captureMethod1Or2Value(
        getEmissionsFactorForSheep(purchase, constants),
        undefined,
      );
  }
}

/** See `getEmissionFactor` - same "check the method 2 guard once, then switch" shape. */
function getLiveweight(
  purchase: PurchasedLivestockInputTransformed,
  constants: ConstantsForPurchasedLivestock,
): Container<Liveweight> {
  if (liveweightIsMethod2(purchase)) {
    return captureMethod1Or2Value(
      voidUnit(),
      purchase.method2LiveweightKilograms,
    );
  }

  switch (purchase.type) {
    case 'Beef':
      return captureMethod1Or2Value(
        selectConstant(
          constants.BEEF_PASTURE,
          'LIVEWEIGHT',
          purchase.region,
          purchase.class,
          purchase.season,
          'liveweight',
        ),
        undefined,
      );

    case 'Dairy':
      return captureMethod1Or2Value(
        selectConstant(
          constants.DAIRY,
          'LIVEWEIGHTS_BY_BREED',
          purchase.breed,
          purchase.class,
        ),
        undefined,
      );

    case 'Other':
      return captureMethod1Or2Value(
        'productivitySystem' in purchase
          ? selectConstant(
              constants.LIVESTOCK,
              'AVERAGE_LIVEWEIGHT_GOATS',
              purchase.productivitySystem,
            )
          : selectConstant(
              constants.LIVESTOCK,
              'OTHER_PURCHASED_LIVESTOCK_AVERAGE_LIVEWEIGHTS',
              purchase.livestockType,
            ),
        undefined,
      );

    case 'Pig':
      return captureMethod1Or2Value(
        selectConstant(constants.PIGS, 'LIVEWEIGHT', purchase.weightClass),
        undefined,
      );

    case 'Poultry':
      return captureMethod1Or2Value(
        selectConstant(constants.POULTRY, 'LIVEWEIGHT', purchase.weightClass),
        undefined,
      );

    case 'Sheep':
      return captureMethod1Or2Value(
        selectConstant(
          constants.SHEEP,
          'SEASONAL_FACTORS',
          purchase.state,
          purchase.class,
          purchase.season,
          'liveweight',
        ),
        undefined,
      );
  }
}

/** A purchase's livestock type and, where it has one, its class, for naming its intermediate. */
const purchaseLabel = (
  purchase: PurchasedLivestockInputTransformed,
): string => {
  const livestockClass =
    'class' in purchase && purchase.class !== undefined
      ? purchase.class.unit
      : undefined;
  return typeof livestockClass === 'string'
    ? `${purchase.type}, ${livestockClass}`
    : purchase.type;
};

export const calculatePurchasedLivestockEmissions = (
  activity: HasPurchasedLivestockInputTransformed,
  context: ExecutionContext<ConstantsForPurchasedLivestock>,
) => {
  const { constants } = context;

  /*
  E = (Nco * Wco * EFco) * 10^-3
  Nco = number of animals purchased in livestock type c from origin o (head)
  Wco = average liveweight of purchased livestock at point of purchase (kg/head)
  EFco = emission factor per livestock type and origin (kg CO2e/kg)
  */

  const purchaseEmissions = activity.purchasedLivestock.map((p) => {
    const liveweight = getLiveweight(p, constants).named('Wco');

    const emissionsFactor = getEmissionFactor(p, constants).named('EFco');

    // Each purchase's emissions are reported as an intermediate named by livestock type and class (e.g.
    // 'E (Dairy, milkingCows)'), summed over the purchases of that class
    return emissionsFactor
      .multiply(p.headPurchased.multiply(liveweight))
      .reference('15.1.1.1 (1)')
      .attach({ intermediate: true, name: `E (${purchaseLabel(p)})` });
  });
  return sum(purchaseEmissions, zeroCO2e).named('E');
};
