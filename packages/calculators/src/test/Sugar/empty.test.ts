import { calculateSugar } from '@/calculators/Sugar/calculator';
import { SugarInput } from '@/types/Sugar/input';
import { SugarOutput } from '@/types/Sugar/output';
import { SugarCrop } from '@/types/Sugar/sugar.input';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';

const expectedScopes = {
  scope1: {
    fuelCO2: 0,
    fuelCH4: 0,
    fuelN2O: 0,
    ureaCO2: 0,
    limeCO2: 0,
    fertiliserN2O: 0,
    atmosphericDepositionN2O: 0,
    leachingAndRunoffN2O: 0,
    cropResidueN2O: 0,
    fieldBurningN2O: 0,
    fieldBurningCH4: 0,
    totalCO2: 0,
    totalCH4: 0,
    totalN2O: 0,
    total: 0,
  },
  scope2: {
    electricity: 0,
    total: 0,
  },
  scope3: {
    fertiliser: 0,
    herbicide: 0,
    electricity: 0,
    fuel: 0,
    lime: 0,
    total: 0,
  },
};

const expectations: SugarOutput = {
  ...expectedScopes,
  carbonSequestration: {
    total: 0,
  },
  net: {
    total: 0,
    crops: [],
  },
  intensities: [],
  intermediate: [],
};

const emptySugarCrop: SugarCrop = {
  state: 'vic',
  productionSystem: 'Non-irrigated crop',
  averageCaneYield: 0,
  areaSown: 0,
  nonUreaNitrogen: 0,
  ureaApplication: 0,
  ureaAmmoniumNitrate: 0,
  phosphorusApplication: 0,
  potassiumApplication: 0,
  sulfurApplication: 0,
  rainfallAbove600: false,
  fractionOfAnnualCropBurnt: 0,
  herbicideUse: 0,
  glyphosateOtherHerbicideUse: 0,
  electricityAllocation: 0,
  limestone: 0,
  limestoneFraction: 0,
  dieselUse: 0,
  petrolUse: 0,
  lpg: 0,
};

const emptyInputWithEnterprise: SugarInput = {
  state: 'vic',
  crops: [emptySugarCrop],
  electricityRenewable: 0,
  electricityUse: 0,
  vegetation: [],
};

const emptyInput: SugarInput = {
  state: 'vic',
  crops: [],
  electricityRenewable: 0,
  electricityUse: 0,
  vegetation: [],
};

describe('Sugar calculator, empty enterprise', () => {
  const context = testContext('Sugar');
  const emissions = calculateSugar(emptyInputWithEnterprise, context);

  const expectedWithEnterprise: SugarOutput = {
    ...expectations,
    intermediate: [
      {
        ...expectedScopes,
        carbonSequestration: { total: 0 },
        id: 'sugar-0',
        intensities: {
          sugarProducedKg: 0,
          sugarExcludingSequestration: 0,
          sugarIncludingSequestration: 0,
        },
        net: {
          total: 0,
        },
      },
    ],
    intensities: [
      {
        sugarProducedKg: 0,
        sugarExcludingSequestration: 0,
        sugarIncludingSequestration: 0,
      },
    ],
    net: {
      total: 0,
      crops: [0],
    },
  };

  executeEmissionsSpec(
    emissions,
    expectedWithEnterprise as unknown as KeyValuePairs,
  );
});

describe('Sugar calculator, no enterprise', () => {
  const context = testContext('Sugar');
  const emissions = calculateSugar(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
