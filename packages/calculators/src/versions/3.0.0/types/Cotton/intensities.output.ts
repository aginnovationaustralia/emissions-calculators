import { z } from 'zod';

export const CottonIntensitiesOutputSchema = z
  .object({
    cottonYieldProducedTonnes: z
      .number()
      .meta({ description: 'Cotton yield produced in tonnes' }),
    balesProduced: z.number().meta({ description: 'Number of bales produced' }),
    lintProducedTonnes: z
      .number()
      .meta({ description: 'Cotton lint produced in tonnes' }),
    seedProducedTonnes: z
      .number()
      .meta({ description: 'Cotton seed produced in tonnes' }),
    tonnesCropExcludingSequestration: z
      .number()
      .meta({
        description:
          'Emissions intensity excluding sequestration, in t-CO2e/t crop',
      }),
    tonnesCropIncludingSequestration: z
      .number()
      .meta({
        description:
          'Emissions intensity including sequestration, in t-CO2e/t crop',
      }),
    balesExcludingSequestration: z
      .number()
      .meta({
        description:
          'Emissions intensity excluding sequestration, in t-CO2e/bale',
      }),
    balesIncludingSequestration: z
      .number()
      .meta({
        description:
          'Emissions intensity including sequestration, in t-CO2e/bale',
      }),
    lintIncludingSequestration: z
      .number()
      .meta({
        description:
          'Emissions intensity of lint including sequestration, in t-CO2e/kg',
      }),
    lintExcludingSequestration: z
      .number()
      .meta({
        description:
          'Emissions intensity of lint excluding sequestration, in t-CO2e/kg',
      }),
    seedIncludingSequestration: z
      .number()
      .meta({
        description:
          'Emissions intensity of seed including sequestration, in t-CO2e/kg',
      }),
    seedExcludingSequestration: z
      .number()
      .meta({
        description:
          'Emissions intensity of seed excluding sequestration, in t-CO2e/kg',
      }),
    lintEconomicAllocation: z
      .number()
      .meta({
        description:
          'Emissions intensity of lint using economic allocation, in t-CO2e/kg',
      }),
    seedEconomicAllocation: z
      .number()
      .meta({
        description:
          'Emissions intensity of seed using economic allocation, in t-CO2e/kg',
      }),
  })
  .meta({ description: 'Cotton intensities output' });

export type CottonIntensitiesOutput = z.infer<
  typeof CottonIntensitiesOutputSchema
>;
