import { GrainsScope3OutputSchema } from '@/calculators/Grains/types';
import { z } from 'zod';

export const CottonScope3OutputSchema = GrainsScope3OutputSchema;

export type CottonScope3Output = z.infer<typeof CottonScope3OutputSchema>;
