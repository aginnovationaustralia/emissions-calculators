import { GrainsScope3OutputSchema } from '@/calculators/Grains/types';
import { z } from 'zod';

export const SugarScope3OutputSchema = GrainsScope3OutputSchema;

export type SugarScope3Output = z.infer<typeof SugarScope3OutputSchema>;
