import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { object } from './schemas';

export const LivestockManureSeasonSchema = object({
  outdoorSystems: z
    .number()
    .min(0)
    .optional()
    .meta({ description: DESCRIPTIONS.VOLATILESOLIDS_OUTDOORSYSTEMS }),
  coveredAnaerobicPond: z
    .number()
    .min(0)
    .optional()
    .meta({ description: DESCRIPTIONS.VOLATILESOLIDS_COVEREDANAEROBICPOND }),
  uncoveredAnaerobicPond: z
    .number()
    .min(0)
    .optional()
    .meta({ description: DESCRIPTIONS.VOLATILESOLIDS_UNCOVEREDANAEROBICPOND }),
  deepLitter: z
    .number()
    .min(0)
    .optional()
    .meta({ description: DESCRIPTIONS.VOLATILESOLIDS_DEEPLITTER }),
  undefinedSystem: z
    .number()
    .min(0)
    .optional()
    .meta({ description: DESCRIPTIONS.VOLATILESOLIDS_UNDEFINED }),
});

export type LivestockManureSeason = z.infer<typeof LivestockManureSeasonSchema>;
