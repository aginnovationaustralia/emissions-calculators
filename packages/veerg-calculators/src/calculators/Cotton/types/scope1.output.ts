import {
  GrainsScope1OutputSchema,
  GrainsScope1OutputSchemaPlusLULUCF,
} from '@/calculators/Grains/types';
import { z } from 'zod';

export const CottonScope1OutputSchema = GrainsScope1OutputSchema;

export type CottonScope1Output = z.infer<typeof CottonScope1OutputSchema>;

export const CottonScope1OutputSchemaPlusLULUCF =
  GrainsScope1OutputSchemaPlusLULUCF;

export type CottonScope1OutputPlusLULUCF = z.infer<
  typeof CottonScope1OutputSchemaPlusLULUCF
>;
