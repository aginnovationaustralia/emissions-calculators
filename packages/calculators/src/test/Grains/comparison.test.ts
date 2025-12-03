import { calculateGrains, validateCalculatorInput } from '@/calculators';
import { entriesFromObject } from '@/calculators/common/tools/object';
import {
  CropType,
  GrainsInput,
  GrainsInputSchema,
  GrainsIntermediateOutput,
  GrainsOutput,
  ProductionSystem,
} from '@/types';
import XLSX, { Cell } from 'xlsx-populate';
import { traverseExpectations } from '../common/emissions';
import {
  getCropVegetations,
  getWorkbook,
  mapInputRegionFromNumber,
  numberInput,
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

const getCalculatorInput = (workbook: XLSX.Workbook): GrainsInput => {
  const sheetInputCrops = workbook.sheet('Data input - crops');
  const crops = (address: string) => sheetInputCrops.cell(address);

  const sheetInputVegetation = workbook.sheet('Data input - vegetation');

  const input: GrainsInput = {
    state: mapInputRegionFromNumber(crops('C2')),
    crops: [
      {
        type: mapCropTypeFromNumber(crops('C3')),
        state: mapInputRegionFromNumber(crops('C2')),
        productionSystem: mapProductionSystemFromNumber(crops('C4')),
        rainfallAbove600: crops('C5').value() === 'Yes',
        averageGrainYield: numberInput(crops('C7')),
        areaSown: numberInput(crops('C8')),
        nonUreaNitrogen: numberInput(crops('C9')),
        phosphorusApplication: numberInput(crops('C10')),
        potassiumApplication: numberInput(crops('C11')),
        sulfurApplication: numberInput(crops('C12')),
        ureaApplication: numberInput(crops('C13')),
        ureaAmmoniumNitrate: numberInput(crops('C14')),
        limestone: numberInput(crops('C15')),
        limestoneFraction: numberInput(crops('C16')),
        fractionOfAnnualCropBurnt: numberInput(crops('C17')),
        dieselUse: numberInput(crops('C18')),
        petrolUse: numberInput(crops('C19')),
        lpg: numberInput(crops('C20')),
        electricityAllocation: 1,
        herbicideUse: numberInput(crops('C24')),
        glyphosateOtherHerbicideUse: numberInput(crops('C25')),
      },
    ],
    electricityUse: numberInput(crops('C21')),
    electricityRenewable: numberInput(crops('C22')),
    vegetation: getCropVegetations(sheetInputVegetation),
  };
  return input;
};

const getExpectedOutput = (workbook: XLSX.Workbook): GrainsOutput => {
  const summarySheet = workbook.sheet('Data summary');
  const summary = (address: string) => numberInput(summarySheet.cell(address));

  const sheetInputCrops = workbook.sheet('Data input - crops');
  const crops = (address: string) => numberInput(sheetInputCrops.cell(address));

  const expectedIntermediate: Omit<GrainsIntermediateOutput, 'id'> = {
    scope1: {
      fuelCO2: summary('C5'),
      limeCO2: summary('C6'),
      ureaCO2: summary('C7'),
      fieldBurningCH4: summary('C8'),
      fuelCH4: summary('C9'),
      fertiliserN2O: summary('C10'),
      atmosphericDepositionN2O: summary('C11'),
      fieldBurningN2O: summary('C12'),
      cropResidueN2O: summary('C13'),
      leachingAndRunoffN2O: summary('C14'),
      fuelN2O: summary('C15'),
      totalCO2: summary('J5'),
      totalCH4: summary('J6'),
      totalN2O: summary('J7'),
      total: summary('C16'),
    },
    scope2: {
      electricity: summary('C19'),
      total: summary('C20'),
    },
    scope3: {
      fertiliser: summary('C23'),
      herbicide: summary('C24'),
      electricity: summary('C25'),
      fuel: summary('C26'),
      lime: summary('C27'),
      total: summary('C28'),
    },
    carbonSequestration: {
      total: -summary('C31'),
    },
    intensitiesWithSequestration: {
      grainProducedTonnes: crops('C7') * crops('C8'),
      grainsExcludingSequestration: summary('C36'),
      grainsIncludingSequestration: summary('C37'),
    },
    net: {
      total: summary('C33'),
    },
  };
  const output: GrainsOutput = {
    ...expectedIntermediate,
    intermediate: [
      {
        ...expectedIntermediate,
        id: '0',
      },
    ],
    intensities: [
      expectedIntermediate.intensitiesWithSequestration
        .grainsIncludingSequestration,
    ],
    intensitiesWithSequestration: [
      expectedIntermediate.intensitiesWithSequestration,
    ],
    net: {
      total: expectedIntermediate.net.total,
      crops: [expectedIntermediate.net.total],
    },
  };

  return output;
};

describe('Compare grains calculator to spreadsheet', () => {
  test('should match spreadsheet', async () => {
    const workbook = await getWorkbook(
      './src/test/sheets/comparison/GrainsGreenhouseV11.1.xlsx',
    );
    const input = getCalculatorInput(workbook);
    const validatedInput = validateCalculatorInput(GrainsInputSchema, input);
    if (!validatedInput.valid) {
      throw validatedInput.error;
    }
    const expectedOutput = getExpectedOutput(workbook);
    const calculatorData = calculateGrains(validatedInput.result);
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
