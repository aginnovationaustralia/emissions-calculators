import { ExecutionContext } from '../../executionContext';

export function getDefaultForAverageStationaryTransport(
  averageStationaryTransport: boolean | undefined,
) {
  return averageStationaryTransport === undefined
    ? true
    : averageStationaryTransport;
}

function getFuelEnergyKl(context: ExecutionContext) {
  const { constants } = context;

  const fuelSD = constants.COMMON.FUEL_ENERGYGJ.STATIONARY.DIESEL;
  const fuelSP = constants.COMMON.FUEL_ENERGYGJ.STATIONARY.PETROL;
  const fuelSL = constants.COMMON.FUEL_ENERGYGJ.STATIONARY.LPG;
  const fuelTD = constants.COMMON.FUEL_ENERGYGJ.TRANSPORT.DIESEL;
  const fuelTP = constants.COMMON.FUEL_ENERGYGJ.TRANSPORT.PETROL;
  const fuelTL = constants.COMMON.FUEL_ENERGYGJ.TRANSPORT.LPG;

  return {
    STATIONARY: {
      DIESEL: {
        ENERGY_CONTENT_FACTOR:
          constants.COMMON.FUEL_ENERGYGJ.STATIONARY.DIESEL
            .ENERGY_CONTENT_FACTOR,
        SCOPE1_EF: {
          CO2: (fuelSD.SCOPE1_EF.CO2 * fuelSD.ENERGY_CONTENT_FACTOR) / 1000,
          CH4: (fuelSD.SCOPE1_EF.CH4 * fuelSD.ENERGY_CONTENT_FACTOR) / 1000,
          N2O: (fuelSD.SCOPE1_EF.N2O * fuelSD.ENERGY_CONTENT_FACTOR) / 1000,
        },
        SCOPE3_EF: constants.COMMON.FUEL_ENERGYGJ.STATIONARY.DIESEL.SCOPE3_EF,
      },
      PETROL: {
        ENERGY_CONTENT_FACTOR:
          constants.COMMON.FUEL_ENERGYGJ.STATIONARY.PETROL
            .ENERGY_CONTENT_FACTOR,
        SCOPE1_EF: {
          CO2: (fuelSP.SCOPE1_EF.CO2 * fuelSP.ENERGY_CONTENT_FACTOR) / 1000,
          CH4: (fuelSP.SCOPE1_EF.CH4 * fuelSP.ENERGY_CONTENT_FACTOR) / 1000,
          N2O: (fuelSP.SCOPE1_EF.N2O * fuelSP.ENERGY_CONTENT_FACTOR) / 1000,
        },
        SCOPE3_EF: constants.COMMON.FUEL_ENERGYGJ.STATIONARY.PETROL.SCOPE3_EF,
      },
      LPG: {
        ENERGY_CONTENT_FACTOR:
          constants.COMMON.FUEL_ENERGYGJ.STATIONARY.LPG.ENERGY_CONTENT_FACTOR,
        SCOPE1_EF: {
          CO2: (fuelSL.SCOPE1_EF.CO2 * fuelSL.ENERGY_CONTENT_FACTOR) / 1000,
          CH4: (fuelSL.SCOPE1_EF.CH4 * fuelSL.ENERGY_CONTENT_FACTOR) / 1000,
          N2O: (fuelSL.SCOPE1_EF.N2O * fuelSL.ENERGY_CONTENT_FACTOR) / 1000,
        },
        SCOPE3_EF: constants.COMMON.FUEL_ENERGYGJ.STATIONARY.LPG.SCOPE3_EF,
      },
    },
    TRANSPORT: {
      DIESEL: {
        ENERGY_CONTENT_FACTOR:
          constants.COMMON.FUEL_ENERGYGJ.TRANSPORT.DIESEL.ENERGY_CONTENT_FACTOR,
        SCOPE1_EF: {
          CO2: (fuelTD.SCOPE1_EF.CO2 * fuelTD.ENERGY_CONTENT_FACTOR) / 1000,
          CH4: (fuelTD.SCOPE1_EF.CH4 * fuelTD.ENERGY_CONTENT_FACTOR) / 1000,
          N2O: (fuelTD.SCOPE1_EF.N2O * fuelTD.ENERGY_CONTENT_FACTOR) / 1000,
        },
        SCOPE3_EF: constants.COMMON.FUEL_ENERGYGJ.TRANSPORT.DIESEL.SCOPE3_EF,
      },
      PETROL: {
        ENERGY_CONTENT_FACTOR:
          constants.COMMON.FUEL_ENERGYGJ.TRANSPORT.PETROL.ENERGY_CONTENT_FACTOR,
        SCOPE1_EF: {
          CO2: (fuelTP.SCOPE1_EF.CO2 * fuelTP.ENERGY_CONTENT_FACTOR) / 1000,
          CH4: (fuelTP.SCOPE1_EF.CH4 * fuelTP.ENERGY_CONTENT_FACTOR) / 1000,
          N2O: (fuelTP.SCOPE1_EF.N2O * fuelTP.ENERGY_CONTENT_FACTOR) / 1000,
        },
        SCOPE3_EF: constants.COMMON.FUEL_ENERGYGJ.TRANSPORT.PETROL.SCOPE3_EF,
      },
      LPG: {
        ENERGY_CONTENT_FACTOR:
          constants.COMMON.FUEL_ENERGYGJ.TRANSPORT.LPG.ENERGY_CONTENT_FACTOR,
        SCOPE1_EF: {
          CO2: (fuelTL.SCOPE1_EF.CO2 * fuelTL.ENERGY_CONTENT_FACTOR) / 1000,
          CH4: (fuelTL.SCOPE1_EF.CH4 * fuelTL.ENERGY_CONTENT_FACTOR) / 1000,
          N2O: (fuelTL.SCOPE1_EF.N2O * fuelTL.ENERGY_CONTENT_FACTOR) / 1000,
        },
        SCOPE3_EF: constants.COMMON.FUEL_ENERGYGJ.TRANSPORT.LPG.SCOPE3_EF,
      },
    },
  };
}

