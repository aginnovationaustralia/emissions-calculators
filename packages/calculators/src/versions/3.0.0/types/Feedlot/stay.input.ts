import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

export const FeedlotStaySchema = z
  .object({
    livestock: z.number().meta({ description: DESCRIPTIONS.HEAD }),
    stayAverageDuration: z
      .number()
      .meta({ description: 'Average stay length in feedlot, in days' }),
    liveweight: z.number().meta({ description: DESCRIPTIONS.LIVEWEIGHT }),
    dryMatterDigestibility: z.number().meta({
      description:
        'Percent dry matter digestibility of the feed eaten, from 0 to 100',
    }),
    crudeProtein: z
      .number()
      .meta({
        description: 'Percent crude protein of the whole diet, from 0 to 100',
      }),
    nitrogenRetention: z
      .number()
      .meta({
        description: 'Percent nitrogen retention of intake, from 0 to 100',
      }),
    dailyIntake: z
      .number()
      .meta({
        description: 'Daily intake of dry matter in kilograms per head per day',
      }),
    ndf: z
      .number()
      .meta({
        description:
          'Percent Neutral detergent fibre (NDF) of intake, from 0 to 100',
      }),
    etherExtract: z
      .number()
      .meta({ description: 'Percent ether extract of intake, from 0 to 100' }),
  })
  .meta({
    description: 'A class of cattle with a specific feedlot stay duration',
  });

export type FeedlotStay = z.infer<typeof FeedlotStaySchema>;
