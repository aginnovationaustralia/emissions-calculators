import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  SheepClassInputSchema,
  SheepClassWithLambingInputSchema,
} from './sheep-class.input';

const SheepRamsInputSchema = SheepClassInputSchema.transform((val) => ({
  ...val,
  name: 'rams' as const,
  number: '1' as const,
}));
const SheepWethersInputSchema = SheepClassInputSchema.transform((val) => ({
  ...val,
  name: 'wethers' as const,
  number: '2' as const,
}));

const SheepMaidenEwesInputSchema = SheepClassWithLambingInputSchema.transform(
  (val) => ({
    ...val,
    name: 'maidenEwes' as const,
    number: '3' as const,
  }),
);
const SheepBreedingEwesInputSchema = SheepClassWithLambingInputSchema.transform(
  (val) => ({
    ...val,
    name: 'breedingEwes' as const,
    number: '4' as const,
  }),
);
const SheepOtherEwesInputSchema = SheepClassInputSchema.transform((val) => ({
  ...val,
  name: 'otherEwes' as const,
  number: '5' as const,
}));
const SheepLambsHoggetsInputSchema = SheepClassInputSchema.transform((val) => ({
  ...val,
  name: 'lambsHoggets' as const,
  number: '6' as const,
}));

export const SheepClassesInputSchema = object({
  rams: SheepRamsInputSchema.optional(),
  wethers: SheepWethersInputSchema.optional(),
  maidenEwes: SheepMaidenEwesInputSchema.optional(),
  breedingEwes: SheepBreedingEwesInputSchema.optional(),
  otherEwes: SheepOtherEwesInputSchema.optional(),
  lambsHoggets: SheepLambsHoggetsInputSchema.optional(),
});

export type SheepRamsInputTransformed = z.output<typeof SheepRamsInputSchema>;
export type SheepWethersInputTransformed = z.output<
  typeof SheepWethersInputSchema
>;
export type SheepMaidenEwesInputTransformed = z.output<
  typeof SheepMaidenEwesInputSchema
>;
export type SheepBreedingEwesInputTransformed = z.output<
  typeof SheepBreedingEwesInputSchema
>;
export type SheepOtherEwesInputTransformed = z.output<
  typeof SheepOtherEwesInputSchema
>;
export type SheepLambsHoggetsInputTransformed = z.output<
  typeof SheepLambsHoggetsInputSchema
>;

export type SheepSpecificClassInputTransformed =
  | SheepRamsInputTransformed
  | SheepWethersInputTransformed
  | SheepMaidenEwesInputTransformed
  | SheepBreedingEwesInputTransformed
  | SheepOtherEwesInputTransformed
  | SheepLambsHoggetsInputTransformed;
