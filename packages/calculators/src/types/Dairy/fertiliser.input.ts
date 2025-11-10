import { z } from 'zod';

export const NitrogenFertiliserSchema = z
  .object({
    cropsIrrigated: z.number(),
    cropsDryland: z.number(),
    pastureIrrigated: z.number(),
    pastureDryland: z.number(),
  })
  .meta({
    description: 'Nitrogen fertiliser application, each value is in kg N/ha',
  });

export type NitrogenFertiliser = z.infer<typeof NitrogenFertiliserSchema>;
