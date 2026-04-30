import { DairyCattleBreeds } from '@/constants/enums';
import {
  DairyMilkSolidsInputSchema,
  DairyMilkVolumeInputSchema,
} from '@/modules/scope1/shared/dairy/milk.input';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { DairyClassesInputSchema } from './dairy-classes.input';

export const DairyHerdInputSchema = object({
  classes: DairyClassesInputSchema,
  milkProduction: z.union([
    DairyMilkVolumeInputSchema,
    DairyMilkSolidsInputSchema,
  ]),
  breed: z.enum(DairyCattleBreeds),
});

export type DairyHerdInput = z.input<typeof DairyHerdInputSchema>;
export type DairyHerdInputTransformed = z.output<typeof DairyHerdInputSchema>;
