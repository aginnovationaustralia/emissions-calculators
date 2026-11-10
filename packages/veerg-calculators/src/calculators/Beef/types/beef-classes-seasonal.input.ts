import { object } from '@/types/schemas';
import z from 'zod';
import {
  BeefCalfClassSeasonalInputSchema,
  BeefClassSeasonalInputSchema,
  BeefClassWithCalvesSeasonalInputSchema,
} from './beef-class.input';

const BeefBullsLt1SeasonalInputSchema =
  BeefCalfClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'bullsLt1' as const,
    number: '1' as const,
  }));

const BeefBullsGt1SeasonalInputSchema = BeefClassSeasonalInputSchema.transform(
  (val) => ({
    ...val,
    name: 'bullsGt1' as const,
    number: '2' as const,
  }),
);

const BeefCowsLt1SeasonalInputSchema =
  BeefCalfClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'cowsLt1' as const,
    number: '3' as const,
  }));

const BeefCows1To2YearsSeasonalInputSchema =
  BeefClassWithCalvesSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'cows1To2Years' as const,
    number: '4' as const,
  }));

const BeefCows2To3YearsSeasonalInputSchema =
  BeefClassWithCalvesSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'cows2To3Years' as const,
    number: '5a' as const,
  }));

const BeefCowsGt3YearsSeasonalInputSchema =
  BeefClassWithCalvesSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'cowsGt3Years' as const,
    number: '5b' as const,
  }));

const BeefSteersLt1SeasonalInputSchema =
  BeefCalfClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'steersLt1' as const,
    number: '6' as const,
  }));

const BeefSteers1To2YearsSeasonalInputSchema =
  BeefClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'steers1To2Years' as const,
    number: '7a' as const,
  }));

const BeefSteers2To3YearsSeasonalInputSchema =
  BeefClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'steers2To3Years' as const,
    number: '7b' as const,
  }));

const BeefSteersGt3YearsSeasonalInputSchema =
  BeefClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'steersGt3Years' as const,
    number: '7c' as const,
  }));

export const BeefClassesSeasonalInputSchema = object({
  period: z.literal('seasonal'),
  bullsLt1: BeefBullsLt1SeasonalInputSchema.optional(),
  bullsGt1: BeefBullsGt1SeasonalInputSchema.optional(),
  cowsLt1: BeefCowsLt1SeasonalInputSchema.optional(),
  cows1To2Years: BeefCows1To2YearsSeasonalInputSchema.optional(),
  cows2To3Years: BeefCows2To3YearsSeasonalInputSchema.optional(),
  cowsGt3Years: BeefCowsGt3YearsSeasonalInputSchema.optional(),
  steersLt1: BeefSteersLt1SeasonalInputSchema.optional(),
  steers1To2Years: BeefSteers1To2YearsSeasonalInputSchema.optional(),
  steers2To3Years: BeefSteers2To3YearsSeasonalInputSchema.optional(),
  steersGt3Years: BeefSteersGt3YearsSeasonalInputSchema.optional(),
}).meta({
  title: 'Beef classes with seasonal input',
});

export type BeefClassesSeasonalInput = z.input<
  typeof BeefClassesSeasonalInputSchema
>;

export type BeefBullsLt1SeasonalInputTransformed = z.output<
  typeof BeefBullsLt1SeasonalInputSchema
>;
export type BeefBullsGt1SeasonalInputTransformed = z.output<
  typeof BeefBullsGt1SeasonalInputSchema
>;
export type BeefCowsLt1SeasonalInputTransformed = z.output<
  typeof BeefCowsLt1SeasonalInputSchema
>;
export type BeefCows1To2YearsSeasonalInputTransformed = z.output<
  typeof BeefCows1To2YearsSeasonalInputSchema
>;
export type BeefCows2To3YearsSeasonalInputTransformed = z.output<
  typeof BeefCows2To3YearsSeasonalInputSchema
>;
export type BeefCowsGt3YearsSeasonalInputTransformed = z.output<
  typeof BeefCowsGt3YearsSeasonalInputSchema
>;
export type BeefSteersLt1SeasonalInputTransformed = z.output<
  typeof BeefSteersLt1SeasonalInputSchema
>;
export type BeefSteers1To2YearsSeasonalInputTransformed = z.output<
  typeof BeefSteers1To2YearsSeasonalInputSchema
>;
export type BeefSteers2To3YearsSeasonalInputTransformed = z.output<
  typeof BeefSteers2To3YearsSeasonalInputSchema
>;
export type BeefSteersGt3YearsSeasonalInputTransformed = z.output<
  typeof BeefSteersGt3YearsSeasonalInputSchema
>;

export type BeefSpecificClassSeasonalInputTransformed =
  | BeefBullsLt1SeasonalInputTransformed
  | BeefBullsGt1SeasonalInputTransformed
  | BeefCowsLt1SeasonalInputTransformed
  | BeefCows1To2YearsSeasonalInputTransformed
  | BeefCows2To3YearsSeasonalInputTransformed
  | BeefCowsGt3YearsSeasonalInputTransformed
  | BeefSteersLt1SeasonalInputTransformed
  | BeefSteers1To2YearsSeasonalInputTransformed
  | BeefSteers2To3YearsSeasonalInputTransformed
  | BeefSteersGt3YearsSeasonalInputTransformed;
