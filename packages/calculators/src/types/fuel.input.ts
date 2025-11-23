import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { StationaryFuelInputSchema } from './stationaryFuel.input';
import { TransportFuelInputSchema } from './transportFuel.input';

export const FuelInputSchema = z.object({
  transportFuel: z
    .array(TransportFuelInputSchema)
    .meta({ description: DESCRIPTIONS.FUEL_TRANSPORT }),
  stationaryFuel: z
    .array(StationaryFuelInputSchema)
    .meta({ description: DESCRIPTIONS.FUEL_STATIONARY }),
  naturalGas: z.number().min(0).meta({ description: DESCRIPTIONS.NATURAL_GAS }),
});

export type FuelInput = z.infer<typeof FuelInputSchema>;
