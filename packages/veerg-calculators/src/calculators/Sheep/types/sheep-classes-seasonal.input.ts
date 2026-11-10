import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  SheepClassSeasonalInputSchema,
  SheepClassWithLambingSeasonalInputSchema,
  SheepClassWithProportionLambsBornSeasonalInputSchema,
} from './sheep-class-seasonal.input';

const SheepRamsSeasonalInputSchema = SheepClassSeasonalInputSchema.transform(
  (val) => ({
    ...val,
    name: 'rams' as const,
    number: '1' as const,
  }),
);
const SheepWethersSeasonalInputSchema = SheepClassSeasonalInputSchema.transform(
  (val) => ({
    ...val,
    name: 'wethers' as const,
    number: '2' as const,
  }),
);

const SheepMaidenEwesSeasonalInputSchema =
  SheepClassWithLambingSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'maidenEwes' as const,
    number: '3' as const,
  }));
const SheepBreedingEwesSeasonalInputSchema =
  SheepClassWithLambingSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'breedingEwes' as const,
    number: '4' as const,
  }));
const SheepOtherEwesSeasonalInputSchema =
  SheepClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'otherEwes' as const,
    number: '5' as const,
  }));
const SheepLambsHoggetsSeasonalInputSchema =
  SheepClassWithProportionLambsBornSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'lambsHoggets' as const,
    number: '6' as const,
  }));

export const SheepClassesSeasonalInputSchema = object({
  period: z.literal('seasonal'),
  breedingEwes: SheepBreedingEwesSeasonalInputSchema.optional(),
  lambsHoggets: SheepLambsHoggetsSeasonalInputSchema.optional(),
  maidenEwes: SheepMaidenEwesSeasonalInputSchema.optional(),
  otherEwes: SheepOtherEwesSeasonalInputSchema.optional(),
  rams: SheepRamsSeasonalInputSchema.optional(),
  wethers: SheepWethersSeasonalInputSchema.optional(),
}).meta({ title: 'Sheep classes (seasonal input)' });

export type SheepClassesSeasonalInput = z.input<
  typeof SheepClassesSeasonalInputSchema
>;

export type SheepRamsSeasonalInputTransformed = z.output<
  typeof SheepRamsSeasonalInputSchema
>;
export type SheepWethersSeasonalInputTransformed = z.output<
  typeof SheepWethersSeasonalInputSchema
>;
export type SheepMaidenEwesSeasonalInputTransformed = z.output<
  typeof SheepMaidenEwesSeasonalInputSchema
>;
export type SheepBreedingEwesSeasonalInputTransformed = z.output<
  typeof SheepBreedingEwesSeasonalInputSchema
>;
export type SheepOtherEwesSeasonalInputTransformed = z.output<
  typeof SheepOtherEwesSeasonalInputSchema
>;
export type SheepLambsHoggetsSeasonalInputTransformed = z.output<
  typeof SheepLambsHoggetsSeasonalInputSchema
>;

export type SheepSpecificClassSeasonalInputTransformed =
  | SheepRamsSeasonalInputTransformed
  | SheepWethersSeasonalInputTransformed
  | SheepMaidenEwesSeasonalInputTransformed
  | SheepBreedingEwesSeasonalInputTransformed
  | SheepOtherEwesSeasonalInputTransformed
  | SheepLambsHoggetsSeasonalInputTransformed;
