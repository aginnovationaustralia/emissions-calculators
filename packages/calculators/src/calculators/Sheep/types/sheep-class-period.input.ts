import {
  isNonNegative,
  isPercentage,
  isProportion,
  numberInput,
  numberInputOptional,
} from '@/tools/inputs';
import { ENTERIC_SHEEP_3_4, MANURE_SHEEP_4_4 } from '@/tools/modules';
import { tonnesPerHectareToKgPerSquareMetres } from '@/tools/unit-conversion';
import {
  days,
  head,
  liveweight,
  liveweightGain,
  massPerArea,
  massPerMass,
  realNumber,
} from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const SheepClassPeriodInputSchema = object({
  head: numberInput(
    (val) => head(val),
    {
      name: 'Nkln',
      method: '1',
      description: 'Number of animals in this class for this season',
      modules: [ENTERIC_SHEEP_3_4, MANURE_SHEEP_4_4],
    },
    (s) => s.min(0),
  ),
  method2Liveweight: numberInputOptional(
    (val) => liveweight(val),
    {
      name: 'Wjk',
      method: '2',
      description:
        'Method 2: supply an exact value for liveweight for this class for this season based on farm records',
      modules: [ENTERIC_SHEEP_3_4, MANURE_SHEEP_4_4],
    },
    (s) => s.min(0),
  ),
  method2LiveweightGain: numberInputOptional((val) => liveweightGain(val), {
    name: 'LWGjk',
    method: '2',
    description:
      'Method 2: supply an exact value for liveweight gain for this class for this season based on farm records',
    modules: [MANURE_SHEEP_4_4],
  }),
  method2DryMatterAvailability: numberInputOptional(
    (val) => massPerArea('DryMatter', tonnesPerHectareToKgPerSquareMetres(val)),
    {
      name: 'DMAjk',
      method: '2',
      description:
        'Method 2: Dry matter availability for this class for this period based on farm records',
      modules: [ENTERIC_SHEEP_3_4, MANURE_SHEEP_4_4],
    },
  ),
  method2DryMatterDigestibility: numberInputOptional((val) => realNumber(val), {
    name: 'DMDjk',
    method: '2',
    description:
      'Method 2: supply an exact value for dry matter digestibility for this class for this period based on farm records',
    modules: [ENTERIC_SHEEP_3_4, MANURE_SHEEP_4_4],
  }),
  method2AverageDurationDays: numberInputOptional((val) => days(val), {
    name: 'Dj',
    method: '2',
    description:
      'Method 2: supply an exact value for average duration for this class for this period based on farm records',
    modules: [ENTERIC_SHEEP_3_4, MANURE_SHEEP_4_4],
  }),
  method2CrudeProteinContent: numberInputOptional(
    (val) => massPerMass('CrudeProtein', 'DryMatter', val),
    {
      name: 'CPjk',
      method: '2',
      description:
        'Method 2: supply an exact value for crude protein content for this class for this period based on farm records',
      modules: [MANURE_SHEEP_4_4],
    },
  ),
}).meta({ id: 'SheepClassPeriodInput' });

export const SheepClassWithLambingPeriodInputSchema =
  SheepClassPeriodInputSchema.extend({
    percentLambing: numberInput(
      (val) => realNumber(val),
      {
        name: 'LRjk',
        method: '1',
        description:
          'Percentage of ewes in this class that lamb in this season, from 0 to 100. This is the share of ewes lambing, not the number of lambs per ewe; enter lambs per ewe as percentLambMarking.',
        modules: [ENTERIC_SHEEP_3_4, MANURE_SHEEP_4_4],
      },
      isPercentage,
    ),
    percentLambMarking: numberInput(
      (val) => realNumber(val),
      {
        name: 'LMRjk',
        method: '1',
        description:
          'Lamb marking rate in this season: lambs marked as a percentage of ewes mated. May exceed 100 where ewes have multiple lambs (e.g. 130). Per the methodology, values above 100 are treated as 100 when estimating the proportion of ewes lactating.',
        modules: [ENTERIC_SHEEP_3_4, MANURE_SHEEP_4_4],
      },
      isNonNegative,
    ),
  });

export const SheepClassWithProportionLambsBornPeriodInputSchema =
  SheepClassPeriodInputSchema.extend({
    proportionOfLambsBorn: numberInput(
      (val) => realNumber(val),
      {
        name: 'PLBjk',
        method: '1',
        description: 'Proportion of lambs born in this time period.',
        modules: [MANURE_SHEEP_4_4],
      },
      isProportion,
    ),
  });

export const isSheepClassPeriodInputWithLambing = (
  period: SheepClassPeriodExtendedInputTransformed,
): period is SheepClassWithLambingPeriodInputTransformed => {
  return 'percentLambing' in period;
};

export const isSheepClassPeriodInputWithProportionLambsBorn = (
  period: SheepClassPeriodExtendedInputTransformed,
): period is SheepClassWithProportionLambsBornPeriodInputTransformed => {
  return 'proportionOfLambsBorn' in period;
};

export type SheepClassPeriodInput = z.input<typeof SheepClassPeriodInputSchema>;
export type SheepClassPeriodInputTransformed = z.output<
  typeof SheepClassPeriodInputSchema
>;

export type SheepClassWithLambingPeriodInput = z.input<
  typeof SheepClassWithLambingPeriodInputSchema
>;
export type SheepClassWithLambingPeriodInputTransformed = z.output<
  typeof SheepClassWithLambingPeriodInputSchema
>;

export type SheepClassWithProportionLambsBornPeriodInput = z.input<
  typeof SheepClassWithProportionLambsBornPeriodInputSchema
>;
export type SheepClassWithProportionLambsBornPeriodInputTransformed = z.output<
  typeof SheepClassWithProportionLambsBornPeriodInputSchema
>;

export type SheepClassPeriodExtendedInputTransformed =
  | SheepClassPeriodInputTransformed
  | SheepClassWithLambingPeriodInputTransformed
  | SheepClassWithProportionLambsBornPeriodInputTransformed;
