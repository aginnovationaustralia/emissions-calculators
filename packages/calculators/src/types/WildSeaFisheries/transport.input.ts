import {
  WildSeaFisheriesFuels,
  WildSeaFisheriesTransportTypes,
} from '@/types/enums';
import { z } from 'zod';

export const WildSeaFisheriesTransportSchema = z.object({
  type: z
    .enum(WildSeaFisheriesTransportTypes)
    .meta({ description: 'Transport type' }),
  fuel: z.enum(WildSeaFisheriesFuels).meta({ description: 'Fuel type' }),
  distance: z.number().min(0).meta({ description: 'Distance in km' }),
});

export type WildSeaFisheriesTransport = z.infer<
  typeof WildSeaFisheriesTransportSchema
>;
