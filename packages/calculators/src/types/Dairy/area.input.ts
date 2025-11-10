import { z } from 'zod';

export const AreaUsedSchema = z
  .object({
    croppedDryland: z.number().default(0),
    croppedIrrigated: z.number().default(0),
    improvedPastureDryland: z.number().default(0),
    improvedPastureIrrigated: z.number().default(0),
  })
  .meta({ description: 'Areas in hectares (ha)' });

export type AreaUsed = z.infer<typeof AreaUsedSchema>;
