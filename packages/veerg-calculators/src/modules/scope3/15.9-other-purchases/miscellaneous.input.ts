import { OtherPurchasedMiscellaneousTypes } from '@/constants/enums';
import { enumSchema } from '@/tools/enum-schemas';
import { input, numberInput } from '@/tools/inputs';
import { OTHER_PURCH_15_9 } from '@/tools/modules';
import { realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const OtherPurchasedMiscellaneousSchema = object({
  miscellaneousType: enumSchema(OtherPurchasedMiscellaneousTypes)
    .transform((val) =>
      input(val, {
        name: 'Miscellaneous item type',
        modules: [OTHER_PURCH_15_9],
      }),
    )
    .meta({ description: 'The type of miscellaneous item purchased.' }),
  quantity: numberInput(
    (val) => realNumber(val),
    {
      name: 'Quantity of miscellaneous item',
      description:
        'The quantity purchased: the number of tags for animal ear tags, or kilograms (kg) for nylon netting.',
      modules: [OTHER_PURCH_15_9],
    },
    (s) => s.min(0),
  ),
}).meta({ title: 'Miscellaneous' });
export type OtherPurchasedMiscellaneousInput = z.input<
  typeof OtherPurchasedMiscellaneousSchema
>;
export type OtherPurchasedMiscellaneousInputTransformed = z.output<
  typeof OtherPurchasedMiscellaneousSchema
>;
