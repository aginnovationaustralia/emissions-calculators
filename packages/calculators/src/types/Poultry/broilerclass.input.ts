import { z } from 'zod';
import { object, proportion } from '../schemas';

export const BroilerClassSchema = object({
  birds: z.number().min(0).meta({ description: 'Total number of birds/head' }),
  averageStayLength50: z.number().min(0).meta({
    description:
      'Average length of stay until 50% of the flock is depleted, in days',
  }),
  liveweight50: z.number().min(0).meta({
    description: 'Average liveweight during the 50% depletion period, in kg',
  }),
  averageStayLength100: z.number().min(0).meta({
    description:
      'Average length of stay until 100% of the flock is depleted, in days',
  }),
  liveweight100: z.number().min(0).meta({
    description: 'Average liveweight during the 100% depletion period, in kg',
  }),
  dryMatterIntake: z
    .number()
    .min(0)
    .optional()
    .meta({ description: 'Dry matter intake, in kg/head/day' }),
  dryMatterDigestibility: proportion(
    'Dry matter digestibility fraction, from 0 to 1',
  ).optional(),
  crudeProtein: proportion('Crude protein fraction, from 0 to 1').optional(),
  manureAsh: proportion('Manure ash fraction, from 0 to 1').optional(),
  nitrogenRetentionRate: proportion(
    'Nitrogen retention rate fraction, from 0 to 1',
  ).optional(),
}).meta({ description: 'Broiler class with seasonal data' });

export type BroilerClass = z.infer<typeof BroilerClassSchema>;
