import { object } from '@/types/schemas';
import {
  BeefClassInputSchema,
  BeefClassWithCalvesInputSchema,
} from './beef-class.input';

export const BeefClassesInputSchema = object({
  bullsLt1: BeefClassInputSchema.optional(),
  bullsGt1: BeefClassInputSchema.optional(),
  cowsLt1: BeefClassInputSchema.optional(),
  cows1To2Years: BeefClassInputSchema.optional(),
  cows2To3Years: BeefClassWithCalvesInputSchema.optional(),
  cowsGt3Years: BeefClassWithCalvesInputSchema.optional(),
  steersLt1: BeefClassInputSchema.optional(),
  steers1To2Years: BeefClassInputSchema.optional(),
  steers2To3Years: BeefClassInputSchema.optional(),
  steersGt3Years: BeefClassInputSchema.optional(),
});
