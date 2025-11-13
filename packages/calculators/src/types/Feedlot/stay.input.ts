import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { percentage } from '../schemas';

export const FeedlotStaySchema = z
  .object({
    livestock: z.number().min(0).meta({ description: DESCRIPTIONS.HEAD }),
    stayAverageDuration: z
      .number()
      .min(0)
      .meta({ description: 'Average stay length in feedlot, in days' }),
    liveweight: z
      .number()
      .min(0)
      .meta({ description: DESCRIPTIONS.LIVEWEIGHT }),
    dryMatterDigestibility: percentage(
      'Percent dry matter digestibility of the feed eaten, from 0 to 100',
    ),
    crudeProtein: percentage(
      'Percent crude protein of the whole diet, from 0 to 100',
    ),
    nitrogenRetention: percentage(
      'Percent nitrogen retention of intake, from 0 to 100',
    ),
    dailyIntake: z
      .number()
      .min(0)
      .meta({
        description: 'Daily intake of dry matter in kilograms per head per day',
      }),
    ndf: percentage(
      'Percent Neutral detergent fibre (NDF) of intake, from 0 to 100',
    ),
    etherExtract: percentage('Percent ether extract of intake, from 0 to 100'),
  })
  .meta({
    description: 'A class of cattle with a specific feedlot stay duration',
  });

export type FeedlotStay = z.infer<typeof FeedlotStaySchema>;
