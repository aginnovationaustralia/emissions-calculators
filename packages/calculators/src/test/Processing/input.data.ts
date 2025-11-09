import { ProcessingInput } from '@/types/Processing/input';
import { ProductUnit } from '@/types/Processing/product.input';
import { FluidWasteTreatmentType, StationaryFuelTypes } from '@/types/types';

export const processingTestData: ProcessingInput = {
  // input tab
  state: 'wa_sw',
  products: [
    {
      product: {
        unit: ProductUnit.UNIT,
        amountMadePerYear: 100000,
      },
      electricitySource: 'State Grid',
      electricityUse: 4000,
      electricityRenewable: 0.25,
      fuel: {
        stationaryFuel: [
          {
            type: StationaryFuelTypes.PETROL,
            amountLitres: 12000,
          },
          {
            type: StationaryFuelTypes.DIESEL,
            amountLitres: 10000,
          },
          {
            type: StationaryFuelTypes.LPG,
            amountLitres: 5000,
          },
        ],
        transportFuel: [],
        naturalGas: 3000,
      },
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
      purchasedCO2: 12.4,
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
        sentOffsiteTonnes: 100,
        onsiteCompostingTonnes: 40,
      },
      // summary tab
      carbonOffsets: 100,
    },
  ],
};
