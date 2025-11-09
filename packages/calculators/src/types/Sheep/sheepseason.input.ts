import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { percentage } from '../schemas';

export const SheepSeasonSchema = z.object({
  head: z.number().meta({ description: DESCRIPTIONS.HEAD }),
  liveweight: z.number().meta({ description: DESCRIPTIONS.LIVEWEIGHT }),
  liveweightGain: z.number().meta({ description: DESCRIPTIONS.LIVEWEIGHTGAIN }),
  crudeProtein: percentage(DESCRIPTIONS.CRUDEPROTEIN).optional(),
  dryMatterDigestibility: percentage(
    DESCRIPTIONS.DRYMATTERDIGESTIBILITY,
  ).optional(),
  feedAvailability: z
    .number()
    .optional()
    .meta({ description: DESCRIPTIONS.FEEDAVAILABILITY }),
});

export type SheepSeason = z.infer<typeof SheepSeasonSchema>;
