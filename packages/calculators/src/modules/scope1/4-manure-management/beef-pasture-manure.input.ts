import { object } from '@/types/schemas';
import { z } from 'zod';

export const BeefPastureManureInputSchema = object({});

export type BeefPastureManureInput = z.input<
  typeof BeefPastureManureInputSchema
>;
export type BeefPastureManureInputTransformed = z.output<
  typeof BeefPastureManureInputSchema
>;
