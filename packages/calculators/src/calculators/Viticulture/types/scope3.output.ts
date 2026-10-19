import { GrainsScope3OutputSchema } from '@/calculators/Grains/types';
import { z } from 'zod';

export const ViticultureScope3OutputSchema = GrainsScope3OutputSchema;

export type ViticultureScope3Output = z.infer<
  typeof ViticultureScope3OutputSchema
>;
