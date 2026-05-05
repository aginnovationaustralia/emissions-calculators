import { entriesFromObject } from '@/calculators/common/tools';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { SheepInputTransformed } from '@/calculators/Sheep/types/input';
import { SheepClassPeriodsInputTransformed } from '@/calculators/Sheep/types/sheep-class-period.input';
import {
  isSheepClassSeasonal,
  isSheepPeriodWithLambing,
} from '@/calculators/Sheep/types/sheep-class.input';
import { SheepFlockInputTransformed } from '@/calculators/Sheep/types/sheep-flock.input';
import { isDefined } from '@/common/filters';
import { Month, Months, Season, Seasons, SheepClass } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { br, Container, num, root } from '@/tools/containers';
import { daysInSeason, e, oneMinus, tenToPowMinus3 } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { days, Days, massPerHeadPerDay, realNumber } from '@/tools/units';

const monthSeasonMap: Record<Month, Season> = {
  january: 'summer',
  february: 'summer',
  march: 'autumn',
  april: 'autumn',
  may: 'autumn',
  june: 'winter',
  july: 'winter',
  august: 'winter',
  september: 'spring',
  october: 'spring',
  november: 'spring',
  december: 'summer',
};

const monthDurationMap: Record<Month, number> = {
  january: 31,
  february: 28,
  march: 31,
  april: 30,
  may: 31,
  june: 30,
  july: 31,
  august: 31,
  september: 30,
  october: 31,
  november: 30,
  december: 31,
};

function calculateAdditionalIntakeForMilkProductionMAjk(
  input: SheepInputTransformed,
  className: SheepClass,
  periodInput: SheepClassPeriodsInputTransformed,
  periodName: string,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  if (!isSheepPeriodWithLambing(periodInput)) {
    return num(1);
  }

  const { constants } = context;
  const { percentLambing, percentLambMarking } = periodInput;

  const LRjk = percentLambing.named(`LRj=${periodName},k=${className}`);
  const LMRjk = percentLambMarking.named(`LMRj=${periodName},k=${className}`);

  const LEjk = LRjk.divide(num(100))
    .multiply(LMRjk.limitedTo(100).divide(num(100)))
    .named(`LEj=${periodName},k=${className}`);

  const FAk = selectConstant(constants.SHEEP, 'FEED_ADJUSTMENT').named(
    `FAj=${periodName},k=${className}`,
  );

  return LEjk.multiply(FAk)
    .plus(oneMinus(LEjk))
    .named(`MAj=${periodName},k=${className}`);
}

function calculateDailyFeedIntakeIjk(
  input: SheepInputTransformed,
  className: SheepClass,
  periodInput: SheepClassPeriodsInputTransformed,
  periodName: string,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;
  /*
  Ijk = PIjk * RIjk * MAk=3,4
  
  qmjk = (0.795 * DMDjk) - 0.0014
  RIjk = 1 - e-2(DMAjk)2
  MAjk=3,4 = (LEjk=3,4 * FAk=3,4) + (1 - LEjk=3,4)
  */

  const {
    method2Liveweight,
    method2DryMatterAvailability,
    method2DryMatterDigestibility,
  } = periodInput;

  const DMAjk = (
    method2DryMatterAvailability ??
    selectConstant(
      constants.SHEEP,
      'SEASONAL_FACTORS',
      input.state,
      className,
      seasonName,
      'dryMatterAvailability',
    )
  ).named(`DMAj=${periodName},k=${className}`);

  const DMDjk = (
    method2DryMatterDigestibility ??
    selectConstant(
      constants.SHEEP,
      'SEASONAL_FACTORS',
      input.state,
      className,
      seasonName,
      'dryMatterDigestibility',
    )
  ).named(`DMDj=${periodName},k=${className}`);

  const Wjk =
    method2Liveweight ??
    selectConstant(
      constants.SHEEP,
      'SEASONAL_FACTORS',
      input.state,
      className,
      seasonName,
      'liveweight',
    ).named(`Wj=${periodName},k=${className}`);

  const qmjk = num(0.795)
    .multiply(DMDjk)
    .minus(num(0.0014))
    .named(`qmj=${periodName},k=${className}`);

  // PIjk = (104.7 * qmjk + 0.307 * Wjk - 15) * Wjk * 10^-3 line 296
  const PIjk = br(
    num(104.7)
      .multiply(qmjk)
      .plus(num(0.307).multiply(Wjk))
      .switchUnit((r) => realNumber(r.value))
      .minus(num(15)),
  )
    .multiply(Wjk.power(num(0.75)))
    .switchUnit((r) => massPerHeadPerDay('DryMatter', r.value))
    .multiply(tenToPowMinus3)
    .named(`PIj=${periodName},k=${className}`);

  const RIjk = oneMinus(
    e
      .power(
        num(-2).multiply(
          DMAjk.squared().switchUnit((r) => realNumber(r.value)),
        ),
      )
      .named(`RIj=${periodName},k=${className}`),
  );

  const MAjk = calculateAdditionalIntakeForMilkProductionMAjk(
    input,
    className,
    periodInput,
    periodName,
    context,
  ).named(`MAj=${periodName},k=${className}`);

  return PIjk.multiply(RIjk)
    .multiply(MAjk)
    .named(`Ij=${periodName},k=${className}`);
}

