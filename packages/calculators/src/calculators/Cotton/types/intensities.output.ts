import { outputValue } from '@/tools/zod';
import { z } from 'zod';

const CottonSeedAndLintIntensitiesOutputSchema = z.object({
  cottonLintExcludingLULUCF: outputValue(
    'Cotton lint emissions intensity excluding LULUCF, in kg-CO2e/kg cotton lint.',
  ),
  cottonLintIncludingLULUCF: outputValue(
    'Cotton lint emissions intensity including LULUCF, in kg-CO2e/kg cotton lint.',
  ),

  cottonSeedExcludingLULUCF: outputValue(
    'Cotton seed emissions intensity excluding LULUCF, in kg-CO2e/kg cotton seed.',
  ),
  cottonSeedIncludingLULUCF: outputValue(
    'Cotton seed emissions intensity including LULUCF, in kg-CO2e/kg cotton seed.',
  ),
});

export type CottonSeedAndLintIntensitiesOutput = z.infer<
  typeof CottonSeedAndLintIntensitiesOutputSchema
>;

export const CottonIntensitiesOutputSchema = z.object({
  cottonHarvestedKg: outputValue('Seed cotton harvested in kg.'),
  cottonLintHarvestedKg: outputValue('Cotton lint harvested in kg.'),
  cottonSeedHarvestedKg: outputValue('Cotton seed harvested in kg.'),

  cottonExcludingLULUCF: outputValue(
    'Cotton emissions intensity excluding LULUCF, in kg-CO2e/kg seed cotton.',
  ),
  cottonIncludingLULUCF: outputValue(
    'Cotton emissions intensity including LULUCF, in kg-CO2e/kg seed cotton.',
  ),

  economicIntensities: CottonSeedAndLintIntensitiesOutputSchema.meta({
    description:
      'Separate cotton seed and lint intensities based on economic allocation. When post production processes for cotton are included within the system boundary, economic allocation should be used. An allocation of 83% is assumed.',
  }),

  massIntensities: CottonSeedAndLintIntensitiesOutputSchema.meta({
    description:
      'Separate cotton seed and lint intensities, with allocations based on mass.',
  }),
});

export type CottonIntensitiesOutput = z.infer<
  typeof CottonIntensitiesOutputSchema
>;
