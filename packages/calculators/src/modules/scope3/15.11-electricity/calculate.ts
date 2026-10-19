import { ExecutionContext } from '@/calculators/executionContext';
import { electricityRegionToJRPPFactor } from '@/constants/translations';
import {
  ElectricityInputsTransformed,
  isMarketBasedElectricity,
} from '@/modules/scope2/14-electricity/electricity.input';
import { LocationBasedElectricityInputsTransformed } from '@/modules/scope2/14-electricity/location-based.input';
import { MarketBasedElectricityInputsTransformed } from '@/modules/scope2/14-electricity/market-based.input';
import { selectConstant } from '@/tools/constants';
import { br } from '@/tools/containers';
import { oneMinus } from '@/tools/sentinels';

export const calculateElectricityScope3LocationBased = (
  electricity: LocationBasedElectricityInputsTransformed,
  context: ExecutionContext,
) => {
  const { constants } = context;

  /*
  15.11.1.1 Purchased electricity upstream emissions (location-based)
  Scope 3 emissions from purchased electricity, E3,elec (t CO2e), under the location-
  based approach are estimated as:
  E3,elec = Qelec * EF 3,elec * 10^-3
  Where Qelec = amount of electricity purchased from the grid (kWh) (same as that
  used in Section 14.1)
  EF3,elec = Scope 3 emission factor for purchased electricity (kg CO2e/kWh)
  */
  const qelec = electricity.electricityPurchasedKWh;
  const ef3elec = selectConstant(
    constants.COMMON,
    'ELECTRICITY',
    electricity.region,
    'SCOPE3_EF',
  );

  const e3elec = qelec.multiply(ef3elec, {
    name: 'e3elec',
    references: ['15.11.1.1 (1)'],
  });

  return e3elec;
};

export const calculateElectricityScope3MarketBased = (
  electricity: MarketBasedElectricityInputsTransformed,
  context: ExecutionContext,
) => {
  const { constants } = context;

  /**
   * 15.11.1.2 (1): Scope 3 emissions from purchased electricity, E3,elec (t CO2e), under
   * the market-based approach are estimated as:
   *
   * E3,elec = [Qelec * (1 - (RPP + JRPP)) - ((RECsurrendered - REConsite) * 10^-3)] *
   * EFRMF3,elec * 10^-3
   *
   * Where:
   * - EF RMF3,elec = Scope 3 residual mix emission factor for electricity (kg CO2e/kWh)
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
   * NOTE: The multiplication of *RECsurrendered* and *REConsite* by 10^-3 is a mistake
   * (it should be 10^3 to convert to kWh - this is how it is done in the original
   * equation in NGAF 2024). However, we have already converted these quantities to kWh,
   * so we can omit this conversion here.
   */
  const RPP = selectConstant(
    constants.COMMON,
    'RENEWABLE_POWER_PERCENTAGE',
  ).named(`RPP`);
  const jrppFactor = electricityRegionToJRPPFactor(electricity.region).named(
    'JRPP factor',
  );
  const JRPP = selectConstant(
    constants.COMMON,
    'JURISDICTIONAL_RENEWABLE_POWER_PERCENTAGE',
  ).multiply(jrppFactor, {
    name: 'JRPP',
  });

  const nonRenewablesPurchased = electricity.electricityPurchasedKWh.multiply(
    oneMinus(RPP.plus(JRPP)),
  );
  const renewableRecs = electricity.recsSurrendered.minus(
    electricity.recsOnsite,
  );

  const efrmf3elec = selectConstant(
    constants.COMMON,
    'ELECTRICITY_RMF_SCOPE3_EF',
  );

  const e3elec = br(nonRenewablesPurchased.minus(renewableRecs)).multiply(
    efrmf3elec,
    { name: 'e3elec', references: ['15.11.1.2 (1)'] },
  );

  return e3elec;
};

export const calculateElectricityScope3 = (
  electricity: ElectricityInputsTransformed,
  context: ExecutionContext,
) => {
  if (isMarketBasedElectricity(electricity)) {
    return calculateElectricityScope3MarketBased(electricity, context);
  } else {
    return calculateElectricityScope3LocationBased(electricity, context);
  }
};
