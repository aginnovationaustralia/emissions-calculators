import { InorganicFertiliserTypes } from '@/constants/enums';
import { enumInput, numberInput } from '@/tools/inputs';
import {
  ATMOS_DEPOSIT_5_4,
  FERT_INORGANIC_5_1,
  LEACH_RUNOFF_5_5,
  PURCH_FERT_15_4,
} from '@/tools/modules';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { InorganicFertiliserComponentInputSchema } from './inorganic-fertiliser-components.input';

export const InorganicFertiliserInputScope3Method1Schema = object({
  massAppliedKg: numberInput(
    (val) => mass('Inorganic Fertiliser', val),
    {
      name: 'massAppliedKg',
      method: '1',
      description: 'Mass of inorganic fertiliser applied',
      modules: [
        FERT_INORGANIC_5_1,
        ATMOS_DEPOSIT_5_4,
        LEACH_RUNOFF_5_5,
        PURCH_FERT_15_4,
      ],
    },
    (s) => s.min(0),
  ),
  fertiliserType: enumInput(InorganicFertiliserTypes, {
    name: 'Inorganic fertiliser type',
    description: 'Type of inorganic fertiliser applied',
    modules: [
      FERT_INORGANIC_5_1,
      ATMOS_DEPOSIT_5_4,
      LEACH_RUNOFF_5_5,
      PURCH_FERT_15_4,
    ],
  }),
  components: z
    .array(InorganicFertiliserComponentInputSchema)
    .optional()
    .meta({
      description: `Components of the inorganic fertiliser applied.
    NOTE: 5.1.2.1 FNinorganic,f data source allows you to supply a custom nitrogen fraction for the fertiliser. This is currently
   implemented via the components field. This means you must supply all components if you want this scenario. If you only supply
   a custom nitrogen fraction, scope 3 emissions will be under calculated. Do not supply a partial list of components.`,
    }),
  calculationMethodScope3: z.literal('1').meta({
    description:
      'Choosing method 1 for calculating scope 3 emissions for this fertiliser',
  }),
}).meta({ title: 'Scope 3 method 1' });

export type InorganicFertiliserInputScope3Method1 = z.input<
  typeof InorganicFertiliserInputScope3Method1Schema
>;

export type InorganicFertiliserInputScope3Method1Transformed = z.output<
  typeof InorganicFertiliserInputScope3Method1Schema
>;
