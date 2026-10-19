import { ExecutionContext } from '@/calculators/executionContext';
import { electricityRegionToJRPPFactor } from '@/constants/translations';
import { selectConstant } from '@/tools/constants';
import { br } from '@/tools/containers';
import { oneMinus } from '@/tools/sentinels';
import {
  ElectricityInputsTransformed,
  isMarketBasedElectricity,
} from './electricity.input';
import { LocationBasedElectricityInputsTransformed } from './location-based.input';
import { MarketBasedElectricityInputsTransformed } from './market-based.input';

const calculateMarketBasedElectricityScope2 = (
  electricity: MarketBasedElectricityInputsTransformed,
  context: ExecutionContext,
) => {
  const { constants } = context;
  /**
   * 14.1.2 (1): The market-based Scope 2 emissions from purchased electricity, E2,elec
   * (t CO2e) are estimated as:
   *
   * E2,elec = (Qelec * (1 - (RPP + JRPP / 100))) - ((RECsurrendered - REConsite) * 10^-3)) *
   * EFRMF2,elec * 10^-3
   *
   * Where:
   * - EF RMF2,elec = Scope 2 residual mix emission factor for electricity (kg CO2e/kWh)
   * - RPP = Renewable Power Percentage under the Large-scale Renewable Energy Target
   * (LRET) for the applicable period (dimensionless)
   * - JRPP = jurisdictional renewable power percentage for the applicable period
   * (only applies to the ACT) (dimensionless)
   * - RECsurrendered = number of eligible Renewable Energy Certificates voluntarily
   * surrendered in the reporting year equivalent to megawatt hours (MWh)
   * - REConsite = number eligible Renewable Energy Certificates that have been or will
   * be issued for electricity produced on-site during the year and consumed by the
   * entity equivalent to megawatt hours (MWh)
   *
   */
  const qelec = electricity.electricityPurchasedKWh;
  const efrmf2elec = selectConstant(
    constants.COMMON,
    'ELECTRICITY_RMF_SCOPE2_EF',
  );
  const recSurrendered = electricity.recsSurrendered;
  const recOnsite = electricity.recsOnsite;
  const rpp = selectConstant(constants.COMMON, 'RENEWABLE_POWER_PERCENTAGE');
  const jrppFactor = electricityRegionToJRPPFactor(electricity.region).named(
    'JRPP factor',
  );
  const jrpp = selectConstant(
    constants.COMMON,
    'JURISDICTIONAL_RENEWABLE_POWER_PERCENTAGE',
  ).multiply(jrppFactor, {
    name: 'JRPP',
  });

  const nonRenewablesPurchased = qelec.multiply(oneMinus(rpp.plus(jrpp)));
  const renewableRecs = recSurrendered.minus(recOnsite);
  const e2elec = br(nonRenewablesPurchased.minus(renewableRecs)).multiply(
    efrmf2elec,
    { name: 'e2elec', references: ['14.1.2 (2)'] },
  );

  return e2elec;
};

const calculateLocationBasedElectricityScope2 = (
  electricity: LocationBasedElectricityInputsTransformed,
  context: ExecutionContext,
) => {
  const { constants } = context;
  /*
  14.1.1 Purchased electricity (location-based)
  
  The location-based Scope 2 emissions from purchased electricity, E2,elec (t CO2e),
  are estimated by:
  Where E2,elec = Qelec * EF2,elec * 10^-3
  Qelec = amount of electricity purchased from the grid (kWh)
  EF 2,elec = location-based Scope 2 emission factor for electricity (kg CO2e/kWh)
  */

  const qelec = electricity.electricityPurchasedKWh;
  const ef2elec = selectConstant(
    constants.COMMON,
    'ELECTRICITY',
    electricity.region,
    'SCOPE2_EF',
  );

  const e2elec = qelec.multiply(ef2elec, {
    name: 'e2elec',
    references: ['14.1.1 (1)'],
  });

  return e2elec;
};

export const calculateElectricityScope2 = (
  electricity: ElectricityInputsTransformed,
  context: ExecutionContext,
) => {
  if (isMarketBasedElectricity(electricity)) {
    return calculateMarketBasedElectricityScope2(electricity, context);
  } else {
    return calculateLocationBasedElectricityScope2(electricity, context);
  }
};
