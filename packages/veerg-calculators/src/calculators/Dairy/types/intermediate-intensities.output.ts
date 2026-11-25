import { outputValue } from '@/tools/zod';
import { z } from 'zod';

type DairyAllocationMethod = 'mass' | 'energy';

const DairyIntermediateAllocatedIntensitiesOutputSchema = (
  allocation: DairyAllocationMethod,
) =>
  z.object({
    liveweightIntensity: outputValue(
      `Dairy liveweight emissions intensity for this activity using ${allocation} based allocation, in kg-CO2e/kg liveweight`,
    ),
    milkIntensity: outputValue(
      `Dairy milk emissions intensity for this activity using ${allocation} based allocation, in kg-CO2e/kg fat and protein corrected milk (FPCM)`,
    ),
  });

export type DairyIntermediateAllocatedIntensitiesOutput = z.infer<
  ReturnType<typeof DairyIntermediateAllocatedIntensitiesOutputSchema>
>;

export const DairyIntermediateIntensitiesOutputSchema = z.object({
  liveweightProducedKilograms: outputValue('Liveweight produced in kg'),
  milkProducedKilograms: outputValue('Milk produced in kg'),
  fatAndProteinCorrectedMilkProducedKilograms: outputValue(
    'Fat and protein corrected milk (FPCM) produced in kg',
  ),

  energyIntensities: DairyIntermediateAllocatedIntensitiesOutputSchema(
    'energy',
  ).meta({
    description:
      'Separate milk and liveweight intensities for this activity, with allocations based on energy. This is the primary allocation used for dairy intensities.',
  }),

  massIntensities: DairyIntermediateAllocatedIntensitiesOutputSchema(
    'mass',
  ).meta({
    description:
      'Separate milk and liveweight intensities for this activity, with allocations based on mass.',
  }),
});

export type DairyIntermediateIntensitiesOutput = z.infer<
  typeof DairyIntermediateIntensitiesOutputSchema
>;
