import { Container, translate, TranslationContainer } from '@/tools/containers';
import { BooleanUnit, NumberUnit, realNumber, StringUnit } from '@/tools/units';
import {
  BasicCropProductionSystem,
  ClimateZoneOrZoneType,
  ClimateZoneType,
  ElectricityRegion,
  ExtendedCropProductionSystem,
  ExtendedRegion,
  FeedlotDurationType,
  GrazingProductionSystemsWithRainfall,
  InorganicFertiliserComponentWithEquivalentType,
  InorganicFertiliserType,
  isClimateZoneType,
  isNTRegion,
  isQLDRegion,
  isState,
  isWetClimateZone,
  LimitedRegion,
  RainfallLevel,
  State,
  StateOrRegion,
} from './enums';

export const applyTranslation =
  <
    In extends StringUnit | NumberUnit | BooleanUnit,
    Out extends StringUnit | NumberUnit,
  >(
    map: (value: In) => Out,
  ) =>
  (from: Container<In>): TranslationContainer<In, Out> =>
    translate(map(from.unit as In), from);

export const rainfallAbove600ToRainfallLevel = applyTranslation(
  (above600: boolean): RainfallLevel =>
    above600 ? 'high_rainfall' : 'low_rainfall',
);

export const climateZoneOrZoneTypeToClimateZoneType = applyTranslation(
  (climateZone: ClimateZoneOrZoneType): ClimateZoneType => {
    if (isClimateZoneType(climateZone)) {
      return climateZone;
    } else if (isWetClimateZone(climateZone)) {
      return 'wet';
    } else {
      return 'dry';
    }
  },
);

export const isInLeachingZoneToFracWET = (from: Container<boolean>) =>
  translate(realNumber(from.unit ? 1 : 0), from).named('FracWET');

/**
 * The jurisdictional renewable power percentage (JRPP) only applies to the ACT.
 * Translating the region into a 1 or 0 factor keeps the region input in the
 * calculation graph, rather than discarding it in a branch.
 */
export const electricityRegionToJRPPFactor = (
  from: Container<ElectricityRegion>,
) =>
  translate(realNumber(from.unit === 'ACT' ? 1 : 0), from).named('JRPPfactor');

export const convertToBasicProductionSystem = applyTranslation(
  (
    system:
      | GrazingProductionSystemsWithRainfall
      | BasicCropProductionSystem
      | ExtendedCropProductionSystem,
  ): BasicCropProductionSystem => {
    if (system === 'Irrigated crop (maize)') {
      return 'Irrigated crop';
    }

    return system;
  },
);

export const groupDurationToDurationType = applyTranslation(
  (duration: NumberUnit): FeedlotDurationType => {
    if (duration.store.value.lte(80)) {
      return '0-80 days';
    } else if (duration.store.value.lte(200)) {
      return '81-200 days';
    } else {
      return '201+ days';
    }
  },
);

export const stateOrRegionToExtendedRegion = applyTranslation(
  (stateOrRegion: StateOrRegion): ExtendedRegion => {
    if (stateOrRegion === 'ACT' || stateOrRegion === 'NSW') {
      return 'ACT/NSW';
    } else {
      return stateOrRegion;
    }
  },
);

export const stateOrRegionToLimitedRegion = applyTranslation(
  (stateOrRegion: StateOrRegion): LimitedRegion => {
    if (isNTRegion(stateOrRegion)) {
      return 'NT';
    } else if (isQLDRegion(stateOrRegion)) {
      return 'QLD';
    } else if (stateOrRegion === 'ACT' || stateOrRegion === 'NSW') {
      return 'ACT/NSW';
    } else {
      return stateOrRegion;
    }
  },
);

export const stateOrRegionToState = applyTranslation(
  (stateOrRegion: StateOrRegion): State => {
    if (isState(stateOrRegion)) {
      return stateOrRegion;
    } else if (isNTRegion(stateOrRegion)) {
      return 'NT';
    } else if (isQLDRegion(stateOrRegion)) {
      return 'QLD';
    } else {
      return 'WA';
    }
  },
);

const componentToEquivalentFertiliser: Record<
  InorganicFertiliserComponentWithEquivalentType,
  InorganicFertiliserType
> = {
  'Monoammonium phosphate': 'Monoammonium Phosphate (MAP)',
  'Diammonium Phosphate': 'Diammonium Phosphate (DAP)',
  'Urea-Ammonium Nitrate': 'Urea-Ammonium Nitrate (UAN)',
  'Ammonium Nitrate': 'Ammonium Nitrate (AN)',
  'Calcium Ammonium Nitrate': 'Calcium Ammonium Nitrate (CAN)',
  'Sulphate of Ammonia': 'Sulphate of Ammonia (SOA)',
  'Single superphosphate': 'Single Super Phosphate',
  Urea: 'Urea',
};

export const componentToFertiliser = applyTranslation(
  (component: InorganicFertiliserComponentWithEquivalentType) =>
    componentToEquivalentFertiliser[component],
);
