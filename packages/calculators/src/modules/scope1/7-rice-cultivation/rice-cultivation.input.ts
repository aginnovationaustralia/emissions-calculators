import {
  RiceCultivationPreSeasonWaterRegimeType,
  RiceCultivationPreSeasonWaterRegimeTypes,
  RiceCultivationSeasonWaterRegimeType,
  RiceCultivationSeasonWaterRegimeTypes,
} from '@/constants/enums';
import { enumSchema } from '@/tools/enum-schemas';
import { input, numberInput } from '@/tools/inputs';
import {
  RESIDUE_BURN_6_4,
  RESIDUE_CROPS_6_1,
  RESIDUE_LEACH_6_3,
  RICE_7_1,
} from '@/tools/modules';
import { hectaresToSquareMetres } from '@/tools/unit-conversion';
import { area, days } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';
import { BaseBurnableCropResidueInputSchema } from '../6-residue-mgmt';
import { RiceCultivationOrganicAmendmentInputSchema } from './organic-amendment.input';

export const RiceCultivationInputSchema =
  BaseBurnableCropResidueInputSchema.safeExtend({
    areaSown: numberInput(
      (val) => area(hectaresToSquareMetres(val)),
      {
        name: 'areaSown',
        method: '1',
        description:
          'Annual area of rice cultivation under water regime during the growing season under the specified water regime and organic amendment conditions.',
        modules: [RICE_7_1],
      },
      (s) => s.min(0),
    ),
    preSeasonWaterRegimeType: z
      .literal(RiceCultivationPreSeasonWaterRegimeTypes)
      .transform((val) =>
        input(val as RiceCultivationPreSeasonWaterRegimeType, {
          name: 'pre-season water regime type',
          modules: [RICE_7_1],
        }),
      )
      .meta({
        description: 'The type of pre-season water regime for this rice crop.',
      }),
    waterRegimeType: enumSchema(RiceCultivationSeasonWaterRegimeTypes)
      .transform((val) =>
        input(val as RiceCultivationSeasonWaterRegimeType, {
          name: 'water regime type',
          modules: [RICE_7_1],
        }),
      )
      .meta({ description: 'The type of water regime for this rice crop' }),

    organicAmendments: z
      .array(RiceCultivationOrganicAmendmentInputSchema)
      .optional()
      .meta({
        description: `Any organic amendments that were applied to this rice crop. This can be omitted if only inorganic fertilisers were applied to the crop.
        Some amendments included here (like 'Farm yard manure') may overlap with chapter 5.2 Organic Fertiliser.
        Make sure that fertilisers.organic.applications includes all organic fertilisers that were applied to the crop.`,
      }),

    cultivationPeriodDays: numberInput(
      (val) => days(val),
      {
        name: 'days in cultivation period',
        method: '1',
        description: 'Duration this rice crop was under cultivation',
        modules: [RICE_7_1],
      },
      (s) => s.min(1),
    ),
  }).transform((val) => ({
    ...val,
    type: input('Rice' as const, {
      name: 'Rice',
      modules: [RESIDUE_CROPS_6_1, RESIDUE_LEACH_6_3, RESIDUE_BURN_6_4],
    }),
  }));

export type RiceCultivationInput = z.input<typeof RiceCultivationInputSchema>;
export type RiceCultivationInputTransformed = z.output<
  typeof RiceCultivationInputSchema
>;

export const HasRiceCultivationInputSchema = object({
  crop: RiceCultivationInputSchema,
});
export type HasRiceCultivationInput = z.input<
  typeof HasRiceCultivationInputSchema
>;
export type HasRiceCultivationInputTransformed = z.output<
  typeof HasRiceCultivationInputSchema
>;
