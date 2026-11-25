import { ManureOutputsSchema } from '@/calculators/types/manure.output';
import { NetTotalPlusLulucfOutputSchema } from '@/calculators/types/net-total-lulucf.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput, object } from '@/types/schemas';
import { z } from 'zod';
import { AllModulesScope1OutputSchema } from './scope1.output';
import { AllModulesScope3OutputSchema } from './scope3.output';

export const AllModulesOutputSchema = emissionsOutput('AllModules', {
  scope1: AllModulesScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: AllModulesScope3OutputSchema,
  net: NetTotalPlusLulucfOutputSchema,
  outputs: object({
    feedlot: ManureOutputsSchema,
    dairy: ManureOutputsSchema,
    pigs: ManureOutputsSchema,
    poultry: ManureOutputsSchema,
  }).meta({
    description:
      'Quantities produced by the calculation that are not emissions, for each livestock input whose manure can be reused (all 0 for one not given)',
  }),
});

export type AllModulesOutput = z.infer<typeof AllModulesOutputSchema>;
