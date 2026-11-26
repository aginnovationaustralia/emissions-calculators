import { booleanInput } from '@/tools/inputs';
import { locateFuel, PURCH_FUEL_15_10 } from '@/tools/modules';
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

export const fuelInputSchema = locateFuel(({ modules, location }) =>
  object({
    transport: z
      .array(transportFuelInputSchema(location))
      .meta({ description: DESCRIPTIONS.FUEL_TRANSPORT }),
    stationary: z
      .array(stationaryFuelInputSchema(location))
      .meta({ description: DESCRIPTIONS.FUEL_STATIONARY }),
    isInMetroRegion: booleanInput(
      'Is in metro?',
      'For more accurate scope 3 emission factors for natural gas consumption, is the location in a Metro region? Metro is defined as located on or east of the dividing range in NSW, including Canberra and Queanbeyan, Melbourne, Brisbane, Adelaide or Perth',
      // Only scope 3 natural gas (15.10, or 15.7 for services) reads this input
      location === 'fuel' ? [PURCH_FUEL_15_10] : modules,
    ).prefault(false),
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
