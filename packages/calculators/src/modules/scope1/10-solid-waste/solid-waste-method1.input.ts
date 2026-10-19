import { numberInputOptional } from '@/tools/inputs';
import { SOLID_WASTE_10_1 } from '@/tools/modules';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const createWasteMassSchema = (symbol: string, description: string) =>
  numberInputOptional(
    (val) => mass('Solid Waste', tonnesToKg(val)),
    {
      name: symbol,
      method: '1',
      description,
      modules: [SOLID_WASTE_10_1],
    },
    (s) => s.min(0),
  );

export const SolidWasteMethod1InputSchema = object({
  method: z.literal('1'),
  unmanagedBurial: createWasteMassSchema(
    'Qu (burial)',
    'Amount of waste disposed of through burial',
  ),
  unmanagedDeep: createWasteMassSchema(
    'Qu (deep)',
    'Amount of solid waste disposed of in a deep open waste dump.',
  ),
  unmanagedShallow: createWasteMassSchema(
    'Qu (shallow)',
    'Amount of solid waste disposed of in a shallow open waste dump.',
  ),
  composting: createWasteMassSchema(
    'Qt (composting)',
    'Amount of waste treated through composting',
  ),
  anaerobicDigestion: createWasteMassSchema(
    'Qt (anaerobic)',
    'Amount of waste treated through anaerobic digestion',
  ),
  incineration: createWasteMassSchema(
    'Qburn',
    'Amount of solid waste disposed of by incineration.',
  ),
}).meta({
  title: 'Method 1',
});
export type SolidWasteMethod1Input = z.input<
  typeof SolidWasteMethod1InputSchema
>;
export type SolidWasteMethod1InputTransformed = z.output<
  typeof SolidWasteMethod1InputSchema
>;
