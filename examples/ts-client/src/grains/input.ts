import { GrainsInput } from '@aginnovationaustralia/emissions-calculators/grains';

// Create a sample grains input (simplified for demonstration)
export const grainsInputData: GrainsInput = {
  state: 'nsw',
  isInLeachingZone: false,
  rainfallAbove600: false,
  electricity: {
    method: 'location',
    electricityPurchasedKWh: 4000,
  },
  crops: [
    {
      areaSown: 1000,
      isInLeachingZone: true,
      electricityAllocation: 0.2,
      chemicals: [],
      refrigerants: [],
      inorganicFertilisers: {
        productionSystem: 'Non-irrigated crops',
        applications: [
          {
            fertiliserType: 'Urea',
            massAppliedKg: 100,
            calculationMethodScope3: '1',
            components: [],
          },
        ],
        calculationMethodScope1: '1',
      },
      organicFertilisers: {
        applications: [
          {
            massAppliedKg: 100,
            origin: {
              origin: 'Local',
              details: {
                type: 'swine',
                fractionAppliedToSoils: 0.5,
                herds: [
                  {
                    boars: {
                      head: 1000,
                      days: 180,
                      manureAllocation: {
                        solidsSeparatedPreTreatment: true,
                        anaerobicLagoon: 0.3,
                        digester: 0.3,
                        deepLitter: 0.4,
                        solidStorage: 0,
                        outdoorAndFreeRange: 0,
                        pitStorage: 0,
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      waste: {
        offsiteManure: [],
        solidWaste: {
          landfill: [],
          incineration: [],
          composting: [],
          anaerobicDigestion: [],
        },
      },
      services: [],
      transportFuel: [],
      stationaryFuel: [],
      rainfallAbove600: true,
      cropResidues: {
        calculationMethod: '1',
      },
      averageYield: 3,
      fractionOfAnnualCropBurnt: 1,
      limestone: 500,
      limestoneFraction: 1,
      dolomiteFraction: 0,
      type: 'Wheat',
      state: 'nsw',
    },
  ],
};
