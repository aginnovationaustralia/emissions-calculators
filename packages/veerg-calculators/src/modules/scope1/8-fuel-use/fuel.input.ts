import { locateFuel } from '@/tools/modules';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { stationaryFuelInputSchema } from './stationaryFuel.input';
import { transportFuelInputSchema } from './transportFuel.input';

const fuelInputIds = {
  fuel: 'FuelInput',
  services: 'ServicesFuelInput',
  freight: 'FreightFuelInput',
} as const;

export const fuelInputSchema = locateFuel(({ location }) =>
  object({
    transport: z
      .array(transportFuelInputSchema(location))
      .meta({ description: DESCRIPTIONS.FUEL_TRANSPORT }),
    stationary: z
      .array(stationaryFuelInputSchema(location))
      .meta({ description: DESCRIPTIONS.FUEL_STATIONARY }),
  }).meta({ id: fuelInputIds[location] }),
);

export type FuelInput = z.input<ReturnType<typeof fuelInputSchema>>;
export type FuelInputTransformed = z.output<ReturnType<typeof fuelInputSchema>>;

export const hasFuelInputSchema = locateFuel(({ location }) =>
  object({
    fuel: fuelInputSchema(location),
  }),
);

export type HasFuelInput = z.input<ReturnType<typeof hasFuelInputSchema>>;
export type HasFuelInputTransformed = z.output<
  ReturnType<typeof hasFuelInputSchema>
>;
