import { object, proportion } from '@/types/schemas';
import { z } from 'zod';
import {
  SwineBoarsInputSchema,
  SwineGiltsInputSchema,
  SwineOtherInputSchema,
  SwineSowsInputSchema,
} from './swine-class.input';
import { input } from '@/tools/inputs';
import { realNumber } from '@/tools/units';

const SwineManureStage2AllocationsSchema = object({
  solidStorage: proportion('TODO').transform((val) =>
    input(`MMSm=4T=2`, realNumber(val)),
  ),
  directApplication: proportion('TODO').transform((val) =>
    input(`MMSm=13T=2`, realNumber(val)),
  ),
  digester: proportion('TODO').transform((val) =>
    input(`MMSm=7T=2`, realNumber(val)),
  ),
});

export const SwineHerdInputSchema = object({
  boars: SwineBoarsInputSchema.optional(),
  sows: SwineSowsInputSchema.optional(),
  gilts: SwineGiltsInputSchema.optional(),
  others: SwineOtherInputSchema.optional(),
});

export type SwineHerdInput = z.input<typeof SwineHerdInputSchema>;
export type SwineHerdInputTransformed = z.output<typeof SwineHerdInputSchema>;
