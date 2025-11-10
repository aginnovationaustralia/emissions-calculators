import { States } from '@/types/enums';
import { z } from 'zod';
import { CropVegetationSchema } from '../common/crop-vegetation.input';
import { DESCRIPTIONS } from '../descriptions.schema';
import { singleEnterpriseInput } from '../schemas';
import { GrainsCropSchema } from './crop.input';

export const GrainsInputSchema = singleEnterpriseInput('Grains', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  crops: z.array(GrainsCropSchema),
  electricityRenewable: z
    .number()
    .min(0)
    .max(1)
    .meta({ description: DESCRIPTIONS.ELECTRICITY_RENEWABLE }),
  electricityUse: z
    .number()
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  vegetation: z.array(CropVegetationSchema),
});

export type GrainsInput = z.infer<typeof GrainsInputSchema>;
