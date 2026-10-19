import {
  ActivityInput,
  ActivityInputTransformed,
} from '@/calculators/types/activity.input';
import { LivestockActivityInputSchema } from '@/calculators/types/livestock-activity.input';
import { State, StateOrRegion } from '@/constants/enums';
import { stateOrRegionToState } from '@/constants/translations';
import {
  HasFertiliserInput,
  HasFertiliserInputSchema,
  HasFertiliserInputTransformed,
} from '@/modules/scope1/5-fertiliser/fertiliser.input';
import {
  HasLimeInput,
  HasLimeInputSchema,
  HasLimeInputTransformed,
} from '@/modules/scope1/5-fertiliser/lime.input';
import {
  HasPastureResidueInput,
  HasPastureResidueInputSchema,
  HasPastureResidueInputTransformed,
} from '@/modules/scope1/6-residue-mgmt/crop-residue.input';
import {
  HasFuelInput,
  hasFuelInputSchema,
  HasFuelInputTransformed,
} from '@/modules/scope1/8-fuel-use';
import {
  BeefManureAndEntericHerdInput,
  BeefManureAndEntericHerdInputTransformed,
  BeefManureAndEntericSharedFieldsSchema,
} from '@/modules/scope1/shared/beef/input';
import {
  HasSolidWasteInput,
  HasSolidWasteInputSchema,
  HasSolidWasteInputTransformed,
} from '@/modules/scope1/shared/solid-waste/input';
import {
  HasBeefPurchasedLivestockInput,
  HasBeefPurchasedLivestockInputSchema,
  HasBeefPurchasedLivestockInputTransformed,
} from '@/modules/scope3/15.1-purchased-livestock/input';
import {
  HasPurchasedFeedInput,
  HasPurchasedFeedInputSchema,
  HasPurchasedFeedInputTransformed,
} from '@/modules/scope3/15.2-purchased-feed/has-purchased-feed.input';
import {
  PurchasedMineralSupplementsInput,
  PurchasedMineralSupplementsInputSchema,
  PurchasedMineralSupplementsInputTransformed,
} from '@/modules/scope3/15.3-purchased-mineral-supplements/purchased-mineral-supplements.input';
import {
  AgrichemicalsInput,
  AgrichemicalsInputSchema,
  AgrichemicalsInputTransformed,
} from '@/modules/scope3/15.5-agrichemicals/agrichemicals.input';
import {
  ServicesInput,
  ServicesInputSchema,
  ServicesInputTransformed,
} from '@/modules/scope3/15.7-services/services.input';
import {
  OtherPurchasedGoodsAndServicesInput,
  OtherPurchasedGoodsAndServicesInputTransformed,
  OtherPurchasedGoodsAndServicesSchema,
} from '@/modules/scope3/15.9-other-purchases';
import { TranslationContainer } from '@/tools/containers';
import { InputContainer, numberInput, NumberInputValue } from '@/tools/inputs';
import { INTENSITIES } from '@/tools/modules';
import { Mass, mass } from '@/tools/units';
import { z } from 'zod';

export type BeefHerdInputWithoutState = ActivityInput &
  BeefManureAndEntericHerdInput &
  HasFuelInput &
  HasLimeInput &
  HasPastureResidueInput &
  HasBeefPurchasedLivestockInput &
  HasPurchasedFeedInput &
  PurchasedMineralSupplementsInput &
  AgrichemicalsInput &
  ServicesInput &
  OtherPurchasedGoodsAndServicesInput &
  HasFertiliserInput &
  HasSolidWasteInput & {
    liveweightSoldKg: NumberInputValue;
  };
export type BeefHerdInputTransformedWithoutState = ActivityInputTransformed &
  BeefManureAndEntericHerdInputTransformed &
  HasFuelInputTransformed &
  HasLimeInputTransformed &
  HasPastureResidueInputTransformed &
  HasBeefPurchasedLivestockInputTransformed &
  HasPurchasedFeedInputTransformed &
  PurchasedMineralSupplementsInputTransformed &
  AgrichemicalsInputTransformed &
  ServicesInputTransformed &
  OtherPurchasedGoodsAndServicesInputTransformed &
  HasFertiliserInputTransformed &
  HasSolidWasteInputTransformed & {
    liveweightSoldKg: InputContainer<Mass<'Liveweight'>>;
  };

export const BeefHerdInputSchemaWithoutState: z.ZodType<
  BeefHerdInputTransformedWithoutState,
  BeefHerdInputWithoutState
> = LivestockActivityInputSchema.safeExtend({
  ...BeefManureAndEntericSharedFieldsSchema.shape,
  /**
   * Common requirements framework 10.3:
   *
   * "In meat production systems that do not have significant by-products, including
   * grass-fed beef, feedlot beef, self-fleecing sheep and goats, all emissions in the
   * reporting period should be attributed to liveweight sold during the reporting
   * period."
   */
  liveweightSoldKg: numberInput(
    (val) => mass('Liveweight', val),
    {
      name: 'liveweightSoldKg',
      description:
        'The liveweight of the animals sold during the reporting period',
      modules: [INTENSITIES],
    },
    (s) => s.min(0),
  ),
  ...hasFuelInputSchema('fuel').shape,
  ...HasLimeInputSchema.shape,
  ...HasPastureResidueInputSchema.shape,
  ...HasBeefPurchasedLivestockInputSchema.shape,
  ...HasPurchasedFeedInputSchema.shape,
  ...PurchasedMineralSupplementsInputSchema.shape,
  ...AgrichemicalsInputSchema.shape,
  ...ServicesInputSchema.shape,
  ...OtherPurchasedGoodsAndServicesSchema.shape,
  ...HasSolidWasteInputSchema.shape,
  ...HasFertiliserInputSchema.shape,
});

export type BeefHerdInput = BeefHerdInputWithoutState;
export type BeefHerdInputTransformed = BeefHerdInputTransformedWithoutState & {
  state: TranslationContainer<StateOrRegion, State>;
};

export const BeefHerdInputSchema: z.ZodType<
  BeefHerdInputTransformed,
  BeefHerdInput
> = BeefHerdInputSchemaWithoutState.transform(
  (val): BeefHerdInputTransformed => ({
    ...val,
    // state can easily be inferred from region, no need for the user to supply it
    state: stateOrRegionToState(val.region),
  }),
);
