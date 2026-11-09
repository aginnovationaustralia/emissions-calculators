import {
  gjPerCubicMetreToJPerLitre,
  gjPerTonneToJPerKg,
  perGjToPerJ,
} from '@/tools/unit-conversion';
import {
  energyPerMass,
  energyPerVolume,
  massPerElectricity,
  massPerEnergy,
  percentage,
} from '@/tools/units';
import { FuelFactorByMass, FuelFactorByVolume } from '../types';
import * as ngaf from './2026.json';

export const ngafTables = ngaf.tables;

export const ngafElectricityData = ngafTables['Table 1'].table;
export const ngafTransportFuelData = ngafTables['Table 9'].table;
export const ngafSolidFuelData = ngafTables['Table 4'].table;
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

type RefrigerantLeakageNGAFName = keyof typeof ngafRefrigerantLeakageData;
export const getRefrigerantLeakageRateFromNGAF = (
  row: RefrigerantLeakageNGAFName,
) => percentage(ngafRefrigerantLeakageData[row]['Annual leakage rate (%)']);
