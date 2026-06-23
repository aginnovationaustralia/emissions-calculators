import {
  BeefClassPeriodsInputTransformed,
  isSeasonInputWithCalves,
} from '@/calculators/Beef/types/beef-class-period.input';
import { isBeefClassSeasonal } from '@/calculators/Beef/types/beef-class.input';
import { BeefSpecificClassInputTransformed } from '@/calculators/Beef/types/beef-classes.input';
import { BeefHerdInputTransformed } from '@/calculators/Beef/types/beef-herd.input';
import { BeefInputTransformed } from '@/calculators/Beef/types/input';
import { entriesFromObject } from '@/calculators/common/tools';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { isDefined } from '@/common/filters';
import {
  BeefClass,
  Month,
  Months,
  Season,
  Seasons,
  stateOrRegionToExtendedRegion,
  stateOrRegionToLimitedRegion,
} from '@/constants/enums';
import { monthDurationMap, monthSeasonMap } from '@/modules/shared';
import { selectConstant } from '@/tools/constants';
import { br, Container, num, root, SummedContainer } from '@/tools/containers';
import { daysInSeason, oneMinus, tenToPowMinus3 } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  days,
  Days,
  massPerHeadPerDay,
  NumberUnit,
  realNumber,
} from '@/tools/units';

export type BeefManureHerdProps = {
  input: BeefInputTransformed;
  herd: BeefHerdInputTransformed;
  context: ExecutionContext<ConstantsForGrainsCalculator>;
};

// TODO: Make this generic so it can contain a specific class like cows2To3Years
export type BeefManurePeriodProps<
  C = BeefSpecificClassInputTransformed,
  P = BeefClassPeriodsInputTransformed,
> = BeefManureHerdProps & {
  className: BeefClass;
  classInput: C;
  currentPeriod: P;
  previousPeriod: P; // TODO: Why isn't this next period?
  periodName: string;
  previousPeriodName: string;
  periodDuration: Container<Days>;
  seasonName: Season;
};

export function calculateForAllClassPeriods<N extends NumberUnit>(
  herdProps: BeefManureHerdProps,
  calculatePeriod: (periodProps: BeefManurePeriodProps) => Container<N>,
  options: {
    classResultName: (className: BeefClass) => string;
    herdResultName: string;
  },
): SummedContainer<N> {
  const { herd } = herdProps;
  const { classes } = herd;
  const classInputs = entriesFromObject(classes);

  const classResults = classInputs
    .map(([className, classInput]) => {
      if (!classInput) {
        return undefined;
      }

      if (isBeefClassSeasonal(classInput)) {
        const seasonalResults = Seasons.map((seasonName) => {
          const currentPeriod = classInput[seasonName];
          const previousPeriodName = getPreviousSeason(seasonName);
          const previousPeriod = classInput[previousPeriodName];
          return calculatePeriod({
            ...herdProps,
            className,
            classInput,
            currentPeriod,
            previousPeriod,
            periodName: seasonName,
            previousPeriodName,
            periodDuration: daysInSeason,
            seasonName,
          });
        });

        return sum(seasonalResults, {
          name: options.classResultName(className),
        });
      }

      const monthlyResults = Months.map((monthName) => {
        const currentPeriod = classInput[monthName];
        const previousPeriodName = getPreviousMonth(monthName);
        const previousPeriod = classInput[previousPeriodName];
        return calculatePeriod({
          ...herdProps,
          className,
          classInput,
          currentPeriod,
          previousPeriod,
          periodName: monthName,
          previousPeriodName,
          periodDuration: root(days(monthDurationMap[monthName])),
          seasonName: monthSeasonMap[monthName],
        });
      });

      return sum(monthlyResults, { name: options.classResultName(className) });
    })
    .filter(isDefined);

  return sum(classResults, { name: options.herdResultName });
}

const getPreviousSeason = (seasonName: Season) => {
  if (seasonName === 'spring') {
    return 'winter';
  }
  if (seasonName === 'summer') {
    return 'spring';
  }
  if (seasonName === 'autumn') {
    return 'summer';
  }
  return 'autumn';
};

