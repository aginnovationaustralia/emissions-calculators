import { SwineMMSTypes } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { mass, realNumber } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

const SwineLiquidsMMSSchema = object({
  liquidsSystem1: z
    .enum(SwineMMSTypes)
    .transform((val) => input('MMST=1', val)),
  fractionOfManureToLiquidsMMS: proportion(
    'Fraction of manure to liquids MMS',
  ).transform((val) => input('MMSmT=1', realNumber(val))),

  fractionOfManureFromLiquidsStage1to2: proportion(
    'Fraction of manure from liquids stage 1 to stage 2 MMS',
  ).transform((val) => input('MMSmT=2', realNumber(val))),
  liquidsSystem2: z
    .enum(SwineMMSTypes)
    .transform((val) => input('MMST=2', val)),
});

const SwineSolidsMMSSchema = object({
  fractionOfNitrogenSeparatedToSolidStorage: proportion(
    'Fraction of nitrogen separated to solid storage',
  ).transform((val) => input('SNm', realNumber(val))),
  solidsSystem1: z.enum(SwineMMSTypes).transform((val) => input('MMST=1', val)),
  fractionOfManureToSolidsMMS: proportion(
    'Fraction of manure to solids MMS',
  ).transform((val) => input('fractionOfManureToSolidsMMS', realNumber(val))),
  fractionOfManureFromSolidsStage1to2: proportion(
    'Fraction of manure from solids stage 1 to stage 2 MMS',
  ).transform((val) =>
    input('fractionOfManureFromSolidsStage1to2', realNumber(val)),
  ),
  solidsSystem2: z.enum(SwineMMSTypes).transform((val) => input('MMST=2', val)),
});

const SwineMMSSchema = object({
  liquids: SwineLiquidsMMSSchema,
  solids: SwineSolidsMMSSchema.optional(),
}).superRefine((refinement, context) => {
  const liquidsFraction =
    refinement.liquids.fractionOfManureToLiquidsMMS.unit.value.toNumber();
  const solidsFraction =
    refinement.solids?.fractionOfManureToSolidsMMS?.unit.value.toNumber() ?? 0;
  const totalFraction = liquidsFraction + solidsFraction;
  if (totalFraction !== 1) {
    context.addIssue({
      code: 'custom',
      message:
        'Total fractions of manure to all primary MMS systems must add up to 1',
    });
  }
});

export const SwineManureInputSchema = object({
  type: z.literal('swine'),
  mms: SwineMMSSchema,
  totalNitrogenExcreted: z
    .number()
    .gt(0)
    .transform((val) => input('AE', mass('N', val))),
  fractionAppliedToSoils: proportion(
    'Fraction of manure applied to soil within the activity boundary',
  ).transform((val) => input('PF', realNumber(val))),
});

export type SwineMMSInput = z.input<typeof SwineMMSSchema>;

export type SwineManureInput = z.input<typeof SwineManureInputSchema>;
export type SwineManureInputTransformed = z.output<
  typeof SwineManureInputSchema
>;
