import { validateCalculatorInput } from '@/calculators';
import { calculateBeef } from '@/calculators/Beef/calculator';
import { LivestockSourceLocations } from '@/constants/types';
import {
  BeefClass,
  BeefInput,
  BeefInputSchema,
  BeefOutput,
  BeefVegetation,
  CustomisedFertiliser,
} from '@/types';
import {
  FireSeasons,
  Fuels,
  Patchinesses,
  RainfallRegion,
  RainfallZones,
  SoilType,
  TreeType,
  VegetationClass,
} from '@/types/enums';
import XLSX from 'xlsx-populate';
import { testContext } from '../common/context';
import { traverseExpectations } from '../common/emissions';
import {
  emptyOrNumber,
  getWorkbook,
  mapInput,
  mapInputRegion,
  numberInput,
  stringInput,
} from '../common/sheets';

const mapBurningFuelSize = mapInput<(typeof Fuels)[number]>({
  fine: 'Fine',
  coarse: 'Course',
});

const mapBurningSeason = mapInput<(typeof FireSeasons)[number]>({
  'early dry season': 'Early Dry Season',
  'late dry season': 'Late Dry Season',
});

const mapBurningPatchiness = mapInput<(typeof Patchinesses)[number]>({
  low: 'Low',
  high: 'High',
});

const mapBurningRainfallZone = mapInput<(typeof RainfallZones)[number]>({
  low: 'Low',
  high: 'High',
});

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

const getBeefClass = (range: XLSX.Range): BeefClass => {
  return {
    spring: {
      head: emptyOrNumber(range.cell(0, 0)) ?? 0,
      liveweight: emptyOrNumber(range.cell(16, 0)) ?? 0,
      liveweightGain: emptyOrNumber(range.cell(22, 0)) ?? 0,
    },
    summer: {
      head: emptyOrNumber(range.cell(1, 0)) ?? 0,
      liveweight: emptyOrNumber(range.cell(17, 0)) ?? 0,
      liveweightGain: emptyOrNumber(range.cell(23, 0)) ?? 0,
    },
    autumn: {
      head: emptyOrNumber(range.cell(2, 0)) ?? 0,
      liveweight: emptyOrNumber(range.cell(18, 0)) ?? 0,
      liveweightGain: emptyOrNumber(range.cell(24, 0)) ?? 0,
    },
    winter: {
      head: emptyOrNumber(range.cell(3, 0)) ?? 0,
      liveweight: emptyOrNumber(range.cell(19, 0)) ?? 0,
      liveweightGain: emptyOrNumber(range.cell(25, 0)) ?? 0,
    },
    purchases: [
      {
        head: emptyOrNumber(range.cell(41, 0)) ?? 0,
        purchaseWeight: emptyOrNumber(range.cell(42, 0)) ?? 0,
        // @ts-expect-error - this is a string input
        purchaseSource: stringInput(
          range.cell(45, 0),
        ) as unknown as LivestockSourceLocations,
      },
    ],
    headSold: emptyOrNumber(range.cell(49, 0)) ?? 0,
    saleWeight: emptyOrNumber(range.cell(50, 0)) ?? 0,
  };
};

const emptyBeefClass: BeefClass = {
  summer: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  autumn: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  winter: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  spring: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  headSold: 0,
  saleWeight: 0,
  purchases: [],
};

export const getCropVegetation = (
  details: XLSX.Range,
  allocations: XLSX.Range,
): BeefVegetation => {
  return {
    allocationToBeef: [numberInput(allocations.cell(0, 0))],
    vegetation: {
      region: stringInput(details.cell(0, 0)) as RainfallRegion,
      treeSpecies: stringInput(details.cell(1, 0)) as TreeType,
      soil: stringInput(details.cell(2, 0)) as SoilType,
      area: numberInput(details.cell(3, 0)),
      age: numberInput(details.cell(4, 0)),
    },
  };
};

const getBeefVegetations = (sheet: XLSX.Sheet): BeefVegetation[] => {
  return [
    getCropVegetation(sheet.range('D3:D7'), sheet.range('D9:D10')),
    getCropVegetation(sheet.range('D13:D17'), sheet.range('D19:D20')),
    getCropVegetation(sheet.range('D23:D27'), sheet.range('D29:D30')),
    getCropVegetation(sheet.range('D33:D37'), sheet.range('D39:D40')),
  ];
};

