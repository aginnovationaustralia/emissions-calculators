import { z } from 'zod';

export const CowsCalvingProportionSchema = z
  .object({
    spring: z.number(),
    summer: z.number(),
    autumn: z.number(),
    winter: z.number(),
  })
  .meta({
    description: 'Proportion of cows calving in each season, from 0 to 1',
  });

export type CowsCalvingProportion = z.infer<typeof CowsCalvingProportionSchema>;
