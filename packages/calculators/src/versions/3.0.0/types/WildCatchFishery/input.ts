import { z } from 'zod';
import { WildCatchFisheryEnterpriseInputSchema } from './wildcatchfishery.input';

export const WildCatchFisheryInputSchema = z
  .object({
    enterprises: z.array(WildCatchFisheryEnterpriseInputSchema),
  })
  .meta({
    description: 'Input data required for the `wildcatchfishery` calculator',
  });

export type WildCatchFisheryInput = z.infer<typeof WildCatchFisheryInputSchema>;
