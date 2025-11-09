import { CropVegetation } from '@/types/common/crop-vegetation.input';

export const veg1: CropVegetation = {
  vegetation: {
    region: 'East Coast',
    treeSpecies: 'Tasmanian Blue Gum',
    soil: 'Structured Earths',
    area: 2,
    age: 20,
  },
  allocationToCrops: [0.6, 0.2, 0.05, 0.05, 0.1],
};

export const veg2: CropVegetation = {
  vegetation: {
    region: 'Central North/Midlands/South East',
    treeSpecies: 'Shining Gum',
    soil: '"Other Soils"',
    area: 5,
    age: 16,
  },
  allocationToCrops: [0.6, 0.2, 0.05, 0.05, 0.1],
};

export const veg3: CropVegetation = {
  vegetation: {
    region: 'East Coast',
    treeSpecies: 'Shining Gum',
    soil: 'Structured Earths',
    area: 10,
    age: 8,
  },
  allocationToCrops: [0.6, 0.2, 0.05, 0.05, 0.1],
};

export const veg4: CropVegetation = {
  vegetation: {
    region: 'North East Vic',
    treeSpecies: 'Shining Gum',
    soil: 'Red Duplex',
    area: 12,
    age: 4,
  },
  allocationToCrops: [0.6, 0.2, 0.05, 0.05, 0.1],
};
