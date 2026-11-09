import { NetTotalPlusLulucfOutputSchema } from '@/calculators/types/net-total-lulucf.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { AllModulesScope1OutputSchema } from './scope1.output';
import { AllModulesScope3OutputSchema } from './scope3.output';

export const AllModulesOutputSchema = emissionsOutput('AllModules', {
  scope1: AllModulesScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: AllModulesScope3OutputSchema,
  net: NetTotalPlusLulucfOutputSchema,
});

export type AllModulesOutput = z.infer<typeof AllModulesOutputSchema>;
