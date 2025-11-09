import { HorticultureCrop } from '@/types/Horticulture/horticulture.input';
import { HorticultureInput } from '@/types/Horticulture/input';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

export const horticulture1: HorticultureCrop = {
  type: 'Perennial Hort',
  areaSown: 1000,
  averageYield: 3.0,
  ureaApplication: 50,
  nonUreaNitrogen: 18,
  phosphorusApplication: 21.76,
  potassiumApplication: 0,
  sulfurApplication: 2.2,
  ureaAmmoniumNitrate: 5,
  limestone: 40,
  limestoneFraction: 1,
  fractionOfAnnualCropBurnt: 0,
  dieselUse: 200,
  petrolUse: 500,
  lpg: 100,
  electricityAllocation: 0.18,
  herbicideUse: 1.7,
  glyphosateOtherHerbicideUse: 7.2,
  rainfallAbove600: true,
  refrigerants: [
    {
      chargeSize: 160,
      refrigerant: 'HFC-134a',
    },
  ],
  nitrificationInhibitorUsed: false,
  ureaseInhibitorUsed: false,
};

export const horticulture2: HorticultureCrop = {
  type: 'Perennial Hort',
  areaSown: 200,
  averageYield: 2.5,
  ureaApplication: 40,
  nonUreaNitrogen: 8.9,
  phosphorusApplication: 14.71,
  potassiumApplication: 0,
  sulfurApplication: 4.6,
  ureaAmmoniumNitrate: 10,
  limestone: 30,
  limestoneFraction: 1,
  fractionOfAnnualCropBurnt: 0.3,
  dieselUse: 500,
  petrolUse: 250,
  lpg: 100,
  electricityAllocation: 0.22,
  herbicideUse: 3.4,
  glyphosateOtherHerbicideUse: 5.4,
  rainfallAbove600: false,
  refrigerants: [
    {
      chargeSize: 50,
      refrigerant: 'HFC-245fa',
    },
  ],
  nitrificationInhibitorUsed: false,
  ureaseInhibitorUsed: true,
};

export const horticulture3: HorticultureCrop = {
  type: 'Hops',
  areaSown: 500,
  averageYield: 2,
  ureaApplication: 20,
  nonUreaNitrogen: 7.2,
  phosphorusApplication: 2.76,
  potassiumApplication: 3,
  sulfurApplication: 9.4,
  ureaAmmoniumNitrate: 5,
  limestone: 0,
  limestoneFraction: 1,
  fractionOfAnnualCropBurnt: 0.2,
  dieselUse: 500,
  petrolUse: 250,
  lpg: 50,
  electricityAllocation: 0.5,
  herbicideUse: 0,
  glyphosateOtherHerbicideUse: 3.6,
  rainfallAbove600: false,
  refrigerants: [
    {
      chargeSize: 20,
      refrigerant: 'HFC-41',
    },
  ],
  nitrificationInhibitorUsed: true,
  ureaseInhibitorUsed: false,
};

export const horticulture4: HorticultureCrop = {
  type: 'Pulses',
  areaSown: 800,
  averageYield: 6,
  ureaApplication: 30,
  nonUreaNitrogen: 15.8,
  phosphorusApplication: 23.28,
  potassiumApplication: 0,
  sulfurApplication: 7,
  ureaAmmoniumNitrate: 12,
  limestone: 0,
  limestoneFraction: 1,
  fractionOfAnnualCropBurnt: 0,
  dieselUse: 500,
  petrolUse: 250,
  lpg: 50,
  electricityAllocation: 0.1,
  herbicideUse: 0,
  glyphosateOtherHerbicideUse: 9,
  rainfallAbove600: false,
  refrigerants: [
    {
      refrigerant: 'HFC-134a',
      chargeSize: 10,
    },
  ],
  nitrificationInhibitorUsed: true,
  ureaseInhibitorUsed: true,
};

export const horticultureTestData: HorticultureInput = {
  state: 'vic',
  crops: [horticulture1],
  electricityRenewable: 0,
  electricityUse: 1200,
  vegetation: [veg1, veg2, veg3, veg4],
};
