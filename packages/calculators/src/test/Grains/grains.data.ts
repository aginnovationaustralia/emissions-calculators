import { GrainsCropInput, GrainsInput } from '@/calculators/Grains/types';
import { GrainsCropResidueInput } from '@/calculators/Grains/types/crop.input';
import { nv } from '@/tools/inputs';

export const wheatCropKey: GrainsCropResidueInput = {
  type: 'Wheat',
  totalYieldKg: nv(3000),
  residues: {
    calculationMethod: '1',
  },
  fractionOfAnnualCropBurnt: nv(1),
};

export const grainWheat: GrainsCropInput = {
  crop: wheatCropKey,
  climateZone: 'wet',
  state: 'NSW',
  electricityAllocation: nv(0.2),
  lime: {
    applications: [
      {
        massAppliedKg: nv(360),
        limestoneFraction: nv(0.5),
        type: 'Limestone',
      },
    ],
  },
  chemicals: [
    {
      type: 'Herbicide (paraquat, diquat, glyphosate)',
      amountKg: nv(8.5),
    },
    {
      type: 'Other herbicide',
      amountKg: nv(3.6),
    },
  ],
  refrigerants: [
    {
      chargeSize: nv(100),
      refrigerant: 'HFC-134 (R-134)',
      refrigerationType: 'Domestic A/C packaged',
    },
  ],
  fertiliser: {
    productionSystem: 'Non-irrigated pasture',
    inorganic: {
      applications: [
        {
          massAppliedKg: nv(100),
          fertiliserType: 'Urea',
          calculationMethodScope3: '1',
        },
      ],
      calculationMethodScope1: '1',
    },
    organic: {
      applications: [],
    },
  },
  isInLeachingZone: true,
  fuel: {
    transport: [
      {
        vehicleType: 'Cars and light commercial vehicles',
        amountKilolitres: nv(1),
        fuelType: 'Diesel oil',
      },
    ],
    stationary: [
      {
        fuelClass: 'Liquid fuels',
        fuelType: 'Automotive gasoline/petrol',
        amountKilolitres: nv(12),
      },
    ],
  },

  services: {
    fuel: { stationary: [], transport: [] },
  },
  waste: {},
} as const;

export const grainSorghum: GrainsCropInput = {
  crop: {
    type: 'Sorghum',
    totalYieldKg: nv(2500),
    fractionOfAnnualCropBurnt: nv(0.5),
    residues: {
      calculationMethod: '1',
    },
  },
  state: 'NSW',
  isInLeachingZone: false,
  climateZone: 'dry',
  electricityAllocation: nv(0.4),
  lime: {
    applications: [
      {
        massAppliedKg: nv(360),
        limestoneFraction: nv(0.5),
        type: 'Limestone',
      },
    ],
  },
  chemicals: [
    {
      type: 'Herbicide (paraquat, diquat, glyphosate)',
      amountKg: nv(4.25),
    },
    {
      type: 'Other herbicide',
      amountKg: nv(10.8),
    },
  ],
  refrigerants: [],
  fertiliser: {
    productionSystem: 'Non-irrigated pasture',
    inorganic: {
      applications: [],
      calculationMethodScope1: '1',
    },
    organic: {
      applications: [],
    },
  },
  fuel: {
    transport: [],
    stationary: [],
  },

  services: {
    fuel: { stationary: [], transport: [] },
  },
  waste: {},
};

export const grainLegume: GrainsCropInput = {
  crop: {
    type: 'Pulses',
    totalYieldKg: nv(2000),
    fractionOfAnnualCropBurnt: nv(0),
    residues: {
      calculationMethod: '1',
    },
  },
  state: 'NSW',
  isInLeachingZone: false,
  climateZone: 'dry',
  electricityAllocation: nv(0.2),
  lime: {
    applications: [
      {
        massAppliedKg: nv(360),
        limestoneFraction: nv(0.5),
        type: 'Limestone',
      },
    ],
  },
  chemicals: [
    {
      type: 'Herbicide (paraquat, diquat, glyphosate)',
      amountKg: nv(2.12),
    },
    {
      type: 'Other herbicide',
      amountKg: nv(3.6),
    },
  ],
  refrigerants: [],
  fertiliser: {
    productionSystem: 'Irrigated crop',
    inorganic: {
      applications: [],
      calculationMethodScope1: '1',
    },
    organic: {
      applications: [],
    },
  },
  fuel: {
    transport: [],
    stationary: [],
  },

  services: {
    fuel: { stationary: [], transport: [] },
  },
  waste: {},
};

