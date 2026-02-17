import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { GrainsCropTransformed } from '@/calculators/Grains/types/crop.input';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import { energyPerVolume, massPerEnergy } from '@/tools/units';
import Decimal from 'decimal.js-light';

const calculateScope3EmissionsFromFuelTransport = (
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const emissionsRecords = crop.transportFuel.map((fuel) => {
    const qTransQ = fuel.amountLitres;
    const ecTransQ = selectConstant(
      constants.COMMON,
      (value) => energyPerVolume('Fuel', value),
      'FUEL_ENERGYGJ',
      'TRANSPORT',
      fuel.type,
      'ENERGY_CONTENT_FACTOR',
    );
    const efTrans3Q = selectConstant(
      constants.COMMON,
      (value) => massPerEnergy('CO2e', new Decimal(value)),
      'FUEL_ENERGYGJ',
      'TRANSPORT',
      fuel.type,
      'SCOPE3_EF',
    );
    const energyFromFuel = ecTransQ.multiply(qTransQ);
    return efTrans3Q.multiply(energyFromFuel);
  });
  return sum(emissionsRecords).attachContext({
    references: ['15.11.1.1 (551)'],
  });
};

const calculateScope3EmissionsFromFuelStationary = (
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const emissionsRecords = crop.stationaryFuel.map((fuel) => {
    const qTransQ = fuel.amountLitres;
    const ecTransQ = selectConstant(
      constants.COMMON,
      (value) => energyPerVolume('Fuel', value),
      'FUEL_ENERGYGJ',
      'STATIONARY',
      fuel.type,
      'ENERGY_CONTENT_FACTOR',
    );
    const efTrans3Q = selectConstant(
      constants.COMMON,
      (value) => massPerEnergy('CO2e', new Decimal(value)),
      'FUEL_ENERGYGJ',
      'STATIONARY',
      fuel.type,
      'SCOPE3_EF',
    );
    const energyFromFuel = ecTransQ.multiply(qTransQ);
    return efTrans3Q.multiply(energyFromFuel);
  });
  return sum(emissionsRecords).attachContext({
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
  return transportEmissions
    .plus(stationaryEmissions)
    .attachContext({ references: ['15.11.1.1 (547)'] });
};
