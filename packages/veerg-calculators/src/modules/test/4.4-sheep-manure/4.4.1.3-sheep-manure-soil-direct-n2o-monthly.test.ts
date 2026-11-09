import {
  SheepFlockInput,
  SheepFlockInputSchema,
  SheepFlockInputTransformed,
} from '@/calculators/Sheep/types/sheep-flock.input';
import {
  HasIsFebruaryInLeapYearInputSchemaForSheep,
  HasIsFebruaryInLeapYearInputTransformed,
} from '@/calculators/types/has-is-february-in-leap-year.input';
import { calculateDirectN2OEmissionsForSheepFlock } from '@/modules/scope1/4-manure-management/4.4-sheep-manure/calculate';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { createSheepFlockInput } from '../factory';
import { checkClimateZone, checkState } from '../livestock-domain';
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
):
  | (SheepFlockInputTransformed & HasIsFebruaryInLeapYearInputTransformed)
  | undefined => {
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
  } = createSheepManureSheetReaders<12>(
    cell,
    method,
    SHEEP_MANURE_MONTHLY_PERIODS_PER_CLASS,
  );

  const sheepInput: SheepFlockInput = createSheepFlockInput({
    climateZone: checkClimateZone(cell(col.columnClimateZone)),
    isInLeachingZone: cell(col.columnIsInLeachingZone) === 'yes',
    state: checkState(cell(col.columnState)),
    excludedFromNaturalWater:
      cell(col.columnExcludedFromNaturalWater) === 'yes',
    classes: {
      period: 'monthly',
      breedingEwes: readSheepClassWithLambing(0),
      lambsHoggets: readSheepClassWithProportionLambsBorn(1),
      rams: readSheepClass(2),
      wethers: readSheepClass(3),
    },
  });

  return {
    ...SheepFlockInputSchema.parse(sheepInput),
    ...HasIsFebruaryInLeapYearInputSchemaForSheep.parse({
      isFebruaryInLeapYear: false,
    }),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${col.columnOutputEN2ODir}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 30 },
);

describe('4.4.1.3 Sheep manure soil direct N2O monthly', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.4-sheep-manure/4.4-sheep-manure.xlsx',
      '4.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 231, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForSheepFlock,
      '4.4',
    );
  });
});
