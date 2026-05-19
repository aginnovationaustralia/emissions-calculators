import { States } from '@/constants/enums';
import { LULUCFInputSchema } from '@/modules/lulucf/input';
import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { singleEnterpriseInput } from '@/types/schemas';
import { z } from 'zod';
import { GrainsCropSchema } from './crop.input';

export const GrainsInputSchema = singleEnterpriseInput('Grains', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  crops: z.array(GrainsCropSchema),
  electricity: ElectricityInputsSchema,
  // TODO: Upgrade this to an array of areas? Each one then has its own leaching zone input.
  landUse: LULUCFInputSchema.optional(),
});

export type GrainsInput = z.input<typeof GrainsInputSchema>;
export type GrainsInputTransformed = z.output<typeof GrainsInputSchema>;
