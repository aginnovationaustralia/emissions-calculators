import { AquacultureInput } from '@/types/Aquaculture/input';
import {
  AquacultureBait,
  AquacultureProductionSystem,
  FluidWasteTreatmentType,
  FreightTypes,
  StationaryFuelTypes,
  TransportFuelTypes,
} from '@/types/enums';

export const aquacultureTestData: AquacultureInput = {
  // input tab
  enterprises: [
    {
      state: 'wa_sw',
      productionSystem: AquacultureProductionSystem.OFFSHORE_CAGED_AQUACULTURE,
      totalHarvestKg: 5600,
      refrigerants: [
        {
          refrigerant: 'HFC-23',
          chargeSize: 5,
        },
        {
          refrigerant: 'R-409A',
          chargeSize: 6,
        },
        {
          refrigerant: 'HFC-152a',
          chargeSize: 7,
        },
        {
          refrigerant: 'R-422D',
          chargeSize: 8,
        },
      ],
      bait: [
        {
          type: AquacultureBait.LOW_ANIMAL_PROTEIN,
          purchasedTonnes: 10,
          additionalIngredients: 0.1,
          emissionsIntensity: 1,
        },
        {
          type: AquacultureBait.FISH,
          purchasedTonnes: 20,
          additionalIngredients: 0.2,
          emissionsIntensity: 0.3,
        },
        {
          type: AquacultureBait.LOW_ANIMAL_PROTEIN,
          purchasedTonnes: 30,
          additionalIngredients: 0.3,
          emissionsIntensity: 1,
        },
        {
          type: AquacultureBait.CEREAL,
          purchasedTonnes: 40,
          additionalIngredients: 0.4,
          emissionsIntensity: 0.5,
        },
      ],
      customBait: [
        {
          emissionsIntensity: 0.08,
          purchasedTonnes: 15,
        },
      ],

      inboundFreight: [
        {
          totalKmTonnes: 261001,
          type: FreightTypes.MEDIUM_HAUL_FLIGHT,
        },
      ],

      outboundFreight: [
        {
          totalKmTonnes: 160801,
          type: FreightTypes.LARGE_CONTAINER_SHIP,
        },
      ],
      totalCommercialFlightsKm: 16000,

      electricitySource: 'State Grid',
      electricityUse: 2250,
      electricityRenewable: 1 / 3,

      fuel: {
        stationaryFuel: [
          {
            type: StationaryFuelTypes.PETROL,
            amountLitres: 110,
          },
          {
            type: StationaryFuelTypes.ETHANOL,
            amountLitres: 150,
          },
        ],
        transportFuel: [
          {
            type: TransportFuelTypes.BIODIESEL,
            amountLitres: 3960.9467,
          },
          {
            type: TransportFuelTypes.AVGAS,
            amountLitres: 4200,
          },
        ],
        naturalGas: 250,
      },
      fluidWaste: [
        {
          fluidWasteKl: 10000,
          fluidWasteTreatmentType:
            FluidWasteTreatmentType.DEEP_ANAEROBIC_LAGOON_GT_2M,
          averageInletCOD: 1500,
          averageOutletCOD: 25,
          flaredCombustedFraction: 0.5,
        },
      ],
      solidWaste: {
        sentOffsiteTonnes: 5,
        onsiteCompostingTonnes: 6.2,
      },
      carbonOffsets: 100,
    },
  ],
};
