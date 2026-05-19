import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  BeefClassInputSchema,
  BeefClassWithCalvesInputSchema,
} from './beef-class.input';

const BeefBullsLt1InputSchema = BeefClassInputSchema.transform((val) => ({
  ...val,
  name: 'bullsLt1' as const,
  number: '1' as const,
}));
const BeefBullsGt1InputSchema = BeefClassInputSchema.transform((val) => ({
  ...val,
  name: 'bullsGt1' as const,
  number: '2' as const,
}));

const BeefCowsLt1InputSchema = BeefClassInputSchema.transform((val) => ({
  ...val,
  name: 'cowsLt1' as const,
  number: '3' as const,
}));
const BeefCows1To2YearsInputSchema = BeefClassInputSchema.transform((val) => ({
  ...val,
  name: 'cows1To2Years' as const,
  number: '4' as const,
}));
const BeefCows2To3YearsInputSchema = BeefClassWithCalvesInputSchema.transform(
  (val) => ({ ...val, name: 'cows2To3Years' as const, number: '5a' as const }),
);
const BeefCowsGt3YearsInputSchema = BeefClassWithCalvesInputSchema.transform(
  (val) => ({ ...val, name: 'cowsGt3Years' as const, number: '5b' as const }),
);
const BeefSteersLt1InputSchema = BeefClassInputSchema.transform((val) => ({
  ...val,
  name: 'steersLt1' as const,
  number: '6' as const,
}));
const BeefSteers1To2YearsInputSchema = BeefClassInputSchema.transform(
  (val) => ({
    ...val,
    name: 'steers1To2Years' as const,
    number: '7a' as const,
  }),
);
const BeefSteers2To3YearsInputSchema = BeefClassInputSchema.transform(
  (val) => ({
    ...val,
    name: 'steers2To3Years' as const,
    number: '7b' as const,
  }),
);
const BeefSteersGt3YearsInputSchema = BeefClassInputSchema.transform((val) => ({
  ...val,
  name: 'steersGt3Years' as const,
  number: '7c' as const,
}));

export const BeefClassesInputSchema = object({
  bullsLt1: BeefBullsLt1InputSchema.optional(),
  bullsGt1: BeefBullsGt1InputSchema.optional(),
  cowsLt1: BeefCowsLt1InputSchema.optional(),
  cows1To2Years: BeefCows1To2YearsInputSchema.optional(),
  cows2To3Years: BeefCows2To3YearsInputSchema.optional(),
  cowsGt3Years: BeefCowsGt3YearsInputSchema.optional(),
  steersLt1: BeefSteersLt1InputSchema.optional(),
  steers1To2Years: BeefSteers1To2YearsInputSchema.optional(),
  steers2To3Years: BeefSteers2To3YearsInputSchema.optional(),
  steersGt3Years: BeefSteersGt3YearsInputSchema.optional(),
});

export type BeefBullsLt1InputTransformed = z.output<
  typeof BeefBullsLt1InputSchema
>;
export type BeefBullsGt1InputTransformed = z.output<
  typeof BeefBullsGt1InputSchema
>;
export type BeefCowsLt1InputTransformed = z.output<
  typeof BeefCowsLt1InputSchema
>;
export type BeefCows1To2YearsInputTransformed = z.output<
  typeof BeefCows1To2YearsInputSchema
>;
export type BeefCows2To3YearsInputTransformed = z.output<
  typeof BeefCows2To3YearsInputSchema
>;
export type BeefCowsGt3YearsInputTransformed = z.output<
  typeof BeefCowsGt3YearsInputSchema
>;
export type BeefSteersLt1InputTransformed = z.output<
  typeof BeefSteersLt1InputSchema
>;
export type BeefSteers1To2YearsInputTransformed = z.output<
  typeof BeefSteers1To2YearsInputSchema
>;
export type BeefSteers2To3YearsInputTransformed = z.output<
  typeof BeefSteers2To3YearsInputSchema
>;
export type BeefSteersGt3YearsInputTransformed = z.output<
  typeof BeefSteersGt3YearsInputSchema
>;

export type BeefSpecificClassInputTransformed =
  | BeefBullsLt1InputTransformed
  | BeefBullsGt1InputTransformed
  | BeefCowsLt1InputTransformed
  | BeefCows1To2YearsInputTransformed
  | BeefCows2To3YearsInputTransformed
  | BeefCowsGt3YearsInputTransformed
  | BeefSteersLt1InputTransformed
  | BeefSteers1To2YearsInputTransformed
  | BeefSteers2To3YearsInputTransformed
  | BeefSteersGt3YearsInputTransformed;
