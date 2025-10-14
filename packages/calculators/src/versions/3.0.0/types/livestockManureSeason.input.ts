import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';

export const LivestockManureSeasonSchema = z.object({
  outdoorSystems: z
    .number()
    .optional()
    .meta({ description: DESCRIPTIONS.VOLATILESOLIDS_OUTDOORSYSTEMS }),
  coveredAnaerobicPond: z
    .number()
    .optional()
    .meta({ description: DESCRIPTIONS.VOLATILESOLIDS_COVEREDANAEROBICPOND }),
  uncoveredAnaerobicPond: z
    .number()
    .optional()
    .meta({ description: DESCRIPTIONS.VOLATILESOLIDS_UNCOVEREDANAEROBICPOND }),
  deepLitter: z
    .number()
    .optional()
    .meta({ description: DESCRIPTIONS.VOLATILESOLIDS_DEEPLITTER }),
  undefinedSystem: z
    .number()
    .optional()
    .meta({ description: DESCRIPTIONS.VOLATILESOLIDS_UNDEFINED }),
});

export type LivestockManureSeason = z.infer<typeof LivestockManureSeasonSchema>;
