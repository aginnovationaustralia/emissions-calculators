import { SwineClass } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { days, head, massPerHeadPerDay, realNumber } from '@/tools/units';
import { mapOptional } from '@/tools/zod';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

const createClassManureAllocationSchema = (number: '1' | '2' | '3' | '4') => {
  const base = object({
    deepLitter: proportion('TODO').transform((val) =>
      input(`MMSj=${number}m=8T=1`, realNumber(val)),
    ),
    // NOTE: This is called drylot at points in the guidelines because it represents
    // emissions from free-range systems than the constants associated with m=14.
    outdoorAndFreeRange: proportion('TODO').transform((val) =>
      input(`MMSj=${number}m=5T=1`, realNumber(val)),
    ),
    anaerobicLagoon: proportion('TODO').transform((val) =>
      input(`MMSj=${number}m=7T=1`, realNumber(val)),
    ), // Covered
    digester: proportion('TODO').transform((val) =>
      input(`MMSj=${number}m=1T=1`, realNumber(val)),
    ), // Uncovered
    pitStorage: proportion('TODO').transform((val) =>
      input(`MMSj=${number}m=9T=1`, realNumber(val)),
    ),
    solidStorage: proportion('TODO').transform((val) =>
      input(`MMSj=${number}m=9T=1`, realNumber(val)),
    ),
  });

  const method1 = base
    .extend({
      solidsSeparatedPreTreatment: z.boolean().meta({
        description:
          'If solids produced by these pigs were separated by pre-treatment of manure (before flowing into the primary MMS).',
      }),
    })
    .transform((val) => ({ ...val, solidSeparationInputMethod: '1' as const }));
  const method2 = base
    .extend({
      fractionSolidsSeparatedPreTreatment: proportion(
        'Fraction of volatile solids separated by pre-treatment of manure (before flowing into the primary MMS). PigBal may be used to support the estimation of this fraction.',
      ).transform((val) => input(`SSj=${number}`, realNumber(val))),
      fractionNitrogenSeparatedPreTreatment: proportion(
        'Fraction of nitrogen separated by pre-treatment of manure (before flowing into the primary MMS). PigBal may be used to support the estimation of this fraction.',
      ).transform((val) => input(`SNj=${number}`, realNumber(val))),
    })
    .transform((val) => ({ ...val, solidSeparationInputMethod: '2' as const }));
  const combined = z.xor([method1, method2]);

  return combined;
};

export const createSwineClassInputSchema = <
  N extends SwineClass,
  J extends '1' | '2' | '3' | '4',
>(
  name: N,
  number: J,
) =>
  object({
    head: z
      .number()
      .min(0)
      .meta({ description: 'Number of head for this class' })
      .transform((val) => input(`Nj=${number}`, head(val))),
    days: z
      .number()
      .min(0)
      .meta({ description: 'Average number of days on farm for this class' })
      .transform((val) => input(`Dj=${number}`, days(val))),
    method2AverageFeedIntake: z
      .number()
      .min(0)
      .optional()
      .meta({ description: 'Average feed intake per head per class' })
      .transform(
        mapOptional((val) =>
          input(`Ij=${number}`, massPerHeadPerDay('DryMatter', val)),
        ),
      ),
    method2NitrogenWasteProductionRate: z
      .number()
      .min(0)
      .optional()
      .meta({
        description:
          'Method 2: Average nitrogen waste production in kilograms per pig per day, including both animal and feed waste. PigBal may be used to calculate this value.',
      })
      .transform(
        mapOptional((val) =>
          input(`NWj=${number}`, massPerHeadPerDay('N', val)),
        ),
      ),
    method2VolatileSolidProductionRate: z
      .number()
      .min(0)
      .optional()
      .meta({
        description:
          'Method 2: Volatile solid production in kilograms per pig per day, including both animal and feed waste. PigBal may be used to calculate this value.',
      })
      .transform(
        mapOptional((val) =>
          input(`VSj=${number}`, massPerHeadPerDay('Volatile Solids', val)),
        ),
      ),
    manureAllocation: createClassManureAllocationSchema(number),
  }).transform((val) => ({
    ...val,
    name,
    number,
  }));

export const SwineBoarsInputSchema = createSwineClassInputSchema('boars', '1');

export const SwineSowsInputSchema = createSwineClassInputSchema('sows', '2');
export const SwineGiltsInputSchema = createSwineClassInputSchema('gilts', '3');
export const SwineOtherInputSchema = createSwineClassInputSchema('others', '4');

export type SwineSpecificClassInput =
  | z.input<typeof SwineBoarsInputSchema>
  | z.input<typeof SwineSowsInputSchema>
  | z.input<typeof SwineGiltsInputSchema>
  | z.input<typeof SwineOtherInputSchema>;

export type SwineBoarsInputTransformed = z.output<typeof SwineBoarsInputSchema>;
export type SwineSowsInputTransformed = z.output<typeof SwineSowsInputSchema>;
export type SwineGiltsInputTransformed = z.output<typeof SwineGiltsInputSchema>;
export type SwineOtherInputTransformed = z.output<typeof SwineOtherInputSchema>;

export type SwineSpecificClassInputTransformed =
  | SwineBoarsInputTransformed
  | SwineSowsInputTransformed
  | SwineGiltsInputTransformed
  | SwineOtherInputTransformed;
