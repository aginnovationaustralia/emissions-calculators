import { CalculationMethods } from '@/calculators/Grains/constants/enums';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { OrganicFertiliserInputSchema } from './organic-fertiliser.input';

export const OrganicFertilisersInputSchema = object({
  applications: z.array(OrganicFertiliserInputSchema).meta({
    description: 'Organic fertiliser applications',
  }),
  calculationMethod: z.enum(CalculationMethods).meta({
    description: 'Method of calculating fertiliser emissions',
  }),
});

export type OrganicFertilisersInput = z.input<
  typeof OrganicFertilisersInputSchema
>;
export type OrganicFertilisersInputTransformed = z.output<
  typeof OrganicFertilisersInputSchema
>;
