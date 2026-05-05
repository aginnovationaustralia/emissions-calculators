import { DairyCattleBreeds } from '@/constants/enums';
import {
  DairyMilkSolidsInputSchema,
  DairyMilkVolumeInputSchema,
} from '@/modules/scope1/shared/dairy/milk.input';
import { input } from '@/tools/inputs';
import { realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import { mapOptional } from '@/tools/zod';
import { z } from 'zod';
import { DairyClassesInputSchema } from './dairy-classes.input';

export const DairyHerdInputSchema = object({
  classes: DairyClassesInputSchema,
  milkProduction: z.union([
    DairyMilkVolumeInputSchema,
    DairyMilkSolidsInputSchema,
  ]),
  breed: z.enum(DairyCattleBreeds),
  method2DryMatterDigestibility: z
    .number()
    .optional()
    .transform(
      mapOptional((val) => input('DMDj', realNumber(val))),
    ),
});

export type DairyHerdInput = z.input<typeof DairyHerdInputSchema>;
export type DairyHerdInputTransformed = z.output<typeof DairyHerdInputSchema>;
