import {
  WildSeaFisheriesFuels,
  WildSeaFisheriesTransportTypes,
} from '@/types/types';
import { z } from 'zod';

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
