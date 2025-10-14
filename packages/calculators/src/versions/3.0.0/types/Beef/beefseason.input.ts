import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

export const BeefSeasonSchema = z.object({
  head: z.number().meta({ description: DESCRIPTIONS.HEAD }),
  liveweight: z.number().meta({ description: DESCRIPTIONS.LIVEWEIGHT }),
  liveweightGain: z.number().meta({ description: DESCRIPTIONS.LIVEWEIGHTGAIN }),
  crudeProtein: z
    .number()
    .optional()
    .meta({ description: DESCRIPTIONS.CRUDEPROTEIN }),
  dryMatterDigestibility: z
    .number()
    .optional()
    .meta({ description: DESCRIPTIONS.DRYMATTERDIGESTIBILITY }),
});

export type BeefSeason = z.infer<typeof BeefSeasonSchema>;
