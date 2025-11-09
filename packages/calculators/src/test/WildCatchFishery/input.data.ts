import {
  FluidWasteTreatmentType,
  FreightTypes,
  StationaryFuelTypes,
  TransportFuelTypes,
  WildCatchFisheryBait,
} from '@/types/types';
import { WildCatchFisheryInput } from '@/types/WildCatchFishery/input';
import { WildCatchFisheryProductionSystem } from '@/types/WildCatchFishery/wildcatchfishery.input';

export const wildCatchFisheryTestData: WildCatchFisheryInput = {
  // input tab
  enterprises: [
    {
      state: 'sa',
      productionSystem:
        WildCatchFisheryProductionSystem.SOUTHERN_OCEAN_LONGLINE,
      totalHarvestKg: 56000,
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
          type: WildCatchFisheryBait.FISH_FRAMES,
          purchasedTonnes: 10,
          additionalIngredients: 0.1,
          emissionsIntensity: 1,
        },
        {
          type: WildCatchFisheryBait.FISH_HEADS,
          purchasedTonnes: 20,
          additionalIngredients: 0.5,
          emissionsIntensity: 2,
        },
        {
          type: WildCatchFisheryBait.SARDINES,
          purchasedTonnes: 30,
          additionalIngredients: 0.1,
          emissionsIntensity: 3,
        },
        {
          type: WildCatchFisheryBait.SQUID,
          purchasedTonnes: 40,
          additionalIngredients: 0.2,
          emissionsIntensity: 4,
        },
      ],
      customBait: [
        {
          emissionsIntensity: 0.08,
          purchasedTonnes: 15,
        },
      ],

      electricitySource: 'State Grid',
      electricityUse: 1500,
      electricityRenewable: 1 / 4,

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
          fluidWasteTreatmentType: FluidWasteTreatmentType.UNMANAGED_AEROBIC,
          averageInletCOD: 1500,
          averageOutletCOD: 25,
          flaredCombustedFraction: 0.5,
        },
      ],
      solidWaste: {
        sentOffsiteTonnes: 5,
        onsiteCompostingTonnes: 6.2,
      },

      inboundFreight: [
        {
          totalKmTonnes: 2610,
          type: FreightTypes.MEDIUM_HAUL_FLIGHT,
        },
      ],

      outboundFreight: [
        {
          totalKmTonnes: 1608,
          type: FreightTypes.LARGE_CONTAINER_SHIP,
        },
      ],
      totalCommercialFlightsKm: 16000,

      carbonOffsets: 100,
    },
  ],
};
