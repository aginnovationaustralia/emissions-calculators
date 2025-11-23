import { CottonCrop } from '@/types/Cotton/cotton.input';
import { CottonInput } from '@/types/Cotton/input';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

export const cotton1: CottonCrop = {
  state: 'nsw',
  rainfallAbove600: true,
  averageWeightPerBaleKg: 227,
  cottonLintPerBaleKg: 200,
  cottonSeedPerBaleKg: 20,
  wastePerBaleKg: 7,
  areaSown: 1000,
  averageCottonYield: 5.247,
  nonUreaNitrogen: 251.55,
  ureaApplication: 543,
  ureaAmmoniumNitrate: 0,
  phosphorusApplication: 20,
  potassiumApplication: 2,
  sulfurApplication: 0,
  singleSuperPhosphate: 20,
  otherFertiliserType: 'Diammonium Phosphate (DAP)',
  otherFertiliserApplication: 10,
  limestone: 7,
  limestoneFraction: 0.8,
  fractionOfAnnualCropBurnt: 0,
  dieselUse: 1000,
  petrolUse: 1000,
  lpg: 80,
  electricityAllocation: 1,
  herbicideUse: 2,
  glyphosateOtherHerbicideUse: 4,
  // v101 values
};

export const cottonTestData: CottonInput = {
  state: 'nsw',
  crops: [cotton1],
  electricityRenewable: 0.2,
  electricityUse: 4000,
  vegetation: [veg1, veg2, veg3, veg4],
};
