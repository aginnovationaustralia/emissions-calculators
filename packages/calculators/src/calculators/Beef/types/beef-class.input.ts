import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  BeefClassSeasonInputSchema,
  BeefClassWithCalvesSeasonInputSchema,
} from './beef-class-season.input';

export const BeefClassInputSchema = object({
  spring: BeefClassSeasonInputSchema,
  summer: BeefClassSeasonInputSchema,
  autumn: BeefClassSeasonInputSchema,
  winter: BeefClassSeasonInputSchema,
});

export const BeefClassWithCalvesInputSchema = object({
  spring: BeefClassWithCalvesSeasonInputSchema,
  summer: BeefClassWithCalvesSeasonInputSchema,
  autumn: BeefClassWithCalvesSeasonInputSchema,
  winter: BeefClassWithCalvesSeasonInputSchema,
});

// export const isBeefClassWithCalves

export type BeefClassInput = z.input<typeof BeefClassInputSchema>;
export type BeefClassInputTransformed = z.output<typeof BeefClassInputSchema>;

export type BeefClassWithCalvesInput = z.input<
  typeof BeefClassWithCalvesInputSchema
>;
export type BeefClassWithCalvesInputTransformed = z.output<
  typeof BeefClassWithCalvesInputSchema
>;
