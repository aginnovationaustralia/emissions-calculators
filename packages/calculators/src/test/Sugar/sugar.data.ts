import { SugarInput } from '@/types/Sugar/input';
import { SugarCrop } from '@/types/Sugar/sugar.input';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

export const sugar1: SugarCrop = {
  state: 'qld',
  productionSystem: 'Sugar cane',
  averageCaneYield: 90,
  areaSown: 2300,
  nonUreaNitrogen: 20,
  ureaApplication: 280,
  ureaAmmoniumNitrate: 0,
  phosphorusApplication: 10,
  potassiumApplication: 100,
  sulfurApplication: 15,
  rainfallAbove600: true,
  fractionOfAnnualCropBurnt: 0,
  herbicideUse: 2300,
  glyphosateOtherHerbicideUse: 7000,
  electricityAllocation: 1.0,
  limestone: 0.5,
  limestoneFraction: 1,
  dieselUse: 350000,
  petrolUse: 15000,
  lpg: 120,
};

export const sugarTestData: SugarInput = {
  crops: [sugar1],
  electricityUse: 300000,
  electricityRenewable: 0.1,
  state: 'qld',
  vegetation: [veg1, veg2, veg3, veg4],
};
