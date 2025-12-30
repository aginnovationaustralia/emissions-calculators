import { input } from '@/calculators/Brocessing/types/inputs';
import { energy } from '@/calculators/Brocessing/types/overloads';
import Decimal from 'decimal.js-light';
import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { object } from './schemas';
import { StationaryFuelInputSchema } from './stationaryFuel.input';
import { TransportFuelInputSchema } from './transportFuel.input';

export const FuelInputSchema = object({
  transportFuel: z
    .array(TransportFuelInputSchema)
    .meta({ description: DESCRIPTIONS.FUEL_TRANSPORT }),
  stationaryFuel: z
    .array(StationaryFuelInputSchema)
    .meta({ description: DESCRIPTIONS.FUEL_STATIONARY }),
  naturalGas: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.NATURAL_GAS })
    .transform((a) => input(`NATURAL_GAS[${a}]`, energy(new Decimal(a)))),
});

export type FuelInput = z.infer<typeof FuelInputSchema>;
export type FuelInputTransformed = z.output<typeof FuelInputSchema>;
