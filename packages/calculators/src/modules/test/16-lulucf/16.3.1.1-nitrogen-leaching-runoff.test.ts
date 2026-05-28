import { calculate_16_3_1_1_NitrogenLeachingAndRunoff } from '@/modules/lulucf/16.3-nitrogen-leaching-runoff';
import {
  LULUCFParentInput,
  LULUCFParentInputSchema,
  LULUCFParentInputTransformed,
} from '@/modules/lulucf/input';
import { LandUseChangeActivityInput } from '@/modules/lulucf/land-use-change-activity-input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { checkIBRA7Region } from './lulucf-domain';

const columnClearingType = 'A';
const columnRegion = 'B';
const columnIsInLeachingZone = 'D';
const columnRainfallAbove600 = 'E';
const columnActivityArea = 'F';
const columnExpectedOutput = 'S';
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

  const region = checkIBRA7Region(cell(columnRegion));
  const activityAreaHectares = Number(cell(columnActivityArea));
  const rainfallAbove600 = cell(columnRainfallAbove600) === 'yes';

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
    massCH4FromBiomassBurningPerHectare: 0,
    massN2OFromBiomassBurningPerHectare: 0,
    region,
    areaBurnt: 0,
    activityAreaHectares,
  };

  const lulucfInput: LULUCFParentInput = {
    isInLeachingZone: cell(columnIsInLeachingZone) === 'yes',
    rainfallAbove600,
    landUse: {
      activities: [activity],
    },
  };

  return LULUCFParentInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnExpectedOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.3.1.1 Nitrogen Leaching and Runoff', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.2-lulucf.xlsx',
      '16.2.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_3_1_1_NitrogenLeachingAndRunoff,
    );
  });
});
