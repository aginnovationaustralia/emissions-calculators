import { calculate_16_2_1_2_ChangesInWoodyCarbonStocks } from '@/modules/lulucf/16.2-land-use-change-forestry';
import {
  LULUCFParentInput,
  LULUCFParentInputSchema,
  LULUCFParentInputTransformed,
} from '@/modules/lulucf/input';
import { LandUseChangeActivityInput } from '@/modules/lulucf/land-use-change-activity-input';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';

const columnMassTreesY = 'B';
const columnMassTreesYMinus1 = 'C';
const columnMassDebrisY = 'E';
const columnMassDebrisYMinus1 = 'F';
const columnActivityArea = 'H';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): LULUCFParentInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const activity: LandUseChangeActivityInput = {
    type: 'revegetationByPlanting',
    carbonMassInTreesCurrentYear: nv(Number(cell(columnMassTreesY))),
    carbonMassInTreesPreviousYear: nv(Number(cell(columnMassTreesYMinus1))),
    carbonMassInDebrisCurrentYear: nv(Number(cell(columnMassDebrisY))),
    carbonMassInDebrisPreviousYear: nv(Number(cell(columnMassDebrisYMinus1))),
    activityAreaHectares: nv(Number(cell(columnActivityArea))),
  };

  const lulucfInput: LULUCFParentInput = {
    landUse: {
      activities: [activity],
    },
  };

  return LULUCFParentInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`K${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.2.1.2 Woody Carbon Stocks', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.2-lulucf.xlsx',
      '16.2.1.2',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_2_1_2_ChangesInWoodyCarbonStocks,
      '16.2',
    );
  });
});
