import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  DairyClassBullsGt1InputSchema,
  DairyClassBullsLt1PreWeanedInputSchema,
  DairyClassBullsLt1WeanedInputSchema,
  DairyClassHeifersGt1InputSchema,
  DairyClassHeifersLt1PreWeanedInputSchema,
  DairyClassHeifersLt1WeanedInputSchema,
  DairyClassMilkingCowsInputSchema,
} from './dairy-class.input';

export const DairyClassesInputSchema = object({
  milkingCows: DairyClassMilkingCowsInputSchema,
  heifersGt1: DairyClassHeifersGt1InputSchema,
  heifersLt1PreWeaned: DairyClassHeifersLt1PreWeanedInputSchema,
  heifersLt1Weaned: DairyClassHeifersLt1WeanedInputSchema,
  bullsGt1: DairyClassBullsGt1InputSchema,
  bullsLt1PreWeaned: DairyClassBullsLt1PreWeanedInputSchema,
  bullsLt1Weaned: DairyClassBullsLt1WeanedInputSchema,
});

export type DairyClassesInput = z.input<typeof DairyClassesInputSchema>;
export type DairyClassesInputTransformed = z.output<
  typeof DairyClassesInputSchema
>;
