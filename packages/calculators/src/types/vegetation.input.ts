import { commonConstants } from '@/constants/values';
import { z } from 'zod';
import { RainfallRegions, SoilTypes, TreeTypes } from './enums';

/**
 * Get valid tree species for a given region
 */
function getValidTreeSpeciesForRegion(
  region: (typeof RainfallRegions)[number],
): string[] {
  const treeRegions = commonConstants.TREE_REGIONS;
  const validSpecies = new Set<string>();

  // Collect all valid tree species for this region (TreeSpecies1-6)
  const treeSpecies1 = treeRegions.TreeSpecies1[region];
  const treeSpecies2 = treeRegions.TreeSpecies2[region];
  const treeSpecies3 = treeRegions.TreeSpecies3[region];
  const treeSpecies4 = treeRegions.TreeSpecies4[region];
  const treeSpecies5 = treeRegions.TreeSpecies5[region];
  const treeSpecies6 = treeRegions.TreeSpecies6[region];

  [
    treeSpecies1,
    treeSpecies2,
    treeSpecies3,
    treeSpecies4,
    treeSpecies5,
    treeSpecies6,
  ]
    .filter(
      (species): species is string =>
        typeof species === 'string' && species !== 'No tree data available',
    )
    .forEach((species) => validSpecies.add(species));

  return Array.from(validSpecies);
}

/**
 * Get valid soil types for a given region
 */
function getValidSoilTypesForRegion(
  region: (typeof RainfallRegions)[number],
): string[] {
  const treeRegions = commonConstants.TREE_REGIONS;
  const validSoils = new Set<string>();

  // Collect all valid soil types for this region (SoilType1-2)
  const soilType1 = treeRegions.SoilType1[region];
  const soilType2 = treeRegions.SoilType2[region];

  [soilType1, soilType2]
    .filter(
      (soil): soil is string =>
        typeof soil === 'string' && soil !== 'No Soil / Tree data available',
    )
    .forEach((soil) => validSoils.add(soil));

  return Array.from(validSoils);
}

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
  .superRefine((data, ctx) => {
    const validTreeSpecies = getValidTreeSpeciesForRegion(data.region);
    const validSoilTypes = getValidSoilTypesForRegion(data.region);

    if (!validTreeSpecies.includes(data.treeSpecies)) {
      ctx.addIssue({
        code: 'custom',
        message: `Tree species "${data.treeSpecies}" is not valid for region "${
          data.region
        }". Valid species for this region are: ${validTreeSpecies.join(', ')}`,
        path: ['treeSpecies'],
      });
    }

    if (!validSoilTypes.includes(data.soil)) {
      ctx.addIssue({
        code: 'custom',
        message: `Soil type "${data.soil}" is not valid for region "${
          data.region
        }". Valid soil types for this region are: ${validSoilTypes.join(', ')}`,
        path: ['soil'],
      });
    }
  })
  .meta({
    description:
      'Inputs required for non-productive vegetation in order to calculate carbon sequestration',
  });

export type Vegetation = z.infer<typeof VegetationSchema>;