const getPreviousMonth = (monthName: Month) => {
  if (monthName === 'january') {
    return 'december';
  }
  return Months[Months.indexOf(monthName) - 1];
};

export const getMilkIntakeMC236 = (periodProps: BeefManurePeriodProps) => {
  const { context, currentPeriod, previousPeriod, periodName, input } =
    periodProps;
  const { constants } = context;
  const { region } = input;
  const limitedRegion = stateOrRegionToLimitedRegion(region);
  if (
    !isSeasonInputWithCalves(currentPeriod) ||
    !isSeasonInputWithCalves(previousPeriod)
  ) {
    return root(massPerHeadPerDay('Milk', 0)).named(
      `MCijkl=236 (${periodName} no calving class)`,
    );
  }

  const currentSeasonCalvingRate =
    currentPeriod.proportionCowsGt2ThisSeasonInCalf;

  // REVISIT: need to investigate handling partial calving, and multiple calving seasons. At the moment any amount of calving is treated as full calving.

  const previousSeasonCalvingRate =
    previousPeriod.proportionCowsGt2ThisSeasonInCalf;
  if (previousSeasonCalvingRate.unit.value.gt(0)) {
    return selectConstant(
      constants.BEEF_PASTURE,
      'MILK_INTAKE',
      limitedRegion,
      'afterCalving',
    ).named(`MCijkl=236 (${periodName} after calving)`);
  }

  if (currentSeasonCalvingRate.unit.value.gt(0)) {
    return selectConstant(
      constants.BEEF_PASTURE,
      'MILK_INTAKE',
      limitedRegion,
      'calving',
    ).named(`MCijkl=236 (${periodName} calving)`);
  }

  return root(massPerHeadPerDay('Milk', 0)).named(
    `MCijkl=236 (${periodName} no calving)`,
  );
};

export const getProportionCowsGt2InCalfLC = (
  periodProps: BeefManurePeriodProps,
) => {
  const { currentPeriod, className, periodName } = periodProps;
  if (!isSeasonInputWithCalves(currentPeriod)) {
    return num(0).named(`LC j=${periodName},k=${className} (0)`);
  }

  return currentPeriod.proportionCowsGt2ThisSeasonInCalf.named(
    `LC j=${periodName},k=${className}`,
  );
};

const getFeedAdjustmentForCowsGt2FA = (periodProps: BeefManurePeriodProps) => {
  const { periodName, currentPeriod, previousPeriodName } = periodProps;
  if (!isSeasonInputWithCalves(currentPeriod)) {
    return num(1).named('FA (1)');
  }

  // REVISIT: We need to review the logic used to calculate FA. There is an example in the test sheet showing why it is probably incorrect
  const currentSeasonInCalf =
    currentPeriod.proportionCowsGt2ThisSeasonInCalf.named(
      `Cows calving this season (${periodName})`,
    );

  const previousSeasonInCalf =
    currentPeriod.proportionCowsGt2PreviousSeasonInCalf.named(
      `Cows calving (${previousPeriodName})`,
    );

  return num(1.3)
    .multiply(currentSeasonInCalf)
    .plus(num(1.1).multiply(previousSeasonInCalf))
    .named(`FAijkl=5 (${periodName})`);
};

export const calculateAdditionalIntakeForMilkProductionMAjk = (
  periodProps: BeefManurePeriodProps,
) => {
  const { className, classInput, periodName } = periodProps;
  /*
    MAjk=4,5 = (LCijkl=4,5 * FAjk=4,5) + (1 - LCjk=4,5 ) -- line 143
  */
  const { number } = classInput;

  if (['5a', '5b'].includes(number)) {
    const LC = getProportionCowsGt2InCalfLC(periodProps);
    const FA = getFeedAdjustmentForCowsGt2FA(periodProps);
    return br(LC.multiply(FA))
      .plus(br(oneMinus(LC)))
      .switchUnit((u) => massPerHeadPerDay('DryMatter', u.value))
      .named(`MA j=${periodName},k=${className}`);
  }

  return root(massPerHeadPerDay('Milk', 1)).named(
    `MA j=${periodName},k=${className}`,
  );
};

