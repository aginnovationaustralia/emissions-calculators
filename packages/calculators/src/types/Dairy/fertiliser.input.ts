import { z } from 'zod';
import { object } from '../schemas';

export const NitrogenFertiliserSchema = object({
    cropsIrrigated: z.number().min(0),
    cropsDryland: z.number().min(0),
    pastureIrrigated: z.number().min(0),
    pastureDryland: z.number().min(0),
  })
  .meta({
    description: 'Nitrogen fertiliser application, each value is in kg N/ha',
  });

export type NitrogenFertiliser = z.infer<typeof NitrogenFertiliserSchema>;
