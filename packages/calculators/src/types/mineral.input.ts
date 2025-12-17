import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { object, proportion } from './schemas';

export const MineralSupplementationSchema = object({
  mineralBlock: z
    .number()
    .min(0)
    .default(0)
    .meta({ description: 'Mineral block product used, in tonnes' }),
  mineralBlockUrea: proportion(DESCRIPTIONS.UREACONTENT),
  weanerBlock: z
    .number()
    .min(0)
    .default(0)
    .meta({ description: 'Weaner block product used, in tonnes' }),
  weanerBlockUrea: proportion(DESCRIPTIONS.UREACONTENT),
  drySeasonMix: z
    .number()
    .min(0)
    .default(0)
    .meta({ description: 'Dry season mix product used, in tonnes' }),
  drySeasonMixUrea: proportion(DESCRIPTIONS.UREACONTENT),
}).meta({ description: 'Supplementation for livestock' });

export type MineralSupplementation = z.infer<
  typeof MineralSupplementationSchema
>;
