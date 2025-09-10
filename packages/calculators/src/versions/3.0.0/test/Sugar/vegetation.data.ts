import { SugarVegetation } from '../../types/Sugar/vegetation.input';

export const veg1: SugarVegetation = {
  vegetation: {
    region: 'Northern Wheat/Sheep',
    treeSpecies: 'Sugar Gum',
    soil: 'Loam',
    area: 2,
    age: 2,
  },
  allocationToCrops: [1.0],
};

export const veg2: SugarVegetation = {
  vegetation: {
    region: 'Southern Tablelands',
    treeSpecies: 'Tasmanian Blue Gum',
    soil: 'Loam',
    area: 4,
    age: 4,
  },
  allocationToCrops: [1.0],
};

export const veg3: SugarVegetation = {
  vegetation: {
    region: 'Northern Tablelands',
    treeSpecies: 'Sugar Gum',
    soil: 'Clay',
    area: 5,
    age: 5,
  },
  allocationToCrops: [1.0],
};

export const veg4: SugarVegetation = {
  vegetation: {
    region: 'North Coast',
    treeSpecies: 'Mixed species (Environmental Plantings)',
    soil: 'Clay & Red Loam',
    area: 10,
    age: 10,
  },
  allocationToCrops: [1.0],
};
