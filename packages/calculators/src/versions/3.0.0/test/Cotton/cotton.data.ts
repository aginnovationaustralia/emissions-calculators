import { CottonCrop } from '../../types/Cotton/cotton.input';
import { CottonInput } from '../../types/Cotton/input';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

export const cotton1: CottonCrop = {
  areaSown: 1000,
  averageCottonYield: 5.247,
  ureaApplication: 543,
  singleSuperPhosphate: 20,
  otherFertiliserType: 'Diammonium Phosphate (DAP)',
  otherFertiliserApplication: 10,
  limestone: 7,
  limestoneFraction: 0.8,
  fractionOfAnnualCropBurnt: 0.3,
  dieselUse: 1000,
  petrolUse: 1000,
  lpg: 80,
  electricityAllocation: 1,
  herbicideUse: 2,
  glyphosateOtherHerbicideUse: 4,
  rainfallAbove600: true,
  state: 'nsw',
  averageWeightPerBaleKg: 227,
  cottonLintPerBaleKg: 200,
  cottonSeedPerBaleKg: 20,
  wastePerBaleKg: 7,
  // v101 values
  nonUreaNitrogen: 251.55,
  phosphorusApplication: 20,
  potassiumApplication: 2,
  sulfurApplication: 0,
  ureaAmmoniumNitrate: 0,
};

export const cottonTestData: CottonInput = {
  state: 'nsw',
  crops: [cotton1],
  electricityRenewable: 0.2,
  electricityUse: 4000,
  vegetation: [veg1, veg2, veg3, veg4],
};
