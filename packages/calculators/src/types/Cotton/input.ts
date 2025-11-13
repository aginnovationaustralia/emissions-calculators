import { States } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { proportion, singleEnterpriseInput } from '../schemas';
import { CottonCropSchema } from './cotton.input';
import { CottonVegetationSchema } from './vegetation.input';

export const CottonInputSchema = singleEnterpriseInput('Cotton', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  crops: z.array(CottonCropSchema),
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  vegetation: z.array(CottonVegetationSchema),
});

export type CottonInput = z.infer<typeof CottonInputSchema>;
