import { OtherPurchasedPharmacyChemicalTypes } from '@/constants/enums';
import { enumSchema } from '@/tools/enum-schemas';
import { input, numberInput } from '@/tools/inputs';
import { OTHER_PURCH_15_9 } from '@/tools/modules';
import { head } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const OtherPurchasedPharmacyChemicalSchema = object({
  pharmacyChemicalType: enumSchema(OtherPurchasedPharmacyChemicalTypes)
    .transform((val) =>
      input(val, {
        name: 'Pharmacy chemical type',
        modules: [OTHER_PURCH_15_9],
      }),
    )
    .meta({ description: 'The type of pharmacy chemical treatment used.' }),
  headTreated: numberInput(
    (val) => head(val),
    {
      name: 'Number of head treated',
      description: 'The number of animals treated with the pharmacy chemical.',
      modules: [OTHER_PURCH_15_9],
    },
    (s) => s.min(0),
  ),
}).meta({ title: 'Pharmacy chemicals' });
export type OtherPurchasedPharmacyChemicalInput = z.input<
  typeof OtherPurchasedPharmacyChemicalSchema
>;
export type OtherPurchasedPharmacyChemicalInputTransformed = z.output<
  typeof OtherPurchasedPharmacyChemicalSchema
>;
