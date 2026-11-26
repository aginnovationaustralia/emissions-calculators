import {
  gjPerCubicMetreToJPerLitre,
  gjPerTonneToJPerKg,
  perGjToPerJ,
} from '@/tools/unit-conversion';
import {
  energyPerMass,
  energyPerVolume,
  massPerElectricity,
  MassPerEnergy,
  massPerEnergy,
  percentage,
} from '@/tools/units';
import { State } from '../enums';
import {
  FuelFactorByMass,
  FuelFactorByVolume,
  GaseousFuelFactor,
} from '../types';
import * as ngaf from './2026.json';

export const ngafTables = ngaf.tables;

export const ngafElectricityData = ngafTables['Table 1'].table;
export const ngafTransportFuelData = ngafTables['Table 9'].table;
export const ngafSolidFuelData = ngafTables['Table 4'].table;
export const ngafGaseousFuelData = ngafTables['Table 5'].table;
export const ngafLiquidFuelData = ngafTables['Table 8'].table;
export const ngafRefrigerantLeakageData = ngafTables['Table 10'].table;

type ElectricityRegionNGAFName = keyof typeof ngafElectricityData;
export const getElectricityFactorsFromNGAF = (
  region: ElectricityRegionNGAFName,
) => ({
  SCOPE2_EF: massPerElectricity('CO2e', ngafElectricityData[region].SCOPE_2),
  SCOPE3_EF: massPerElectricity('CO2e', ngafElectricityData[region].SCOPE_3),
});

type TransportFuelNGAFName = keyof typeof ngafTransportFuelData;
/**
 * Construct transport fuel constants and apply any deviations
 * (for pre-2004 cars and commercial light vehicles)
 */
export const createTransportFuelConstantsFromNGAF = (
  row: TransportFuelNGAFName,
  scope1Overides: Partial<FuelFactorByVolume['SCOPE1_EF']> = {},
): FuelFactorByVolume => ({
  ENERGY_CONTENT_FACTOR: energyPerVolume(
    'Fuel',
    gjPerCubicMetreToJPerLitre(ngafTransportFuelData[row].ENERGY_CONTENT),
  ),
  SCOPE1_EF: {
    CO2: massPerEnergy('CO2e', perGjToPerJ(ngafTransportFuelData[row].CO2)),
    CH4: massPerEnergy('CO2e', perGjToPerJ(ngafTransportFuelData[row].CH4)),
    N2O: massPerEnergy('CO2e', perGjToPerJ(ngafTransportFuelData[row].N2O)),
    CO2e: massPerEnergy(
      'CO2e',
      perGjToPerJ(ngafTransportFuelData[row].COMBINED),
    ),
    ...scope1Overides,
  },
  SCOPE3_EF: massPerEnergy(
    'CO2e',
    perGjToPerJ(ngafTransportFuelData[row].SCOPE_3),
  ),
});

type StationaryLiquidOrSolidFuelNGAFName =
  keyof typeof ngafLiquidFuelData | keyof typeof ngafSolidFuelData;
type FuelRowExtract = {
  ENERGY_CONTENT: number;
  CO2: number;
  CH4: number;
  N2O: number;
  COMBINED: number;
  SCOPE_3: number;
};
export const createStationaryFuelConstantsFromNGAFByVolume = <
  F extends StationaryLiquidOrSolidFuelNGAFName,
>(
  table: Record<F, FuelRowExtract>,
  row: F,
): FuelFactorByVolume => ({
  ENERGY_CONTENT_FACTOR: energyPerVolume(
    'Fuel',
    gjPerCubicMetreToJPerLitre(table[row].ENERGY_CONTENT),
  ),
  SCOPE1_EF: {
    CO2: massPerEnergy('CO2e', perGjToPerJ(table[row].CO2)),
    CH4: massPerEnergy('CO2e', perGjToPerJ(table[row].CH4)),
    N2O: massPerEnergy('CO2e', perGjToPerJ(table[row].N2O)),
    CO2e: massPerEnergy('CO2e', perGjToPerJ(table[row].COMBINED)),
  },
  SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(table[row].SCOPE_3)),
});

export const createStationaryFuelConstantsFromNGAFByMass = <
  F extends StationaryLiquidOrSolidFuelNGAFName,
>(
  table: Record<F, FuelRowExtract>,
  row: F,
): FuelFactorByMass => ({
  ENERGY_CONTENT_FACTOR: energyPerMass(
    'Fuel',
    gjPerTonneToJPerKg(table[row].ENERGY_CONTENT),
  ),
  SCOPE1_EF: {
    CO2: massPerEnergy('CO2e', perGjToPerJ(table[row].CO2)),
    CH4: massPerEnergy('CO2e', perGjToPerJ(table[row].CH4)),
    N2O: massPerEnergy('CO2e', perGjToPerJ(table[row].N2O)),
    CO2e: massPerEnergy('CO2e', perGjToPerJ(table[row].COMBINED)),
  },
  SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(table[row].SCOPE_3)),
});

type GaseousFuelNGAFName = keyof typeof ngafGaseousFuelData;
/**
 * Gaseous fuel constants from NGAF Table 5. Energy content is in GJ/m3.
 */
export const createGaseousFuelConstantsFromNGAF = (
  row: GaseousFuelNGAFName,
): GaseousFuelFactor => ({
  ENERGY_CONTENT_FACTOR: energyPerVolume(
    'Fuel',
    gjPerCubicMetreToJPerLitre(ngafGaseousFuelData[row].ENERGY_CONTENT),
  ),
  SCOPE1_EF: {
    CO2: massPerEnergy('CO2e', perGjToPerJ(ngafGaseousFuelData[row].CO2)),
    CH4: massPerEnergy('CO2e', perGjToPerJ(ngafGaseousFuelData[row].CH4)),
    N2O: massPerEnergy('CO2e', perGjToPerJ(ngafGaseousFuelData[row].N2O)),
    CO2e: massPerEnergy('CO2e', perGjToPerJ(ngafGaseousFuelData[row].COMBINED)),
  },
});

type RefrigerantLeakageNGAFName = keyof typeof ngafRefrigerantLeakageData;
export const getRefrigerantLeakageRateFromNGAF = (
  row: RefrigerantLeakageNGAFName,
) => percentage(ngafRefrigerantLeakageData[row]['Annual leakage rate (%)']);

type NaturalGasTable6Row = keyof (typeof ngafTables)['Table 6']['table'];

/**
 * The NGA Table 6 row used for each state's scope 3 natural gas EF.
 * TAS is based on Victoria, and NT on WA.
 */
const naturalGasTable6RowByState: Record<State, NaturalGasTable6Row> = {
  NSW: 'New South Wales and ACT',
  ACT: 'New South Wales and ACT',
  VIC: 'Victoria',
  QLD: 'Queensland',
  SA: 'South Australia',
  WA: 'Western Australia',
  TAS: 'Victoria',
  NT: 'Western Australia',
};

export const naturalGasScope3EfByState = (
  region: 'METRO' | 'NON_METRO',
): Record<State, MassPerEnergy<'CO2e'>> =>
  Object.fromEntries(
    Object.entries(naturalGasTable6RowByState).map(([state, row]) => [
      state,
      massPerEnergy(
        'CO2e',
        perGjToPerJ(ngafTables['Table 6'].table[row][region]),
      ),
    ]),
  ) as Record<State, MassPerEnergy<'CO2e'>>;
