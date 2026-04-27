import { calculate_16_1_1_2_ChangesInWoodyCarbonStocks } from '@/modules/lulucf/16.1-land-use-change-forestry';
import {
  LULUCFInput,
  LULUCFInputSchema,
  LULUCFInputTransformed,
} from '@/modules/lulucf/input';
import { LandUseChangeActivityInput } from '@/modules/lulucf/land-use-change-activity-input';
import { getSheet } from '@/test/common/sheets';
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
): LULUCFInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const activity: LandUseChangeActivityInput = {
    type: 'landClearingForestToCropland',
    carbonMassInTreesCurrentYear: Number(cell(columnMassTreesY)),
    carbonMassInTreesPreviousYear: Number(cell(columnMassTreesYMinus1)),
    carbonMassInDebrisCurrentYear: Number(cell(columnMassDebrisY)),
    carbonMassInDebrisPreviousYear: Number(cell(columnMassDebrisYMinus1)),
    massCH4FromBiomassBurningPerHectare: 0,
    massN2OFromBiomassBurningPerHectare: 0,
    region: 'Arnhem Coast',
    areaBurnt: 0,
    activityArea: Number(cell(columnActivityArea)),
  };

  const lulucfInput: LULUCFInput = {
    isInLeachingZone: false,
    rainfallAbove600: false,
    activities: [activity],
  };

  return LULUCFInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`K${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.1.1.2 Woody Carbon Stocks', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.1-lulucf.xlsx',
      '16.1.1.2',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_1_1_2_ChangesInWoodyCarbonStocks,
    );
  });
});
