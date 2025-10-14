import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

export const SheepSeasonSchema = z.object({
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
  feedAvailability: z
    .number()
    .optional()
    .meta({ description: DESCRIPTIONS.FEEDAVAILABILITY }),
});

export type SheepSeason = z.infer<typeof SheepSeasonSchema>;
