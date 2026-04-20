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

export const RiceCultivationInputSchema = object({
  preSeasonWaterRegimeType: z
    .literal(RiceCultivationPreSeasonWaterRegimeTypes)
    .transform((val) =>
      input(
        'pre-season water regime type',
        val as RiceCultivationPreSeasonWaterRegimeType,
      ),
    )
    .meta({ description: 'TODO' }),
  waterRegimeType: z
    .literal(RiceCultivationSeasonWaterRegimeTypes)
    .transform((val) =>
      input('water regime type', val as RiceCultivationSeasonWaterRegimeType),
    )
    .meta({ description: 'TODO' }),

  organicAmendments: z
    .array(RiceCultivationOrganicAmendmentInputSchema)
    .meta({ description: 'TODO' }),
});

export type RiceCultivationInput = z.input<typeof RiceCultivationInputSchema>;
export type RiceCultivationInputTransformed = z.output<
  typeof RiceCultivationInputSchema
>;
