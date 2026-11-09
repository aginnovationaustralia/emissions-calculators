import { AllConstants, HasCommonConstants } from '@/constants/types';
import {
  aquacultureConstants,
  beefPastureConstants,
  commonConstants,
  cropConstants,
  dairyConstants,
  feedlotConstants,
  livestockConstants,
  lulucfConstants,
  pigsConstants,
  poultryConstants,
  riceConstants,
  sheepConstants,
} from '@/constants/values';
import { packageVersion } from './execution/version';

type ExecutionMetadata = {
  calculator: string;
  version: string;
  timestamp: string;
  overrides?: object | undefined;
  checkpoint?: (
    sheetName: string,
    data: Record<string, { cell: string; value: number }>,
  ) => void;
};

export interface ExecutionContext<
  T extends HasCommonConstants = HasCommonConstants,
> extends ExecutionMetadata {
  constants: T;
}

export type WithExecutionMetadata<T> = T & { metaData: ExecutionMetadata };

export function contextFor(calculator: string, constants: AllConstants) {
  return {
    calculator,
    version: packageVersion(),
    constants,
    timestamp: new Date().toISOString(),
  };
}

export const loadConstants = (): AllConstants => {
  return {
    COMMON: commonConstants,
    CROP: cropConstants,
    PIGS: pigsConstants,
    FEEDLOT: feedlotConstants,
    DAIRY: dairyConstants,
    POULTRY: poultryConstants,
    BEEF_PASTURE: beefPastureConstants,
    LIVESTOCK: livestockConstants,
    RICE: riceConstants,
    SHEEP: sheepConstants,
    LULUCF: lulucfConstants,
    AQUACULTURE: aquacultureConstants,
  };
};
