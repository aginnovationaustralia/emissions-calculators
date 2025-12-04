import { HorticultureVegetation } from '@/types/Horticulture/vegetation.input';

export const veg1: HorticultureVegetation = {
  vegetation: {
    region: 'East Coast',
    treeSpecies: 'Tasmanian Blue Gum',
    soil: '"Other Soils"',
    area: 3,
    age: 15,
  },
  allocationToCrops: [0.6, 0.4, 0, 0],
};

export const veg2: HorticultureVegetation = {
  vegetation: {
    region: 'North West',
    treeSpecies: 'Tasmanian Blue Gum',
    soil: 'Structured Earths',
    area: 2,
    age: 15,
  },
  allocationToCrops: [0.4, 0.4, 0.1, 0.1],
};

export const veg3: HorticultureVegetation = {
  vegetation: {
    region: 'South Coast',
    treeSpecies: 'Sugar Gum',
    soil: 'Loam',
    area: 5,
    age: 15,
  },
  allocationToCrops: [0.25, 0.25, 0.25, 0.25],
};

export const veg4: HorticultureVegetation = {
  vegetation: {
    region: 'Wimmera',
    treeSpecies: 'Tasmanian Blue Gum',
    soil: 'Yellow Duplex',
    area: 1,
    age: 15,
  },
  allocationToCrops: [0.1, 0.2, 0.65, 0.05],
};
