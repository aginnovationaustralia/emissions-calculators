import { OtherPurchasedCleaningChemicalTypes } from '@/constants/enums';
import { enumSchema } from '@/tools/enum-schemas';
import { input, numberInput } from '@/tools/inputs';
import { OTHER_PURCH_15_9 } from '@/tools/modules';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const OtherPurchasedCleaningChemicalSchema = object({
  cleaningChemicalType: enumSchema(OtherPurchasedCleaningChemicalTypes)
    .transform((val) =>
      input(val, {
        name: 'Cleaning chemical type',
        modules: [OTHER_PURCH_15_9],
      }),
    )
    .meta({ description: 'The type of cleaning chemical purchased.' }),
  quantityKilograms: numberInput(
    (val) => mass('Chemical', val),
    {
      name: 'Quantity of cleaning chemical',
      description:
        'The mass of cleaning chemical purchased, in kilograms (kg).',
      modules: [OTHER_PURCH_15_9],
    },
    (s) => s.min(0),
  ),
}).meta({ title: 'Cleaning chemicals' });
export type OtherPurchasedCleaningChemicalInput = z.input<
  typeof OtherPurchasedCleaningChemicalSchema
>;
export type OtherPurchasedCleaningChemicalInputTransformed = z.output<
  typeof OtherPurchasedCleaningChemicalSchema
>;
