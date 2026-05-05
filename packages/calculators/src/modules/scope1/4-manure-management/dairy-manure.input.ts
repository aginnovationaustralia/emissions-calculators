import { DairyCattleBreeds, DairySystems } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { head, mass, massPerHeadPerDay, realNumber } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { mapOptional } from '@/tools/zod';
import { z } from 'zod';
import {
  DairyMilkSolidsInputSchema,
  DairyMilkVolumeInputSchema,
} from '../shared/dairy/milk.input';

const DairyManureClassInputSchema = object({
  head: z
    .number()
    .gt(0)
    .transform((val) => input('Nj', head(val))),
  method2Liveweight: z
    .number()
    .gt(0)
    .optional()
    .transform(
      mapOptional((val) => input('Wj', mass('Liveweight', val))),
    ),
  method2LiveweightGain: z
    .number()
    .optional()
    .transform(
      mapOptional((val) => input('LWGj', massPerHeadPerDay('Liveweight', val))),
    ),
  method2CrudeProteinContent: proportion()
    .optional()
    .transform(
      mapOptional((val) => input('CPj', realNumber(val))),
    ),
  method2DryMatterDigestibility: proportion()
    .optional()
    .transform(
      mapOptional((val) => input('DMDj', realNumber(val))),
    ),
});

const DairyMilkingCowsInputSchema = DairyManureClassInputSchema.transform(
  (val) => ({ ...val, name: 'milkingCows' as const, number: 1 as const }),
);

const DairyHeifersGt1InputSchema = DairyManureClassInputSchema.transform(
  (val) => ({ ...val, name: 'heifersGt1' as const, number: 2 as const }),
);

const DairyHeifersLt1InputSchema = DairyManureClassInputSchema.transform(
  (val) => ({ ...val, name: 'heifersLt1' as const, number: 3 as const }),
);

const DairyBullsGt1InputSchema = DairyManureClassInputSchema.transform(
  (val) => ({ ...val, name: 'bullsGt1' as const, number: 4 as const }),
);

const DairyBullsLt1InputSchema = DairyManureClassInputSchema.transform(
  (val) => ({ ...val, name: 'bullsLt1' as const, number: 5 as const }),
);

type DairyMilkVolumeInputTransformed = z.output<
  typeof DairyMilkVolumeInputSchema
>;
type DairyMilkSolidsInputTransformed = z.output<
  typeof DairyMilkSolidsInputSchema
>;

export type DairyMilkInputTransformed =
  | DairyMilkVolumeInputTransformed
  | DairyMilkSolidsInputTransformed;

export const isMilkVolumeBased = (
  input: DairyMilkInputTransformed,
): input is DairyMilkVolumeInputTransformed => {
  return 'litresPerHeadPerDay' in input;
};

const MMSAllocationSchema = object({
  anaerobicLagoon: proportion(
    'Fraction of manure allocated to anaerobic lagoon',
  ).transform((val) => input('anaerobicLagoon', realNumber(val))),
  sumpDispersal: proportion(
    'Fraction of manure allocated to sump dispersal',
  ).transform((val) => input('sumpDispersal', realNumber(val))),
  drainToPaddock: proportion(
    'Fraction of manure allocated to drain to paddock',
  ).transform((val) => input('drainToPaddock', realNumber(val))),
  solidStorage: proportion(
    'Fraction of manure allocated to solid storage',
  ).transform((val) => input('solidStorage', realNumber(val))),
});

export const DairyManureInputSchema = object({
  type: z.literal('dairy'),
  fractionAppliedToSoils: proportion(
    'Fraction of manure applied to soil within the activity boundary',
  ).transform((val) => input('PF', realNumber(val))),
  system: z.enum(DairySystems),
  method2TimeSpentOnPasture: proportion()
    .optional()
    .transform(
      mapOptional((val) => input('fmPasture', realNumber(val))),
    ),
  method2TimeSpentOnFeedpad: proportion()
    .optional()
    .transform(
      mapOptional((val) => input('fmFeedpad', realNumber(val))),
    ),
  method2TimeSpentOnMilkingShed: proportion()
    .optional()
    .transform(
      mapOptional((val) => input('fmMilkingShed', realNumber(val))),
    ),
  classes: object({
    milkingCows: DairyMilkingCowsInputSchema,
    heifersGt1: DairyHeifersGt1InputSchema.optional(),
    heifersLt1: DairyHeifersLt1InputSchema.optional(),
    bullsGt1: DairyBullsGt1InputSchema.optional(),
    bullsLt1: DairyBullsLt1InputSchema.optional(),
  }),
  milkProduction: z.union([
    DairyMilkVolumeInputSchema,
    DairyMilkSolidsInputSchema,
  ]),
  breed: z.enum(DairyCattleBreeds),
  milkingShedMMSAllocation: MMSAllocationSchema,
  feedPadMMSAllocation: MMSAllocationSchema,
}).superRefine((refinement, context) => {
  const fmPasture = refinement.method2TimeSpentOnPasture;
  const fmFeedpad = refinement.method2TimeSpentOnFeedpad;
  const fmMilkingShed = refinement.method2TimeSpentOnMilkingShed;
  if (
    fmPasture === undefined &&
    fmFeedpad === undefined &&
    fmMilkingShed === undefined
  ) {
    return;
  }
  if (
    fmPasture === undefined ||
    fmFeedpad === undefined ||
    fmMilkingShed === undefined
  ) {
    context.addIssue({
      code: 'custom',
      message:
        'When providing time spent on one location, you must provide time spent on all locations',
    });
  } else {
    const totalTime = fmPasture.plus(fmFeedpad).plus(fmMilkingShed);
    if (totalTime.unit.value.toNumber() !== 1) {
      context.addIssue({
        code: 'custom',
        message:
          'When providing time spent on one location, all values must add up to exactly 1',
      });
    }
  }
});

export type DairyManureInput = z.input<typeof DairyManureInputSchema>;
export type DairyManureInputTransformed = z.output<
  typeof DairyManureInputSchema
>;

export type DairyManureClassInput = z.input<typeof DairyManureClassInputSchema>;
export type DairyManureClassInputTransformed = z.output<
  typeof DairyManureClassInputSchema
>;

export type DairyMilkingCowsInput = z.input<typeof DairyMilkingCowsInputSchema>;
export type DairyMilkingCowsInputTransformed = z.output<
  typeof DairyMilkingCowsInputSchema
>;

export type DairyHeifersGt1Input = z.input<typeof DairyHeifersGt1InputSchema>;
export type DairyHeifersGt1InputTransformed = z.output<
  typeof DairyHeifersGt1InputSchema
>;

export type DairyHeifersLt1Input = z.input<typeof DairyHeifersLt1InputSchema>;
export type DairyHeifersLt1InputTransformed = z.output<
  typeof DairyHeifersLt1InputSchema
>;

export type DairyBullsGt1Input = z.input<typeof DairyBullsGt1InputSchema>;
export type DairyBullsGt1InputTransformed = z.output<
  typeof DairyBullsGt1InputSchema
>;

export type DairyBullsLt1Input = z.input<typeof DairyBullsLt1InputSchema>;
export type DairyBullsLt1InputTransformed = z.output<
  typeof DairyBullsLt1InputSchema
>;

export type DairySpecificClassInput =
  | DairyMilkingCowsInputTransformed
  | DairyHeifersGt1InputTransformed
  | DairyHeifersLt1InputTransformed
  | DairyBullsGt1InputTransformed
  | DairyBullsLt1InputTransformed;
