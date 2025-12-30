import { input } from '@/calculators/Brocessing/types/inputs';
import { volume } from '@/calculators/Brocessing/types/units';
import { swapObjectKeysAndValues } from '@/calculators/common/tools/object';
import { Decimal } from 'decimal.js-light';
import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { StationaryFuelTypes } from './enums';
import { object } from './schemas';

const reverseStationaryFuelKeys = swapObjectKeysAndValues(StationaryFuelTypes);
const convertStationaryFuelType = (
  fuelType: StationaryFuelTypes,
): keyof typeof StationaryFuelTypes => {
  return reverseStationaryFuelKeys[fuelType];
};

export const StationaryFuelInputSchema = object({
  type: z
    .enum(StationaryFuelTypes)
    .meta({ description: DESCRIPTIONS.FUEL_TYPE })
    .transform((t) =>
      input(`STATIONARY_FUEL[${t}]`, convertStationaryFuelType(t)),
    ),
  amountLitres: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION })
    .transform((a) =>
      input(`AMOUNT_LITRES[${a}]`, volume('Fuel', new Decimal(a))),
    ),
});

export type StationaryFuelInput = z.infer<typeof StationaryFuelInputSchema>;
