import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

const optionalDietInputNote =
  'Note: If no value is provided, zero will be assumed. This will result in large, negative output values. This input will become mandatory in a future version.';

export const DairySeasonSchema = z.object({
  head: z.number().meta({ description: DESCRIPTIONS.HEAD }),
  liveweight: z.number().meta({ description: DESCRIPTIONS.LIVEWEIGHT }),
  liveweightGain: z.number().meta({ description: DESCRIPTIONS.LIVEWEIGHTGAIN }),
  crudeProtein: z
    .number()
    .optional()
    .meta({
      description: `${DESCRIPTIONS.CRUDEPROTEIN}. ${optionalDietInputNote}`,
    }),
  dryMatterDigestibility: z
    .number()
    .optional()
    .meta({
      description: `${DESCRIPTIONS.DRYMATTERDIGESTIBILITY}. ${optionalDietInputNote}`,
    }),
  milkProduction: z
    .number()
    .optional()
    .meta({ description: DESCRIPTIONS.MILK_PRODUCTION }),
});

export type DairySeason = z.infer<typeof DairySeasonSchema>;
