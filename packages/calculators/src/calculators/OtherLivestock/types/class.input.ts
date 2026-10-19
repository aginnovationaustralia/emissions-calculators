import { numberInput } from '@/tools/inputs';
import { ENTERIC_OTHER_3_6, MANURE_OTHER_4_7 } from '@/tools/modules';
import { head } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const OtherLivestockBaseInputSchema = object({
  head: numberInput(
    (val) => head(val),
    {
      name: 'Nj',
      description: 'Number of animals in this class',
      modules: [ENTERIC_OTHER_3_6, MANURE_OTHER_4_7],
    },
    (s) => s.min(0),
  ),
});

export const OtherLivestockBuffaloClassInputSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Buffalo'),
  })
    .transform((val) => ({
      ...val,
      number: '1' as const,
    }))
    .meta({ title: 'Buffalo' });

export const OtherLivestockGoatClassInputSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Goats'),
  })
    .transform((val) => ({
      ...val,
      number: '2' as const,
    }))
    .meta({ title: 'Goats' });

export const OtherLivestockDeerClassInputSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Deer'),
  })
    .transform((val) => ({
      ...val,
      number: '3' as const,
    }))
    .meta({ title: 'Deer' });

export const OtherLivestockCamelClassSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Camels'),
  })
    .transform((val) => ({
      ...val,
      number: '4' as const,
    }))
    .meta({ title: 'Camels' });

export const OtherLivestockAlpacaClassSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Alpacas'),
  })
    .transform((val) => ({
      ...val,
      number: '5' as const,
    }))
    .meta({ title: 'Alpacas' });

export const OtherLivestockHorseClassSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Horses'),
  })
    .transform((val) => ({
      ...val,
      number: '6' as const,
    }))
    .meta({ title: 'Horses' });

export const OtherLivestockMuleAssClassSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Mules/asses'),
  })
    .transform((val) => ({
      ...val,
      number: '7' as const,
    }))
    .meta({ title: 'Mules/asses' });

export const OtherLivestockEmuOstrichClassSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Emus/ostriches'),
  })
    .transform((val) => ({
      ...val,
      number: '8' as const,
    }))
    .meta({ title: 'Emus/ostriches' });

export const OtherLivestockClassInputSchema = z.discriminatedUnion('type', [
  OtherLivestockCamelClassSchema,
  OtherLivestockAlpacaClassSchema,
  OtherLivestockHorseClassSchema,
  OtherLivestockMuleAssClassSchema,
  OtherLivestockEmuOstrichClassSchema,
  OtherLivestockBuffaloClassInputSchema,
  OtherLivestockGoatClassInputSchema,
  OtherLivestockDeerClassInputSchema,
]);

export type OtherLivestockClassInput = z.input<
  typeof OtherLivestockClassInputSchema
>;
export type OtherLivestockClassInputTransformed = z.output<
  typeof OtherLivestockClassInputSchema
>;
