import { GrainsCrop, GrainsInput } from '@/calculators/Grains/types';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

export const grainWheat: GrainsCrop = {
  type: 'Wheat',
  state: 'nsw',
  averageYield: 3,
  areaSown: 1000,
  rainfallAbove600: true,
  fractionOfAnnualCropBurnt: 1,
  electricityAllocation: 0.2,
  limestone: 500,
  limestoneFraction: 1,
  dolomiteFraction: 0,
  chemicals: [
    {
      type: 'Herbicide',
      amountKg: 8.5,
    },
    {
      type: 'HerbicideOther',
      amountKg: 3.6,
    },
  ],
  refrigerants: [],
  inorganicFertilisers: {
    productionSystem: 'Non-irrigated crops',
    applications: [
      {
        massAppliedKg: 100,
        fertiliserType: 'Urea',
        calculationMethodScope3: '1',
      },
    ],
    calculationMethodScope1: '1',
  },
  organicFertilisers: {
    applications: [],
  },
  isInLeachingZone: true,
  transportFuel: [
    {
      amountLitres: 1000,
      type: 'diesel',
    },
  ],
  stationaryFuel: [
    {
      type: 'automotive petrol',
      amountLitres: 12000,
    },
  ],
  naturalGas: 0,
  cropResidues: {
    calculationMethod: '1',
  },
  services: [],
  waste: {
    solidWaste: {
      landfill: [],
      incineration: [],
      composting: [],
      anaerobicDigestion: [],
    },
    offsiteManure: [],
  },
};

export const grainSorghum: GrainsCrop = {
  type: 'Sorghum',
  state: 'nsw',
  isInLeachingZone: false,
  averageYield: 2.5,
  areaSown: 200,
  rainfallAbove600: false,
  fractionOfAnnualCropBurnt: 0.5,
  electricityAllocation: 0.4,
  limestone: 100,
  limestoneFraction: 1,
  dolomiteFraction: 0,
  chemicals: [
    {
      type: 'Herbicide',
      amountKg: 4.25,
    },
    {
      type: 'HerbicideOther',
      amountKg: 10.8,
    },
  ],
  refrigerants: [],
  inorganicFertilisers: {
    productionSystem: 'Non-irrigated crops',
    applications: [],
    calculationMethodScope1: '1',
  },
  organicFertilisers: {
    applications: [],
  },
  transportFuel: [],
  stationaryFuel: [],
  naturalGas: 0,
  cropResidues: {
    calculationMethod: '1',
  },
  services: [],
  waste: {
    solidWaste: {
      landfill: [],
      incineration: [],
      composting: [],
      anaerobicDigestion: [],
    },
    offsiteManure: [],
  },
};

export const grainLegume: GrainsCrop = {
  type: 'Other legume',
  state: 'nsw',
  isInLeachingZone: false,
  averageYield: 2,
  areaSown: 500,
  rainfallAbove600: false,
  fractionOfAnnualCropBurnt: 0,
  electricityAllocation: 0.2,
  limestone: 250,
  limestoneFraction: 1,
  dolomiteFraction: 0,
  chemicals: [
    {
      type: 'Herbicide',
      amountKg: 2.12,
    },
    {
      type: 'HerbicideOther',
      amountKg: 3.6,
    },
  ],
  refrigerants: [],
  inorganicFertilisers: {
    productionSystem: 'Irrigated crop',
    applications: [],
    calculationMethodScope1: '1',
  },
  organicFertilisers: {
    applications: [],
  },
  transportFuel: [],
  stationaryFuel: [],
  naturalGas: 0,
  cropResidues: {
    calculationMethod: '1',
  },
  services: [],
  waste: {
    solidWaste: {
      landfill: [],
      incineration: [],
      composting: [],
      anaerobicDigestion: [],
    },
    offsiteManure: [],
  },
};

