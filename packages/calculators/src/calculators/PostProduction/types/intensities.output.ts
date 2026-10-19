import { outputValue } from '@/tools/zod';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';

export const PostProductionIntensitiesOutputSchema = emissionsOutput(
  'PostProduction',
  {
    unitsProduced: outputValue('Number of units produced (count)'),
    productionEmissionsKgCO2e: outputValue('Production emissions (kg CO2e)'),
    postProductionAllocation: outputValue(
      'Share of post-production emissions allocated to these units (proportion, 0 to 1)',
    ),
    postProductionEmissionsKgCO2e: outputValue(
      'Post-production emissions (kg CO2e)',
    ),
    productionIntensityKgCO2ePerUnit: outputValue(
      'Production intensity (kg CO2e per unit)',
    ),
    postProductionIntensityKgCO2ePerUnit: outputValue(
      'Post-production intensity (kg CO2e per unit)',
    ),
    combinedIntensityKgCO2ePerUnit: outputValue(
      'Combined emissions intensity, including production and post-production (kg CO2e per unit)',
    ),
  },
);

export type PostProductionIntensitiesOutput = z.infer<
  typeof PostProductionIntensitiesOutputSchema
>;
