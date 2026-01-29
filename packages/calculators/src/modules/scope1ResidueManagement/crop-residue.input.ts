import { input } from '@/tools/inputs';
import { area, massPerArea, realNumber } from '@/tools/units';
import { CropTypes } from '@/types';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object, proportion } from '@/types/schemas';
import Decimal from 'decimal.js-light';
import { z } from 'zod';

export const CropResidueInputSchema = object({
  rainfallAbove600: z
    .boolean()
    .transform((val) => input('rainfallAbove600', val ? 'wet' : 'dry'))
    .meta({ description: DESCRIPTIONS.RAINFALLIRRIGATIONABOVE600 }),
  type: z.enum(CropTypes).meta({
    description:
      "Crop type. Note that the following crop types are now deprecated, the relevant full calculator should be used instead: 'Cotton', 'Rice', 'Sugar Cane'",
  }),
  averageGrainYield: z
    .number()
    .min(0)
    .transform((val) =>
      input('averageGrainYield', massPerArea('Yield', new Decimal(val))),
    )
    .meta({
      description: 'Average grain yield, in t/ha (tonnes per hectare)',
    }),
  areaSown: z
    .number()
    .min(0)
    .transform((val) => input('areaSown', area(new Decimal(val))))
    .meta({ description: 'Area sown, in ha (hectares)' }),
  fractionOfAnnualCropBurnt: proportion(
    'Fraction of annual production of crop that is burnt, from 0 to 1',
  ).transform((val) => input('fractionOfAnnualCropBurnt', realNumber(val))),
});

export type CropResidueInput = z.input<typeof CropResidueInputSchema>;
export type CropResidueInputTransformed = z.output<
  typeof CropResidueInputSchema
>;
