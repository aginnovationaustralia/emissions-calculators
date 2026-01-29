import { input } from '@/tools/inputs';
import { electricity } from '@/tools/units';
import { States } from '@/types/enums';
import { z } from 'zod';
import { CropVegetationSchema } from '../common/crop-vegetation.input';
import { DESCRIPTIONS } from '../descriptions.schema';
import { proportion, singleEnterpriseInput } from '../schemas';
import { GrainsCropSchema } from './crop.input';

export const GrainsInputSchema = singleEnterpriseInput('Grains', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  crops: z.array(GrainsCropSchema),
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .min(0)
    .transform((val) => input('electricityUse', electricity(val)))
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  vegetation: z.array(CropVegetationSchema),
});

export type GrainsInput = z.input<typeof GrainsInputSchema>;
export type GrainsInputTransformed = z.output<typeof GrainsInputSchema>;
