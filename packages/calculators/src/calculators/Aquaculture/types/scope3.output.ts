import { WildCatchFisheriesScope3OutputSchema } from '@/calculators/WildCatchFisheries/types';
import { z } from 'zod';

export const AquacultureScope3OutputSchema =
  WildCatchFisheriesScope3OutputSchema;

export type AquacultureScope3Output = z.infer<
  typeof AquacultureScope3OutputSchema
>;
