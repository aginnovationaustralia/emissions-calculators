import { hasStateInputSchema } from '@/calculators/types/has-state.input';
import { HasWastewaterTreatmentInputSchema } from '@/modules/scope1/11-wastewater/wastewater-treatment.input';
import { HasSupplementaryCO2InputSchema } from '@/modules/scope1/12-supplementary-co2';
import { hasFuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { RefrigerantsInputSchema } from '@/modules/scope1/9-refrigerant-use/refrigerants.input';
import { HasSolidWasteInputSchema } from '@/modules/scope1/shared/solid-waste/input';
import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { FreightsInputSchema } from '@/modules/scope3/15.13-freight/freights.input';
import { PurchasedPackagingsInputSchema } from '@/modules/scope3/15.8-purchased-packaging/purchased-packagings.input';
import { OtherPurchasedGoodsAndServicesSchema } from '@/modules/scope3/15.9-other-purchases/input';
import { PURCH_FUEL_15_10 } from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { PostProductionIntensitiesSchema } from './intensities.input';

export const PostProductionInputSchema = object({
  electricity: ElectricityInputsSchema,
  intensities: PostProductionIntensitiesSchema.optional(),
  ...HasWastewaterTreatmentInputSchema.shape,
  ...hasFuelInputSchema('fuel').shape,
  ...RefrigerantsInputSchema.shape,
  ...HasSolidWasteInputSchema.shape,
  ...HasSupplementaryCO2InputSchema.shape,
  ...OtherPurchasedGoodsAndServicesSchema.shape,
  ...hasStateInputSchema([PURCH_FUEL_15_10]).shape,
  ...PurchasedPackagingsInputSchema.shape,
  ...FreightsInputSchema.shape,
}).meta({
  description: `Post Production Calculator (chapter 2.13). This calculator can be used to calculate the emissions that occur after primary production is complete. It can be used to extend from
      a 'cradle-to-gate' calculation to a 'cradle-to-factory-gate' or 'cradle-to-distribution-gate' calculation.`,
});

export type PostProductionInput = z.input<typeof PostProductionInputSchema>;
export type PostProductionInputTransformed = z.output<
  typeof PostProductionInputSchema
>;
