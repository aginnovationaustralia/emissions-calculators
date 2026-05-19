import { PastureCropTypes } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { tonnesPerHectareToKgPerSquareMetres } from '@/tools/unit-conversion';
import { massPerArea, realNumber } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

export const CropResidueInputSchema = object({
  rainfallAbove600: z
    .boolean()
    .transform((val) => input('rainfallAbove600', val ? 'wet' : 'dry'))
    .meta({ description: DESCRIPTIONS.RAINFALLIRRIGATIONABOVE600 }),
  type: z.enum(PastureCropTypes).meta({
    description:
      "Crop type. Note that the following crop types are now deprecated, the relevant full calculator should be used instead: 'Cotton', 'Rice', 'Sugar Cane'",
  }),
  // REVISIT: This key name is currently generic. We may decide we want to make inputs more specific
  // to pasture vs crop
  // REVISIT: To implement 6.2.1.1 (method 1) averageYield would need to be optional. But it's required
  // in other places, like 6.1 and 6.4
  averageYield: z
    .number()
    .min(0)
    .transform((val) =>
      input(
        'averageYield',
        massPerArea('DryMatter', tonnesPerHectareToKgPerSquareMetres(val)),
      ),
    )
    .meta({
      description: 'Average crop yield, in t/ha (tonnes per hectare)',
    }),

  fractionOfAnnualCropBurnt: proportion(
    'Fraction of annual production of crop that is burnt, from 0 to 1',
  ).transform((val) => input('fractionOfAnnualCropBurnt', realNumber(val))),
  cropResidues: z.xor([
    object({
      calculationMethod: z.literal('1'),
    }),
    object({
      calculationMethod: z.literal('2'),
      fractionCropResidueRemoved: proportion(
        'Fraction of crop residue that is removed, from 0 to 1',
      ).transform((val) =>
        input('fractionCropResidueRemoved', realNumber(val)),
      ),
    }),
  ]),
  // REVISIT: crop and pasture inputs, especially around type and residues, probably need to be split up
  pastureResidues: z
    .xor([
      object({
        calculationMethod: z.literal('1'),
      }),
      object({
        calculationMethod: z.literal('2'),
        averageYieldPerHectare: z
          .number()
          .min(0)
          .transform((val) =>
            input(
              'averageYieldPerHectare',
              massPerArea(
                'DryMatter',
                tonnesPerHectareToKgPerSquareMetres(val),
              ),
            ),
          )
          .meta({
            description:
              'Custom average pasture yield, in t/ha (tonnes per hectare)',
          }),
      }),
    ])
    .optional(),
});

export type CropResidueInput = z.input<typeof CropResidueInputSchema>;
export type CropResidueInputTransformed = z.output<
  typeof CropResidueInputSchema
>;
