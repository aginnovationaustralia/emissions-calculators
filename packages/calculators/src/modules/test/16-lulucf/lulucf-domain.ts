import {
  IBRA7Region,
  IBRA7Regions,
  PerennialWoodyCropFull,
  PerennialWoodyCropPartial,
  PerennialWoodyCropsFull,
  PerennialWoodyCropsPartial,
} from '@/constants/enums';

export const checkIBRA7Region = (region: string | undefined): IBRA7Region => {
  if (!IBRA7Regions.includes(region as IBRA7Region)) {
    throw new Error(`Invalid IBRA7 region: ${region}`);
  }
  return region as IBRA7Region;
};

export const checkPerennialWoodyCropType = (
  type: string | undefined,
): PerennialWoodyCropFull | PerennialWoodyCropPartial => {
  if (PerennialWoodyCropsFull.includes(type as PerennialWoodyCropFull)) {
    return type as PerennialWoodyCropFull;
  }
  if (PerennialWoodyCropsPartial.includes(type as PerennialWoodyCropPartial)) {
    return type as PerennialWoodyCropPartial;
  }
  throw new Error(`Invalid perennial woody crop type: ${type}`);
};
