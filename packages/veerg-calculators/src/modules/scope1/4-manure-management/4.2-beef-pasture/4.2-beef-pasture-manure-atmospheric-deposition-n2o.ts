import { ExecutionContext } from '@/calculators/executionContext';
import { HasIsFebruaryInLeapYearInputTransformed } from '@/calculators/types/has-is-february-in-leap-year.input';
import { selectConstant } from '@/tools/constants';
import { zeroMassVolatilisedN } from '@/tools/sentinels';
import {
  BeefPeriodProps,
  calculateForAllClassPeriods,
} from '../../shared/beef/helpers';
import { BeefManureAndEntericHerdInputTransformed } from '../../shared/beef/input';
import { calculateTotalNitrogenExcretedByClassInPeriod } from './4.2-beef-pasture-manure-n2o';
import { ConstantsForBeefManure } from './constants';

const calculateNitrogenVolatilisedMVolForClassPeriod = (
  periodProps: BeefPeriodProps,
) => {
  const { constants } = periodProps.context;
  /*
    Mvol = AE * FracGASMsoil
    */

  const AE = calculateTotalNitrogenExcretedByClassInPeriod(periodProps);

  const FracGASMsoil = selectConstant(
    constants.CROP,
    'FRACTION_N_VOLATILISED_ORGANIC_FERTILISER',
  ).named('FracGASMsoil');

  return AE.multiply(FracGASMsoil)
    .named(`Mvol (${periodProps.className}, ${periodProps.seasonName})`)
    .reference('4.2.1.5 (2)');
};
export const calculateManureManagementSoilAtmosphericDepositionN2OForHerd = (
  herd: BeefManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<ConstantsForBeefManure>,
) => {
  const { constants } = context;
  const { grazingSystem } = herd;
  const Mvol = calculateForAllClassPeriods(
    { herd, context },
    calculateNitrogenVolatilisedMVolForClassPeriod,
    {
      classResultName: (className) => `Mvol=${className}`,
      herdResultName: 'Mvol (herd)',
      isFebruaryInLeapYear: herd.isFebruaryInLeapYear,
      fallback: zeroMassVolatilisedN,
    },
  );

  const EFn2o = selectConstant(
    constants.CROP,
    'EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM',
    grazingSystem,
  );

  const cn2o = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  return Mvol.multiply(EFn2o)
    .multiply(cn2o)
    .named('EN2O,ad (herd)')
    .reference('4.2.1.5 (1)');
};
