import { object } from '@/types/schemas';
import { z } from 'zod';
import { OtherLivestockClassInputSchema } from './class.input';

export const OtherLivestockHerdInputSchema = object({
  classes: z.array(OtherLivestockClassInputSchema),
  excludedFromWater: z.boolean().meta({
    description:
      'Whether the herd is excluded from water use (i.e. on bore or reticulated water systems where water is provided in troughs)',
  }),
});

export type OtherLivestockHerdInput = z.input<
  typeof OtherLivestockHerdInputSchema
>;
export type OtherLivestockHerdInputTransformed = z.output<
  typeof OtherLivestockHerdInputSchema
>;
