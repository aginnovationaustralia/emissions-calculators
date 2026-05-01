import { input } from '@/tools/inputs';
import {
  massPerHeadPerDay,
  realNumber,
  volumePerHeadPerDay,
} from '@/tools/units';
import { object, percentage } from '@/types/schemas';
import { z } from 'zod';

export const DairyMilkVolumeInputSchema = object({
  litresPerHeadPerDay: z
    .number()
    .gt(0)
    .transform((val) => input('MPj', volumePerHeadPerDay('Milk', val))),
});

export const DairyMilkSolidsInputSchema = object({
  kgSolidsPerHeadPerDay: z
    .number()
    .gt(0)
    .transform((val) => input('MSj', massPerHeadPerDay('Milk Solids', val))),
  fatContent: percentage(
    'Fat content percentage in fat and protein corrected milk',
  ).transform((val) => input('FCj', realNumber(val))),
  proteinContent: percentage(
    'Protein content percentage in fat and protein corrected milk',
  ).transform((val) => input('PCj', realNumber(val))),
});

export const DairyMilkProductionInputSchema = z.union([
  DairyMilkVolumeInputSchema,
  DairyMilkSolidsInputSchema,
]);

export type DairyMilkProductionInput = z.input<
  typeof DairyMilkProductionInputSchema
>;
export type DairyMilkProductionInputTransformed = z.output<
  typeof DairyMilkProductionInputSchema
>;
