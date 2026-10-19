import { ExecutionContext } from '@/calculators/executionContext';
import { HasExcludedFromNaturalWaterInputTransformed } from '@/calculators/types/has-excluded-from-natural-water.input';
import { HasIsFebruaryInLeapYearInputTransformed } from '@/calculators/types/has-is-february-in-leap-year.input';
import { MeanAnnualTemperature, StateOrRegion } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { br, num, root, StringContainer } from '@/tools/containers';
import { ifTrueElse } from '@/tools/if-else';
import { captureMethod1Or2Value } from '@/tools/multi';
import { oneMinus } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { massPerHeadPerDay, realNumber } from '@/tools/units';
import { calculateOrGetFeedIntakeForBeef } from '../../shared/beef/calculate';
import {
  BeefPeriodProps,
  calculateForAllClassPeriods,
  getDryMatterDigestibilityDMD,
} from '../../shared/beef/helpers';
import { BeefManureAndEntericHerdInputTransformed } from '../../shared/beef/input';
import { ConstantsForBeefManure } from './constants';

const calculateMMSm = (
  mms: '1' | '14',
  excludedFromNaturalWater: HasExcludedFromNaturalWaterInputTransformed['excludedFromNaturalWater'],
  region: StringContainer<StateOrRegion>,
  constants: ConstantsForBeefManure,
) => {
  const whenTrue = mms === '1' ? root(realNumber(0)) : root(realNumber(1));
  const whenFalse = selectConstant(
    constants.BEEF_PASTURE,
    'MMS',
    region,
    mms === '1' ? 'Lagoon' : 'PRP',
  );
  return ifTrueElse(excludedFromNaturalWater, whenTrue, whenFalse).named(
    `MMSm=${mms}`,
  );
};

const calculateMCFim = (
  mms: '1' | '14',
  method2MeanAnnualTemperature:
    StringContainer<MeanAnnualTemperature> | undefined,
  region: StringContainer<StateOrRegion>,
  constants: ConstantsForBeefManure,
) => {
  if (mms === '14') {
    return selectConstant(constants.BEEF_PASTURE, 'MCF_PASTURE').named(
      `MCFim=${mms}`,
    );
  }

  return captureMethod1Or2Value(
    selectConstant(constants.BEEF_PASTURE, 'MCF_LAGOON', region),
    method2MeanAnnualTemperature
      ? selectConstant(
          constants.LIVESTOCK,
          'MANURE_MANAGEMENT_METHANE_CONVERSION_FACTORS',
          'anaerobicLagoon',
          method2MeanAnnualTemperature,
        )
      : undefined,
  ).named(`MCFim=${mms}`);
};

const calculateTotalMethaneProductionFromClassSeasonM = (
  periodProps: BeefPeriodProps,
  mms: '1' | '14',
) => {
  /*
  Mjklm = VSjkl * B0 * MMSm * MCFim * 𝜌
  VSjkl = (Ijkl * (1 - DMDjkl) + (0.04 * Ijkl)) * (1 - A)
  */

  const { className, periodName, context, herd } = periodProps;
  const { method2MeanAnnualTemperature, region, excludedFromNaturalWater } =
    herd;
  const { constants } = context;

  const Ijkl = calculateOrGetFeedIntakeForBeef(periodProps);

  const DMDjkl = getDryMatterDigestibilityDMD(periodProps);

  const B0 = selectConstant(
    constants.LIVESTOCK,
    'EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4',
    'beef',
  ).named('B0');

  const A = selectConstant(
    constants.LIVESTOCK,
    'ASH_CONTENT_OF_MANURE',
    'beef',
  ).named('A');

  const VSjkl = br(
    Ijkl.multiply(oneMinus(DMDjkl)).plus(num(0.04).multiply(Ijkl)),
  )
    .multiply(oneMinus(A))
    .switchUnit((v) => massPerHeadPerDay('Volatile Solids', v.store))
    .named(`VSjkl=${periodName},k=${className}`)
    .reference('4.2.1.1 (3)');

  const MMS = calculateMMSm(mms, excludedFromNaturalWater, region, constants);

  const MCFim = calculateMCFim(
    mms,
    method2MeanAnnualTemperature,
    region,
    constants,
  );

  const p = selectConstant(constants.COMMON, 'DENSITY_OF_METHANE').named('p');

  const Mjklm = VSjkl.multiply(B0)
    .multiply(MMS)
    .multiply(MCFim)
    .multiply(p)
    .named(`Mjklm=${mms},j=${periodName},k=${className}`)
    .reference('4.2.1.1 (2)');

  return Mjklm;
};

const calculateTotalMethaneFromClassSeason = (periodProps: BeefPeriodProps) => {
  const { currentPeriod, className, periodDuration, periodName } = periodProps;

  const Njkl = currentPeriod.head;
  const Dj = captureMethod1Or2Value(
    periodDuration,
    currentPeriod.method2DurationDays,
  ).named(`Dj=${periodName}`);

  const Mjklm1 = calculateTotalMethaneProductionFromClassSeasonM(
    periodProps,
    '1',
  ).named(`Mjklm=1,j=${periodName},k=${className}`);
  const Mjklm14 = calculateTotalMethaneProductionFromClassSeasonM(
    periodProps,
    '14',
  ).named(`Mjklm=14,j=${periodName},k=${className}`);

  const Mjkl = sum([Mjklm1, Mjklm14], {
    name: `Mjkl j=${periodName},k=${className}`,
  });

  return Mjkl.multiply(Njkl)
    .multiply(Dj)
    .named(`ECH4 j=${periodName},k=${className}`)
    .reference('4.2.1.1 (1)');
};

export const calculate42BeefPastureManureCH4ForHerd = (
  herd: BeefManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<ConstantsForBeefManure>,
) => {
  /*
    Total annual methane emissions from manure management EMCH4 is calculated as:
    EMCH4 = SUM[jklm] (Njkl * Mjklm * Dj) * 10^-3
    
  */
  return calculateForAllClassPeriods(
    { herd, context },
    calculateTotalMethaneFromClassSeason,
    {
      classResultName: (className) => `ECH4j=${className}`,
      herdResultName: 'ECH4 (herd)',
      isFebruaryInLeapYear: herd.isFebruaryInLeapYear,
    },
  );
};
