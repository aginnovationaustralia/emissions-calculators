import { BuffaloClasses, DeerClasses, GoatClasses } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { head } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const OtherLivestockBaseInputSchema = object({
  head: z
    .number()
    .min(0)
    .meta({ description: 'Number of head' })
    .transform((val) => input('Nj', head(val))),
});

export const OtherLivestockBuffaloClassInputSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Buffalo'),
    class: z.enum(BuffaloClasses),
  }).transform((val) => ({
    ...val,
    number: '1' as const,
  }));

export const OtherLivestockGoatClassInputSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Goats'),
    class: z.enum(GoatClasses),
  }).transform((val) => ({
    ...val,
    number: '2' as const,
  }));

export const OtherLivestockDeerClassInputSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Deer'),
    class: z.enum(DeerClasses),
  }).transform((val) => ({
    ...val,
    number: '3' as const,
  }));

export const OtherLivestockCamelClassSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Camels'),
  }).transform((val) => ({
    ...val,
    number: '4' as const,
  }));

export const OtherLivestockAlpacaClassSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Alpacas'),
  }).transform((val) => ({
    ...val,
    number: '5' as const,
  }));

export const OtherLivestockHorseClassSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Horses'),
  }).transform((val) => ({
    ...val,
    number: '6' as const,
  }));

export const OtherLivestockMuleAssClassSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Mules/asses'),
  }).transform((val) => ({
    ...val,
    number: '7' as const,
  }));

export const OtherLivestockEmuOstrichClassSchema =
  OtherLivestockBaseInputSchema.extend({
    type: z.literal('Emus/ostriches'),
  }).transform((val) => ({
    ...val,
    number: '8' as const,
  }));

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
