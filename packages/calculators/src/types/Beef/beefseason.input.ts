import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { percentage } from '../schemas';

export const BeefSeasonSchema = z.object({
  head: z.number().min(0).meta({ description: DESCRIPTIONS.HEAD }),
  liveweight: z.number().min(0).meta({ description: DESCRIPTIONS.LIVEWEIGHT }),
  liveweightGain: z.number().meta({ description: DESCRIPTIONS.LIVEWEIGHTGAIN }),
  crudeProtein: percentage(DESCRIPTIONS.CRUDEPROTEIN).optional(),
  dryMatterDigestibility: percentage(
    DESCRIPTIONS.DRYMATTERDIGESTIBILITY,
  ).optional(),
});

export type BeefSeason = z.infer<typeof BeefSeasonSchema>;
