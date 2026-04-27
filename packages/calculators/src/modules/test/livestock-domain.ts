import {
  BuffaloClass,
  BuffaloClasses,
  ClimateZone,
  ClimateZones,
  DairySystem,
  DairySystems,
  DeerClass,
  DeerClasses,
  ExtendedRegion,
  ExtendedRegions,
  FeedlotMMSType,
  FeedlotMMSTypes,
  GoatClass,
  GoatClasses,
  GrazingProductionSystem,
  GrazingProductionSystems,
  LimitedRegion,
  LimitedRegions,
  OtherLivestockType,
  OtherLivestockTypes,
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

export const checkGrazingSystem = (
  system: string | undefined,
): GrazingProductionSystem => {
  if (!GrazingProductionSystems.includes(system as GrazingProductionSystem)) {
    throw new Error(`Invalid grazing system: ${system}`);
  }
  return system as GrazingProductionSystem;
};

export const checkOtherLivestockClass = (
  type: string | undefined,
): OtherLivestockType => {
  if (!OtherLivestockTypes.includes(type as OtherLivestockType)) {
    throw new Error(`Invalid other livestock class: ${type}`);
  }
  return type as OtherLivestockType;
};

export const checkBuffaloClass = (cls: string | undefined): BuffaloClass => {
  if (!BuffaloClasses.includes(cls as BuffaloClass)) {
    throw new Error(`Invalid buffalo class: ${cls}`);
  }
  return cls as BuffaloClass;
};

export const checkGoatClass = (cls: string | undefined): GoatClass => {
  if (!GoatClasses.includes(cls as GoatClass)) {
    throw new Error(`Invalid goat class: ${cls}`);
  }
  return cls as GoatClass;
};

export const checkDeerClass = (cls: string | undefined): DeerClass => {
  if (!DeerClasses.includes(cls as DeerClass)) {
    throw new Error(`Invalid deer class: ${cls}`);
  }
  return cls as DeerClass;
};
