import { z } from 'zod';
import { ProductUnit } from './product.input';

export const ProcessingIntensitiesOutputSchema = z.object({
  unitsProduced: z
    .number()
    .meta({ description: 'Number of processed product units produced' }),
  unitOfProduct: z.enum(ProductUnit).meta({
    description:
      'Unit type of the product being produced (used by "unitsProduced")',
  }),
  processingExcludingCarbonOffsets: z.number().meta({
    description:
      'Processing emissions intensity excluding carbon offsets, in kg-CO2e/number of units produced',
  }),
  processingIncludingCarbonOffsets: z.number().meta({
    description:
      'Processing emissions intensity including carbon offsets, in kg-CO2e/number of units produced',
  }),
});

export type ProcessingIntensitiesOutput = z.infer<
  typeof ProcessingIntensitiesOutputSchema
>;
