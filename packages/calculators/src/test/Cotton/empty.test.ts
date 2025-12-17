import { calculateCotton } from '@/calculators/Cotton/calculator';
import { CottonCrop } from '@/types/Cotton/cotton.input';
import { CottonInput } from '@/types/Cotton/input';
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
    total: 0,
  },
};

const expectations = {
  ...expectedScopes,
  carbonSequestration: {
    total: 0,
    intermediate: [],
  },
  net: {
    total: 0,
    crops: [],
  },
  intensities: [],
  intermediate: [],
};

const emptyCottonCrop: CottonCrop = {
  state: 'vic',
  averageCottonYield: 0,
  areaSown: 0,
  averageWeightPerBaleKg: 0,
  cottonLintPerBaleKg: 0,
  cottonSeedPerBaleKg: 0,
  wastePerBaleKg: 0,
  ureaApplication: 0,
  otherFertiliserApplication: 0,
  nonUreaNitrogen: 0,
  ureaAmmoniumNitrate: 0,
  phosphorusApplication: 0,
  potassiumApplication: 0,
  sulfurApplication: 0,
  singleSuperPhosphate: 0,
  rainfallAbove600: false,
  herbicideUse: 0,
  glyphosateOtherHerbicideUse: 0,
  electricityAllocation: 0,
  limestone: 0,
  limestoneFraction: 0,
  dieselUse: 0,
  petrolUse: 0,
  lpg: 0,
};

const emptyInputWithEnterprise: CottonInput = {
  state: 'vic',
  crops: [emptyCottonCrop],
  electricityRenewable: 0,
  electricityUse: 0,
  vegetation: [],
};

const emptyInput: CottonInput = {
  state: 'vic',
  crops: [],
  electricityRenewable: 0,
  electricityUse: 0,
  vegetation: [],
};

describe('Cotton calculator, empty enterprise', () => {
  const context = testContext('Cotton');
  const emissions = calculateCotton(emptyInputWithEnterprise, context);

  const expectedWithEnterprise = {
    ...expectations,
    intermediate: [
      {
        ...expectedScopes,
        carbonSequestration: { total: 0 },
        intensities: {
          cottonYieldProducedTonnes: 0,
          balesProduced: 0,
          lintProducedTonnes: 0,
          seedProducedTonnes: 0,
          tonnesCropExcludingSequestration: 0,
          tonnesCropIncludingSequestration: 0,
          balesExcludingSequestration: 0,
          balesIncludingSequestration: 0,
          lintIncludingSequestration: 0,
          lintExcludingSequestration: 0,
          seedIncludingSequestration: 0,
          seedExcludingSequestration: 0,
          lintEconomicAllocation: 0,
          seedEconomicAllocation: 0,
        },
        net: {
          total: 0,
        },
      },
    ],
    intensities: [
      {
        cottonYieldProducedTonnes: 0,
        balesProduced: 0,
        lintProducedTonnes: 0,
        seedProducedTonnes: 0,
        tonnesCropExcludingSequestration: 0,
        tonnesCropIncludingSequestration: 0,
        balesExcludingSequestration: 0,
        balesIncludingSequestration: 0,
        lintIncludingSequestration: 0,
        lintExcludingSequestration: 0,
        seedIncludingSequestration: 0,
        seedExcludingSequestration: 0,
        lintEconomicAllocation: 0,
        seedEconomicAllocation: 0,
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

describe('Cotton calculator, no enterprise', () => {
  const context = testContext('Cotton');
  const emissions = calculateCotton(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
