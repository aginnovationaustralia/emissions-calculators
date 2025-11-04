import { z } from 'zod';
import { calculatorInput } from '../schemas';
import { WildCatchFisheryEnterpriseInputSchema } from './wildcatchfishery.input';

export const WildCatchFisheryInputSchema = calculatorInput('WildCatchFishery', {
  enterprises: z.array(WildCatchFisheryEnterpriseInputSchema),
});

export type WildCatchFisheryInput = z.infer<typeof WildCatchFisheryInputSchema>;
