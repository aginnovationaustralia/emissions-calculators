import { z } from 'zod';
import { object } from '../schemas';

export const AreaUsedSchema = object({
  croppedDryland: z.number().min(0).default(0),
  croppedIrrigated: z.number().min(0).default(0),
  improvedPastureDryland: z.number().min(0).default(0),
  improvedPastureIrrigated: z.number().min(0).default(0),
}).meta({ description: 'Areas in hectares (ha)' });

export type AreaUsed = z.infer<typeof AreaUsedSchema>;
