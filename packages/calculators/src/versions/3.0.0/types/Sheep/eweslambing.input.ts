import { z } from 'zod';

export const EwesLambingSchema = z
  .object({
    autumn: z.number().min(0).max(1),
    winter: z.number().min(0).max(1),
    spring: z.number().min(0).max(1),
    summer: z.number().min(0).max(1),
  })
  .meta({
    description:
      'The proportion of ewes lambing in each season, as a value from 0 to 1',
  });

export type EwesLambing = z.infer<typeof EwesLambingSchema>;
