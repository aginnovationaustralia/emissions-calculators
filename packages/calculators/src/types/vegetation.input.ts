import { z } from 'zod';
import { RainfallRegions, SoilTypes, TreeTypes } from './enums';

export const VegetationSchema = z
  .object({
    region: z
      .enum(RainfallRegions)
      .meta({ description: 'The rainfall region that the vegetation is in' }),
    treeSpecies: z.enum(TreeTypes).meta({ description: 'The species of tree' }),
    soil: z
      .enum(SoilTypes)
      .meta({ description: 'The soil type the tree is in' }),
    area: z
      .number()
      .min(0)
      .meta({ description: 'The area of trees, in ha (hectares)' }),
    age: z
      .number()
      .min(0)
      .meta({ description: 'The age of the trees, in years' }),
  })
  .meta({
    description:
      'Inputs required for non-productive vegetation in order to calculate carbon sequestration',
  });

export type Vegetation = z.infer<typeof VegetationSchema>;
