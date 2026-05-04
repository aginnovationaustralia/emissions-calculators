import { OtherLivestockClassInput } from '@/calculators/OtherLivestock/types/class.input';
import {
  isOtherLivestockClasslessType,
  OtherLivestockType,
} from '@/constants/enums';
import {
  checkBuffaloClass,
  checkDeerClass,
  checkGoatClass,
} from '../livestock-domain';

/** Column letters for `4.7-other-livestock-manure.xlsx` sheet `4.7.1.1` (shared across 4.7 tests). */
export const otherLivestockManureSheetColumns = {
  columnLivestockType: 'A',
  columnLivestockClass: 'B',
  columnHead: 'C',
  columnIsInLeachingZone: 'D',
  columnProductionSystem: 'E',
  columnMeanAnnualTemperature: 'F',
  columnClimateZone: 'G',
  columnState: 'I',
  columnExcludedFromWater: 'L',
  columnOutputMethane: 'AD',
  columnOutputDirectN2o: 'AF',
  columnOutputDepositionN2o: 'AH',
  columnOutputLeachingN2o: 'AJ',
} as const;

export function getOtherLivestockInput(
  type: OtherLivestockType,
  cls: string | undefined,
  head: number,
): OtherLivestockClassInput {
  if (type === 'Buffalo') {
    const buffaloClass = checkBuffaloClass(cls);
    return {
      type,
      class: buffaloClass,
      head,
    };
  }
  if (type === 'Goats') {
    const goatClass = checkGoatClass(cls);
    return {
      type,
      class: goatClass,
      head,
    };
  }
  if (type === 'Deer') {
    const deerClass = checkDeerClass(cls);
    return {
      type,
      class: deerClass,
      head,
    };
  }
  if (isOtherLivestockClasslessType(type)) {
    return {
      type,
      head,
    };
  }
  throw new Error(`Invalid other livestock type: ${type} with class: ${cls}`);
}