export const grainGrass: GrainsCropInput = {
  crop: {
    type: 'Other Cereals',
    totalYieldKg: nv(6000),
    fractionOfAnnualCropBurnt: nv(0),
    residues: {
      calculationMethod: '1',
    },
  },
  state: 'NSW',
  isInLeachingZone: false,
  climateZone: 'dry',
  electricityAllocation: nv(0.1),
  lime: {
    applications: [
      {
        massAppliedKg: nv(360),
        limestoneFraction: nv(0.5),
        type: 'Limestone',
      },
    ],
  },
  chemicals: [
    {
      type: 'Herbicide (paraquat, diquat, glyphosate)',
      amountKg: nv(4.25),
    },
    {
      type: 'Other herbicide',
      amountKg: nv(18),
    },
  ],
  refrigerants: [],
  fertiliser: {
    productionSystem: 'Non-irrigated pasture',
    inorganic: {
      applications: [],
      calculationMethodScope1: '1',
    },
    organic: {
      applications: [],
    },
  },
  fuel: {
    transport: [],
    stationary: [],
  },
  services: {
    fuel: { stationary: [], transport: [] },
  },
  waste: {},
};

export const grainTriticale: GrainsCropInput = {
  crop: {
    type: 'Triticale',
    totalYieldKg: nv(4000),
    fractionOfAnnualCropBurnt: nv(0),
    residues: {
      calculationMethod: '1',
    },
  },
  state: 'NSW',
  isInLeachingZone: false,
  climateZone: 'dry',
  electricityAllocation: nv(0.1),
  lime: {
    applications: [
      {
        massAppliedKg: nv(360),
        limestoneFraction: nv(0.5),
        type: 'Limestone',
      },
    ],
  },
  chemicals: [
    {
      type: 'Herbicide (paraquat, diquat, glyphosate)',
      amountKg: nv(8.5),
    },
    {
      type: 'Other herbicide',
      amountKg: nv(5.4),
    },
  ],
  refrigerants: [],
  fertiliser: {
    productionSystem: 'Non-irrigated pasture',
    inorganic: {
      applications: [],
      calculationMethodScope1: '1',
    },
    organic: {
      applications: [],
    },
  },
  fuel: {
    transport: [],
    stationary: [],
  },
  services: {
    fuel: { stationary: [], transport: [] },
  },
  waste: {},
};

export const grainsTestData: GrainsInput = {
  crops: [grainWheat, grainSorghum, grainLegume, grainGrass, grainTriticale],
  electricity: {
    method: 'location',
    electricityPurchasedKWh: nv(4000),
    region: 'NSW',
  },
};

export const grainsTestData102: GrainsInput = {
  electricity: {
    method: 'location',
    electricityPurchasedKWh: nv(2650),
    region: 'NSW',
  },
  crops: [
    {
      crop: {
        type: 'Other Cereals',
        totalYieldKg: nv(2500),
        fractionOfAnnualCropBurnt: nv(0.1),
        residues: {
          calculationMethod: '1',
        },
      },
      state: 'NSW',
      isInLeachingZone: false,
      climateZone: 'dry',
      electricityAllocation: nv(1),
      lime: {
        applications: [
          {
            massAppliedKg: nv(360),
            limestoneFraction: nv(0.5),
            type: 'Limestone',
          },
        ],
      },
      chemicals: [
        {
          type: 'Herbicide (paraquat, diquat, glyphosate)',
          amountKg: nv(54.504),
        },
        {
          type: 'Other herbicide',
          amountKg: nv(100),
        },
      ],
      refrigerants: [
        {
          refrigerant: 'HCFC-141b (R-141b)',
          chargeSize: nv(100),
          refrigerationType: 'Domestic refrigerators',
        },
      ],
      fertiliser: {
        productionSystem: 'Irrigated crop',
        inorganic: {
          applications: [
            {
              fertiliserType: 'Urea',
              massAppliedKg: nv(100),
              calculationMethodScope3: '1',
            },
          ],
          calculationMethodScope1: '1',
        },
        organic: {
          applications: [],
        },
      },
      fuel: {
        transport: [],
        stationary: [],
      },
      services: {
        fuel: { stationary: [], transport: [] },
      },
      waste: {},
    },
  ],
};
