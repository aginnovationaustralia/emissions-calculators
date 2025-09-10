import { BeefVegetation } from '../../types/Beef/vegetation.input';

export const veg1: BeefVegetation = {
  vegetation: {
    region: 'South West Vic',
    treeSpecies: 'Mixed species (Environmental Plantings)',
    soil: 'Red Duplex',
    area: 1,
    age: 1,
  },
  beefProportion: 1.0,
  allocationToBeef: [1.0],
};

export const veg2: BeefVegetation = {
  vegetation: {
    region: 'Central Plateau/Derwent Valley',
    treeSpecies: 'Tasmanian Blue Gum',
    soil: 'Structured Earths',
    area: 5,
    age: 5,
  },
  beefProportion: 0.4,
  allocationToBeef: [0.4],
};

export const veg3: BeefVegetation = {
  vegetation: {
    region: 'Maranoa/Warrego',
    treeSpecies: 'Mixed species (Environmental Plantings)',
    soil: 'Gradational soils',
    area: 10,
    age: 10,
  },
  beefProportion: 0.2,
  allocationToBeef: [0.2],
};

export const veg4: BeefVegetation = {
  vegetation: {
    region: 'North East Vic',
    treeSpecies: 'Tasmanian Blue Gum',
    soil: 'Red Duplex',
    area: 15,
    age: 15,
  },
  beefProportion: 1.0,
  allocationToBeef: [1.0],
};
