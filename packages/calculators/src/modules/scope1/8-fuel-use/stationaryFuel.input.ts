import { StationaryFuelTypes } from '@/calculators/Grains/constants/enums';
import { DESCRIPTIONS } from '@/calculators/Grains/types/descriptions.schema';
import { input } from '@/tools/inputs';
import { volume } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

// const reverseStationaryFuelKeys = swapObjectKeysAndValues(StationaryFuelTypes);
// const convertStationaryFuelType = (
//   fuelType: StationaryFuelTypes,
// ): keyof typeof StationaryFuelTypes => {
//   return reverseStationaryFuelKeys[fuelType];
// };

export const StationaryFuelInputSchema = object({
  type: z
    .enum(StationaryFuelTypes)
    .meta({ description: DESCRIPTIONS.FUEL_TYPE }),
  // .transform((t) =>
  //   input(`STATIONARY_FUEL[${t}]`, convertStationaryFuelType(t)),
  // ),
  amountLitres: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION })
    .transform((a) => input(`AMOUNT_VOLUME[${a}]`, volume('Fuel', a))),
});

export type StationaryFuelInput = z.input<typeof StationaryFuelInputSchema>;
