import {
  MatureDairyClass,
  MatureDairyClasses,
  PreWeanedDairyClass,
  PreWeanedDairyClasses,
} from '@/constants/enums';
import {
  booleanInput,
  enumInput,
  numberInput,
  numberInputOptional,
} from '@/tools/inputs';
import { head, liveweight } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';
import { INTENSITIES } from '@/tools/modules';

const BaseDairySaleInputSchema = object({
  numberSold: numberInput(head, {
    name: 'numberSold',
    description: 'The number of cattle sold.',
    modules: [INTENSITIES],
  }),
  averageLiveweight: numberInputOptional(
    (val) => liveweight(val),
    {
      name: 'averageLiveweight',
      description: 'The average liveweight of cattle sold.',
      modules: [INTENSITIES],
    },
    (s) => s.min(0),
  ),
});

const MatureDairySaleInputSchema = BaseDairySaleInputSchema.safeExtend({
  class: enumInput(MatureDairyClasses, {
    name: 'dairy class',
    description: 'The class of cattle that was sold.',
    modules: [INTENSITIES],
  }),
}).meta({ title: 'Mature cattle sale' });
export type MatureDairySaleInputTransformed = z.output<
  typeof MatureDairySaleInputSchema
>;

const DairyCalfSaleSchema = BaseDairySaleInputSchema.safeExtend({
  class: enumInput(PreWeanedDairyClasses, {
    name: 'dairy class',
    description: 'The class of cattle that was sold.',
    modules: [INTENSITIES],
  }),
  weaned: booleanInput(
    'weaned',
    'True if the calves sold were weaned at the time of the sale.',
    [INTENSITIES],
  ),
}).meta({ title: 'Calf sale' });
export type DairyCalfSaleInputTransformed = z.output<
  typeof DairyCalfSaleSchema
>;

export const DairySaleInputSchema = z.xor([
  MatureDairySaleInputSchema,
  DairyCalfSaleSchema,
]);
export type DairySaleInput = z.input<typeof DairySaleInputSchema>;
export type DairySaleInputTransformed = z.output<typeof DairySaleInputSchema>;

export const isDairySaleMature = (
  sale: DairySaleInputTransformed,
): sale is MatureDairySaleInputTransformed => {
  return MatureDairyClasses.includes(sale.class.unit as MatureDairyClass);
};

export const isDairySaleCalf = (
  sale: DairySaleInputTransformed,
): sale is DairyCalfSaleInputTransformed => {
  return PreWeanedDairyClasses.includes(sale.class.unit as PreWeanedDairyClass);
};
