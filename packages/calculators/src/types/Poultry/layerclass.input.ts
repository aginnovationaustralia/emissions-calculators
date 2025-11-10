import { z } from 'zod';

export const LayerClassSchema = z
  .object({
    autumn: z.number().meta({ description: 'Flock numbers in autumn' }),
    winter: z.number().meta({ description: 'Flock numbers in winter' }),
    spring: z.number().meta({ description: 'Flock numbers in spring' }),
    summer: z.number().meta({ description: 'Flock numbers in summer' }),
  })
  .meta({ description: 'Layer class with seasonal data' });

export type LayerClass = z.infer<typeof LayerClassSchema>;
