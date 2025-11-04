import { z } from 'zod';

export const GoatEmissionsIntensitiesSchema = z.object({
  amountMeatProduced: z
    .number()
    .meta({ description: 'Amount of goat meat produced in kg liveweight' }),
  amountWoolProduced: z
    .number()
    .meta({ description: 'Amount of wool produced in kg greasy' }),
  goatMeatBreedingIncludingSequestration: z.number().meta({
    description:
      'Goat meat (breeding herd) emissions intensity including carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  goatMeatBreedingExcludingSequestration: z.number().meta({
    description:
      'Goat meat (breeding herd) emissions intensity excluding carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  woolIncludingSequestration: z.number().meta({
    description:
      'Wool production emissions intensity including carbon sequestration, in kg-CO2e/kg greasy',
  }),
  woolExcludingSequestration: z.number().meta({
    description:
      'Wool production emissions intensity excluding carbon sequestration, in kg-CO2e/kg greasy',
  }),
});

export type GoatEmissionsIntensities = z.infer<
  typeof GoatEmissionsIntensitiesSchema
>;
