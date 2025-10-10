import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';

export const MineralSupplementationSchema = z
  .object({
    mineralBlock: z
      .number()
      .default(0)
      .meta({ description: 'Mineral block product used, in tonnes' }),
    mineralBlockUrea: z
      .number()
      .default(0)
      .meta({ description: DESCRIPTIONS.UREACONTENT }),
    weanerBlock: z
      .number()
      .default(0)
      .meta({ description: 'Weaner block product used, in tonnes' }),
    weanerBlockUrea: z
      .number()
      .default(0)
      .meta({ description: DESCRIPTIONS.UREACONTENT }),
    drySeasonMix: z
      .number()
      .default(0)
      .meta({ description: 'Dry season mix product used, in tonnes' }),
    drySeasonMixUrea: z
      .number()
      .default(0)
      .meta({ description: DESCRIPTIONS.UREACONTENT }),
  })
  .meta({ description: 'Supplementation for livestock' });

export type MineralSupplementation = z.infer<
  typeof MineralSupplementationSchema
>;
