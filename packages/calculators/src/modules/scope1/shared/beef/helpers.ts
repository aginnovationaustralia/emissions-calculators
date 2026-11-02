import {
  BeefClassPeriodInputTransformed,
  BeefClassPeriodWithCalvesInputTransformed,
} from '@/calculators/Beef/types/beef-class-period.input';
import { isBeefClassSeasonal } from '@/calculators/Beef/types/beef-class.input';
import {
  BeefSpecificClassInputTransformed,
  BeefSpecificClassWithCalvesInputTransformed,
} from '@/calculators/Beef/types/beef-classes.input';
import { entriesFromObject } from '@/calculators/common/tools';
import { ExecutionContext } from '@/calculators/executionContext';
import { isDefined } from '@/common/filters';
import { BeefClass, Months, Season, Seasons } from '@/constants/enums';
import {
  stateOrRegionToExtendedRegion,
  stateOrRegionToLimitedRegion,
  stateOrRegionToState,
} from '@/constants/translations';
import { HasConstants } from '@/constants/types';
import { daysInMonth, monthSeasonMap } from '@/modules/shared';
import { selectConstant } from '@/tools/constants';
import { Container, SummedContainer } from '@/tools/containers';
import { InputContainer } from '@/tools/inputs';
import { captureMethod1Or2Value } from '@/tools/multi';
import { daysInSeason } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Days, NumberUnit } from '@/tools/units';
import { BeefManureAndEntericHerdInputTransformed } from './input';

export type BeefConstants = HasConstants<
  'BEEF_PASTURE' | 'COMMON' | 'LIVESTOCK' | 'CROP'
>;

// Narrowed to just the fields the pasture enteric methane (3.2) and pasture manure
// management (4.2) calculations actually read, rather than the full
// `BeefHerdInputTransformed` -- see shared/beef/input.ts. A full herd object still
// satisfies this structurally, so the dedicated Beef calculator (which does pass the
// full herd) is unaffected.
export type BeefHerdProps = {
  herd: BeefManureAndEntericHerdInputTransformed;
  context: ExecutionContext<BeefConstants>;
};

export type BeefPeriodProps<
  C = BeefSpecificClassInputTransformed,
  P = C extends BeefSpecificClassWithCalvesInputTransformed
    ? BeefClassPeriodWithCalvesInputTransformed
    : BeefClassPeriodInputTransformed,
> = BeefHerdProps & {
  className: BeefClass;
  classInput: C;
  currentPeriod: P;
  periodName: string;
  periodDuration: Container<Days>;
  seasonName: Season;
};

export function calculateForAllClassPeriods<N extends NumberUnit>(
  herdProps: BeefHerdProps,
  calculatePeriod: (periodProps: BeefPeriodProps) => Container<N>,
  options: {
    classResultName: (className: BeefClass) => string;
    herdResultName: string;
    isFebruaryInLeapYear: InputContainer<boolean>;
    /** The result when there are no classes to sum, e.g. zeroCH4 */
    fallback: Container<N>;
  },
): SummedContainer<N> {
  const { herd } = herdProps;
  const { period: _period, ...classes } = herd.classes;
  const classInputs = entriesFromObject(classes);

  const classResults = classInputs
    .map(([className, classInput]) => {
      if (!classInput) {
        return undefined;
      }

      if (isBeefClassSeasonal(classInput)) {
        const seasonalResults = Seasons.map((seasonName) => {
          const currentPeriod = classInput[seasonName];
          return calculatePeriod({
            ...herdProps,
            className,
            classInput,
            currentPeriod,
            periodName: seasonName,
            periodDuration: daysInSeason,
            seasonName,
          });
        });

        return sum(seasonalResults, options.fallback, {
          name: options.classResultName(className),
        });
      }

      const monthlyResults = Months.map((monthName) => {
        const currentPeriod = classInput[monthName];
        return calculatePeriod({
          ...herdProps,
          className,
          classInput,
          currentPeriod,
          periodName: monthName,
          periodDuration: daysInMonth(monthName, options.isFebruaryInLeapYear),
          seasonName: monthSeasonMap[monthName],
        });
      });

      return sum(monthlyResults, options.fallback, {
        name: options.classResultName(className),
      });
    })
    .filter(isDefined);

  return sum(classResults, options.fallback, { name: options.herdResultName });
}

