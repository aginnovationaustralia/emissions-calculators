import { merge } from 'ts-deepmerge';
import { CalculatorConfig } from '../calculators/execution/config';
import { AllConstants } from './types';
import {
  aquacultureConstants,
  beefConstants,
  buffaloConstants,
  commonConstants,
  cottonConstants,
  cropConstants,
  dairyConstants,
  deerConstants,
  feedlotConstants,
  fisheriesConstants,
  goatConstants,
  livestockConstants,
  porkConstants,
  poultryConstants,
  riceConstants,
  savannaConstants,
  sheepConstants,
  sugarConstants,
} from './values';

export const loadConstants = (): AllConstants => {
  return {
    COMMON: commonConstants,
    CROP: cropConstants,
    FISHERIES: fisheriesConstants,
    RICE: riceConstants,
    AQUACULTURE: aquacultureConstants,
    BEEF: beefConstants,
    BUFFALO: buffaloConstants,
    COTTON: cottonConstants,
    DAIRY: dairyConstants,
    DEER: deerConstants,
    FEEDLOT: feedlotConstants,
    GOAT: goatConstants,
    LIVESTOCK: livestockConstants,
    PORK: porkConstants,
    POULTRY: poultryConstants,
    SAVANNA: savannaConstants,
    SHEEP: sheepConstants,
    SUGAR: sugarConstants,
  };
};

export function loadOverrideConstants(): AllConstants {
  const overrides = CalculatorConfig.overrides();
  return merge<AllConstants[]>(loadConstants(), overrides as AllConstants);
}