export const grainGrass: GrainsCrop = {
  type: 'Annual grass',
  state: 'nsw',
  isInLeachingZone: false,
  averageYield: 6,
  areaSown: 800,
  rainfallAbove600: false,
  fractionOfAnnualCropBurnt: 0,
  electricityAllocation: 0.1,
  limestone: 400,
  limestoneFraction: 1,
  dolomiteFraction: 0,
  chemicals: [
    {
      type: 'Herbicide',
      amountKg: 4.25,
    },
    {
      type: 'HerbicideOther',
      amountKg: 18,
    },
  ],
  refrigerants: [],
  inorganicFertilisers: {
    productionSystem: 'Non-irrigated crops',
    applications: [],
    calculationMethodScope1: '1',
  },
  organicFertilisers: {
    applications: [],
  },
  transportFuel: [],
  stationaryFuel: [],
  naturalGas: 0,
  cropResidues: {
    calculationMethod: '1',
  },
  services: [],
  waste: {
    solidWaste: {
      landfill: [],
      incineration: [],
      composting: [],
      anaerobicDigestion: [],
    },
    offsiteManure: [],
  },
};

export const grainTriticale: GrainsCrop = {
  type: 'Triticale',
  state: 'nsw',
  isInLeachingZone: false,
  averageYield: 4,
  areaSown: 300,
  rainfallAbove600: false,
  fractionOfAnnualCropBurnt: 0,
  electricityAllocation: 0.1,
  limestone: 150,
  limestoneFraction: 1,
  dolomiteFraction: 0,
  chemicals: [
    {
      type: 'Herbicide',
      amountKg: 8.5,
    },
    {
      type: 'HerbicideOther',
      amountKg: 5.4,
    },
  ],
  refrigerants: [],
  inorganicFertilisers: {
    productionSystem: 'Non-irrigated crops',
    applications: [],
    calculationMethodScope1: '1',
  },
  organicFertilisers: {
    applications: [],
  },
  transportFuel: [],
  stationaryFuel: [],
  naturalGas: 0,
  cropResidues: {
    calculationMethod: '1',
  },
  services: [],
  waste: {
    solidWaste: {
      landfill: [],
      incineration: [],
      composting: [],
      anaerobicDigestion: [],
    },
    offsiteManure: [],
  },
};

export const grainsTestData: GrainsInput = {
  crops: [grainWheat, grainSorghum, grainLegume, grainGrass, grainTriticale],
  electricity: {
    electricityRenewable: 0,
    electricityUse: 4000,
  },
  state: 'nsw',
  vegetation: [veg1, veg2, veg3, veg4],
};

export const grainsTestData102: GrainsInput = {
  state: 'nsw',
  electricity: {
    electricityRenewable: 0,
    electricityUse: 2650,
  },
  crops: [
    {
      type: 'Hops',
      state: 'nsw',
      isInLeachingZone: false,
      averageYield: 2.5,
      areaSown: 180,
      rainfallAbove600: false,
      fractionOfAnnualCropBurnt: 0.1,
      electricityAllocation: 1,
      limestone: 360,
      limestoneFraction: 0.5,
      dolomiteFraction: 0.5,
      chemicals: [
        {
          type: 'Herbicide',
          amountKg: 54.504,
        },
        {
          type: 'HerbicideOther',
          amountKg: 100,
        },
      ],
      refrigerants: [
        {
          refrigerant: 'R22',
          chargeSize: 100,
          refrigerationType: 'Domestic refrigerators',
        },
      ],
      inorganicFertilisers: {
        productionSystem: 'Non-irrigated crops',
        applications: [
          {
            fertiliserType: 'Urea',
            massAppliedKg: 100,
            calculationMethodScope3: '1',
          },
        ],
        calculationMethodScope1: '1',
      },
      organicFertilisers: {
        applications: [],
      },
      transportFuel: [],
      stationaryFuel: [],
      naturalGas: 0,
      cropResidues: {
        calculationMethod: '1',
      },
      services: [],
      waste: {
        solidWaste: {
          landfill: [],
          incineration: [],
          composting: [],
          anaerobicDigestion: [],
        },
        offsiteManure: [],
      },
    },
  ],
  vegetation: [
    {
      vegetation: {
        region: 'Central Wheat Belt',
        treeSpecies: 'Mixed species (Environmental Plantings)',
        soil: 'Coloured Sands',
        area: 22,
        age: 7,
      },
      allocationToCrops: [1],
    },
  ],
};
