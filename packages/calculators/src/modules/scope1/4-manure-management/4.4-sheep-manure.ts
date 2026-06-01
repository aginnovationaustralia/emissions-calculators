import { entriesFromObject } from '@/calculators/common/tools';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { SheepInputTransformed } from '@/calculators/Sheep/types/input';
import { SheepClassPeriodsInputTransformed } from '@/calculators/Sheep/types/sheep-class-period.input';
import { isSheepClassSeasonal } from '@/calculators/Sheep/types/sheep-class.input';
import { SheepFlockInputTransformed } from '@/calculators/Sheep/types/sheep-flock.input';
import { isDefined } from '@/common/filters';
import {
  Month,
  Months,
  pureStateWithoutNTToLimitedState,
  Season,
  Seasons,
  SheepClass,
} from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { Container, num, root } from '@/tools/containers';
import { daysInSeason, oneMinus } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { days, Days, realNumber } from '@/tools/units';
import { calculateDailyFeedIntakeIjk } from '../3-enteric-methane/3.4-sheep-enteric';

// TODO: Cloned from 3.4-sheep-enteric.ts
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

function calculateDailyManureMethane(
  input: SheepInputTransformed,
  flock: SheepFlockInputTransformed,
  className: SheepClass,
  periodInput: SheepClassPeriodsInputTransformed,
  periodName: string,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;
  /*
    Mjkm = VSjk * BO * MMSm * MCFim * 𝜌

    NOTE: We are calculating M for m=1,14 combined. This avoids an extra summing layer, but is identical

    VSjk = (Ijk * ((1 - DMDjk) + (0.04 * Ijk))) * ( 1 - A )
  */

  const { state } = input;
  const { noUnfencedNaturalWater } = flock;

  const Ijk = calculateDailyFeedIntakeIjk(
    input,
    className,
    periodInput,
    periodName,
    seasonName,
    context,
  ).named(`Ij=${periodName},k=${className}`);

  const limitedState = pureStateWithoutNTToLimitedState(input.state);

  const DMDjk = selectConstant(
    constants.SHEEP,
    'SEASONAL_FACTORS',
    limitedState,
    className,
    seasonName,
    'dryMatterDigestibility',
  ).named(`DMDj=${periodName},k=${className}`);

  const ashContentOfManureA = selectConstant(
    constants.SHEEP,
    'ASH_CONTENT_OF_MANURE',
  ).named('A');

  const VSjk = Ijk.multiply(
    oneMinus(DMDjk)
      .plus(Ijk.multiply(num(0.04)))
      .switchUnit((u) => realNumber(u.value)),
  )
    .multiply(oneMinus(ashContentOfManureA))
    .named(`VSj=${periodName},k=${className}`);

  const BO = selectConstant(
    constants.LIVESTOCK,
    'EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4',
    'sheep',
  ).named('BO');

  const MMSm1 = noUnfencedNaturalWater
    ? num(0).named('MMSm=1 (fenced)')
    : selectConstant(constants.SHEEP, 'MMS', state, 'Lagoon').named('MMSm=1');

  const MMSm14 = noUnfencedNaturalWater
    ? num(1).named('MMSm=14 (fenced)')
    : selectConstant(constants.SHEEP, 'MMS', state, 'PRP').named('MMSm=14');

  const MCFm1 = selectConstant(constants.SHEEP, 'MCF_LAGOON', state).named(
    'MCFm=1',
  );

  const MCFm14 = selectConstant(constants.SHEEP, 'MCF_PRP').named('MCFm=14');

  const p = selectConstant(constants.COMMON, 'DENSITY_OF_METHANE').named('p');

  const Mjkm1 = VSjk.multiply(BO)
    .multiply(MMSm1)
    .multiply(MCFm1)
    .multiply(p)
    .named(`Mj=${periodName},k=${className},m=1`);
  const Mjkm14 = VSjk.multiply(BO)
    .multiply(MMSm14)
    .multiply(MCFm14)
    .multiply(p)
    .named(`Mj=${periodName},k=${className},m=14`);

  return sum([Mjkm1, Mjkm14], { name: `Mj=${periodName},k=${className}` });
}

function calculateManureMethaneForPeriod(
  input: SheepInputTransformed,
  flock: SheepFlockInputTransformed,
  className: SheepClass,
  periodInput: SheepClassPeriodsInputTransformed,
  periodName: string,
  periodDuration: Container<Days>,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  /*
    ECH4 = SUM SUM SUM (Njk * Mjkm * Dj) * 10^-3
  */
  const { head, method2AverageDurationDays } = periodInput;

  const Njk = head.named(`Njk=${className}`);

  const Dj = (method2AverageDurationDays ?? periodDuration).named(
    `Dj=${periodName}`,
  );

  const Mjkm = calculateDailyManureMethane(
    input,
    flock,
    className,
    periodInput,
    periodName,
    seasonName,
    context,
  );

  return Mjkm.multiply(Njk)
    .multiply(Dj)
    .named(`ECH4=${periodName},k=${className}`);
}

function calculateManureMethaneForFlock(
  input: SheepInputTransformed,
  flock: SheepFlockInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { classes } = flock;
  const classInputs = entriesFromObject(classes);

  const classResults = classInputs
    .map(([className, classInput]) => {
      if (!classInput) {
        return undefined;
      }

      if (isSheepClassSeasonal(classInput)) {
        const seasonalResults = Seasons.map((seasonName) => {
          const seasonalMethane = calculateManureMethaneForPeriod(
            input,
            flock,
            className,
            classInput[seasonName],
            seasonName,
            daysInSeason,
            seasonName,
            context,
          );

          return seasonalMethane;
        });

        return sum(seasonalResults, { name: `ECH4=${className}` });
      }
      const monthlyResults = Months.map((monthName) => {
        const daysInMonth = root(days(monthDurationMap[monthName]));
        const monthlyMethane = calculateManureMethaneForPeriod(
          input,
          flock,
          className,
          classInput[monthName],
          monthName,
          daysInMonth,
          monthSeasonMap[monthName],
          context,
        );

        return monthlyMethane;
      });

      return sum(monthlyResults, { name: `ECH4=${className}` });
    })
    .filter(isDefined);

  return sum(classResults, { name: 'ECH4 (flock)' });
}

export function calculate_4_4_1_1_SheepManureMethane(
  input: SheepInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { flocks } = input;

  const ECH4 = flocks.map((flock) => {
    return calculateManureMethaneForFlock(input, flock, context);
  });

  return sum(ECH4, { name: 'ECH4' });
}
