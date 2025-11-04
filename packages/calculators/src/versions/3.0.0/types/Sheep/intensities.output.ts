import { z } from 'zod';

export const SheepEmissionsIntensitiesSchema = z.object({
  woolProducedKg: z
    .number()
    .meta({ description: 'Greasy wool produced in kg' }),
  sheepMeatProducedKg: z
    .number()
    .meta({ description: 'Sheep meat produced in kg liveweight' }),
  woolIncludingSequestration: z.number().meta({
    description:
      'Wool production emissions intensity including carbon sequestration, in kg-CO2e/kg greasy wool',
  }),
  woolExcludingSequestration: z.number().meta({
    description:
      'Wool production emissions intensity excluding carbon sequestration, in kg-CO2e/kg greasy',
  }),
  sheepMeatBreedingIncludingSequestration: z.number().meta({
    description:
      'Sheep meat (breeding herd) emissions intensity including carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  sheepMeatBreedingExcludingSequestration: z.number().meta({
    description:
      'Sheep meat (breeding herd) emissions intensity excluding carbon sequestration, in kg-CO2e/kg liveweight',
  }),
});

export type SheepEmissionsIntensities = z.infer<
  typeof SheepEmissionsIntensitiesSchema
>;
