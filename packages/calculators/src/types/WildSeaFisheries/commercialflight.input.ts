import { z } from 'zod';

export const WildSeaFisheriesCommercialFlightSchema = z.object({
  commercialFlightPassengers: z
    .number()
    .meta({ description: 'Commercial flight passengers per year' }),
  totalFlightDistance: z
    .number()
    .meta({ description: 'Total commercial flight distance in km' }),
});

export type WildSeaFisheriesCommercialFlight = z.infer<
  typeof WildSeaFisheriesCommercialFlightSchema
>;
