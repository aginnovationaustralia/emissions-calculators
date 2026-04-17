import { calculate_16_1_1_5_SoilOrganicStockLosses } from '@/modules/lulucf/16.1-land-use-change-forestry';
import {
  LULUCFInput,
  LULUCFInputSchema,
  LULUCFInputTransformed,
} from '@/modules/lulucf/input';
import { LandUseChangeActivityInput } from '@/modules/lulucf/land-user-change-activity-input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { checkIBRA7Region } from './lulucf-domain';

const columnRegion = 'A';
const columnActivityArea = 'B';

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

  const region = checkIBRA7Region(cell(columnRegion));
  const activityArea = Number(cell(columnActivityArea));

  const activity: LandUseChangeActivityInput = {
    type: 'landClearingForestToCropland',
    carbonMassInTreesCurrentYear: 0,
    carbonMassInTreesPreviousYear: 0,
    carbonMassInDebrisCurrentYear: 0,
    carbonMassInDebrisPreviousYear: 0,
    ghgMassFromBiomassBurningPerHectare: 0,
    region,
    areaBurnt: 0,
    activityArea,
  };

  const lulucfInput: LULUCFInput = {
    isInLeachingZone: false,
    activities: [activity],
  };

  return LULUCFInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`F${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.1.1.5 Soil Organic Stock Losses', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.1-lulucf.xlsx',
      '16.1.1.5',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_1_1_5_SoilOrganicStockLosses,
    );
  });
});
