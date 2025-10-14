import { z } from 'zod';
import {
  WildSeaFisheriesFuels,
  WildSeaFisheriesTransportTypes,
} from '../types';

export const WildSeaFisheriesTransportSchema = z.object({
  type: z
    .enum(WildSeaFisheriesTransportTypes)
    .meta({ description: 'Transport type' }),
  fuel: z.enum(WildSeaFisheriesFuels).meta({ description: 'Fuel type' }),
  distance: z.number().meta({ description: 'Distance in km' }),
});

export type WildSeaFisheriesTransport = z.infer<
  typeof WildSeaFisheriesTransportSchema
>;
