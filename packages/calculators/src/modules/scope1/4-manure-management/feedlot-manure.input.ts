import { FeedlotMMSTypes } from '@/calculators/Grains/constants/enums';
import { input } from '@/tools/inputs';
import {
  days,
  head,
  massPerHeadPerDay,
  massPerMass,
  realNumber,
} from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

export const FeedlotManureHerdInputSchema = object({
  lengthOfStayDays: z
    .number()
    .min(0)
    .meta({ description: 'Length of stay in days' })
    .transform((val) => input('Lj', days(val))),
  dryMatterIntake: z
    .number()
    .min(0)
    .optional()
    .meta({ description: 'Dry matter intake in kg/head/day' })
    .transform((val) =>
      val === undefined
        ? undefined
        : input('Ij custom', massPerHeadPerDay('DryMatter', val)),
    ),
  crudeProteinContent: z
    .number()
    .min(0)
    .optional()
    .meta({ description: 'Crude protein content in %' })
    .transform((val) =>
      val === undefined
        ? undefined
        : input(
            'CPj custom',
            massPerMass('CrudeProtein', 'DryMatter', val / 100), // REVISIT: handle inputs as percentage
          ),
    ),
  numberOfCattle: z
    .number()
    .min(0)
    .meta({ description: 'Number of cattle in group' })
    .transform((val) => input('Nj', head(val))),
});

export const FeedlotManureInputSchema = object({
  type: z.literal('feedlot'),
  herds: z.array(FeedlotManureHerdInputSchema),
  fractionAppliedToSoils: proportion(
    'Fraction of manure applied to soil within the activity boundary',
  ).transform((val) => input('PF', realNumber(val))),
  // REVISIT: Currently assumes a single secondary MMS. Docs suggest multiple are possible
  secondaryMMS: z
    .enum(FeedlotMMSTypes)
    .meta({ description: 'Secondary MMS type' }),
  tertiaryLagoonInUse: z
    .boolean()
    .meta({ description: 'Whether a tertiary lagoon is in use' }),
});

export type FeedlotManureInput = z.input<typeof FeedlotManureInputSchema>;
export type FeedlotManureInputTransformed = z.output<
  typeof FeedlotManureInputSchema
>;

export type FeedlotManureHerdInput = z.input<
  typeof FeedlotManureHerdInputSchema
>;
export type FeedlotManureHerdInputTransformed = z.output<
  typeof FeedlotManureHerdInputSchema
>;
