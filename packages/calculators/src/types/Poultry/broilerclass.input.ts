import { z } from 'zod';

export const BroilerClassSchema = z
  .object({
    birds: z.number().meta({ description: 'Total number of birds/head' }),
    averageStayLength50: z.number().meta({
      description:
        'Average length of stay until 50% of the flock is depleted, in days',
    }),
    liveweight50: z.number().meta({
      description: 'Average liveweight during the 50% depletion period, in kg',
    }),
    averageStayLength100: z.number().meta({
      description:
        'Average length of stay until 100% of the flock is depleted, in days',
    }),
    liveweight100: z.number().meta({
      description: 'Average liveweight during the 100% depletion period, in kg',
    }),
    dryMatterIntake: z
      .number()
      .optional()
      .meta({ description: 'Dry matter intake, in kg/head/day' }),
    dryMatterDigestibility: z
      .number()
      .optional()
      .meta({ description: 'Dry matter digestibility fraction, from 0 to 1' }),
    crudeProtein: z
      .number()
      .optional()
      .meta({ description: 'Crude protein fraction, from 0 to 1' }),
    manureAsh: z
      .number()
      .optional()
      .meta({ description: 'Manure ash fraction, from 0 to 1' }),
    nitrogenRetentionRate: z
      .number()
      .optional()
      .meta({ description: 'Nitrogen retention rate fraction, from 0 to 1' }),
  })
  .meta({ description: 'Broiler class with seasonal data' });

export type BroilerClass = z.infer<typeof BroilerClassSchema>;
