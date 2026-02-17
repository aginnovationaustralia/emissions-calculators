import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { CropVegetationSchema } from '@/types/common/crop-vegetation.input';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { States } from '@/types/enums';
import { singleEnterpriseInput } from '@/types/schemas';
import { z } from 'zod';
import { GrainsCropSchema } from './crop.input';

export const GrainsInputSchema = singleEnterpriseInput('Grains', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  crops: z.array(GrainsCropSchema),
  electricity: ElectricityInputsSchema,
  vegetation: z.array(CropVegetationSchema),
});

export type GrainsInput = z.input<typeof GrainsInputSchema>;
export type GrainsInputTransformed = z.output<typeof GrainsInputSchema>;
