import { RiceInput } from '../../types/Rice/input';
import { RiceCrop } from '../../types/Rice/rice.input';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

export const riceCrop: RiceCrop = {
  state: 'qld',
  areaSown: 1000,
  averageRiceYield: 5,
  growingSeasonDays: 100,
  waterRegimeType: 'Rainfed',
  waterRegimeSubType: 'Regular rainfed',
  ricePreseasonFloodingPeriod: 'Non flooded pre-season > 180 days',
  nonUreaNitrogen: 2,
  ureaApplication: 50,
  ureaAmmoniumNitrate: 5,
  phosphorusApplication: 20,
  potassiumApplication: 0,
  sulfurApplication: 0,
  fractionOfAnnualCropBurnt: 1,
  herbicideUse: 8.5,
  glyphosateOtherHerbicideUse: 3.6,
  electricityAllocation: 1,
  limestone: 500,
  limestoneFraction: 1,
  dieselUse: 200,
  petrolUse: 500,
  lpg: 100,
};

export const riceTestData: RiceInput = {
  crops: [riceCrop],
  electricityUse: 4000,
  electricityRenewable: 0,
  state: 'qld',
  vegetation: [veg1, veg2, veg3, veg4],
};
