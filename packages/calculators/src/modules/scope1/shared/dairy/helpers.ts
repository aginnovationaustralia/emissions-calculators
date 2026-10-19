import {
  DairyClassInputTransformed,
  isClassMature,
  isClassWeaned,
} from '@/calculators/Dairy/types/dairy-class.input';
import { DairySaleInputTransformed } from '@/calculators/Dairy/types/sale.input';
import { DairyCattleBreed, DairyTimeInLocations } from '@/constants/enums';
import { DairyConstants, HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container, num } from '@/tools/containers';
import { ifTrueElse } from '@/tools/if-else';
import { captureMethod1Or2Value } from '@/tools/multi';
import { RealNumber } from '@/tools/units';
import {
  DairyHerdSharedInputTransformed,
  DairyMMSAllocationLivestockInputTransformed,
} from './input';

/**
 * Wrapper for getting the liveweight *Wj* for a dairy class *j*.
 */
export const getLiveweight = (
  dairyClass: DairyClassInputTransformed,
  breed: Container<DairyCattleBreed>,
  constants: HasConstants<'DAIRY'>,
) => {
  return captureMethod1Or2Value(
    selectConstant(
      constants.DAIRY,
      'LIVEWEIGHTS_BY_BREED',
      breed,
      dairyClass.className,
    ),
    dairyClass.method2Liveweight,
  ).named(`Wj=${dairyClass.number}`);
};

/**
 * Wrapper for getting the liveweight gain *LWGj* for a dairy class *j*.
 */
export const getLiveweightGain = (
  dairyClass: DairyClassInputTransformed,
  constants: HasConstants<'DAIRY'>,
) =>
  captureMethod1Or2Value(
    selectConstant(
      constants.DAIRY,
      'CLASSES',
      dairyClass.className,
      'liveweightGain',
    ),
    dairyClass.method2LiveweightGain,
  ).named(`LWGj=${dairyClass.number}`);

/**
 * Wrapper for getting the average length of stay *Dj*.
 */
export const getLengthOfStay = (
  dairyClass: DairyClassInputTransformed,
  constants: HasConstants<'DAIRY'>,
) => {
  if (dairyClass.method2DurationDays) return dairyClass.method2DurationDays;
  if (isClassMature(dairyClass)) {
    return selectConstant(
      constants.DAIRY,
      'CLASSES',
      dairyClass.className,
      'averageStay',
    );
  }
  return selectConstant(
    constants.DAIRY,
    'CLASSES',
    dairyClass.className,
    'averageStay',
    isClassWeaned(dairyClass) ? 'weaned' : 'preWeaned',
  );
};

/**
 * Wrapper for getting the dry matter digestibility of feed intake *DMDj*.
 */
export const getDryMatterDigestibility = (
  dairyClass: DairyClassInputTransformed,
  constants: HasConstants<'DAIRY'>,
) => {
  return captureMethod1Or2Value(
    selectConstant(
      constants.DAIRY,
      'DIETARY_CONSTANTS',
      'dryMatterDigestibility',
    ),
    dairyClass.method2DryMatterDigestibility,
  ).named(`DMDj=${dairyClass.number}`);
};

/**
 * Wrapper for getting the crude protein content *CPj* of a dairy class *j*.
 */
export const getCrudeProtein = (
  dairyClass: DairyClassInputTransformed,
  constants: HasConstants<'DAIRY'>,
) => {
  return captureMethod1Or2Value(
    selectConstant(constants.DAIRY, 'DIETARY_CONSTANTS', 'crudeProtein'),
    dairyClass.method2CrudeProtein,
  ).named(`CPj=${dairyClass.number}`);
};

/**
 * Wrapper for getting the metabolic rate increase of feed intake *MRj* of a dairy class *j*.
 */
export const getMetabolicRateIncrease = (
  dairyClass: DairyClassInputTransformed,
  constants: { DAIRY: DairyConstants },
) =>
  selectConstant(
    constants.DAIRY,
    'MILK_CONSTANTS',
    'INCREASE_METABOLIC_RATE_FOR_MILK',
    dairyClass.className === 'milkingCows' ? 'milkingCows' : 'others',
  ).named(`MRj=${dairyClass.number}`);

/**
 * Wrapper for getting the relative size *Zj* of a dairy class *j*.
 */
export const getRelativeSize = (
  dairyClass: DairyClassInputTransformed,
  breed: Container<DairyCattleBreed>,
  constants: HasConstants<'DAIRY'>,
) => {
  const liveweight = getLiveweight(dairyClass, breed, constants);
  const referenceWeight = selectConstant(
    constants.DAIRY,
    'CLASSES',
    dairyClass.className,
    'referenceWeight',
  ).named(`WRj=${dairyClass.number}`);
  return liveweight
    .divide(referenceWeight)
    .named(`Zj=${dairyClass.number}`)
    .reference('4.3.1.3 (8)');
};

/**
 * Wrapper for getting solid separation rate *SSm*.
 */
export const getSolidSeparationRate = (
  allocations: DairyMMSAllocationLivestockInputTransformed,
  constants: HasConstants<'DAIRY'>,
) => {
  if (allocations.solidSeparationInputMethod === '2')
    return allocations.fractionSolidsSeparatedPreTreatment;
  return ifTrueElse(
    allocations.solidsSeparatedPreTreatment,
    selectConstant(constants.DAIRY, 'DEFAULT_SOLID_SEPARATION_RATE'),
    num(0),
  ).named('SSm');
};

/**
 * Wrapper for getting proportion of time cattle spent in each location,
 * either from direct input or based on the chosen system option.
 */
export const getProportionOfTimeSpentInLocationForHerd = (
  herdInput: DairyHerdSharedInputTransformed,
  constants: HasConstants<'DAIRY'>,
): Record<DairyTimeInLocations, Container<RealNumber>> => {
  if (herdInput.timeSpentInLocationsInputMethod === '2')
    return {
      pasture: herdInput.method2TimeSpentInLocations.timeSpentOnPasture,
      feedpad: herdInput.method2TimeSpentInLocations.timeSpentOnFeedpad,
      milkingShed: herdInput.method2TimeSpentInLocations.timeSpentOnMilkingShed,
    };

  return {
    pasture: selectConstant(
      constants.DAIRY,
      'TIME_IN_LOCATIONS',
      herdInput.system,
      'pasture',
    ),
    feedpad: selectConstant(
      constants.DAIRY,
      'TIME_IN_LOCATIONS',
      herdInput.system,
      'feedpad',
    ),
    milkingShed: selectConstant(
      constants.DAIRY,
      'TIME_IN_LOCATIONS',
      herdInput.system,
      'milkingShed',
    ),
  };
};

export const totalLiveweightFromSale = (
  sale: DairySaleInputTransformed,
  breed: Container<DairyCattleBreed>,
  constants: HasConstants<'DAIRY'>,
) => {
  const liveweight =
    sale.averageLiveweight ??
    selectConstant(constants.DAIRY, 'LIVEWEIGHTS_BY_BREED', breed, sale.class);

  return sale.numberSold.multiply(liveweight);
};
