import {
  GrainsScope1OutputSchema,
  GrainsScope1OutputSchemaPlusLULUCF,
} from '@/calculators/Grains/types';
import { z } from 'zod';

export const SugarScope1OutputSchema = GrainsScope1OutputSchema;

export type SugarScope1Output = z.infer<typeof SugarScope1OutputSchema>;

export const SugarScope1OutputSchemaPlusLULUCF =
  GrainsScope1OutputSchemaPlusLULUCF;

export type SugarScope1OutputPlusLULUCF = z.infer<
  typeof SugarScope1OutputSchemaPlusLULUCF
>;
