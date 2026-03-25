import { States } from '@/constants/enums';
import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { singleEnterpriseInput } from '@/types/schemas';
import { z } from 'zod';
import { GrainsCropSchema } from './crop.input';

export const GrainsInputSchema = singleEnterpriseInput('Grains', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  crops: z.array(GrainsCropSchema),
  electricity: ElectricityInputsSchema,
  // vegetation: z.array(CropVegetationSchema),
});

export type GrainsInput = z.input<typeof GrainsInputSchema>;
export type GrainsInputTransformed = z.output<typeof GrainsInputSchema>;
