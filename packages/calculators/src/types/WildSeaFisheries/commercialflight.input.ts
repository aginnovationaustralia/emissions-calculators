import { z } from 'zod';

export const WildSeaFisheriesCommercialFlightSchema = z.object({
  commercialFlightPassengers: z
    .number()
    .min(0)
    .meta({ description: 'Commercial flight passengers per year' }),
  totalFlightDistance: z
    .number()
    .min(0)
    .meta({ description: 'Total commercial flight distance in km' }),
});

export type WildSeaFisheriesCommercialFlight = z.infer<
  typeof WildSeaFisheriesCommercialFlightSchema
>;
