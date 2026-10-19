import {
  enumInput,
  isProportion,
  numberInput,
  numberInputOptional,
} from '@/tools/inputs';
import { LIME_5_3, PURCH_LIME_15_6 } from '@/tools/modules';
import { mass, massPerMass, realNumber } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object } from '@/types/schemas';
import { z } from 'zod';

const LimeApplicationBaseInputSchema = object({
  massAppliedKg: numberInput(
    (val) => mass('Lime', val),
    {
      name: 'Mlime',
      method: '1',
      description: 'Total mass of lime applied',
      modules: [PURCH_LIME_15_6, LIME_5_3],
    },
    (s) => s.min(0),
  ),
  customScope3EmissionsFactor: numberInputOptional(
    (val) => massPerMass('CO2e', 'Lime', val),
    {
      name: 'customScope3EmissionsFactor',
      method: '2',
      scope: '3',
      description:
        'Method 2: supply a custom scope 3 emissions factor for lime based on supplier records',
      modules: [PURCH_LIME_15_6],
    },
    (s) => s.min(0),
  ),
});

export const LimeApplicationLimeInputSchema =
  LimeApplicationBaseInputSchema.safeExtend({
    limestoneFraction: numberInput(
      (val) => realNumber(val),
      {
        name: 'fracLime',
        method: '1',
        description: DESCRIPTIONS.LIMESTONEFRACTION,
        modules: [PURCH_LIME_15_6, LIME_5_3],
      },
      isProportion,
    ),
    type: enumInput(['Limestone', 'Dolomite'], {
      description:
        'Type of soil ameliorant. Note that gypsum applications are not counted in scope 1 emissions, only scope 3',
      name: 'ameliorantType',
      modules: [PURCH_LIME_15_6],
    }),
  }).meta({ title: 'Limestone or Dolomite Application' });

export const LimeApplicationGypsumInputSchema =
  LimeApplicationBaseInputSchema.safeExtend({
    type: z.literal('Gypsum'),
  }).meta({ title: 'Gypsum Application' });

export const LimeApplicationInputSchema = z.discriminatedUnion('type', [
  LimeApplicationLimeInputSchema,
  LimeApplicationGypsumInputSchema,
]);

export type LimeApplicationInput = z.input<typeof LimeApplicationInputSchema>;
export type LimeApplicationInputTransformed = z.output<
  typeof LimeApplicationInputSchema
>;

export const limeApplicationIsNotGypsum = (
  input: LimeApplicationInputTransformed,
): input is z.output<typeof LimeApplicationLimeInputSchema> => {
  return input.type !== 'Gypsum';
};
