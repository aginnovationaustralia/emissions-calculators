import { LivestockLocation } from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  dairyClassBullsGt1InputSchema,
  dairyClassBullsLt1PreWeanedInputSchema,
  dairyClassBullsLt1WeanedInputSchema,
  dairyClassHeifersGt1InputSchema,
  dairyClassHeifersLt1PreWeanedInputSchema,
  dairyClassHeifersLt1WeanedInputSchema,
  dairyClassMilkingCowsInputSchema,
} from './dairy-class.input';

export const dairyClassesInputSchema = (location: LivestockLocation) =>
  object({
    milkingCows: dairyClassMilkingCowsInputSchema(location).optional(),
    heifersGt1: dairyClassHeifersGt1InputSchema(location).optional(),
    heifersLt1PreWeaned:
      dairyClassHeifersLt1PreWeanedInputSchema(location).optional(),
    heifersLt1Weaned:
      dairyClassHeifersLt1WeanedInputSchema(location).optional(),
    bullsGt1: dairyClassBullsGt1InputSchema(location).optional(),
    bullsLt1PreWeaned:
      dairyClassBullsLt1PreWeanedInputSchema(location).optional(),
    bullsLt1Weaned: dairyClassBullsLt1WeanedInputSchema(location).optional(),
  });

export type DairyClassesInput = z.input<
  ReturnType<typeof dairyClassesInputSchema>
>;
export type DairyClassesInputTransformed = z.output<
  ReturnType<typeof dairyClassesInputSchema>
>;
