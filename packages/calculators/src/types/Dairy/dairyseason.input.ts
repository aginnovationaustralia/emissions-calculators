import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { percentage } from '../schemas';

const optionalDietInputNote =
  'Note: If no value is provided, zero will be assumed. This will result in large, negative output values. This input will become mandatory in a future version.';

export const DairySeasonSchema = z.object({
  head: z.number().meta({ description: DESCRIPTIONS.HEAD }),
  liveweight: z.number().meta({ description: DESCRIPTIONS.LIVEWEIGHT }),
  liveweightGain: z.number().meta({ description: DESCRIPTIONS.LIVEWEIGHTGAIN }),
  crudeProtein: percentage(
    `${DESCRIPTIONS.CRUDEPROTEIN}. ${optionalDietInputNote}`,
  ).optional(),
  dryMatterDigestibility: percentage(
    `${DESCRIPTIONS.DRYMATTERDIGESTIBILITY}. ${optionalDietInputNote}`,
  ).optional(),
  milkProduction: z
    .number()
    .optional()
    .meta({ description: DESCRIPTIONS.MILK_PRODUCTION }),
});

export type DairySeason = z.infer<typeof DairySeasonSchema>;
