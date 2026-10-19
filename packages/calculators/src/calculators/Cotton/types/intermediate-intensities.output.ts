import { outputValue } from '@/tools/zod';
import { z } from 'zod';

const CottonIntermediateSeedAndLintIntensitiesOutputSchema = z.object({
  cottonLint: outputValue(
    'Cotton lint emissions intensity for this activity, in kg-CO2e/kg cotton lint.',
  ),
  cottonSeed: outputValue(
    'Cotton seed emissions intensity for this activity, in kg-CO2e/kg cotton seed.',
  ),
});

export type CottonIntermediateSeedAndLintIntensitiesOutput = z.infer<
  typeof CottonIntermediateSeedAndLintIntensitiesOutputSchema
>;

export const CottonIntermediateIntensitiesOutputSchema = z.object({
  cottonHarvestedKg: outputValue('Seed cotton harvested in kg.'),
  cottonLintHarvestedKg: outputValue('Cotton lint harvested in kg.'),
  cottonSeedHarvestedKg: outputValue('Cotton seed harvested in kg.'),

  cottonIntensity: outputValue(
    'Cotton emissions intensity for this activity, in kg-CO2e/kg seed cotton.',
  ),

  economicIntensities:
    CottonIntermediateSeedAndLintIntensitiesOutputSchema.meta({
      description:
        'Separate cotton seed and lint intensities for this activity based on economic allocation. When post production processes for cotton are included within the system boundary, economic allocation should be used. An allocation of 83% is assumed.',
    }),

  massIntensities: CottonIntermediateSeedAndLintIntensitiesOutputSchema.meta({
    description:
      'Separate cotton seed and lint intensities for this activity, with allocations based on mass.',
  }),
});

export type CottonIntermediateIntensitiesOutput = z.infer<
  typeof CottonIntermediateIntensitiesOutputSchema
>;
