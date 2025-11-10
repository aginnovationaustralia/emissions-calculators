/* eslint-disable camelcase */
import { VineyardInput } from '@/types/Vineyard/input';
import { VineyardIntermediateOutput } from '@/types/Vineyard/intermediate.output';
import { VineyardOutput } from '@/types/Vineyard/output';
import clone from 'nanoclone';
import { calculateVineyard } from '../../calculators/Vineyard/calculator';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';
import { vineyardTestData } from './input.data';

const expectedScopes = {
  scope1: {
    fuelCO2: 0.79936801,
    limeCO2: 55.913,
    ureaCO2: 1.8975,
    wasteWaterCO2: 10.59555993,
    compostedSolidWasteCO2: 0.184,
    fertiliserN2O: 1.78731143,
    atmosphericDepositionN2O: 0.19660426,
    cropResidueN2O: 0.19907418,
    leachingAndRunoffN2O: 0.0,
    fuelN2O: 0.59026636,
    fuelCH4: 0.27876151,
    totalCH4: 0.27876151,
    totalCO2: 69.38942794,
    totalN2O: 2.77325622,
    total: 72.44144568,
  },
  scope2: {
    electricity: 0.161,
    total: 0.161,
  },
  scope3: {
    fertiliser: 5.06636667,
    herbicide: 0.19275,
    electricity: 0.035,
    fuel: 0.20129371,
    lime: 4.6449,
    commercialFlights: 606,
    inboundFreight: 1597.5,
    solidWasteSentOffsite: 16,
    outboundFreight: 3669.8875,
    total: 5899.52781038,
  },
  carbonSequestration: 95.9705,
};

const expectations: VineyardOutput = {
  ...expectedScopes,
  net: {
    vineyards: [5876.15975605],
    total: 5876.15975605,
  },
  intensities: [
    {
      vineyardsExcludingSequestration: 497.6775213379037,
      vineyardsIncludingSequestration: 489.67997967,
      cropProducedKg: 12,
    },
  ],
  carbonSequestration: {
    total: 95.9705,
    intermediate: [95.9705],
  },
  intermediate: [expectedScopes as VineyardIntermediateOutput],
};

describe('Vineyard calculator, SA', () => {
  const context = testContext('Vineyard');
  const emissions = calculateVineyard(vineyardTestData, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});

describe('Vineyard calculator (multi activity)', () => {
  const originalActivity = clone(vineyardTestData.vineyards[0]);
  originalActivity.id = 'vineyard-original';
  const activityDoubleYield = clone(originalActivity);
  activityDoubleYield.id = 'vineyard-double-yield';

  activityDoubleYield.averageYield *= 2;

  const vineyardDoubleYield: VineyardInput = {
    ...vineyardTestData,
    vineyards: [activityDoubleYield],
    vegetation: [],
  };

  const vineyardTestDataAllActivities: VineyardInput = {
    ...vineyardTestData,
    vineyards: [originalActivity, activityDoubleYield],
  };

  compareEmissionsFrom2Inputs(
    'Vineyard',
    calculateVineyard,
    vineyardTestData,
    vineyardDoubleYield,
    vineyardTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities[0].cropProducedKg).toBeCloseTo(
        secondEmissions.intensities[0].cropProducedKg / 2,
        7,
      );
    },
  );
});
