/* eslint-disable camelcase */
import clone from 'nanoclone';
import { calculateAquaculture } from '../../Aquaculture/calculator';
import { AquacultureOutput } from '../../types/Aquaculture/output';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';
import { aquacultureTestData } from './input.data';

const expectedScopes = {
  scope1: {
    fuelCO2: 9.5807488,
    fuelCH4: 0.1190384,
    fuelN2O: 0.31785678,
    hfcsRefrigerantLeakage: 94.166,
    wasteWaterCO2: 35.30568874,
    compostedSolidWasteCO2: 0.2852,
    totalCO2: 45.1716375,
    totalCH4: 0.1190384,
    totalN2O: 0.3178568,
    totalHFCs: 94.166,
    total: 139.77453273,
  },
  scope2: {
    electricity: 0.765,
    total: 0.765,
  },
  scope3: {
    electricity: 0.09,
    fuel: 2.5680914,
    purchasedBait: 67.2,
    inboundFreight: 208800.8,
    outboundFreight: 1849.2115,
    commercialFlights: 1616.0,
    solidWasteSentOffsite: 8,
    total: 212343.8695914,
  },
  intensities: {
    aquacultureIncludingCarbonOffsets: 37925.7873436,
    aquacultureExcludingCarbonOffsets: 37943.64448645,
    totalHarvestWeightKg: 5600,
  },
  carbonSequestration: {
    total: 0,
    intermediate: [0],
  },
  net: {
    total: 212384.40912413,
  },
};

const expectations: AquacultureOutput = {
  ...expectedScopes,

  purchasedOffsets: {
    total: 100,
  },

  intermediate: [
    { ...expectedScopes, id: '0', carbonSequestration: { total: 0 } },
  ],
};

describe('Aquaculture calculator, SW WA', () => {
  const context = testContext('Aquaculture');
  const emissions = calculateAquaculture(aquacultureTestData, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});

describe('Aquaculture calculator (multi activity)', () => {
  const originalActivity = clone(aquacultureTestData.enterprises[0]);
  originalActivity.id = 'aqua-original';
  const activityDoubleSaleweight = clone(originalActivity);
  activityDoubleSaleweight.id = 'aqua-double-saleweight';

  activityDoubleSaleweight.totalHarvestKg *= 2;

  const aquaDoubleSaleweight = {
    ...aquacultureTestData,
    enterprises: [activityDoubleSaleweight],
    vegetation: [],
  };

  const aquacultureTestDataAllActivities = {
    ...aquacultureTestData,
    enterprises: [originalActivity, activityDoubleSaleweight],
  };

  compareEmissionsFrom2Inputs(
    'Aquaculture',
    calculateAquaculture,
    aquacultureTestData,
    aquaDoubleSaleweight,
    aquacultureTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.totalHarvestWeightKg).toBeCloseTo(
        secondEmissions.intensities.totalHarvestWeightKg / 2,
      );
    },
  );
});
