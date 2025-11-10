import { calculateProcessing } from '@/calculators/Processing/calculator';
import { ProcessingInput } from '@/types/Processing/input';
import { ProductProcessingInput } from '@/types/Processing/processing.input';
import {
  ProcessingProduct,
  ProductUnit,
} from '@/types/Processing/product.input';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';

const expectedScopes = {
  scope1: {
    fuelCO2: 0,
    fuelCH4: 0,
    fuelN2O: 0,
    hfcsRefrigerantLeakage: 0,
    purchasedCO2: 0,
    wastewaterCO2: 0,
    compostedSolidWasteCO2: 0,
    totalCO2: 0,
    totalCH4: 0,
    totalN2O: 0,
    totalHFCs: 0,
    total: 0,
  },
  scope2: {
    electricity: 0,
    total: 0,
  },
  scope3: {
    electricity: 0,
    fuel: 0,
    total: 0,
  },
};

const expectations = {
  ...expectedScopes,
  carbonSequestration: {
    total: 0,
    intermediate: [],
  },
  purchasedOffsets: {
    total: 0,
  },
  net: {
    total: 0,
  },
  intensities: [],
  intermediate: [],
};

const emptyProduct: ProcessingProduct = {
  unit: ProductUnit.UNIT,
  amountMadePerYear: 0,
};

const emptyProductProcessing: ProductProcessingInput = {
  product: emptyProduct,
  electricityRenewable: 0,
  electricityUse: 0,
  electricitySource: 'State Grid',
  fuel: {
    transportFuel: [],
    stationaryFuel: [],
    naturalGas: 0,
  },
  refrigerants: [],
  fluidWaste: [],
  solidWaste: {
    sentOffsiteTonnes: 0,
    onsiteCompostingTonnes: 0,
  },
  purchasedCO2: 0,
};

const emptyInputWithEnterprise: ProcessingInput = {
  state: 'vic',
  products: [emptyProductProcessing],
};

const emptyInput: ProcessingInput = {
  state: 'vic',
  products: [],
};

describe('Processing calculator, empty enterprise', () => {
  const context = testContext('Processing');
  const emissions = calculateProcessing(emptyInputWithEnterprise, context);

  const expectedWithEnterprise = {
    ...expectations,
    intermediate: [
      {
        ...expectedScopes,
        carbonSequestration: { total: 0 },
        intensities: {
          unitsProduced: 0,
          unitOfProduct: 'unit',
          processingExcludingCarbonOffsets: 0,
          processingIncludingCarbonOffsets: 0,
        },
        net: {
          total: 0,
        },
      },
    ],
    intensities: [
      {
        unitsProduced: 0,
        unitOfProduct: 'unit',
        processingExcludingCarbonOffsets: 0,
        processingIncludingCarbonOffsets: 0,
      },
    ],
  };

  executeEmissionsSpec(
    emissions,
    expectedWithEnterprise as unknown as KeyValuePairs,
  );
});

describe('Processing calculator, no enterprise', () => {
  const context = testContext('Processing');
  const emissions = calculateProcessing(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
