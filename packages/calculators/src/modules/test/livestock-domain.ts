import {
  BeefBreed,
  BeefBreeds,
  BeefClass,
  BeefClasses,
  BeefPurchaseCategories,
  BuffaloClass,
  BuffaloClasses,
  ClimateZone,
  ClimateZones,
  DairyClasses,
  DairyPurchaseCategories,
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
  GrazingProductionSystemsWithRainfall,
  LimitedRegion,
  LimitedRegions,
  LivestockPurchaseCategories,
  MeanAnnualTemperature,
  MeanAnnualTemperatures,
  OtherLivestockType,
  OtherLivestockTypes,
  PigPurchaseCategories,
  PigsLiveweightClasses,
  PoultryWeightClasses,
  Seasons,
  SecondaryFeedlotMMSType,
  SecondaryFeedlotMMSTypes,
  State,
  StateOrRegion,
  StateOrRegions,
  States,
} from '@/constants/enums';
import { createValueCheck } from './domain';

export const checkFeedlotMMSType = (
  type: string | undefined,
): FeedlotMMSType => {
  if (!FeedlotMMSTypes.includes(type as FeedlotMMSType)) {
    throw new Error(`Invalid feedlot MMS type: ${type}`);
  }
  return type as FeedlotMMSType;
};

export const checkFeedlotSecondaryMMSType = (
  type: string | undefined,
): SecondaryFeedlotMMSType => {
  if (!SecondaryFeedlotMMSTypes.includes(type as SecondaryFeedlotMMSType)) {
    throw new Error(`Invalid feedlot secondary MMS type: ${type}`);
  }
  return type as SecondaryFeedlotMMSType;
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

export const checkState = (state: string | undefined): State => {
  if (!States.includes(state as State)) {
    throw new Error(`Invalid pure state: ${state}`);
  }
  return state as State;
};

export const checkMeanAnnualTemperature = (
  temperature: string | undefined,
): MeanAnnualTemperature => {
  if (!MeanAnnualTemperatures.includes(temperature as MeanAnnualTemperature)) {
    throw new Error(`Invalid mean annual temperature: ${temperature}`);
  }
  return temperature as MeanAnnualTemperature;
};

export const checkGrazingProductionSystemsWithRainfall = (
  system: string | undefined,
): GrazingProductionSystemsWithRainfall => {
  if (
    !GrazingProductionSystemsWithRainfall.includes(
      system as GrazingProductionSystemsWithRainfall,
    )
  ) {
    throw new Error(
      `Invalid grazing production system with rainfall: ${system}`,
    );
  }
  return system as GrazingProductionSystemsWithRainfall;
};

export const checkBeefBreed = (breed: string | undefined): BeefBreed => {
  if (!BeefBreeds.includes(breed as BeefBreed)) {
    throw new Error(`Invalid beef breed: ${breed}`);
  }
  return breed as BeefBreed;
};

export const checkPurchaseCategory = createValueCheck(
  LivestockPurchaseCategories,
  'Livestock purchase category',
);

export const checkBeefPurchaseCategory = createValueCheck(
  BeefPurchaseCategories,
  'Beef purchase category',
);

export const checkDairyPurchaseCategory = createValueCheck(
  DairyPurchaseCategories,
  'Dairy purchase category',
);

export const checkBeefClass = createValueCheck(BeefClasses, 'Beef class');

export const convertBeefClass = (input: string | undefined): BeefClass => {
  switch (input) {
    case 'Bulls < 1 year':
      return 'bullsLt1';
    case 'Cows 1-2 years':
      return 'cows1To2Years';
    case 'Cows < 1 year':
      return 'cowsLt1';
    case 'Cows > 3 years':
      return 'cowsGt3Years';
    case 'Steers 1-2 years':
      return 'steers1To2Years';
    case 'Steers 2-3 years':
      return 'steers2To3Years';
    case 'Steers < 1 year':
      return 'steersLt1';
    case 'Steers >3 years':
      return 'steersGt3Years';
  }

  throw new Error(`${input} is not a valid beef class lookup value`);
};

export const convertExtendedRegion = (
  input: string | undefined,
): ExtendedRegion => {
  if (input === 'ACT' || input === 'NSW') {
    return 'ACT/NSW';
  }

  return checkExtendedRegion(input);
};

export const checkSeason = createValueCheck(Seasons, 'Season');

export const checkDairyClass = createValueCheck(DairyClasses, 'Dairy class');

export const checkPigPurchaseCategory = createValueCheck(
  PigPurchaseCategories,
  'Pig purchase',
);
export const checkPigWeightClass = createValueCheck(
  PigsLiveweightClasses,
  'Pig weight class',
);

export const checkPoultryWeightClass = createValueCheck(
  PoultryWeightClasses,
  'Poultry weight class',
);
