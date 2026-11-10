import { GrainsScope3OutputSchema } from '@/calculators/Grains/types';
import { z } from 'zod';

export const RiceScope3OutputSchema = GrainsScope3OutputSchema;

export type RiceScope3Output = z.infer<typeof RiceScope3OutputSchema>;
