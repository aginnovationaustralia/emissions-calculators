import { States } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { proportion, singleEnterpriseInput } from '../schemas';
import { HorticultureCropSchema } from './horticulture.input';
import { HorticultureVegetationSchema } from './vegetation.input';

export const HorticultureInputSchema = singleEnterpriseInput('Horticulture', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  crops: z.array(HorticultureCropSchema),
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  vegetation: z.array(HorticultureVegetationSchema),
});

export type HorticultureInput = z.infer<typeof HorticultureInputSchema>;
