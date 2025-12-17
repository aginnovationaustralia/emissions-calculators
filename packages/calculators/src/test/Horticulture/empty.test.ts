import { calculateHorticulture } from '@/calculators/Horticulture/calculator';
import { HorticultureCrop } from '@/types/Horticulture/horticulture.input';
import { HorticultureInput } from '@/types/Horticulture/input';
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
    hfcsRefrigerantLeakage: 0,
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

const emptyHorticultureCrop: HorticultureCrop = {
  type: 'Annual Hort',
  averageYield: 0,
  areaSown: 0,
  ureaApplication: 0,
  nonUreaNitrogen: 0,
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
  refrigerants: [],
};

const emptyInputWithEnterprise: HorticultureInput = {
  state: 'vic',
  crops: [emptyHorticultureCrop],
  electricityRenewable: 0,
  electricityUse: 0,
  vegetation: [],
};

const emptyInput: HorticultureInput = {
  state: 'vic',
  crops: [],
  electricityRenewable: 0,
  electricityUse: 0,
  vegetation: [],
};

describe('Horticulture calculator, empty enterprise', () => {
  const context = testContext('Horticulture');
  const emissions = calculateHorticulture(emptyInputWithEnterprise, context);

  const expectedWithEnterprise = {
    ...expectations,
    intermediate: [
      {
        ...expectedScopes,
        carbonSequestration: { total: 0 },
        intensitiesWithSequestration: {
          cropProducedTonnes: 0,
          tonnesCropExcludingSequestration: 0,
          tonnesCropIncludingSequestration: 0,
        },
        net: {
          total: 0,
        },
      },
    ],
    intensities: [
      {
        cropProducedTonnes: 0,
        tonnesCropExcludingSequestration: 0,
        tonnesCropIncludingSequestration: 0,
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

describe('Horticulture calculator, no enterprise', () => {
  const context = testContext('Horticulture');
  const emissions = calculateHorticulture(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
