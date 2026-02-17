import { DESCRIPTIONS } from '@/calculators/Grains/types/descriptions.schema';
import { input } from '@/tools/inputs';
import { electricity } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

export const LocationBasedElectricityInputsSchema = object({
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .min(0)
    .transform((val) => input('electricityUse', electricity(val)))
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
});

export type LocationBasedElectricityInputs = z.input<
  typeof LocationBasedElectricityInputsSchema
>;
export type LocationBasedElectricityInputsTransformed = z.output<
  typeof LocationBasedElectricityInputsSchema
>;
