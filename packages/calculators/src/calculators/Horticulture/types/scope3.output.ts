import { GrainsScope3OutputSchema } from '@/calculators/Grains/types';
import { z } from 'zod';

export const HorticultureScope3OutputSchema = GrainsScope3OutputSchema;

export type HorticultureScope3Output = z.infer<
  typeof HorticultureScope3OutputSchema
>;