const getCalculatorInput = (workbook: XLSX.Workbook): BeefInput => {
  const sheetInputBeef = workbook.sheet('Data input - beef');
  const beef = (address: string) => sheetInputBeef.cell(address);

  const sheetInputVegetation = workbook.sheet('Data input - vegetation');

  const input: BeefInput = {
    state: mapInputRegion(beef('D6')),
    northOfTropicOfCapricorn: beef('M4').value() === 'Yes',
    rainfallAbove600: beef('M6').value() === 'Yes',
    beef: [
      {
        classes: {
          bullsGt1: getBeefClass(sheetInputBeef.range('D13:D63')),
          bullsGt1Traded: emptyBeefClass,
          cowsGt2: getBeefClass(sheetInputBeef.range('H13:H63')),
          cowsGt2Traded: emptyBeefClass,
          heifers1To2: getBeefClass(sheetInputBeef.range('J13:J63')),
          heifers1To2Traded: emptyBeefClass,
          heifersLt1: getBeefClass(sheetInputBeef.range('I13:I63')),
          heifersLt1Traded: emptyBeefClass,
          steersLt1: getBeefClass(sheetInputBeef.range('E13:E63')),
          steersLt1Traded: getBeefClass(sheetInputBeef.range('N13:N63')),
          steers1To2: getBeefClass(sheetInputBeef.range('F13:F63')),
          steers1To2Traded: getBeefClass(sheetInputBeef.range('M13:M63')),
          heifersGt2: getBeefClass(sheetInputBeef.range('K13:K63')),
          heifersGt2Traded: emptyBeefClass,
          steersGt2: getBeefClass(sheetInputBeef.range('G13:G63')),
          steersGt2Traded: getBeefClass(sheetInputBeef.range('L13:L63')),
        },
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
          pastureDryland: numberInput(beef('D84')),
          cropsDryland: numberInput(beef('D85')),
          pastureIrrigated: numberInput(beef('F84')),
          cropsIrrigated: numberInput(beef('F85')),
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
          emptyOrNumber(beef('D94')),
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
    burning: [
      {
        allocationToBeef: [1],
        burning: {
          rainfallZone: mapBurningRainfallZone(beef('D106')),
          vegetation: stringInput(beef('D107')) as unknown as VegetationClass,
          patchiness: mapBurningPatchiness(beef('D108')),
          fuel: mapBurningFuelSize(beef('D109')),
          season: mapBurningSeason(beef('I106')),
          yearsSinceLastFire: numberInput(beef('I107')),
          fireScarArea: numberInput(beef('I108')),
        },
      },
    ],
    vegetation: getBeefVegetations(sheetInputVegetation),
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
      fuelCO2: summary('C4'),
      limeCO2: summary('C5'),
      ureaCO2: summary('C6'),
      fuelCH4: summary('C7'),
      entericCH4: summary('C8'),
      manureManagementCH4: summary('C9'),
      savannahBurningCH4: summary('C10'),
      fertiliserN2O: summary('C11'),
      urineAndDungN2O: summary('C12'),
      atmosphericDepositionN2O: summary('C13'),
      leachingAndRunoffN2O: summary('C14'),
      savannahBurningN2O: summary('C15'),
      fuelN2O: summary('C16'),
      totalCO2: summary('G4'),
      totalCH4: summary('G5'),
      totalN2O: summary('G6'),
      total: summary('E17'),
    },
    scope2: {
      electricity: summary('C20'),
      total: summary('C21'),
    },
    scope3: {
      fertiliser: summary('C24'),
      purchasedMineralSupplementation: summary('C25'),
      purchasedFeed: summary('C26'),
      herbicide: summary('C27'),
      electricity: summary('C28'),
      fuel: summary('C29'),
      lime: summary('C30'),
      purchasedLivestock: summary('C31'),
      total: summary('C32'),
    },
    intensities: {
      liveweightBeefProducedKg: beef('O64') + beef('P64'),
      beefExcludingSequestration: summary('C44'),
      beefIncludingSequestration: summary('C45'),
    },
    carbonSequestration: {
      total: -summary('C35'),
    },
  } as const;

  const output: BeefOutput = {
    ...expectedScopes,
    net: {
      total: summary('E37'),
      beef: summary('C37'),
    },
    intermediate: [
      { ...expectedScopes, id: 'beef-0', net: { total: summary('E37') } },
    ],
  };

  return output;
};

describe('Compare beef calculator to spreadsheet', () => {
  test('should match spreadsheet', async () => {
    const workbook = await getWorkbook(
      './src/test/sheets/comparison/SB-GAFv2.6_Seasonal.xlsx',
    );
    const input = getCalculatorInput(workbook);
    const validatedInput = validateCalculatorInput(BeefInputSchema, input);
    // console.dir(validatedInput, { depth: null });
    const expectedOutput = getExpectedOutput(workbook);
    const calculatorData = calculateBeef(
      validatedInput,
      testContext('Beef', workbook),
    );
    // console.dir(calculatorData, { depth: null });
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
