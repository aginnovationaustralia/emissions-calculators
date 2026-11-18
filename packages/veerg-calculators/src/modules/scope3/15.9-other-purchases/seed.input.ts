import { OtherPurchasedSeedTypes } from '@/constants/enums';
import { enumSchema } from '@/tools/enum-schemas';
import { input, numberInput } from '@/tools/inputs';
import { OTHER_PURCH_15_9 } from '@/tools/modules';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const OtherPurchasedSeedSchema = object({
  seedType: enumSchema(OtherPurchasedSeedTypes)
    .transform((val) =>
      input(val, {
        name: 'Seed type',
        modules: [OTHER_PURCH_15_9],
      }),
    )
    .meta({ description: 'The type of seed purchased.' }),
  quantityKilograms: numberInput(
    (val) => mass('Seed', val),
    {
      name: 'Quantity of seed',
      description: 'The mass of seed purchased, in kilograms (kg).',
      modules: [OTHER_PURCH_15_9],
    },
    (s) => s.min(0),
  ),
}).meta({ title: 'Seed' });
export type OtherPurchasedSeedInput = z.input<typeof OtherPurchasedSeedSchema>;
export type OtherPurchasedSeedInputTransformed = z.output<
  typeof OtherPurchasedSeedSchema
>;
