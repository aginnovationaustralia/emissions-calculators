import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { GrainsCropTransformed } from '@/calculators/Grains/types/crop.input';
import {
  FuelInputTransformed,
  isStationaryLiquidFuelMassBased,
  selectTransportFuelConstants,
  StationaryFuelLiquidInputTransformed,
  StationaryFuelNaturalGasInputTransformed,
  StationaryFuelSolidInputTransformed,
} from '@/modules/scope1/8-fuel-use';
import {
  isStationaryFuelLiquid,
  isStationaryFuelSolid,
} from '@/modules/scope1/8-fuel-use/stationaryFuel.input';
import { isTransportFuelCNGBased } from '@/modules/scope1/8-fuel-use/transportFuel.input';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';

export const calculateScope3EmissionsFromFuelTransport = (
  crop: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const emissionsRecords = crop.transportFuel.map((fuel) => {
    const { ecTransQ, efTrans3Q } = selectTransportFuelConstants(
      fuel,
      constants,
      'CH4', // doesn't affect scope 3 EF
    );

    const qTransTQ = isTransportFuelCNGBased(fuel)
      ? fuel.amountCubicMetres
      : fuel.amountLitres;

    const energyFromFuel = ecTransQ.multiply(qTransTQ);
    return efTrans3Q.multiply(energyFromFuel);
  });
  return sum(emissionsRecords, {
    name: 'EWTT,trans,q',
    references: ['15.11.1.1 (551)'],
  });
};

const calculateScope3EmissionsFromFuelStationarySolid = (
  fuel: StationaryFuelSolidInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const qTransQ = fuel.amountTonnes;
  const ecTransQ = selectConstant(
    constants.COMMON,
    'STATIONARY_FUEL_FACTORS_BY_MASS',
    'Solid fuels',
    fuel.fuelType,
    'ENERGY_CONTENT_FACTOR',
  );
  const efTrans3Q = selectConstant(
    constants.COMMON,
    // REVISIT: Constant values in table 4 are all in GJ/t, we are converting to GJ/kL
    'STATIONARY_FUEL_FACTORS_BY_MASS',
    'Solid fuels',
    fuel.fuelType,
    'SCOPE3_EF',
  );
  const energyFromFuel = ecTransQ.multiply(qTransQ);
  return efTrans3Q.multiply(energyFromFuel);
};

const calculateScope3EmissionsFromFuelStationaryLiquid = (
  fuel: StationaryFuelLiquidInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  if (isStationaryLiquidFuelMassBased(fuel)) {
    const qTransQ = fuel.amountTonnes;
    const ecTransQ = selectConstant(
      constants.COMMON,
      'STATIONARY_FUEL_FACTORS_BY_MASS',
      'Liquid fuels',
      fuel.fuelType,
      'ENERGY_CONTENT_FACTOR',
    );
    const efTrans3Q = selectConstant(
      constants.COMMON,
      'STATIONARY_FUEL_FACTORS_BY_MASS',
      'Liquid fuels',
      fuel.fuelType,
      'SCOPE3_EF',
    );
    const energyFromFuel = ecTransQ.multiply(qTransQ);
    return efTrans3Q.multiply(energyFromFuel);
  }
  const qTransQ = fuel.amountLitres;
  const ecTransQ = selectConstant(
    constants.COMMON,
    'STATIONARY_FUEL_FACTORS_BY_VOLUME',
    'Liquid fuels',
    fuel.fuelType,
    'ENERGY_CONTENT_FACTOR',
  );
  const efTrans3Q = selectConstant(
    constants.COMMON,
    'STATIONARY_FUEL_FACTORS_BY_VOLUME',
    'Liquid fuels',
    fuel.fuelType,
    'SCOPE3_EF',
  );
  const energyFromFuel = ecTransQ.multiply(qTransQ);
  return efTrans3Q.multiply(energyFromFuel);
};

const calculateScope3EmissionsFromFuelStationaryNaturalGas = (
  fuel: StationaryFuelNaturalGasInputTransformed,
  input: BaseGrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const qTransQ = fuel.amountLitres;
  const ecTransQ = selectConstant(
    constants.COMMON,
    'NATURAL_GAS_FACTORS',
    'ENERGY_CONTENT_FACTOR',
  );
  const efTrans3Q = selectConstant(
    constants.COMMON,
    'NATURAL_GAS_FACTORS',
    'SCOPE3_EF',
    input.state,
  );
  const energyFromFuel = ecTransQ.multiply(qTransQ);
  return efTrans3Q.multiply(energyFromFuel);
};

export const calculateScope3EmissionsFromFuelStationary = (
  crop: BaseGrainsCropTransformed & FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const emissionsRecords = crop.stationaryFuel.map((fuel) => {
    if (isStationaryFuelSolid(fuel)) {
      return calculateScope3EmissionsFromFuelStationarySolid(fuel, context);
    } else if (isStationaryFuelLiquid(fuel)) {
      return calculateScope3EmissionsFromFuelStationaryLiquid(fuel, context);
    }
    return calculateScope3EmissionsFromFuelStationaryNaturalGas(
      fuel,
      crop,
      context,
    );
  });
  return sum(emissionsRecords, {
    name: 'EWTT,SC,q',
    references: ['15.11.1.1 (561)'],
  });
};

export const calculateScope3EmissionsFromFuel = (
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*  15.11.1.1 Method 1 -- Upstream Fuel
  (1) Total upstream emissions from scope 1 fuel consumption E (t CO2e) are calculated as the sum of upstream emissions from scope 1 fuel used for transport purposes
  (EWTT,trans,q) and upstream emissions from scope 1 fuel used for stationary combustion purposes (EWTT,SC,q) as:
  E = SUM EWTT,trans,qq + SUM EWTT,SC,qq

  (2) Upstream emissions from Scope 1 fuel use for transport purposes EWTT,trans,q for fuel q is calculated as:
  EWTT,trans,q = QTrans,q * ECTrans,q * EFTrans,3,q * 10^-3
  Where QTrans,q = amount of fuel q combusted for transport energy purposes (kL)
  (same as that used in Section 8.1)
  ECTrans,q = energy content factor for transport energy purposes (joules/litre or
  m3) (same as that used in Section 8.1)
  EFTrans,3,q = Scope 3 emission factor for transport energy purposes (kg CO2e/GJ)

  (3) Upstream emissions from Scope 1 stationary combustion fuel use EWTT,SC,q for fuel q is calculated as:
  EWTT,SC,q = QSC,q * ECSC,q * EF SC,3,q * 10^-3
  Where QSC,q = amount of fuel used for stationary combustion operations (kL) (same as that used in Section 8.2)
  ECSC,q = energy content factor for stationary combustion operations (GJ/kL) (same as that used in Section 8.2)
  EFSC,3,q = Scope 3 emission factor for stationary combustion operations (kg CO2e /GJ)
  */
  const transportEmissions = calculateScope3EmissionsFromFuelTransport(
    crop,
    context,
  );
  const stationaryEmissions = calculateScope3EmissionsFromFuelStationary(
    crop,
    context,
  );
  return transportEmissions.plus(stationaryEmissions, {
    name: 'E',
    references: ['15.11.1.1 (547)'],
  });
};
