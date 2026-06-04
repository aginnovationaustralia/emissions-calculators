import {
  SheepInput,
  SheepInputSchema,
  SheepInputTransformed,
} from '@/calculators/Sheep/types/input';
import { calculate_4_4_1_1_SheepManureMethane } from '@/modules/scope1/4-manure-management/4.4-sheep-manure';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { checkClimateZone, checkPureStateWithoutNT } from '../livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import * as col from './columns';
import {
  createSheepManureSheetReaders,
  SHEEP_MANURE_MONTHLY_PERIODS_PER_CLASS,
} from './sheep-manure-sheet-readers';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): SheepInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const {
    readSheepClass,
    readSheepClassWithLambing,
    readSheepClassWithProportionLambsBorn,
  } = createSheepManureSheetReaders(
    cell,
    method,
    SHEEP_MANURE_MONTHLY_PERIODS_PER_CLASS,
  );

  const sheepInput: SheepInput = {
    state: checkPureStateWithoutNT(cell(col.columnState)),
    climateZone: checkClimateZone(cell(col.columnClimateZone)),
    isInLeachingZone: cell(col.columnIsInLeachingZone) === 'yes',
    rainfallAbove600: cell(col.columnRainfallAbove600) === 'yes',
    productionSystem: 'Non-irrigated pasture',
    electricity: {
      method: 'location',
      electricityPurchasedKWh: 0,
    },
    flocks: [
      {
        noUnfencedNaturalWater:
          cell(col.columnNoUnfencedNaturalWater) === 'yes',
        classes: {
          breedingEwes: readSheepClassWithLambing(0),
          lambsHoggets: readSheepClassWithProportionLambsBorn(1),
          rams: readSheepClass(2),
          wethers: readSheepClass(3),
        },
      },
    ],
  };

  // console.dir(sheepInput, { depth: null });

  return SheepInputSchema.parse(sheepInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${col.columnOutputECH4}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 30 },
);

describe('4.4.1.1 Sheep manure methane seasonal', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.4-sheep-manure/4.4-sheep-manure.xlsx',
      '4.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 231, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_4_4_1_1_SheepManureMethane,
    );
  });

  it.skip('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.4-sheep-enteric.xlsx',
      '3.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 201, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_4_4_1_1_SheepManureMethane,
    );
  });
});