export function calculateDailyDryMatterIntakeForPeriodIjkl(
  periodProps: BeefManurePeriodProps,
) {
  const { context, input, currentPeriod, className, seasonName } = periodProps;
  const { constants } = context;
  const { region } = input;

  const MAjk = calculateAdditionalIntakeForMilkProductionMAjk(periodProps);

  const extendedRegion = stateOrRegionToExtendedRegion(region);

  const Wijkln =
    currentPeriod.method2Liveweight ??
    selectConstant(
      constants.BEEF_PASTURE,
      'LIVEWEIGHT',
      extendedRegion,
      className,
      seasonName,
      'liveweight',
    );
  const LWGijkln =
    currentPeriod.method2LiveweightGain ??
    selectConstant(
      constants.BEEF_PASTURE,
      'LIVEWEIGHT',
      extendedRegion,
      className,
      seasonName,
      'liveweightGain',
    );

  /*
    Iijkln = (1.185 + 0.00454 * Wijkln - 0.0000026 * Wijkln ^ 2 + 0.315 * LWGijkln) ^ 2 * MAijkl=5 -- line 136
  */
  const Iijkln = br(
    num(1.185)
      .plus(num(0.00454).multiply(Wijkln))
      .minus(num(0.0000026).multiply(Wijkln.squared()))
      .switchUnit((u) => massPerHeadPerDay('Liveweight', u.value))
      .plus(num(0.315).multiply(LWGijkln)),
  )
    .squared()
    .switchUnit((u) => realNumber(u.value))
    .multiply(MAjk)
    .named('Iijkln');

  return Iijkln;
}

function calculateDailyMethaneForPeriod(periodProps: BeefManurePeriodProps) {
  const Ijkl = calculateDailyDryMatterIntakeForPeriodIjkl(periodProps);
  const Mjkl = num(20.7).multiply(Ijkl).multiply(tenToPowMinus3).named('Mjkl');
  return Mjkl;
}

function calculateClassMethaneForPeriod(periodProps: BeefManurePeriodProps) {
  const {
    className,
    currentPeriod,
    periodName,
    // seasonName,
    periodDuration,
    // context,
    input,
  } = periodProps;
  // const { constants } = context;
  const { region } = input;
  const { head } = currentPeriod;
  // const extendedRegion = stateOrRegionToExtendedRegion(region);
  const Nj = head.named(`Nj=${periodName}`);
  const Dj = periodDuration.named(`Dj=${periodName}`);
  // const Wj =
  //   currentPeriod.method2Liveweight ??
  //   selectConstant(
  //     constants.BEEF_PASTURE,
  //     'LIVEWEIGHT',
  //     extendedRegion,
  //     className,
  //     seasonName,
  //     'liveweight',
  //   ).named(`Wj (${className}, ${seasonName})`);
  // const LWGj =
  //   currentPeriod.method2LiveweightGain ??
  //   selectConstant(
  //     constants.BEEF_PASTURE,
  //     'LIVEWEIGHT',
  //     extendedRegion,
  //     className,
  //     seasonName,
  //     'liveweightGain',
  //   ).named(`LWGj=${periodName}`);
  const Mjkl = calculateDailyMethaneForPeriod(periodProps);
  return Mjkl.multiply(Nj)
    .multiply(Dj)
    .named(`Eenteric j=${periodName},k=${className}`);
}

function calculateEntericMethaneForHerd(herdProps: BeefManureHerdProps) {
  return calculateForAllClassPeriods(
    herdProps,
    calculateClassMethaneForPeriod,
    {
      classResultName: (className) => `Eenteric=${className}`,
      herdResultName: 'Eenteric (herd)',
    },
  );
}
export function calculate32BeefPastureEntericMethane(
  input: BeefInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { herds } = input;
  const herdResults = herds.map((herd) => {
    return calculateEntericMethaneForHerd({ input, herd, context });
  });
  return sum(herdResults).named('Eenteric');
}
