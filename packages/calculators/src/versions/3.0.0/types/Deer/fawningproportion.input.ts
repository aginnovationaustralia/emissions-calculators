import { z } from 'zod';

export const DoesFawningProportionSchema = z
  .object({
    spring: z.number(),
    summer: z.number(),
    autumn: z.number(),
    winter: z.number(),
  })
  .meta({
    description: 'Proportion of does fawning in each season, from 0 to 1',
  });

export type DoesFawningProportion = z.infer<typeof DoesFawningProportionSchema>;
