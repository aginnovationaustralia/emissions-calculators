import { input } from '@/tools/inputs';
import { volume } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const StationaryFuelNaturalGasInputSchema = object({
  fuelClass: z.literal('Gaseous fuels'),
  fuelType: z.literal('Natural gas'),
  amountLitres: z
    .number()
    .min(0)
    .transform((a) => input(`AMOUNT_LITRES[${a}]`, volume('Fuel', a))),
});

export type StationaryFuelNaturalGasInputTransformed = z.output<
  typeof StationaryFuelNaturalGasInputSchema
>;