function calculateClassMethaneForPeriod(
  input: SheepInputTransformed,
  className: SheepClass,
  periodInput: SheepClassPeriodsInputTransformed,
  periodName: string,
  periodDuration: Container<Days>,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { head, method2AverageDurationDays } = periodInput;
  const Nj = head.named(`Nj=${periodName}k=${className}`);
  const Dj =
    method2AverageDurationDays ??
    periodDuration.named(`Dj=${periodName}k=${className}`);

  const Ijk = calculateDailyFeedIntakeIjk(
    input,
    className,
    periodInput,
    periodName,
    seasonName,
    context,
  ).named(`Ij=${periodName},k=${className}`);
  const Mijk = num(0.0188)
    .multiply(Ijk)
    .plus(num(0.00158))
    .named(`Mj=${periodName},k=${className}`);

  return Mijk.multiply(Nj)
    .multiply(Dj)
    .named(`Eenteric,j=${periodName},k=${className}`);
}

function calculateEntericMethaneForFlock(
  input: SheepInputTransformed,
  flock: SheepFlockInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  /*
  3.4.1.1 line 281
  Eenteric = SUM SUM (Njk * Mijk * Dj) * 10^-3

  Mijk = (Ijk * 0.0188) + 0.00158
  */

  const { classes } = flock;
  const classInputs = entriesFromObject(classes);
  const classResults = classInputs
    .map(([className, classInput]) => {
      if (!classInput) {
        return undefined;
      }

      if (isSheepClassSeasonal(classInput)) {
        const seasonalResults = Seasons.map((seasonName) => {
          const seasonalMethane = calculateClassMethaneForPeriod(
            input,
            className,
            classInput[seasonName],
            seasonName,
            daysInSeason,
            seasonName,
            context,
          );
          return seasonalMethane;
        });
        return sum(seasonalResults).named(`Eenteric=${className}`);
      }

      const monthlyResults = Months.map((monthName) => {
        const monthDuration = root(days(monthDurationMap[monthName]));
        const monthlyMethane = calculateClassMethaneForPeriod(
          input,
          className,
          classInput[monthName],
          monthName,
          monthDuration,
          monthSeasonMap[monthName],
          context,
        );
        return monthlyMethane;
      });
      return sum(monthlyResults).named(`Eenteric=${className}`);
    })
    .filter(isDefined);
  return sum(classResults).named('Eenteric (flock)');
}

export function calculate34SheepEntericMethane(
  input: SheepInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { flocks } = input;
  const flockResults = flocks.map((flock) => {
    return calculateEntericMethaneForFlock(input, flock, context);
  });
  return sum(flockResults).named('Eenteric');
}
