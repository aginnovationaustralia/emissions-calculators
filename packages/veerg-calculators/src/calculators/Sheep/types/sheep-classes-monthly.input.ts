import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  SheepClassMonthlyInputSchema,
  SheepClassWithLambingMonthlyInputSchema,
  SheepClassWithProportionLambsBornMonthlyInputSchema,
} from './sheep-class-monthly.input';

const SheepRamsMonthlyInputSchema = SheepClassMonthlyInputSchema.transform(
  (val) => ({
    ...val,
    name: 'rams' as const,
    number: '1' as const,
  }),
);
const SheepWethersMonthlyInputSchema = SheepClassMonthlyInputSchema.transform(
  (val) => ({
    ...val,
    name: 'wethers' as const,
    number: '2' as const,
  }),
);

const SheepMaidenEwesMonthlyInputSchema =
  SheepClassWithLambingMonthlyInputSchema.transform((val) => ({
    ...val,
    name: 'maidenEwes' as const,
    number: '3' as const,
  }));
const SheepBreedingEwesMonthlyInputSchema =
  SheepClassWithLambingMonthlyInputSchema.transform((val) => ({
    ...val,
    name: 'breedingEwes' as const,
    number: '4' as const,
  }));
const SheepOtherEwesMonthlyInputSchema = SheepClassMonthlyInputSchema.transform(
  (val) => ({
    ...val,
    name: 'otherEwes' as const,
    number: '5' as const,
  }),
);
const SheepLambsHoggetsMonthlyInputSchema =
  SheepClassWithProportionLambsBornMonthlyInputSchema.transform((val) => ({
    ...val,
    name: 'lambsHoggets' as const,
    number: '6' as const,
  }));

export const SheepClassesMonthlyInputSchema = object({
  period: z.literal('monthly'),
  breedingEwes: SheepBreedingEwesMonthlyInputSchema.optional(),
  lambsHoggets: SheepLambsHoggetsMonthlyInputSchema.optional(),
  maidenEwes: SheepMaidenEwesMonthlyInputSchema.optional(),
  otherEwes: SheepOtherEwesMonthlyInputSchema.optional(),
  rams: SheepRamsMonthlyInputSchema.optional(),
  wethers: SheepWethersMonthlyInputSchema.optional(),
}).meta({ title: 'Sheep classes (monthly input)' });

export type SheepClassesMonthlyInput = z.input<
  typeof SheepClassesMonthlyInputSchema
>;

export type SheepRamsMonthlyInputTransformed = z.output<
  typeof SheepRamsMonthlyInputSchema
>;
export type SheepWethersMonthlyInputTransformed = z.output<
  typeof SheepWethersMonthlyInputSchema
>;
export type SheepMaidenEwesMonthlyInputTransformed = z.output<
  typeof SheepMaidenEwesMonthlyInputSchema
>;
export type SheepBreedingEwesMonthlyInputTransformed = z.output<
  typeof SheepBreedingEwesMonthlyInputSchema
>;
export type SheepOtherEwesMonthlyInputTransformed = z.output<
  typeof SheepOtherEwesMonthlyInputSchema
>;
export type SheepLambsHoggetsMonthlyInputTransformed = z.output<
  typeof SheepLambsHoggetsMonthlyInputSchema
>;

export type SheepSpecificClassMonthlyInputTransformed =
  | SheepRamsMonthlyInputTransformed
  | SheepWethersMonthlyInputTransformed
  | SheepMaidenEwesMonthlyInputTransformed
  | SheepBreedingEwesMonthlyInputTransformed
  | SheepOtherEwesMonthlyInputTransformed
  | SheepLambsHoggetsMonthlyInputTransformed;
