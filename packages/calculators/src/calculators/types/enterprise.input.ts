import { LULUCFParentInputSchema } from '@/modules/lulucf/input';
import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { z } from 'zod';

export const EnterpriseInputSchema = LULUCFParentInputSchema.safeExtend({
  electricity: ElectricityInputsSchema,
});

export type EnterpriseInput = z.input<typeof EnterpriseInputSchema>;
export type EnterpriseInputTransformed = z.output<typeof EnterpriseInputSchema>;