function calculateFuelScope1BaseLPG(
  annualDieselConsumption: number,
  annualPetrolConsumption: number,
  annualLPGConsumption: number,
  type: 'CO2' | 'CH4' | 'N2O',
  context: ExecutionContext,
  averageStationaryTransportOptional?: boolean,
) {
  const averageStationaryTransport = getDefaultForAverageStationaryTransport(
    averageStationaryTransportOptional,
  );
  const fuelEnergyKl = getFuelEnergyKl(context);
  // average is used for grains/horticulture/etc calcs, transport is for
  // sheepbeef/feedlot/etc
  // (fuelF6)
  const dieselEF = averageStationaryTransport
    ? (fuelEnergyKl.STATIONARY.DIESEL.SCOPE1_EF[type] +
        fuelEnergyKl.TRANSPORT.DIESEL.SCOPE1_EF[type]) /
      2
    : fuelEnergyKl.TRANSPORT.DIESEL.SCOPE1_EF[type];

  const petrolEF = averageStationaryTransport
    ? (fuelEnergyKl.STATIONARY.PETROL.SCOPE1_EF[type] +
        fuelEnergyKl.TRANSPORT.PETROL.SCOPE1_EF[type]) /
      2
    : fuelEnergyKl.TRANSPORT.PETROL.SCOPE1_EF[type];

  const lpgEF = averageStationaryTransport
    ? (fuelEnergyKl.STATIONARY.LPG.SCOPE1_EF[type] +
        fuelEnergyKl.TRANSPORT.LPG.SCOPE1_EF[type]) /
      2
    : fuelEnergyKl.TRANSPORT.LPG.SCOPE1_EF[type];

  const dieselKl = annualDieselConsumption / 1000;
  const dieselEmissions = dieselKl * dieselEF;

  const petrolKl = annualPetrolConsumption / 1000;
  const petrolEmissions = petrolKl * petrolEF;

  const lpgKl = annualLPGConsumption / 1000;
  const lpgEmissions = lpgKl * lpgEF;

  return dieselEmissions + petrolEmissions + lpgEmissions;
}

export function calculateFuelScope1BaseLPGStationary(
  annualDieselConsumption: number,
  annualPetrolConsumption: number,
  annualLPGConsumption: number,
  type: 'CO2' | 'CH4' | 'N2O',
  context: ExecutionContext,
) {
  const fuelEnergyKl = getFuelEnergyKl(context);

  // stationary is only for fisheries
  const dieselEF = fuelEnergyKl.STATIONARY.DIESEL.SCOPE1_EF[type];
  const petrolEF = fuelEnergyKl.STATIONARY.PETROL.SCOPE1_EF[type];
  const lpgEF = fuelEnergyKl.STATIONARY.LPG.SCOPE1_EF[type];

  const dieselKl = annualDieselConsumption / 1000;
  const dieselEmissions = dieselKl * dieselEF;

  const petrolKl = annualPetrolConsumption / 1000;
  const petrolEmissions = petrolKl * petrolEF;

  const lpgKl = annualLPGConsumption / 1000;
  const lpgEmissions = lpgKl * lpgEF;

  return dieselEmissions + petrolEmissions + lpgEmissions;
}

export function calculateFuelScope1CO2LPG(
  annualDieselConsumption: number,
  annualPetrolConsumption: number,
  annualLPGConsumption: number,
  context: ExecutionContext,
  averageStationaryTransport?: boolean,
) {
  return calculateFuelScope1BaseLPG(
    annualDieselConsumption,
    annualPetrolConsumption,
    annualLPGConsumption,
    'CO2',
    context,
    averageStationaryTransport,
  );
}

export function calculateFuelScope1N2OLPG(
  annualDieselConsumption: number,
  annualPetrolConsumption: number,
  annualLPGConsumption: number,
  context: ExecutionContext,
  averageStationaryTransport?: boolean,
) {
  return calculateFuelScope1BaseLPG(
    annualDieselConsumption,
    annualPetrolConsumption,
    annualLPGConsumption,
    'N2O',
    context,
    averageStationaryTransport,
  );
}

export function calculateFuelScope1CH4LPG(
  annualDieselConsumption: number,
  annualPetrolConsumption: number,
  annualLPGConsumption: number,
  context: ExecutionContext,
  averageStationaryTransport?: boolean,
) {
  return calculateFuelScope1BaseLPG(
    annualDieselConsumption,
    annualPetrolConsumption,
    annualLPGConsumption,
    'CH4',
    context,
    averageStationaryTransport,
  );
}

export function calculateFuelScope1AllLPG(
  annualDieselConsumption: number,
  annualPetrolConsumption: number,
  annualLPGConsumption: number,
  context: ExecutionContext,
  averageStationaryTransport: boolean = false,
) {
  return {
    CH4: calculateFuelScope1CH4LPG(
      annualDieselConsumption,
      annualPetrolConsumption,
      annualLPGConsumption,
      context,
      averageStationaryTransport,
    ),
    N2O: calculateFuelScope1N2OLPG(
      annualDieselConsumption,
      annualPetrolConsumption,
      annualLPGConsumption,
      context,
      averageStationaryTransport,
    ),
    CO2: calculateFuelScope1CO2LPG(
      annualDieselConsumption,
      annualPetrolConsumption,
      annualLPGConsumption,
      context,
      averageStationaryTransport,
    ),
  };
}
