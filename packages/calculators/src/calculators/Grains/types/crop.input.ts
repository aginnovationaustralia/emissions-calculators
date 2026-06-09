import { FertiliserInputSchema } from '@/modules/scope1/5-fertiliser/fertiliser.input';
import { LimeInputSchema } from '@/modules/scope1/5-fertiliser/lime.input';
import { CropResidueInputSchema } from '@/modules/scope1/6-residue-mgmt/crop-residue.input';
import { FuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { RefrigerantInputsSchema } from '@/modules/scope1/9-refrigerant-use/refrigerants.input';
import { WasteInputSchema } from '@/modules/scope3/15.13-waste/waste.input';
import { AgrichemicalsInputSchema } from '@/modules/scope3/15.5-agrichemicals/agrichemicals.input';
import { ServicesInputSchema } from '@/modules/scope3/15.7-services/services.input';
import { input } from '@/tools/inputs';
import { realNumber } from '@/tools/units';
import { proportion, singleEnterpriseInput } from '@/types/schemas';
import { z } from 'zod';
import { BaseGrainsCropSchema } from './base-crop.input';

export const GrainsCropSchema = singleEnterpriseInput('Grains', {
  ...BaseGrainsCropSchema.shape,
  ...AgrichemicalsInputSchema.shape,
  ...LimeInputSchema.shape,
  ...CropResidueInputSchema.shape,
  ...FuelInputSchema.shape,
  ...FertiliserInputSchema.shape,
  ...RefrigerantInputsSchema.shape,
  ...ServicesInputSchema.shape,
  ...WasteInputSchema.shape,
  lulucfAllocation: proportion(
    'Percentage of LULUCF emissions to allocate to this crop, from 0 to 1',
  ).transform((val) => input('lulucfAllocation', realNumber(val))),
});

export type GrainsCrop = z.input<typeof GrainsCropSchema>;
export type GrainsCropTransformed = z.output<typeof GrainsCropSchema>;
