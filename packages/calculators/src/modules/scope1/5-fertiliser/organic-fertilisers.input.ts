import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  OrganicFertiliserInput,
  OrganicFertiliserInputSchema,
  OrganicFertiliserInputTransformed,
} from './organic-fertiliser.input';

/*
 * Explicit ZodType: organic fertiliser nests livestock manures (incl. MMS options), and the
 * inferred type becomes too large for TS to serialize on declaration emit (TS7056) once it is
 * embedded in the crop calculator inputs. Same pattern as BeefHerd / DairyHerd / FertiliserInput.
 */
export type OrganicFertilisersInput = {
  applications: OrganicFertiliserInput[];
};
export type OrganicFertilisersInputTransformed = {
  applications: OrganicFertiliserInputTransformed[];
};

export const OrganicFertilisersInputSchema: z.ZodType<
  OrganicFertilisersInputTransformed,
  OrganicFertilisersInput
> = object({
  applications: z.array(OrganicFertiliserInputSchema).meta({
    description: 'Organic fertiliser applications',
  }),
}).meta({ id: 'OrganicFertilisersInput' });
