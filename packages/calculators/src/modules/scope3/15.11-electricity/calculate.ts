import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { GrainsInputTransformed } from '@/calculators/Grains/types/input';
import { isMarketBasedElectricity } from '@/modules/scope2/14-electricity/electricity.input';
import { LocationBasedElectricityInputsTransformed } from '@/modules/scope2/14-electricity/location-based.input';
import { MarketBasedElectricityInputsTransformed } from '@/modules/scope2/14-electricity/market-based.input';
import { selectConstant } from '@/tools/constants';
import { oneMinus, tenToPowMinus3, zero } from '@/tools/sentinels';

export const calculateElectricityScope3LocationBased = (
  crop: GrainsInputTransformed,
  input: LocationBasedElectricityInputsTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  /*
  15.12.1.1 Purchased electricity upstream emissions (location-based)
  Scope 3 emissions from purchased electricity, E3,elec (t CO2e), under the location-
  based approach are estimated as:
  E3,elec = Qelec * EF 3,elec * 10^-3
  Where Qelec = amount of electricity purchased from the grid (kWh) (same as that
  used in Section 14.1)
  EF3,elec = Scope 3 emission factor for purchased electricity (kg CO2e/kWh)
  */
  const qelec = input.electricityPurchasedKWh;
  const ef3elec = selectConstant(
    constants.COMMON,
    'ELECTRICITY',
    crop.state,
    'SCOPE3_EF',
  );

  const e3elec = qelec.multiply(ef3elec, {
    name: 'e3elec',
    references: ['15.12.1.1 (595)'],
  });

  return e3elec;
};

export const calculateElectricityScope3MarketBased = (
  crop: GrainsInputTransformed,
  input: MarketBasedElectricityInputsTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  /*
  15.12.1.2 Purchased electricity upstream emissions (market-based)
  (1) Scope 3 emissions from purchased electricity, E3,elec (t CO2e), under the market-based approach are estimated as:
  E3,elec = [Qelec * (1 - (RPP + JRPP)) - ((RECsurrendered - REConsite) * 10^-3)] * EF RMF3,elec * 10^-3
  Where Qelec = amount of electricity purchased from the grid (kWh) (same as that used in Section 14.1)
  EF RMF3,elec = Scope 3 residual mix emission factor for electricity (kg CO2e/kWh)
  RPP = Renewable Power Percentage under the Large-scale
  Renewable Energy Target (LRET) for the applicable period (dimensionless)
  JRPP = jurisdictional renewable power percentage for the applicable period (only applies to the ACT) (dimensionless)
  RECsurrendered = number of eligible Renewable Energy Certificates voluntarily surrendered in the reporting year equivalent to megawatt hours (MWh)
  REConsite = number eligible Renewable Energy Certificates that have been or will be issued for electricity produced on-site during the year and consumed by the entity equivalent to megawatt hours (MWh)
  */
  const qelec = input.electricityPurchasedKWh;
  const rpp = selectConstant(constants.COMMON, 'RENEWABLE_POWER_PERCENTAGE');
  const jrpp =
    crop.state === 'act'
      ? selectConstant(
          constants.COMMON,
          'JURISDICTIONAL_RENEWABLE_POWER_PERCENTAGE',
        )
      : zero;
  const recSurrendered = input.recsSurrenderedKWh;
  const recOnsite = input.recsOnsiteKWh;
  const nonRenewablesPurchased = qelec.multiply(oneMinus(rpp.plus(jrpp)));
  const renewableRecs = recSurrendered
    .minus(recOnsite)
    // REVISIT: These units really need to be double checked
    .multiply(tenToPowMinus3);

  const efrmf3elec = selectConstant(
    constants.COMMON,
    'ELECTRICITY_RMF_SCOPE3_EF',
  );

  const e3elec = nonRenewablesPurchased
    .minus(renewableRecs)
    .multiply(efrmf3elec, { name: 'e3elec', references: ['15.12.1.2 (602)'] });

  return e3elec;
};

export const calculateElectricityScope3 = (
  crop: GrainsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const electricity = crop.electricity;
  if (isMarketBasedElectricity(electricity)) {
    return calculateElectricityScope3MarketBased(crop, electricity, context);
  } else {
    return calculateElectricityScope3LocationBased(crop, electricity, context);
  }
};
