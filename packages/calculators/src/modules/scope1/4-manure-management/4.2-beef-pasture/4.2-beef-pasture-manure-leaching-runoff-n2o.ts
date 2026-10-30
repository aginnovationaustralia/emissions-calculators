import { ExecutionContext } from '@/calculators/executionContext';
import { HasIsFebruaryInLeapYearInputTransformed } from '@/calculators/types/has-is-february-in-leap-year.input';
import { isInLeachingZoneToFracWET } from '@/constants/translations';
import { selectConstant } from '@/tools/constants';
import { zeroN } from '@/tools/sentinels';
import {
  BeefPeriodProps,
  calculateForAllClassPeriods,
} from '../../shared/beef/helpers';
import { BeefManureAndEntericHerdInputTransformed } from '../../shared/beef/input';
import { calculateTotalNitrogenExcretedByClassInPeriod } from './4.2-beef-pasture-manure-n2o';
import { ConstantsForBeefManure } from './constants';
const calculateNitrogenLeachingRunoffMLeachForClassPeriod = (
  periodProps: BeefPeriodProps,
) => {
  const { constants } = periodProps.context;
  const { herd } = periodProps;
  const { isInLeachingZone } = herd;
  /*
    Mleach = AE * FracWet * FracLEACH
    */

  const AE = calculateTotalNitrogenExcretedByClassInPeriod(periodProps);

  const FracWet = isInLeachingZoneToFracWET(isInLeachingZone);
  const FracLEACH = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
  ).named('FracLEACH');
  return AE.multiply(FracWet)
    .multiply(FracLEACH)
    .named('Mleach')
    .reference('4.2.1.7 (2)');
};

export const calculateManureManagementSoilLeachingRunoffN2OForHerd = (
  herd: BeefManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<ConstantsForBeefManure>,
) => {
  /*
  EN2O,leach = Mleach * EFleach * CN2O * 10^-3
  */
  const { constants } = context;
  const Mleach = calculateForAllClassPeriods(
    { herd, context },
    calculateNitrogenLeachingRunoffMLeachForClassPeriod,
    {
      classResultName: (className) => `Mleach=${className}`,
      herdResultName: 'Mleach (herd)',
      isFebruaryInLeapYear: herd.isFebruaryInLeapYear,
      fallback: zeroN,
    },
  );

  const EFleach = selectConstant(
    constants.CROP,
    'EF_N2O_LEACHING_AND_RUNOFF',
  ).named('EFleach');

  const cn2o = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  return Mleach.multiply(EFleach)
    .multiply(cn2o)
    .named('EN2O,leach (herd)')
    .reference('4.2.1.7 (1)');
};
