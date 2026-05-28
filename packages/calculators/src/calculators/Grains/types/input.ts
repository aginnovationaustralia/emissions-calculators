import { States } from '@/constants/enums';
import { LULUCFParentInputSchema } from '@/modules/lulucf/input';
import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { singleEnterpriseInput } from '@/types/schemas';
import { z } from 'zod';
import { GrainsCropSchema } from './crop.input';

export const GrainsInputSchema = singleEnterpriseInput(
  'Grains',
  LULUCFParentInputSchema.extend({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    crops: z.array(GrainsCropSchema),
    electricity: ElectricityInputsSchema,
  }).shape,
);

export type GrainsInput = z.input<typeof GrainsInputSchema>;
export type GrainsInputTransformed = z.output<typeof GrainsInputSchema>;
