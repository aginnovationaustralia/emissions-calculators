import { FreightTypes } from '@/constants/enums';
import { transportFuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { input, numberInput } from '@/tools/inputs';
import { FREIGHT_15_13 } from '@/tools/modules';
import { kilometresToMetres, tonnesToKg } from '@/tools/unit-conversion';
import { distance, mass } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const FreightBaseInputSchema = object({
  freightType: z
    .literal(FreightTypes)
    .transform((val) =>
      input(val, { name: 'freightType', modules: [FREIGHT_15_13] }),
    )
    .meta({
      description: 'The type of vehicle used to transport this freight.',
    }),
});
export const FreightMethod1InputSchema = FreightBaseInputSchema.safeExtend({
  freightType: z
    .literal(FreightTypes)
    .transform((val) =>
      input(val, { name: 'freightType', modules: [FREIGHT_15_13] }),
    )
    .meta({
      description: 'The type of vehicle used to transport this freight.',
    }),
  distance: numberInput(
    (val) => distance(kilometresToMetres(val)),
    {
      name: 'total distance',
      description: 'Distance the freight travelled.',
      modules: [FREIGHT_15_13],
    },
    (s) => s.min(0),
  ),
  weight: numberInput(
    (val) => mass('Freight Goods', tonnesToKg(val)),
    {
      name: 'total weight transported',
      description: 'Total weight transported',
      modules: [FREIGHT_15_13],
    },
    (s) => s.min(0),
  ),
  calculationMethod: z.literal('1'),
}).meta({ title: 'Method 1 (distance and weight)' });

export type FreightMethod1Input = z.input<typeof FreightMethod1InputSchema>;
export type FreightMethod1InputTransformed = z.output<
  typeof FreightMethod1InputSchema
>;

export const FreightMethod2InputSchema = FreightBaseInputSchema.safeExtend({
  fuel: transportFuelInputSchema('freight').meta({
    description: 'Fuel used to transport the freight.',
    method: '2',
  }),
  calculationMethod: z.literal('2'),
}).meta({ title: 'Method 2 (fuel)' });

export type FreightMethod2Input = z.input<typeof FreightMethod2InputSchema>;
export type FreightMethod2InputTransformed = z.output<
  typeof FreightMethod2InputSchema
>;

export const FreightInputSchema = z.discriminatedUnion('calculationMethod', [
  FreightMethod1InputSchema,
  FreightMethod2InputSchema,
]);

export type FreightInput = z.input<typeof FreightInputSchema>;
export type FreightInputTransformed = z.output<typeof FreightInputSchema>;

export const freightIsMethod1 = (
  freight: FreightInputTransformed,
): freight is FreightMethod1InputTransformed => {
  return freight.calculationMethod === '1';
};

export const freightIsMethod2 = (
  freight: FreightInputTransformed,
): freight is FreightMethod2InputTransformed => {
  return freight.calculationMethod === '2';
};
