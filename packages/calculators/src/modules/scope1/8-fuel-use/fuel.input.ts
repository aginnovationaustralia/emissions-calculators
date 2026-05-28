import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object, z } from 'zod';
import { StationaryFuelInputSchema } from './stationaryFuel.input';
import { TransportFuelInputSchema } from './transportFuel.input';

export const FuelInputSchema = object({
  transportFuel: z
    .array(TransportFuelInputSchema)
    .meta({ description: DESCRIPTIONS.FUEL_TRANSPORT }),
  stationaryFuel: z
    .array(StationaryFuelInputSchema)
    .meta({ description: DESCRIPTIONS.FUEL_STATIONARY }),
});

export type FuelInput = z.input<typeof FuelInputSchema>;
export type FuelInputTransformed = z.output<typeof FuelInputSchema>;
