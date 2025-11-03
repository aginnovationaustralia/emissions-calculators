import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { proportion, singleEnterpriseInput } from '../schemas';
import { States } from '../types';
import { HorticultureCropSchema } from './horticulture.input';
import { HorticultureVegetationSchema } from './vegetation.input';

export const HorticultureInputSchema = singleEnterpriseInput('Horticulture', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  crops: z.array(HorticultureCropSchema),
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  vegetation: z.array(HorticultureVegetationSchema),
}).meta({
  description: 'Input data required for the `horticulture` calculator',
});

export type HorticultureInput = z.infer<typeof HorticultureInputSchema>;
