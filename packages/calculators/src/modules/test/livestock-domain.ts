import {
  ClimateZone,
  ClimateZones,
  DairySystem,
  DairySystems,
  ExtendedRegion,
  ExtendedRegions,
  FeedlotMMSType,
  FeedlotMMSTypes,
  LimitedRegion,
  LimitedRegions,
  StateOrRegion,
  StateOrRegions,
  SwineMMSType,
  SwineMMSTypes,
} from '@/constants/enums';

export const checkSwineMMSType = (type: string | undefined): SwineMMSType => {
  if (!SwineMMSTypes.includes(type as SwineMMSType)) {
    throw new Error(`Invalid swine MMS type: ${type}`);
  }
  return type as SwineMMSType;
};

export const checkFeedlotMMSType = (
  type: string | undefined,
): FeedlotMMSType => {
  if (!FeedlotMMSTypes.includes(type as FeedlotMMSType)) {
    throw new Error(`Invalid feedlot MMS type: ${type}`);
  }
  return type as FeedlotMMSType;
};

export const checkDairySystem = (system: string | undefined): DairySystem => {
  if (!DairySystems.includes(system as DairySystem)) {
    throw new Error(`Invalid dairy system: ${system}`);
  }
  return system as DairySystem;
};

export const checkClimateZone = (region: string | undefined): ClimateZone => {
  if (!ClimateZones.includes(region as ClimateZone)) {
    throw new Error(`Invalid climate region: ${region}`);
  }
  return region as ClimateZone;
};

export const checkLimitedRegion = (
  region: string | undefined,
): LimitedRegion => {
  if (!LimitedRegions.includes(region as LimitedRegion)) {
    throw new Error(`Invalid region: ${region}`);
  }
  return region as LimitedRegion;
};

export const checkExtendedRegion = (
  region: string | undefined,
): ExtendedRegion => {
  if (!ExtendedRegions.includes(region as ExtendedRegion)) {
    throw new Error(`Invalid extended region: ${region}`);
  }
  return region as ExtendedRegion;
};

export const checkStateOrRegion = (
  stateOrRegion: string | undefined,
): StateOrRegion => {
  if (!StateOrRegions.includes(stateOrRegion as StateOrRegion)) {
    throw new Error(`Invalid state or region: ${stateOrRegion}`);
  }
  return stateOrRegion as StateOrRegion;
};
