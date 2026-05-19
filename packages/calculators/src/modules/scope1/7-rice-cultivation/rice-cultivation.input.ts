import {
  RiceCultivationPreSeasonWaterRegimeType,
  RiceCultivationPreSeasonWaterRegimeTypes,
  RiceCultivationSeasonWaterRegimeType,
  RiceCultivationSeasonWaterRegimeTypes,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { object } from '@/types/schemas';
import z from 'zod';
import { RiceCultivationOrganicAmendmentInputSchema } from './organic-amendment.input';
import { days } from '@/tools/units';

export const RiceCultivationInputSchema = object({
  preSeasonWaterRegimeType: z
    .literal(RiceCultivationPreSeasonWaterRegimeTypes)
    .transform((val) =>
      input(
        'pre-season water regime type',
        val as RiceCultivationPreSeasonWaterRegimeType,
      ),
    )
    .meta({
      description: 'The type of pre-season water regime for this rice crop.',
    }),
  waterRegimeType: z
    .literal(RiceCultivationSeasonWaterRegimeTypes)
    .transform((val) =>
      input('water regime type', val as RiceCultivationSeasonWaterRegimeType),
    )
    .meta({ description: 'The type of water regime for this rice crop' }),

  organicAmendments: z
    .array(RiceCultivationOrganicAmendmentInputSchema)
    .optional()
    .meta({
      /**
       * REVISIT:
       * Do we want to put a warning here about remembering to 'reflect' any organic fertilisers in this input array as well? Looking at
       * the organic fertiliser input types, I'm not too sure if each possible input reflects an option here or vice versa.
       */
      description:
        'Any organic amendments that were applied to this rice crop. This can be ommitted if only inorganic fertilisers were applied to the crop.',
    }),

  cultivationPeriodDays: z
    .number()
    .min(1)
    .transform((val) => input('days in cultivation period', days(val))),
});

export type RiceCultivationInput = z.input<typeof RiceCultivationInputSchema>;
export type RiceCultivationInputTransformed = z.output<
  typeof RiceCultivationInputSchema
>;
