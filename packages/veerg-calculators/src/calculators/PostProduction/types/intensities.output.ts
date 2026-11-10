import { outputValue } from '@/tools/zod';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';

export const PostProductionIntensitiesOutputSchema = emissionsOutput(
  'PostProduction',
  {
    unitsProduced: outputValue('Number of units produced (count)'),
    productionEmissionsKilogramsCO2e: outputValue(
      'Production emissions (kg CO2e)',
    ),
    postProductionAllocation: outputValue(
      'Share of post-production emissions allocated to these units (proportion, 0 to 1)',
    ),
    postProductionEmissionsKilogramsCO2e: outputValue(
      'Post-production emissions (kg CO2e)',
    ),
    productionIntensityKilogramsCO2ePerUnit: outputValue(
      'Production intensity (kg CO2e per unit)',
    ),
    postProductionIntensityKilogramsCO2ePerUnit: outputValue(
      'Post-production intensity (kg CO2e per unit)',
    ),
    combinedIntensityKilogramsCO2ePerUnit: outputValue(
      'Combined emissions intensity, including production and post-production (kg CO2e per unit)',
    ),
  },
);

export type PostProductionIntensitiesOutput = z.infer<
  typeof PostProductionIntensitiesOutputSchema
>;
