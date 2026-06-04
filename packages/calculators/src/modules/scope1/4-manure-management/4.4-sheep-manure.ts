import { entriesFromObject } from '@/calculators/common/tools';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { SheepInputTransformed } from '@/calculators/Sheep/types/input';
import {
  isSeasonInputWithProportionLambsBorn,
  SheepClassPeriodsInputTransformed,
} from '@/calculators/Sheep/types/sheep-class-period.input';
import { isSheepClassSeasonal } from '@/calculators/Sheep/types/sheep-class.input';
import { SheepFlockInputTransformed } from '@/calculators/Sheep/types/sheep-flock.input';
import { isDefined } from '@/common/filters';
import {
  isWetClimateZone,
  Month,
  Months,
  pureStateWithoutNTToLimitedState,
  Season,
  Seasons,
  SheepClass,
} from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { br, Container, num, root } from '@/tools/containers';
import {
  daysInSeason,
  daysInYear,
  e,
  oneMinus,
  tenToPowMinus3,
  zeroN2O,
} from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { days, Days, massPerHeadPerDay, realNumber } from '@/tools/units';
import {
  calculateDailyFeedIntakeIjk,
  calculateProportionLactatingLEjk,
} from '../3-enteric-methane/3.4-sheep-enteric';

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

  const { method2DryMatterDigestibility } = periodInput;

  const limitedState = pureStateWithoutNTToLimitedState(input.state);

  const DMDjk =
    method2DryMatterDigestibility ??
    selectConstant(
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

function calculateNitrogenRetainedNRjk(
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
  NRijk = ((0.045 * MPjk=3,4) + (WPk * 0.84)  + (EBGjk * ((212 - 4 * ((EBGjk * 1000)/(4* SRWk^0.75) - 1)) - ((140 - 4 * (((EBGjk * 1000)/4*SRWk^0.75) - 1))/(1 + e ^ (-6 * (Zjk - 0.4)))))) * 10^-3) / 6.25
  */
  const { constants } = context;
  const classInput = flock.classes[className];
  if (!classInput) {
    return root(massPerHeadPerDay('N', 0)).named(
      `NRjk=${className},${periodName}`,
    );
  }
  const { greasyWoolProduction, cleanWoolYieldProportion } = classInput;
  const { state } = input;
  const pureState = pureStateWithoutNTToLimitedState(state);

  const { method2Liveweight } = periodInput;

  const { method2LiveweightGain } = periodInput;

  const LEjk = calculateProportionLactatingLEjk(
    periodInput,
    periodName,
    className,
  );

  const MPjk = LEjk.multiply(num(1.6)).named(`MPjk=${className},${periodName}`);

  const WPk = greasyWoolProduction
    .multiply(cleanWoolYieldProportion)
    .divide(daysInYear)
    .named(`WPk=${className}`);
  const LWGjk =
    method2LiveweightGain ??
    selectConstant(
      constants.SHEEP,
      'SEASONAL_FACTORS',
      pureState,
      className,
      seasonName,
      'liveweightGain',
    ).named(`LWGjk=${className},${periodName}`);
  const EBGjk = LWGjk.multiply(num(0.92)).named(
    `EBGjk=${className},${periodName}`,
  );

  const SRWk = selectConstant(
    constants.SHEEP,
    'SEASONAL_FACTORS',
    pureState,
    className,
    seasonName,
    'standardReferenceWeight',
  ).named(`SRWk=${className},${periodName}`);

  const Wjk =
    method2Liveweight ??
    selectConstant(
      constants.SHEEP,
      'SEASONAL_FACTORS',
      pureState,
      className,
      seasonName,
      'liveweight',
    ).named(`Wjk=${className},${periodName}`);

  const Zjk = Wjk.divide(SRWk).named(`Zjk=${className},${periodName}`);

  const NRmilkProduction = br(num(0.045).multiply(MPjk));
  const NRwoolProduction = br(num(0.84).multiply(WPk));
  const NRgainForWeight = num(4).multiply(
    br(
      EBGjk.multiply(num(1000))
        .divide(num(4).multiply(SRWk.power(num(0.75))))
        .switchUnit((u) => realNumber(u.value))
        .minus(num(1)),
    ),
  );
  const NRrelativeSize = num(1).plus(
    e.power(num(-6).multiply(Zjk.minus(num(0.4)))),
  );

  const NRjk = br(
    NRmilkProduction.plus(NRwoolProduction)
      .switchUnit((u) => massPerHeadPerDay('N', u.value))
      .plus(
        br(
          EBGjk.multiply(
            br(num(212).minus(NRgainForWeight)).minus(
              br(num(140).minus(NRgainForWeight)).divide(NRrelativeSize),
            ),
          ).switchUnit((u) => realNumber(u.value)),
        ).multiply(tenToPowMinus3),
      ),
  )
    .divide(num(6.25))
    .named(`NRj=${className},k=${periodName}`);

  return NRjk;
}

function calculateMilkIntakeMCjk(
  input: SheepInputTransformed,
  flock: SheepFlockInputTransformed,
  className: SheepClass,
  periodInput: SheepClassPeriodsInputTransformed,
  periodName: string,
) {
  if (!isSeasonInputWithProportionLambsBorn(periodInput)) {
    return num(0).named(`MCjk=${className},${periodName}`);
  }
  const { proportionOfLambsBorn } = periodInput;

  return proportionOfLambsBorn
    .multiply(num(1.6))
    .named(`MCjk=${className},${periodName}`);
}

function calculateCrudeProteinIntakeCPIjk(
  input: SheepInputTransformed,
  flock: SheepFlockInputTransformed,
  className: SheepClass,
  periodInput: SheepClassPeriodsInputTransformed,
  periodName: string,
  periodDuration: Container<Days>,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;
  const { state } = input;
  const pureState = pureStateWithoutNTToLimitedState(state);
  const { method2CrudeProteinContent } = periodInput;
  const Ijk = calculateDailyFeedIntakeIjk(
    input,
    className,
    periodInput,
    periodName,
    seasonName,
    context,
  );

  const CPjk =
    method2CrudeProteinContent ??
    selectConstant(
      constants.SHEEP,
      'SEASONAL_FACTORS',
      pureState,
      className,
      seasonName,
      'crudeProteinContent',
    ).named(`CPjk=${className},${periodName}`);

  const MCjk = calculateMilkIntakeMCjk(
    input,
    flock,
    className,
    periodInput,
    periodName,
  );

  const CPIjk = Ijk.multiply(CPjk)
    .plus(num(0.045).multiply(MCjk))
    .named(`CPIjk=${className},${periodName}`);
  return CPIjk;
}

function calculateNitrogenExcretedOnPastureAEForPeriod(
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
  AE = SUM SUM (Njk * NEjk * Dj)
  NEjk = (CPIjk / 6.25 ) - NRjk
  */
  const { head, method2AverageDurationDays } = periodInput;

  const Njk = head.named(`Njk=${className},${periodName}`);

  const CPIjk = calculateCrudeProteinIntakeCPIjk(
    input,
    flock,
    className,
    periodInput,
    periodName,
    periodDuration,
    seasonName,
    context,
  );
  const NRjk = calculateNitrogenRetainedNRjk(
    input,
    flock,
    className,
    periodInput,
    periodName,
    periodDuration,
    seasonName,
    context,
  );
  const NEjk = CPIjk.divide(num(6.25))
    .switchUnit((u) => massPerHeadPerDay('N', u.value))
    .minus(NRjk)
    .named(`NEjk=${className},${periodName}`); // line 978

  const Dj = (method2AverageDurationDays ?? periodDuration).named(
    `Dj=${periodName}`,
  );

  const AE = NEjk.multiply(Njk)
    .multiply(Dj)
    .named(`AEj=${className},k=${periodName}`);

  return AE;
}

function calculateSoilDirectN2OForPeriod(
  input: SheepInputTransformed,
  flock: SheepFlockInputTransformed,
  className: SheepClass,
  periodInput: SheepClassPeriodsInputTransformed,
  periodName: string,
  periodDuration: Container<Days>,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;
  /*
  EN2O,dir = AE * EF PRP * CN2O * 10^-3
  */

  const AE = calculateNitrogenExcretedOnPastureAEForPeriod(
    input,
    flock,
    className,
    periodInput,
    periodName,
    periodDuration,
    seasonName,
    context,
  ).named(`AE=${className},${periodName}`);

  const wetOrDry = isWetClimateZone(input.climateZone) ? 'wet' : 'dry';
  const EFPRP = selectConstant(
    constants.LIVESTOCK,
    'EF_DEPOSITED_URINE_AND_DUNG_PRP',
    wetOrDry,
  ).named(`EFPRP ${wetOrDry}`);

  const CN2O = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named('CN2O');

  return AE.multiply(EFPRP)
    .multiply(CN2O)
    .named(`EN2O,dir=${periodName},k=${className}`);
}

function calculateSoilDirectN2OForFlock(
  input: SheepInputTransformed,
  flock: SheepFlockInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  /*
  EN2O,dir = AE * EF PRP * CN2O * 10^-3
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
          const seasonalN2O = calculateSoilDirectN2OForPeriod(
            input,
            flock,
            className,
            classInput[seasonName],
            seasonName,
            daysInSeason,
            seasonName,
            context,
          );
          return seasonalN2O;
        });
        return sum(seasonalResults, { name: `EN2O,dir=${className}` });
      }
      const monthlyResults = Months.map((monthName) => {
        const daysInMonth = root(days(monthDurationMap[monthName]));
        const monthlyN2O = calculateSoilDirectN2OForPeriod(
          input,
          flock,
          className,
          classInput[monthName],
          monthName,
          daysInMonth,
          monthSeasonMap[monthName],
          context,
        );
        return monthlyN2O;
      });
      return sum(monthlyResults, { name: `EN2O,dir=${className}` });
    })
    .filter(isDefined);

  return sum(classResults, { name: 'EN2O,dir' });
  return zeroN2O;
}

export function calculate_4_4_1_3_SheepSoilDirectN2O(
  input: SheepInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { flocks } = input;

  const EN2ODir = flocks.map((flock, ix) => {
    const n2o = calculateSoilDirectN2OForFlock(input, flock, context).named(
      `EN2O,dir (flock ${ix})`,
    );
    return n2o;
  });

  return sum(EN2ODir, { name: 'EN2O,dir' });
}

function calculateSoilAtmosphericDepositionN2OForFlock(
  input: SheepInputTransformed,
  flock: SheepFlockInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  /*
  EN2O,ad = AE * EF PRP * CN2O * 10^-3
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
          const seasonalN2O = calculateNitrogenExcretedOnPastureAEForPeriod(
            input,
            flock,
            className,
            classInput[seasonName],
            seasonName,
            daysInSeason,
            seasonName,
            context,
          );
          return seasonalN2O;
        });
        return sum(seasonalResults, { name: `EN2O,ad=${className}` });
      }
      const monthlyResults = Months.map((monthName) => {
        const daysInMonth = root(days(monthDurationMap[monthName]));
        const monthlyN2O = calculateNitrogenExcretedOnPastureAEForPeriod(
          input,
          flock,
          className,
          classInput[monthName],
          monthName,
          daysInMonth,
          monthSeasonMap[monthName],
          context,
        );
        return monthlyN2O;
      });
      return sum(monthlyResults, { name: `EN2O,ad=${className}` });
    })
    .filter(isDefined);

  return sum(classResults, { name: 'EN2O,ad' });
}

export function calculate_4_4_1_5_SheepSoilAtmosphericDepositionN2O(
  input: SheepInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { flocks } = input;

  const { constants } = context;
  const { productionSystem } = input;

  const FracGASMSoil = selectConstant(
    constants.CROP,
    'FRACTION_N_VOLATILISED_ORGANIC_FERTILISER',
  ).named('FracGASMsoil');

  const AERecords = flocks.map((flock, ix) => {
    const n2o = calculateSoilAtmosphericDepositionN2OForFlock(
      input,
      flock,
      context,
    ).named(`EN2O,ad (flock ${ix})`);
    return n2o;
  });

  const AE = sum(AERecords, { name: 'AE' });

  const Mvol = AE.multiply(FracGASMSoil).named(`Mvol`);

  const EFN2O = selectConstant(
    constants.LIVESTOCK,
    'EF_ATMOSPHERIC_DEPOSITION',
    productionSystem,
  ).named('EFN2O');

  const CN2O = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named('CN2O');

  return Mvol.multiply(EFN2O).multiply(CN2O).named('EN2O,ad');
}
