import { IBRA7Region, IBRA7Regions } from '@/constants/enums';

export const checkIBRA7Region = (region: string | undefined): IBRA7Region => {
  if (!IBRA7Regions.includes(region as IBRA7Region)) {
    throw new Error(`Invalid IBRA7 region: ${region}`);
  }
  return region as IBRA7Region;
};
