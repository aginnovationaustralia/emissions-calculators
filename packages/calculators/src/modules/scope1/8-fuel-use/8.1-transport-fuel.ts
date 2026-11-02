import { ExecutionContext } from '@/calculators/executionContext';
import { FuelEmissionsGasType } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container, SummedContainer } from '@/tools/containers';
import { massCO2eToMassGHGGas } from '@/tools/gwp';
import { zeroOfGas } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { ConstantsForFuel } from './constants';
import { FuelInputTransformed, HasFuelInputTransformed } from './fuel.input';
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

const constantsForCarsLightCommercial = (
  input: TransportFuelInputCarsLightCommercialTransformed,
  constants: ConstantsForFuel,
  gasType: FuelEmissionsGasType,
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
const constantsForCarsLightCommercialPre2004 = (
  input: TransportFuelInputCarsLightCommercialPre2004Transformed,
  constants: ConstantsForFuel,
  gasType: FuelEmissionsGasType,
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
const constantsForLightDuty = (
  input: TransportFuelInputLightDutyTransformed,
  constants: ConstantsForFuel,
  gasType: FuelEmissionsGasType,
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
const constantsForHeavyDuty = (
  input: TransportFuelInputHeavyDutyTransformed,
  constants: ConstantsForFuel,
  gasType: FuelEmissionsGasType,
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
const constantsForAviation = (
  input: TransportFuelInputAviationTransformed,
  constants: ConstantsForFuel,
  gasType: FuelEmissionsGasType,
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
const constantsForVessel = (
  input: TransportFuelInputVesselTransformed,
  constants: ConstantsForFuel,
  gasType: FuelEmissionsGasType,
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
const constantsForOffRoadAgricultureAndForestryEquipment = (
  input: TransportFuelInputOffRoadAgricultureAndForestryEquipmentTransformed,
  constants: ConstantsForFuel,
  gasType: FuelEmissionsGasType,
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

export const transportFuelConstantsForCNG = (
  vehicleType: 'Light duty vehicles' | 'Heavy duty vehicles',
  constants: ConstantsForFuel,
  gasType: FuelEmissionsGasType,
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

export const selectTransportFuelConstants = (
  fuel: TransportFuelInputTransformed,
  constants: ConstantsForFuel,
  gasType: FuelEmissionsGasType,
) => {
  switch (fuel.vehicleType) {
    case 'Cars and light commercial vehicles':
      return constantsForCarsLightCommercial(fuel, constants, gasType);
    case 'Cars and light commercial vehicles (pre 2004)':
      return constantsForCarsLightCommercialPre2004(fuel, constants, gasType);
    case 'Light duty vehicles':
      if (isTransportFuelCNGBased(fuel)) {
        return transportFuelConstantsForCNG(
          fuel.vehicleType,
          constants,
          gasType,
        );
      }
      return constantsForLightDuty(fuel, constants, gasType);
    case 'Heavy duty vehicles':
      if (isTransportFuelCNGBased(fuel)) {
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

export function emissionsOfGasForFuel<G extends FuelEmissionsGasType>(
  fuel: TransportFuelInputTransformed,
  constants: ConstantsForFuel,
  gasType: G,
): Container<Mass<G>> {
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
    : fuel.amountKilolitres;

  const energyFromFuel = ecTransQ.multiply(qTransTQ);

  const massCO2e = efTrans1tqg.multiply(energyFromFuel);

  return massCO2eToMassGHGGas(massCO2e, gasType);
}

const transportEmissionsForGas = <G extends FuelEmissionsGasType>(
  input: FuelInputTransformed,
  context: ExecutionContext,
  gasType: G,
): SummedContainer<Mass<G>> => {
  const { constants } = context;
  const transportFuelEmissions = input.transport.map((fuel) => {
    return emissionsOfGasForFuel(fuel, constants, gasType);
  });

  return sum(transportFuelEmissions, zeroOfGas[gasType], {
    name: `Eg=${gasType}`,
    references: [`8.1.1.1 (1)`],
  });
};

export const transportEmissionsForCO2 = (
  input: FuelInputTransformed,
  context: ExecutionContext,
) => {
  return transportEmissionsForGas(input, context, 'CO2');
};

export const transportEmissionsForCH4 = (
  input: FuelInputTransformed,
  context: ExecutionContext,
) => {
  return transportEmissionsForGas(input, context, 'CH4');
};

export const transportEmissionsForN2O = (
  input: FuelInputTransformed,
  context: ExecutionContext,
) => {
  return transportEmissionsForGas(input, context, 'N2O');
};

export const transportEmissionsForCombined = (
  input: FuelInputTransformed,
  context: ExecutionContext,
) => {
  return transportEmissionsForGas(input, context, 'CO2e');
};

export const calculate81TransportFuel = (
  input: HasFuelInputTransformed,
  context: ExecutionContext,
) => {
  const fuelTransportCO2 = transportEmissionsForCO2(input.fuel, context);
  const fuelTransportCH4 = transportEmissionsForCH4(input.fuel, context);
  const fuelTransportN2O = transportEmissionsForN2O(input.fuel, context);

  return {
    fuelTransportCO2,
    fuelTransportCH4,
    fuelTransportN2O,
  };
};
