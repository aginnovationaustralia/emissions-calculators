import { calculate_16_2_1_1_NitrogenMineralisationSoilLosses } from '@/modules/lulucf/16.2-nitrogen-soil-losses';
import {
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

const columnClearingType = 'A';
const columnRegion = 'B';
const columnActivityArea = 'D';

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

  const clearingType = cell(columnClearingType);

  const type =
    clearingType === 'crop'
      ? 'landClearingForestToCropland'
      : clearingType === 'grassland'
        ? 'landClearingForestToGrassland'
        : 'landClearingForestToSettlements';

  const activity: LandUseChangeActivityInput = {
    type,
    carbonMassInTreesCurrentYear: 0,
    carbonMassInTreesPreviousYear: 0,
    carbonMassInDebrisCurrentYear: 0,
    carbonMassInDebrisPreviousYear: 0,
    ghgMassFromBiomassBurningPerHectare: 0,
    region,
    areaBurnt: 0,
    activityArea,
  };

  return LULUCFInputSchema.parse({
    activities: [activity],
  });
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`M${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.2.1.1 Nitrogen Mineralisation from Soil Losses', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.2-lulucf.xlsx',
      '16.2.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_2_1_1_NitrogenMineralisationSoilLosses,
    );
  });
});
