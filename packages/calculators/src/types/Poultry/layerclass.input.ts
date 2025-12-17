import { z } from 'zod';
import { object } from '../schemas';

export const LayerClassSchema = object({
    autumn: z.number().min(0).meta({ description: 'Flock numbers in autumn' }),
    winter: z.number().min(0).meta({ description: 'Flock numbers in winter' }),
    spring: z.number().min(0).meta({ description: 'Flock numbers in spring' }),
    summer: z.number().min(0).meta({ description: 'Flock numbers in summer' }),
  })
  .meta({ description: 'Layer class with seasonal data' });

export type LayerClass = z.infer<typeof LayerClassSchema>;
