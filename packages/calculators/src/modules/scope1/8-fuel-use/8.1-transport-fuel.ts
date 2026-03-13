import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { selectConstant } from '@/tools/constants';
import { BinaryContainer } from '@/tools/containers';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { FuelInputTransformed } from './fuel.input';
import {
  isTransportFuelCNGBased,
  TransportFuelInputAviationTransformed,
  TransportFuelInputCarsLightCommercialPre2004Transformed,
  TransportFuelInputCarsLightCommercialTransformed,
  TransportFuelInputHeavyDutyTransformed,
  TransportFuelInputLightDutyTransformed,
  TransportFuelInputOffRoadAgricultureAndForestryEquipmentTransformed,
  TransportFuelInputTransformed,
  TransportFuelInputVesselTransformed,
} from './transportFuel.input';

// REVISIT: It would be nice to find a generic way to access the constants for the transport fuel factors.
const constantsForCarsLightCommercial = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  input: TransportFuelInputCarsLightCommercialTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  return {
    ecTransQ: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'ENERGY_CONTENT_FACTOR',
    ),
    efTrans1tqg: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE1_EF',
      gasType,
    ),
    efTrans3Q: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE3_EF',
    ),
  };
};
const constantsForCarsLightCommercialPre2004 = <
  GasType extends 'CO2' | 'CH4' | 'N2O',
>(
  input: TransportFuelInputCarsLightCommercialPre2004Transformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  return {
    ecTransQ: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'ENERGY_CONTENT_FACTOR',
    ),
    efTrans1tqg: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE1_EF',
      gasType,
    ),
    efTrans3Q: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE3_EF',
    ),
  };
};
const constantsForLightDuty = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  input: TransportFuelInputLightDutyTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  return {
    ecTransQ: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'ENERGY_CONTENT_FACTOR',
    ),
    efTrans1tqg: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE1_EF',
      gasType,
    ),
    efTrans3Q: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE3_EF',
    ),
  };
};
const constantsForHeavyDuty = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  input: TransportFuelInputHeavyDutyTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  return {
    ecTransQ: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'ENERGY_CONTENT_FACTOR',
    ),
    efTrans1tqg: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE1_EF',
      gasType,
    ),
    efTrans3Q: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE3_EF',
    ),
  };
};
const constantsForAviation = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  input: TransportFuelInputAviationTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  return {
    ecTransQ: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'ENERGY_CONTENT_FACTOR',
    ),
    efTrans1tqg: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE1_EF',
      gasType,
    ),
    efTrans3Q: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE3_EF',
    ),
  };
};
const constantsForVessel = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  input: TransportFuelInputVesselTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  return {
    ecTransQ: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'ENERGY_CONTENT_FACTOR',
    ),
    efTrans1tqg: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE1_EF',
      gasType,
    ),
    efTrans3Q: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE3_EF',
    ),
  };
};
const constantsForOffRoadAgricultureAndForestryEquipment = <
  GasType extends 'CO2' | 'CH4' | 'N2O',
>(
  input: TransportFuelInputOffRoadAgricultureAndForestryEquipmentTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  return {
    ecTransQ: selectConstant(
      constants.COMMON,

      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'ENERGY_CONTENT_FACTOR',
    ),
    efTrans1tqg: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE1_EF',
      gasType,
    ),
    efTrans3Q: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      input.vehicleType,
      input.fuelType,
      'SCOPE3_EF',
    ),
  };
};

export const transportFuelConstantsForCNG = <
  GasType extends 'CO2' | 'CH4' | 'N2O',
>(
  vehicleType: 'Light duty vehicles' | 'Heavy duty vehicles',
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  return {
    ecTransQ: selectConstant(
      constants.COMMON,

      'TRANSPORT_FUEL_FACTORS',
      vehicleType,
      'Compressed natural gas',
      'ENERGY_CONTENT_FACTOR',
    ),
    efTrans1tqg: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      vehicleType,
      'Compressed natural gas',
      'SCOPE1_EF',
      gasType,
    ),
    efTrans3Q: selectConstant(
      constants.COMMON,
      'TRANSPORT_FUEL_FACTORS',
      vehicleType,
      'Compressed natural gas',
      'SCOPE3_EF',
    ),
  };
};

