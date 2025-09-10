import { VineyardInput } from '../../types/Vineyard/input';
import {
  FluidWasteTreatmentType,
  FreightTypes,
  StationaryFuelTypes,
  TransportFuelTypes,
} from '../../types/types';

export const vineyardTestData: VineyardInput = {
  vineyards: [
    {
      // Input - Vineyard
      state: 'sa',
      rainfallAbove600: false,
      irrigated: false,
      areaPlanted: 50, // hectares
      averageYield: 0.24, // tonnes per hectare

      nonUreaNitrogen: 5, // kg N/ha
      phosphorusApplication: 20, // kg P/ha
      potassiumApplication: 0, // kg K/ha
      sulfurApplication: 0, // kg S/ha
      ureaApplication: 50, // kg Urea/ha
      ureaAmmoniumNitrate: 5, // kg product/ha

      limestone: 130, // kg/ha
      limestoneFraction: 0.4,

      herbicideUse: 5, // kg active ingredient
      glyphosateOtherHerbicideUse: 3, // kg active ingredient

      // Input - Electricity & Fuel
      electricitySource: 'State Grid',
      electricityUse: 1000, // kWh
      electricityRenewable: 0.3, // 30% renewable

      fuel: {
        stationaryFuel: [
          {
            type: StationaryFuelTypes.PETROL,
            amountLitres: 180,
          },
          {
            type: StationaryFuelTypes.DIESEL,
            amountLitres: 72.5,
          },
          {
            type: StationaryFuelTypes.LPG,
            amountLitres: 39,
          },
        ],
        transportFuel: [
          {
            type: TransportFuelTypes.BIODIESEL,
            amountLitres: 10000,
          },
        ],
        naturalGas: 2500,
      },

      // Input - Waste & Outputs
      fluidWaste: [
        {
          fluidWasteKl: 10000,
          fluidWasteTreatmentType: FluidWasteTreatmentType.UNMANAGED_AEROBIC,
          averageInletCOD: 1500,
          averageOutletCOD: 25,
          flaredCombustedFraction: 0.6,
        },
      ],

      solidWaste: {
        sentOffsiteTonnes: 10,
        onsiteCompostingTonnes: 4,
      },

      // Input - Travel & freight
      outboundFreight: [
        {
          totalKmTonnes: 40100,
          type: FreightTypes.TRUCK,
        },
        {
          totalKmTonnes: 40600,
          type: FreightTypes.LARGE_CONTAINER_SHIP,
        },
      ],

      inboundFreight: [
        {
          totalKmTonnes: 20000,
          type: FreightTypes.TRUCK,
        },
      ],

      totalCommercialFlightsKm: 6000,
    },
  ],
  vegetation: [
    {
      vegetation: {
        region: 'Central Highlands/Northern',
        treeSpecies: 'Pinus Hybrids',
        soil: 'Clays',
        area: 10,
        age: 5,
      },
      allocationToVineyards: [1.0],
    },
    {
      vegetation: {
        region: 'Northern Tablelands',
        treeSpecies: 'Red Ironbark',
        soil: 'Loam',
        area: 10,
        age: 5,
      },
      allocationToVineyards: [1.0],
    },
    {
      vegetation: {
        region: 'South Coast',
        treeSpecies: 'Sugar Gum',
        soil: 'Clay',
        area: 10,
        age: 5,
      },
      allocationToVineyards: [1.0],
    },
    {
      vegetation: {
        region: 'North East',
        treeSpecies: 'Tasmanian Blue Gum',
        soil: 'Structured Earths',
        area: 5,
        age: 2,
      },
      allocationToVineyards: [1.0],
    },
  ],
};
