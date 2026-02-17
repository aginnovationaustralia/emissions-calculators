import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { STATES } from '@/calculators/Grains/constants/types';
import { GrainsCropTransformed } from '@/calculators/Grains/types/crop.input';
import { GrainsInputTransformed } from '@/calculators/Grains/types/input';
import { selectConstant } from '@/tools/constants';
import { oneMinus } from '@/tools/sentinels';
import { massPerElectricity, realNumber } from '@/tools/units';
import { isMarketBasedElectricity } from './electricity.input';
import { LocationBasedElectricityInputsTransformed } from './location-based.input';
import { MarketBasedElectricityInputsTransformed } from './market-based.input';

const calculateMarketBasedElectricityScope2 = (
  input: GrainsInputTransformed,
  electricity: MarketBasedElectricityInputsTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
  (1) The market-based Scope 2 emissions from purchased electricity, E2,elec (t CO2e), are
  estimated as:
  E2,elec = (Qelec * (1 - (RPP + JRPP)) - ((RECsurrendered- REConsite) * 10^-3)) * EF RMF2,elec * 10^-3
  Where Qelec = amount of electricity purchased from the grid (kWh)
  EF RMF2,elec = Scope 2 residual mix emission factor for electricity (kgCO2e/kWh)
  RPP = Renewable Power Percentage under the Large-scale Renewable Energy Target (LRET) for the applicable period (dimensionless)
  JRPP = jurisdictional renewable power percentage for the applicable period (only applies to the ACT) (dimensionless)
  RECsurrendered = number of eligible Renewable Energy Certificates voluntarily surrendered in the reporting year equivalent to megawatt hours (MWh)
  REConsite = number eligible Renewable Energy Certificates that have been or will be issued for electricity produced on-site during the year and consumed by the entity equivalent to megawatt hours (MWh)
  */
  const qelec = electricity.electricityPurchasedKWh;
  const efrmf2elec = selectConstant(
    constants.COMMON,
    (value) => massPerElectricity('CO2e', value),
    'ELECTRICITY_RMF_SCOPE2_EF',
  );
  const recSurrendered = electricity.recsSurrenderedKWh;
  const recOnsite = electricity.recsOnsiteKWh;
  const rpp = selectConstant(
    constants.COMMON,
    (value) => realNumber(value / 100),
    'RENEWABLE_POWER_PERCENTAGE',
  );
  const jrpp = selectConstant(
    constants.COMMON,
    (value) => realNumber(input.state === STATES.ACT ? value / 100 : 0),
    'JURISDICTIONAL_RENEWABLE_POWER_PERCENTAGE',
  );

  const nonRenewablesPurchased = qelec.multiply(oneMinus(rpp.plus(jrpp)));
  const renewableRecs = recSurrendered.minus(recOnsite);
  const e2elec = nonRenewablesPurchased
    .minus(renewableRecs)
    .multiply(efrmf2elec)
    .attachContext({ references: ['14.1.2 (88)'] });

  return e2elec;
};

const calculateLocationBasedElectricityScope2 = (
  input: GrainsInputTransformed,
  electricity: LocationBasedElectricityInputsTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
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

  const qelec = electricity.electricityUse;
  const ef2elec = selectConstant(
    constants.COMMON,
    (value) => massPerElectricity('CO2e', value),
    'ELECTRICITY',
    input.state,
    'SCOPE2_EF',
  );

  const e2elec = qelec
    .multiply(ef2elec)
    .attachContext({ references: ['14.1.1 (73)'] });

  return e2elec;
};

export const calculateElectricityScope2 = (
  crop: GrainsCropTransformed,
  input: GrainsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const electricity = input.electricity;

  if (isMarketBasedElectricity(electricity)) {
    return calculateMarketBasedElectricityScope2(input, electricity, context);
  } else {
    return calculateLocationBasedElectricityScope2(input, electricity, context);
  }
};
