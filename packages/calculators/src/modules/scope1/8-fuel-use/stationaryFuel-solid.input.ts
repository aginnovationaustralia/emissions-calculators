import { DESCRIPTIONS } from '@/calculators/Grains/types/descriptions.schema';
import { FuelStationarySolidTypes } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const StationaryFuelSolidInputSchema = object({
  fuelClass: z.literal('Solid fuels'),
  fuelType: z.enum(FuelStationarySolidTypes),
  amountTonnes: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION })
    .transform((a) =>
      input(`AMOUNT_TONNES[${a}]`, mass('Fuel', tonnesToKg(a))),
    ),
});

export type StationaryFuelSolidInputTransformed = z.output<
  typeof StationaryFuelSolidInputSchema
>;
