import { entriesFromObject } from '@/calculators/common/tools';
import { FuelEmissionsGasType } from '@/constants/types';
import Decimal from 'decimal.js-light';
import { constant } from './constants';
import { Container } from './containers';
import { Mass, massPerMass } from './units';

/*
 * Global warming potential (GWP) factors are taken from the NGAF 2024.
 * This uses Chapter 8, Anthropogenic and Natural Radiative Forcing, Appendix 8.A, Table 8.A.1 (page 731) of the IPCC 5th Assessment Report.
 * https://www.ipcc.ch/site/assets/uploads/2018/02/WG1AR5_Chapter08_FINAL.pdf
 * GWP100, no cc fb
 */
const GWP_CH4 = new Decimal(28);
const GWP_N2O = new Decimal(265);
const GWP_CO2 = new Decimal(1);

export const CH4GWPByMass = constant(
  'GWP_CH4',
  massPerMass('CO2e', 'CH4', GWP_CH4),
);
export const N2OGWPByMass = constant(
  'GWP_N2O',
  massPerMass('CO2e', 'N2O', GWP_N2O),
);
export const CO2GWPByMass = constant(
  'GWP_CO2',
  massPerMass('CO2e', 'CO2', GWP_CO2),
);

const gwpConversions: {
  [G in FuelEmissionsGasType]: (
    massCO2e: Container<Mass<'CO2e'>>,
  ) => Container<Mass<G>>;
} = {
  CH4: (massCO2e) => massCO2e.divide(CH4GWPByMass),
  N2O: (massCO2e) => massCO2e.divide(N2OGWPByMass),
  CO2: (massCO2e) => massCO2e.divide(CO2GWPByMass),
  CO2e: (massCO2e) => massCO2e,
};

export function massCO2eToMassGHGGas<G extends FuelEmissionsGasType>(
  massCO2e: Container<Mass<'CO2e'>>,
  gasType: G,
): Container<Mass<G>> {
  return gwpConversions[gasType](massCO2e);
}

export const convertToCO2e = (
  gasAmountKg: Decimal,
  gas: 'CO2' | 'CH4' | 'N2O' | 'CO2e',
) => {
  if (gas === 'CH4') {
    return gasAmountKg.mul(GWP_CH4);
  } else if (gas === 'N2O') {
    return gasAmountKg.mul(GWP_N2O);
  }
  return gasAmountKg;
};

export function sumOfValuesInKgCO2e<
  T extends { [K in keyof T]: Container<Mass<'CO2' | 'CH4' | 'N2O' | 'CO2e'>> },
>(object: T): Decimal {
  const valuesKg = entriesFromObject(object).map(([_key, value]) =>
    convertToCO2e(value.unit.store.value, value.unit.substance),
  );

  return valuesKg.reduce((acc, curr) => acc.add(curr), new Decimal(0));
}
