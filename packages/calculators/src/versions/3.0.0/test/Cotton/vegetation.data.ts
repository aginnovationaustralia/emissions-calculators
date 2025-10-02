import { CropVegetation } from '../../types/common/crop-vegetation.input';

export const veg1: CropVegetation = {
  vegetation: {
    region: 'Northern Tablelands',
    treeSpecies: 'Sugar Gum',
    soil: 'Loam',
    area: 5,
    age: 10,
  },
  allocationToCrops: [1.0],
};

export const veg2: CropVegetation = {
  vegetation: {
    region: 'Northern Tablelands',
    treeSpecies: 'Red Ironbark',
    soil: 'Loam',
    area: 5,
    age: 5,
  },
  allocationToCrops: [1.0],
};

export const veg3: CropVegetation = {
  vegetation: {
    region: 'South Coast',
    treeSpecies: 'Sugar Gum',
    soil: 'Clay',
    area: 5,
    age: 20,
  },
  allocationToCrops: [1.0],
};

export const veg4: CropVegetation = {
  vegetation: {
    region: 'South Coast',
    treeSpecies: 'Tasmanian Blue Gum',
    soil: 'Clay',
    area: 5,
    age: 4,
  },
  allocationToCrops: [1.0],
};
