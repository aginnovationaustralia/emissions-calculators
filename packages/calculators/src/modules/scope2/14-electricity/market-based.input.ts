import { DESCRIPTIONS } from '@/calculators/Grains/types/descriptions.schema';
import { input } from '@/tools/inputs';
import { electricity } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const MarketBasedElectricityInputsSchema = object({
  method: z.literal('market'),
  electricityPurchasedKWh: z
    .number()
    .min(0)
    .transform((val) => input('electricityPurchased', electricity(val)))
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  recsSurrenderedKWh: z
    .number()
    .min(0)
    .transform((val) => input('recsSurrendered', electricity(val)))
    .meta({ description: DESCRIPTIONS.RECS_SURRENDERED }),
  recsOnsiteKWh: z
    .number()
    .min(0)
    .transform((val) => input('recsOnsite', electricity(val)))
    .meta({ description: DESCRIPTIONS.RECS_ONSITE }),
});

export type MarketBasedElectricityInputs = z.input<
  typeof MarketBasedElectricityInputsSchema
>;
export type MarketBasedElectricityInputsTransformed = z.output<
  typeof MarketBasedElectricityInputsSchema
>;
