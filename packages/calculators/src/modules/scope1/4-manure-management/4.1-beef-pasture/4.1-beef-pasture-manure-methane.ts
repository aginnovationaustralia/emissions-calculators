import { BeefInputTransformed } from '@/calculators/Beef/types/input';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { stateOrRegionToLimitedRegion } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { br, num } from '@/tools/containers';
import { daysInSeason, oneMinus } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { massPerHeadPerDay } from '@/tools/units';
import {
  BeefManureHerdProps,
  BeefManurePeriodProps,
  calculateDailyDryMatterIntakeForPeriodIjkl,
  calculateForAllClassPeriods,
} from '../../3-enteric-methane/3.2-beef-pasture';

const calculateTotalMethaneFromClassSeasonMmmSeason = (
  periodProps: BeefManurePeriodProps,
) => {
  const { context, input, herd, currentPeriod, seasonName, className } =
    periodProps;
  const { constants } = context;
  const { climateZone, region } = input;
  const limitedRegion = stateOrRegionToLimitedRegion(region);

  const { method2Dmd, method2NoUnfencedNaturalWater } = herd;

  const Nkln = currentPeriod.head;

  const dmd = method2Dmd
    ? method2Dmd[seasonName]
    : selectConstant(constants.BEEF_PASTURE, 'DMD', limitedRegion, seasonName);

  const MMSm1 = method2NoUnfencedNaturalWater
    ? num(0).named('MMSm=1 (fenced)')
    : num(0.05).named('MMSm=1 (unfenced)');
  const MMSm14 = method2NoUnfencedNaturalWater
    ? num(1).named('MMSm=14 (fenced)')
    : num(0.95).named('MMSm=14 (unfenced)');
  const MCFm14 = selectConstant(constants.BEEF_PASTURE, 'MCF_PASTURE');

  const ashContentOfManureA = selectConstant(
    constants.COMMON,
    'ASH_CONTENT_OF_MANURE',
  ).named('A');

  const Iijkln = calculateDailyDryMatterIntakeForPeriodIjkl(periodProps);

  // VSijkln = (Iijkln * (1 - DMDijk) + (0.04 * Iijkln)) * ( 1 - A ) -- line 425
  const VSijkln = br(
    Iijkln.multiply(oneMinus(dmd))
      .plus(Iijkln.multiply(num(0.04)))
      .switchUnit((u) => massPerHeadPerDay('Volatile Solids', u.value)),
  )
    .multiply(oneMinus(ashContentOfManureA))
    .named('VSijkln');

  const Bo = selectConstant(
    constants.LIVESTOCK,
    'EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4',
    'general',
  );
  const p = selectConstant(constants.COMMON, 'DENSITY_OF_METHANE');
  const MCFm1 = selectConstant(
    constants.BEEF_PASTURE,
    'MCF_LAGOON',
    climateZone,
  );

  // Mmijklnm = VSijkln * BO * MMSm * MCF m * 𝜌 -- line 405
  const dailyMethanePerHeadMm1 = VSijkln.multiply(Bo)
    .multiply(MMSm1)
    .multiply(MCFm1)
    .multiply(p)
    .named(`Mmijklnm=1 (${className}, ${seasonName})`);

  const dailyMethanePerHeadMm14 = VSijkln.multiply(Bo)
    .multiply(MMSm14)
    .multiply(MCFm14)
    .multiply(p)
    .named(`Mmijklnm=14 (${className}, ${seasonName})`);

  /*
    Line 396:
    The methane production from the manure management MMM of pasture-based beef cattle is
    calculated as:
    MMM = SUM SUM SUM SUM SUM ( Nkln * Mmijklnm * 91.25)
    Nkln = number of pasture beef cattle per class (head)
    Mmijklnm = daily methane production from manure each season per head
    and MMS(kg/head/day)
    91.25 = number of days in each season
  */
  const Mmm1 = dailyMethanePerHeadMm1
    .multiply(Nkln)
    .multiply(daysInSeason)
    .named(`Mmm=1 (${className}, ${seasonName})`);
  const Mmm14 = dailyMethanePerHeadMm14
    .multiply(Nkln)
    .multiply(daysInSeason)
    .named(`Mmm=14 (${className}, ${seasonName})`);

  return sum([Mmm1, Mmm14], { name: `Mmm (${className}, ${seasonName})` });
};

export const calculateManureManagementCH4ForHerd = (
  herdProps: BeefManureHerdProps,
) => {
  return calculateForAllClassPeriods(
    herdProps,
    calculateTotalMethaneFromClassSeasonMmmSeason,
    {
      classResultName: (className) => `Eenteric=${className}`,
      herdResultName: 'Eenteric (herd)',
    },
  );
};

export const calculateManureManagementCH4 = (
  input: BeefInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
    Line 390:
    Total annual methane emissions from manure management EMCH4 is calculated as:
    EMCH4 = MMM * GWPCH4 * 10^-3
    Mmm = total methane production from manure management (kgCH4)
    GWPCH4 = GWP of methane to convert tCH4 to tCO2e
  */

  const { constants } = context;

  const { herds } = input;
  const ch4EmissionsForHerds = herds.map((herd) =>
    calculateManureManagementCH4ForHerd({ input, herd, context }),
  );

  const Mmm = sum(ch4EmissionsForHerds, { name: 'Mmm (all herds)' });

  const GWPch4 = selectConstant(constants.COMMON, 'GWP_CH4');

  const EMch4 = Mmm.multiply(GWPch4, { name: 'EMch4' });

  return EMch4;
};