export const selectTransportFuelConstants = <
  GasType extends 'CO2' | 'CH4' | 'N2O',
>(
  fuel: TransportFuelInputTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  switch (fuel.vehicleType) {
    case 'Cars and light commercial vehicles':
      return constantsForCarsLightCommercial(fuel, constants, gasType);
    case 'Cars and light commercial vehicles (pre 2004)':
      return constantsForCarsLightCommercialPre2004(fuel, constants, gasType);
    case 'Light duty vehicles':
      if (fuel.fuelType === 'Compressed natural gas') {
        return transportFuelConstantsForCNG(
          fuel.vehicleType,
          constants,
          gasType,
        );
      }
      return constantsForLightDuty(fuel, constants, gasType);
    case 'Heavy duty vehicles':
      if (fuel.fuelType === 'Compressed natural gas') {
        return transportFuelConstantsForCNG(
          fuel.vehicleType,
          constants,
          gasType,
        );
      }
      return constantsForHeavyDuty(fuel, constants, gasType);
    case 'Aviation':
      return constantsForAviation(fuel, constants, gasType);
    case 'Vessel':
      return constantsForVessel(fuel, constants, gasType);
    case 'Off-road Agriculture and forestry equipment':
      return constantsForOffRoadAgricultureAndForestryEquipment(
        fuel,
        constants,
        gasType,
      );
  }
};

const emissionsOfGasForFuel = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  fuel: TransportFuelInputTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
): BinaryContainer<Mass<GasType>> => {
  /*
  8.1.1.1 Method 1 - Fuel use transport
  (1) Emissions for each GHG from the combustion of fuels for transport purposes, Eg (t
  CO2e), is estimated by:
  Eg = SUMt SUMq QTrans,tq * ECTrans,q * EFTrans,1,tqg * 10^-3

  Where QTrans,tq = amount of fuel type q combusted in each transport type t (kL or m3)
  ECTrans,q = energy content factor of fuel (GJ/kL or GJ/m3)
  EFTrans,1,tqg = Scope 1 emission factor for each fuel type and transport type
  for each greenhouse gas (kg CO2e/GJ)
  */
  const { ecTransQ, efTrans1tqg } = selectTransportFuelConstants(
    fuel,
    constants,
    gasType,
  );

  const qTransTQ = isTransportFuelCNGBased(fuel)
    ? fuel.amountCubicMetres
    : fuel.amountLitres;

  const energyFromFuel = ecTransQ.multiply(qTransTQ);

  return efTrans1tqg.multiply(energyFromFuel);
};

const transportEmissionsForGas = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  input: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
  gasType: GasType,
) => {
  const { constants } = context;
  const transportFuelEmissions = input.transportFuel.map((fuel) => {
    return emissionsOfGasForFuel(fuel, constants, gasType);
  });

  return sum(transportFuelEmissions, {
    name: `EtransGHG${gasType}`,
    references: [`8.1.1.1 (62)`],
  });
};

export const transportEmissionsForCO2 = (
  input: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  return transportEmissionsForGas(input, context, 'CO2');
};

export const transportEmissionsForCH4 = (
  input: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  return transportEmissionsForGas(input, context, 'CH4');
};

export const transportEmissionsForN2O = (
  input: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  return transportEmissionsForGas(input, context, 'N2O');
};

export const calculate81TransportFuel = (
  input: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const fuelTransportCO2 = transportEmissionsForCO2(input, context);
  const fuelTransportCH4 = transportEmissionsForCH4(input, context);
  const fuelTransportN2O = transportEmissionsForN2O(input, context);

  return {
    fuelTransportCO2,
    fuelTransportCH4,
    fuelTransportN2O,
  };
};