export const getDurationDays = ({
  currentPeriod,
  periodDuration,
  classInput,
  periodName,
}: BeefPeriodProps) => {
  return captureMethod1Or2Value(
    periodDuration,
    currentPeriod.method2DurationDays,
  ).named(`Djk=${classInput.number} (j = ${periodName})`);
};

/**
 * Wrapper for getting liveweight *Wjk* for a beef cattle class *k* in a period *j*.
 */
export const getLiveweight = ({
  context,
  herd,
  currentPeriod,
  className,
  classInput,
  seasonName,
  periodName,
}: BeefPeriodProps) => {
  const { constants } = context;
  const { region } = herd;
  const extendedRegion = stateOrRegionToExtendedRegion(region);

  return captureMethod1Or2Value(
    selectConstant(
      constants.BEEF_PASTURE,
      'LIVEWEIGHT',
      extendedRegion,
      className,
      seasonName,
      'liveweight',
    ),
    currentPeriod.method2Liveweight,
  ).named(`Wjk=${classInput.number} (j=${periodName})`);
};

/**
 * Wrapper for getting liveweight gain *LWGjk* for a beef cattle class *k* in a period
 * *j*.
 */
export const getLiveweightGain = ({
  context,
  herd,
  currentPeriod,
  className,
  classInput,
  seasonName,
  periodName,
}: BeefPeriodProps) => {
  if (currentPeriod.method2LiveweightGain !== undefined) {
    return currentPeriod.method2LiveweightGain.named(
      `LWGjk=${classInput.number} (j=${periodName})`,
    );
  }

  const { constants } = context;
  const { region } = herd;
  const extendedRegion = stateOrRegionToExtendedRegion(region);

  return captureMethod1Or2Value(
    selectConstant(
      constants.BEEF_PASTURE,
      'LIVEWEIGHT',
      extendedRegion,
      className,
      seasonName,
      'liveweightGain',
    ),
    currentPeriod.method2LiveweightGain,
  ).named(`LWGjk=${classInput.number} (j=${periodName})`);
};

/**
 * Wrapper for getting relative size *Zjk* for a beef cattle class *k* in a period
 * *j*.
 */
export const getRelativeSize = (periodProps: BeefPeriodProps) => {
  const { context, className, classInput, herd, periodName } = periodProps;
  const { constants } = context;
  const state = stateOrRegionToState(herd.region);
  const liveweight = getLiveweight(periodProps);
  const referenceWeight = selectConstant(
    constants.BEEF_PASTURE,
    'REFERENCE_WEIGHT',
    state,
    className,
  ).named(`SRWk=${classInput.number}`);

  return liveweight
    .divide(referenceWeight)
    .named(`Zjk=${classInput.number} (j = ${periodName})`)
    .reference('4.2.1.3 (7)');
};

/**
 * Wrapper for getting crude protein content *CPj*  in a period *j*.
 */
export const getCrudeProtein = ({
  herd,
  seasonName,
  currentPeriod,
  context,
}: BeefPeriodProps) => {
  const { constants } = context;
  const { region } = herd;
  const limitedRegion = stateOrRegionToLimitedRegion(region);
  return captureMethod1Or2Value(
    selectConstant(constants.BEEF_PASTURE, 'CP', limitedRegion, seasonName),
    currentPeriod.method2CrudeProteinContent,
  ).named(`CPj (j = ${seasonName})`);
};

export const getDryMatterDigestibilityDMD = ({
  context,
  herd,
  currentPeriod,
  seasonName,
  periodName,
  className,
}: BeefPeriodProps) => {
  const { constants } = context;
  const { region } = herd;
  const limitedStateOrRegion = stateOrRegionToLimitedRegion(region);
  return captureMethod1Or2Value(
    selectConstant(
      constants.BEEF_PASTURE,
      'DMD',
      limitedStateOrRegion,
      seasonName,
    ),
    currentPeriod.method2DryMatterDigestibility,
  ).named(`DMDjkl=${periodName},k=${className}`);
};
