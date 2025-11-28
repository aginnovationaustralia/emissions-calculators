import { calculateBeef, validateCalculatorInput } from '@/calculators';
import { entriesFromObject } from '@/calculators/common/tools/object';
import {
  BeefInput,
  BeefInputSchema,
  BeefOutput,
  CropType,
  CustomisedFertiliser,
  ProductionSystem,
} from '@/types';
import XLSX, { Cell } from 'xlsx-populate';
import { traverseExpectations } from '../common/emissions';
import {
  emptyOrNumber,
  getWorkbook,
  mapInputRegion,
  numberInput,
  stringInput,
} from '../common/sheets';

const mapCropTypeFromNumber = (input: Cell): CropType => {
  const numberValue = numberInput(input);

  const lookup: Record<
    Exclude<CropType, 'Rice' | 'Sugar Cane' | 'Cotton'>,
    number
  > = {
    Wheat: 1,
    Barley: 2,
    Maize: 3,
    Oats: 4,
    Sorghum: 5,
    Triticale: 6,
    'Other Cereals': 7,
    Pulses: 8,
    'Tuber and Roots': 9,
    Peanuts: 10,
    Hops: 11,
    Oilseeds: 12,
    'Forage Crops': 13,
    Lucerne: 14,
    'Other legume': 15,
    'Annual grass': 16,
    'Grass clover mixture': 17,
    'Perennial pasture': 18,
  };
  const match = entriesFromObject(lookup).find(([_k, v]) => v === numberValue);

  if (match) {
    return match[0];
  }

  throw new Error(
    `Cell address ${input.address()} is not a valid crop type: ${numberValue}`,
  );
};

const mapProductionSystemFromNumber = (input: Cell): ProductionSystem => {
  const numberValue = numberInput(input);
  const lookup: Record<ProductionSystem, number> = {
    'Non-irrigated crop': 1,
    'Irrigated crop': 2,
    'Sugar cane': 3,
    Cotton: 4,
    Horticulture: 5,
  };
  const match = entriesFromObject(lookup).find(([_k, v]) => v === numberValue);
  if (match) {
    return match[0];
  }
  throw new Error(
    `Cell address ${input.address()} is not a valid production system: ${numberValue}`,
  );
};

const getElectricity = (
  annualElectricityUse: number | null,
  percentRenewable: number | null,
) => {
  const electricitySource =
    percentRenewable && percentRenewable === 1 ? 'Renewable' : 'State Grid';

  return {
    electricitySource,
    electricityRenewable: percentRenewable ?? 0 * (annualElectricityUse ?? 0),
    electricityUse: annualElectricityUse ?? 0,
  } as const;
};

const getCalculatorInput = (workbook: XLSX.Workbook): BeefInput => {
  const sheetInputBeef = workbook.sheet('Data input - beef');
  const beef = (address: string) => sheetInputBeef.cell(address);

  const sheetInputVegetation = workbook.sheet('Data input - vegetation');

  const input: BeefInput = {
    state: mapInputRegion(beef('D6')),
    northOfTropicOfCapricorn: beef('M4').value() === 'Yes',
    rainfallAbove600: beef('M5').value() === 'Yes',
    beef: [
      {
        classes: {},
        cowsCalving: {
          spring: numberInput(beef('D71')),
          summer: numberInput(beef('D72')),
          autumn: numberInput(beef('D73')),
          winter: numberInput(beef('D74')),
        },
        mineralSupplementation: {
          mineralBlockUrea: numberInput(beef('D77')),
          weanerBlockUrea: numberInput(beef('D78')),
          drySeasonMixUrea: numberInput(beef('D79')),
          mineralBlock: numberInput(beef('F77')),
          weanerBlock: numberInput(beef('F78')),
          drySeasonMix: numberInput(beef('F79')),
        },
        fertiliser: {
          pastureDryland: numberInput(beef('D85')),
          cropsDryland: numberInput(beef('D86')),
          pastureIrrigated: numberInput(beef('F85')),
          cropsIrrigated: numberInput(beef('F86')),
          otherFertilisers: [
            {
              otherType: stringInput(beef('C86')) as CustomisedFertiliser,
              otherDryland: numberInput(beef('D86')),
              otherIrrigated: numberInput(beef('F86')),
            },
          ],
          singleSuperphosphate: numberInput(beef('D88')),
        },
        limestone: numberInput(beef('D89')),
        limestoneFraction: numberInput(beef('D90')),
        ...getElectricity(
          emptyOrNumber(beef('D98')),
          emptyOrNumber(beef('D92')),
        ),
        diesel: numberInput(beef('D95')),
        petrol: numberInput(beef('D96')),
        lpg: numberInput(beef('D97')),
        grainFeed: numberInput(beef('D99')),
        cottonseedFeed: numberInput(beef('D100')),
        hayFeed: numberInput(beef('D101')),
        herbicide: numberInput(beef('D102')),
        herbicideOther: numberInput(beef('D103')),
      },
    ],
    burning: [],
    vegetation: [],
  };
  return input;
};

const getExpectedOutput = (workbook: XLSX.Workbook): BeefOutput => {
  const summarySheet = workbook.sheet('Data summary');
  const summary = (address: string) => numberInput(summarySheet.cell(address));

  const sheetInputBeef = workbook.sheet('Data input - beef');
  const beef = (address: string) => numberInput(sheetInputBeef.cell(address));

  const expectedScopes = {
    scope1: {
      fuelCO2: 0,
      fuelCH4: 0,
      fuelN2O: 0,
      ureaCO2: 0,
      limeCO2: 0,
      fertiliserN2O: 0,
      entericCH4: 0,
      manureManagementCH4: 0,
      urineAndDungN2O: 0,
      atmosphericDepositionN2O: 0,
      leachingAndRunoffN2O: 0,
      savannahBurningN2O: 0,
      savannahBurningCH4: 0,
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
      purchasedMineralSupplementation: 0,
      purchasedFeed: 0,
      herbicide: 0,
      electricity: 0,
      fuel: 0,
      lime: 0,
      purchasedLivestock: 0,
      total: 0,
    },
  };

  const output: BeefOutput = {
    ...expectedScopes,
    carbonSequestration: {
      total: 0,
    },
    net: {
      total: 0,
      beef: 0,
    },
    intensities: {
      liveweightBeefProducedKg: 0,
      beefExcludingSequestration: 0,
      beefIncludingSequestration: 0,
    },
    intermediate: [],
  };

  return output;
};

describe('Compare grains calculator to spreadsheet', () => {
  test('should match spreadsheet', async () => {
    const workbook = await getWorkbook(
      './src/test/sheets/comparison/SB-GAFv2.6_Seasonal.xlsx',
    );
    const input = getCalculatorInput(workbook);
    const validatedInput = validateCalculatorInput(BeefInputSchema, input);
    const expectedOutput = getExpectedOutput(workbook);
    const calculatorData = calculateBeef(validatedInput);
    const tests = traverseExpectations(expectedOutput, calculatorData);
    tests.forEach((test) => {
      try {
        test.test();
      } catch (e: unknown) {
        console.error(`Error in test ${test.path}: ${e}`);
        throw e;
      }
    });
  });
});
