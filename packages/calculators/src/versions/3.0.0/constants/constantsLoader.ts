import { merge } from 'ts-deepmerge';
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
} from './constant_values';
import { ConstantsContext } from './context';
import { AllConstants } from './versionedConstants';

export const loadAllConstants = (): AllConstants => {
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
  const overrides = ConstantsContext.getOverrides();
  return merge<AllConstants[]>(loadAllConstants(), overrides as AllConstants);
}
