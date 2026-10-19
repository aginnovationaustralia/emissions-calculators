import { entriesFromObject } from '@/calculators/common/tools';
import { ExecutionContext } from '@/calculators/executionContext';
import { SheepClassPeriodExtendedInputTransformed } from '@/calculators/Sheep/types/sheep-class-period.input';
import { isSheepClassSeasonal } from '@/calculators/Sheep/types/sheep-class.input';
import { isDefined } from '@/common/filters';
import { Months, Season, Seasons, SheepClass } from '@/constants/enums';
import { HasConstants } from '@/constants/types';
import { daysInMonth, monthSeasonMap } from '@/modules/shared';
import { selectConstant } from '@/tools/constants';
import {
  Container,
  NumberContainer,
  SummedContainer,
} from '@/tools/containers';
import { InputContainer } from '@/tools/inputs';
import { captureMethod1Or2Value } from '@/tools/multi';
import { daysInSeason } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  Days,
  Liveweight,
  LiveweightGain,
  MassPerArea,
  NumberUnit,
  RealNumber,
} from '@/tools/units';
import { SheepManureAndEntericHerdInputTransformed } from './input';

export type SheepConstants = HasConstants<
  'SHEEP' | 'COMMON' | 'CROP' | 'LIVESTOCK'
>;

// Narrowed to just the fields the sheep enteric methane (3.4) and sheep manure
// management (4.4) calculations actually read, rather than the full
// `SheepFlockInputTransformed` -- see shared/sheep/input.ts. A full flock object still
// satisfies this structurally, so the dedicated Sheep calculator (which does pass the
// full flock) is unaffected.
export type SheepFlockProps = {
  flock: SheepManureAndEntericHerdInputTransformed;
  context: ExecutionContext<SheepConstants>;
};

export type SheepPeriodProps = SheepFlockProps & {
  className: SheepClass;
  periodInput: SheepClassPeriodExtendedInputTransformed;
  periodName: string;
  periodDuration: Container<Days>;
  seasonName: Season;
};

export function calculateForAllClassPeriods<N extends NumberUnit>(
  flockProps: SheepFlockProps,
  calculatePeriod: (periodProps: SheepPeriodProps) => NumberContainer<N>,
  options: {
    classResultName: (className: SheepClass) => string;
    flockResultName: string;
    isFebruaryInLeapYear: InputContainer<boolean>;
  },
): SummedContainer<N> {
  const { flock } = flockProps;
  const { period: _period, ...classes } = flock.classes;
  const classInputs = entriesFromObject(classes);

  const classResults = classInputs
    .map(([className, classInput]) => {
      if (!classInput) {
        return undefined;
      }

      if (isSheepClassSeasonal(classInput)) {
        const seasonalResults = Seasons.map((seasonName) => {
          return calculatePeriod({
            ...flockProps,
            className,
            periodInput: classInput[seasonName],
            periodName: seasonName,
            periodDuration: daysInSeason,
            seasonName,
          });
        });

        return sum(seasonalResults, {
          name: options.classResultName(className),
        });
      }

      const monthlyResults = Months.map((monthName) => {
        return calculatePeriod({
          ...flockProps,
          className,
          periodInput: classInput[monthName],
          periodName: monthName,
          periodDuration: daysInMonth(monthName, options.isFebruaryInLeapYear),
          seasonName: monthSeasonMap[monthName],
        });
      });

      return sum(monthlyResults, { name: options.classResultName(className) });
    })
    .filter(isDefined);

  return sum(classResults, { name: options.flockResultName });
}

/**
 * Wrapper for getting average duration spent within herd *Dj* for a sheep class within a
 * given period.
 */
export const getDurationDays = ({
  periodDuration,
  periodInput,
  periodName,
  className,
}: SheepPeriodProps) =>
  captureMethod1Or2Value(
    periodDuration,
    periodInput.method2AverageDurationDays,
  ).named(`Dj=${periodName}k=${className}`);

/**
 * Wrapper for getting average liveweight *Wjk* for a sheep class within a given period.
 */
export const getLiveweight = ({
  periodInput,
  periodName,
  seasonName,
  className,
  flock,
  context,
}: SheepPeriodProps): NumberContainer<Liveweight> =>
  captureMethod1Or2Value(
    selectConstant(
      context.constants.SHEEP,
      'SEASONAL_FACTORS',
      flock.state,
      className,
      seasonName,
      'liveweight',
    ),
    periodInput.method2Liveweight,
  ).named(`Wj=${periodName},k=${className}`);

/**
 * Wrapper for getting average liveweight *Wjk* for a sheep class within a given period.
 */
export const getLiveweightGain = ({
  periodInput,
  periodName,
  seasonName,
  className,
  flock,
  context,
}: SheepPeriodProps): NumberContainer<LiveweightGain> =>
  captureMethod1Or2Value(
    selectConstant(
      context.constants.SHEEP,
      'SEASONAL_FACTORS',
      flock.state,
      className,
      seasonName,
      'liveweightGain',
    ),
    periodInput.method2LiveweightGain,
  ).named(`Wj=${periodName},k=${className}`);

/**
 * Wrapper for getting dry matter availability *DMAjk* for a sheep class within a given
 * period.
 */
export const getDryMatterAvailability = ({
  periodInput,
  periodName,
  className,
  flock,
  seasonName,
  context,
}: SheepPeriodProps): NumberContainer<MassPerArea<'DryMatter'>> =>
  captureMethod1Or2Value(
    selectConstant(
      context.constants.SHEEP,
      'SEASONAL_FACTORS',
      flock.state,
      className,
      seasonName,
      'dryMatterAvailability',
    ),
    periodInput.method2DryMatterAvailability,
  ).named(`DMAj=${periodName},k=${className}`);

/**
 * Wrapper for getting dry matter digestibility *DMDjk* for a sheep class within a given
 * period.
 */
export const getDryMatterDigestibility = ({
  periodInput,
  periodName,
  className,
  flock,
  seasonName,
  context,
}: SheepPeriodProps): NumberContainer<RealNumber> =>
  captureMethod1Or2Value(
    selectConstant(
      context.constants.SHEEP,
      'SEASONAL_FACTORS',
      flock.state,
      className,
      seasonName,
      'dryMatterDigestibility',
    ),
    periodInput.method2DryMatterDigestibility,
  ).named(`DMDj=${periodName},k=${className}`);
