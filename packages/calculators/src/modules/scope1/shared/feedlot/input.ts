import {
  FeedlotGroupLivestockInputSchema,
  feedlotGroupSharedInputSchema,
} from '@/calculators/Feedlot/types/feedlot-group.input';
import { HasFractionAppliedToSoilsInputSchema } from '@/calculators/types/has-fraction-applied-to-soils.input';
import { hasGrazingProductionSystemInputSchema } from '@/calculators/types/has-grazing-production-system.input';
import { hasMethod2MeanAnnualTemperatureInputSchema } from '@/calculators/types/has-method2-mean-annual-temperature.input';
import { States } from '@/constants/enums';
import { enumInput } from '@/tools/inputs';
import { MANURE_FEEDLOT_4_1 } from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

/**
 * A feedlot lot as read by feedlot enteric methane (3.1) and manure management (4.1).
 */
export const FeedlotLotLivestockInputSchema = object({
  groups: z.array(FeedlotGroupLivestockInputSchema),
  state: enumInput(States, {
    name: 'State',
    description: 'State or territory in which the feedlot is located',
    modules: [MANURE_FEEDLOT_4_1],
  }),
  ...hasGrazingProductionSystemInputSchema(MANURE_FEEDLOT_4_1).shape,
  ...hasMethod2MeanAnnualTemperatureInputSchema(MANURE_FEEDLOT_4_1).shape,
});

export type FeedlotLotLivestockInput = z.input<
  typeof FeedlotLotLivestockInputSchema
>;
export type FeedlotLotLivestockInputTransformed = z.output<
  typeof FeedlotLotLivestockInputSchema
>;

/**
 * A feedlot lot whose manure is the source of an organic fertiliser application, as
 * read by the chapter 5 nitrogen calculation.
 */
export const FeedlotLotFertiliserInputSchema = object({
  groups: z.array(feedlotGroupSharedInputSchema('fertiliser')),
  ...HasFractionAppliedToSoilsInputSchema.shape,
});

export type FeedlotLotFertiliserInput = z.input<
  typeof FeedlotLotFertiliserInputSchema
>;
export type FeedlotLotFertiliserInputTransformed = z.output<
  typeof FeedlotLotFertiliserInputSchema
>;
