import {
  WildSeaFisheriesFuels,
  WildSeaFisheriesTransportTypes,
} from '@/types/enums';
import { z } from 'zod';
import { object } from '../schemas';

export const WildSeaFisheriesTransportSchema = object({
  type: z
    .enum(WildSeaFisheriesTransportTypes)
    .meta({ description: 'Transport type' }),
  fuel: z.enum(WildSeaFisheriesFuels).meta({ description: 'Fuel type' }),
  distance: z.number().min(0).meta({ description: 'Distance in km' }),
});

export type WildSeaFisheriesTransport = z.infer<
  typeof WildSeaFisheriesTransportSchema
>;
