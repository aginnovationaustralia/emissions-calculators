import { DESCRIPTIONS } from '@/calculators/Grains/types/descriptions.schema';
import { input } from '@/tools/inputs';
import { electricity } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const LocationBasedElectricityInputsSchema = object({
  method: z.literal('location'),
  electricityPurchasedKWh: z
    .number()
    .min(0)
    .transform((val) => input('electricityPurchased', electricity(val)))
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
});

export type LocationBasedElectricityInputs = z.input<
  typeof LocationBasedElectricityInputsSchema
>;
export type LocationBasedElectricityInputsTransformed = z.output<
  typeof LocationBasedElectricityInputsSchema
>;
