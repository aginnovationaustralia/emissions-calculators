/* eslint-disable camelcase */
import clone from 'nanoclone';
import { calculateProcessing } from '../../Processing/calculator';
import { ConstantsForProcessingCalculator } from '../../Processing/constants';
import { ProcessingInput } from '../../types/Processing/input';
import { ProcessingIntermediateOutput } from '../../types/Processing/intermediate.output';
import { ProcessingOutput } from '../../types/Processing/output';
import { ProductUnit } from '../../types/Processing/product.input';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';
import { processingTestData } from './input.data';

const expectedScopes = {
  scope1: {
    fuelCO2: 62.53226,
    fuelCH4: 0.14668,
    fuelN2O: 0.18507,
    hfcsRefrigerantLeakage: 94.166,
    purchasedCO2: 0.0124,
    wastewaterCO2: 13.23963328,
    compostedSolidWasteCO2: 1.84,
    totalCO2: 77.62429328,
    totalCH4: 0.14668,
    totalN2O: 0.18507,
    totalHFCs: 94.166,
    total: 172.12204328,
  },
  scope2: {
    electricity: 1.53,
    total: 1.53,
  },
  scope3: {
    electricity: 0.18,
    fuel: 16.34468,
    solidWasteSentOffsite: 160,
    total: 176.52468,
  },
} as ProcessingIntermediateOutput;

const expectations_1_2_0: ProcessingOutput = {
  ...expectedScopes,
  net: {
    total: 250.17672328,
  },
  intensities: [
    {
      processingIncludingCarbonOffsets: 0.00250177,
      processingExcludingCarbonOffsets: 0.00350177,
      unitsProduced: 100000,
      unitOfProduct: ProductUnit.UNIT,
    },
  ],
  purchasedOffsets: {
    total: 100,
  },
  carbonSequestration: {
    total: 0,
    intermediate: [0],
  },
  intermediate: [expectedScopes as ProcessingIntermediateOutput],
};

describe('Processing calculator, SW WA', () => {
  const context = testContext('Processing');
  const emissions = calculateProcessing(processingTestData, context);

  executeEmissionsSpec(
    emissions,
    expectations_1_2_0 as unknown as KeyValuePairs,
  );
});

describe('Processing calculator (multi activity)', () => {
  const originalActivity = clone(processingTestData.products[0]);
  originalActivity.id = 'aqua-original';
  const activityDoubleSaleweight = clone(originalActivity);
  activityDoubleSaleweight.id = 'aqua-double-saleweight';

  activityDoubleSaleweight.product.amountMadePerYear *= 2;

  const processingDoubleAmountProduced: ProcessingInput = {
    ...processingTestData,
    products: [activityDoubleSaleweight],
  };

  const processingTestDataAllActivities: ProcessingInput = {
    ...processingTestData,
    products: [originalActivity, activityDoubleSaleweight],
  };

  compareEmissionsFrom2Inputs<
    ProcessingInput,
    ProcessingIntermediateOutput,
    'intermediate',
    ProcessingOutput,
    ConstantsForProcessingCalculator
  >(
    'Processing',
    calculateProcessing,
    processingTestData,
    processingDoubleAmountProduced,
    processingTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities[0].unitsProduced).toBeCloseTo(
        secondEmissions.intensities[0].unitsProduced / 2,
      );
    },
    {
      transformIntermediate: (intermediate) => ({
        ...intermediate,
        intensities: [intermediate.intensities],
        carbonSequestration: {
          total: intermediate.carbonSequestration.total,
          intermediate: [intermediate.carbonSequestration.total],
        },
      }),
    },
  );
});
