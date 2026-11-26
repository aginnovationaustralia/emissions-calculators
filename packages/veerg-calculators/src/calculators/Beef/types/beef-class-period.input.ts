import { isProportion, numberInput, numberInputOptional } from '@/tools/inputs';
import { ENTERIC_BEEF_3_2, MANURE_BEEF_4_2 } from '@/tools/modules';
import {
  days,
  head,
  liveweight,
  liveweightGain,
  massPerHeadPerDay,
  massPerMass,
  realNumber,
} from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const BeefClassPeriodInputSchema = object({
  head: numberInput(
    (val) => head(val),
    {
      name: 'Nkln',
      method: '1',
      description: 'Number of animals in this class for this period',
      modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
    },
    (s) => s.min(0),
  ),
  method2LiveweightKilograms: numberInputOptional(
    (value) => liveweight(value),
    {
      name: 'Wijkln',
      method: '2',
      description:
        'Method 2: supply an exact value for liveweight for this class for this time period based on farm records',
      modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
    },
    (s) => s.min(0),
  ),
  method2DailyLiveweightGainKilograms: numberInputOptional(
    (val) => liveweightGain(val),
    {
      name: 'LWGijkln',
      method: '2',
      description:
        'Method 2: supply an exact value for liveweight gain for this class for this time period based on farm records',
      modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
    },
  ),
  method2DurationDays: numberInputOptional(
    (val) => days(val),
    {
      name: 'Djk',
      method: '2',
      description:
        'Method 2: supply an exact value for the average duration of animals in this class for this time period, based on farm records',
      modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
    },
    (s) => s.min(0),
  ),
  method2DailyDryMatterIntakeKilograms: numberInputOptional(
    (val) => massPerHeadPerDay('DryMatter', val),
    {
      name: 'Ijk',
      method: '2',
      description:
        'Method 2: supply an exact value for the dry matter intake for this class for this time period based on farm records',
      modules: [ENTERIC_BEEF_3_2],
    },
    (s) => s.min(0),
  ),
  method2FractionDryMatterDigestibility: numberInputOptional(
    realNumber,
    {
      name: 'DMDijk',
      method: '2',
      description:
        'Method 2: Specific dry matter digestibility for this class for this time period, based on farm records',
      modules: [MANURE_BEEF_4_2],
    },
    isProportion,
  ),
  method2FractionCrudeProteinContent: numberInputOptional(
    (val) => massPerMass('CrudeProtein', 'DryMatter', val),
    {
      name: 'CPijk=spring',
      method: '2',
      description:
        'Method 2: Specific crude protein content for this class for this time period, based on farm records',
      modules: [MANURE_BEEF_4_2],
    },
    isProportion,
  ),
}).meta({ id: 'BeefClassPeriodInput' });

export type BeefClassPeriodInput = z.input<typeof BeefClassPeriodInputSchema>;
export type BeefClassPeriodInputTransformed = z.output<
  typeof BeefClassPeriodInputSchema
>;

/**
 * A period (season or month) of a cow class that calves (k=4,5). The herd gives the periods in
 * which calving seasons fall (`calvingSeasons` for seasonal herds, `calvingSeasonStartMonths`
 * for monthly herds), and each period gives the share of the class calving in it. The
 * calculation derives LCjk=4,5 for the season of calving and the season after it from them
 * (Chapter 3, 3.2.1.1 (4) and 3.2.2.1), see shared/beef/calving.ts.
 */
export const BeefClassPeriodWithCalvesInputSchema =
  BeefClassPeriodInputSchema.extend({
    fractionCowsCalving: numberInput(
      (val) => realNumber(val),
      {
        name: 'Proportion of cows calving',
        method: '1',
        description:
          "Proportion of the cows in this class that calved in this period (season or month). Only calving in one of the herd's calving seasons counts: LCjk=4,5 is the total calving of a calving season, for each period of that season and of the season after it, and 0 for all other periods (Chapter 3, 3.2.2.1).",
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
  }).meta({ id: 'BeefClassPeriodWithCalvesInput' });

export type BeefClassPeriodWithCalvesInput = z.input<
  typeof BeefClassPeriodWithCalvesInputSchema
>;
export type BeefClassPeriodWithCalvesInputTransformed = z.output<
  typeof BeefClassPeriodWithCalvesInputSchema
>;

/**
 * A period (season or month) of a calf class (k=1,3,6). Each period gives the number of
 * calves of the class born in it. The calves' shares born in the season of calving and in
 * the season before it are derived from them for milk intake MCjk=1,3,6 (4.2.1.3 (3)), see
 * shared/beef/calving.ts.
 */
export const BeefCalfClassPeriodInputSchema = BeefClassPeriodInputSchema.extend(
  {
    calvesBorn: numberInput(
      (val) => head(val),
      {
        name: 'CRjk=1,3,6',
        method: '1',
        description:
          "Number of calves in this class born in this period (season or month). Only births in one of the herd's calving seasons count: the calves born in a calving season, divided by the number of animals in the class in the period, give the share for each period of that season and of the season after it, and 0 for all other periods (4.2.1.3 (3)).",
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      (s) => s.min(0),
    ),
  },
).meta({ id: 'BeefCalfClassPeriodInput' });

export type BeefCalfClassPeriodInput = z.input<
  typeof BeefCalfClassPeriodInputSchema
>;
export type BeefCalfClassPeriodInputTransformed = z.output<
  typeof BeefCalfClassPeriodInputSchema
>;

export type BeefClassPeriodExtendedInputTransformed =
  | BeefClassPeriodInputTransformed
  | BeefClassPeriodWithCalvesInputTransformed
  | BeefCalfClassPeriodInputTransformed;

/** A cow class period (k=4,5), seasonal or monthly. */
export const isBeefClassPeriodInputWithCalves = (
  period: BeefClassPeriodExtendedInputTransformed,
): period is BeefClassPeriodWithCalvesInputTransformed =>
  'fractionCowsCalving' in period;

/** A calf class period (k=1,3,6), seasonal or monthly. */
export const isBeefCalfClassPeriodInput = (
  period: BeefClassPeriodExtendedInputTransformed,
): period is BeefCalfClassPeriodInputTransformed => 'calvesBorn' in period;
