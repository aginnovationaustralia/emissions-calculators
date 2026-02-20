import { input } from '@/tools/inputs';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { OrganicFertiliserLocalInputSchema } from './organic-fertiliser-local.input';
import { OrganicFertiliserPurchasedTracedInputSchema } from './organic-fertiliser-purchased-traced.input';
import { OrganicFertiliserPurchasedUntracedInputSchema } from './organic-fertiliser-purchased-untraced.input';

export const OrganicFertiliserInputSchema = object({
  massAppliedKg: z
    .number()
    .min(0)
    .meta({
      description: 'Mass of organic fertiliser applied, in kg',
    })
    .transform((val) =>
      input('massAppliedKg', mass('Organic Fertiliser', val)),
    ),
  origin: z.discriminatedUnion('origin', [
    OrganicFertiliserLocalInputSchema,
    OrganicFertiliserPurchasedTracedInputSchema,
    OrganicFertiliserPurchasedUntracedInputSchema,
  ]),
});

export type OrganicFertiliserInput = z.input<
  typeof OrganicFertiliserInputSchema
>;
export type OrganicFertiliserInputTransformed = z.output<
  typeof OrganicFertiliserInputSchema
>;
