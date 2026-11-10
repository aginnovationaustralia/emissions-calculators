import { calculate_16_2_1_5_SoilOrganicStockLosses } from '@/modules/lulucf/16.2-land-use-change-forestry';
import {
  LULUCFParentInput,
  LULUCFParentInputSchema,
  LULUCFParentInputTransformed,
} from '@/modules/lulucf/input';
import { LandClearingForestToCroplandInput } from '@/modules/lulucf/land-use-change-activity-input';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
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

  const activity: LandClearingForestToCroplandInput = {
    isInLeachingZone: false,
    type: 'landClearingForestToCropland',
    cropProductionSystem: 'Irrigated crop',
    carbonMassInTreesCurrentYearTonnesPerHectare: nv(0),
    carbonMassInTreesPreviousYearTonnesPerHectare: nv(0),
    carbonMassInDebrisCurrentYearTonnesPerHectare: nv(0),
    carbonMassInDebrisPreviousYearTonnesPerHectare: nv(0),
    massCH4FromBiomassBurningTonnesPerHectare: nv(0),
    massN2OFromBiomassBurningTonnesPerHectare: nv(0),
    region,
    areaBurntHectares: nv(0),
    activityAreaHectares: nv(activityAreaHectares),
  };

  const lulucfInput: LULUCFParentInput = {
    landUse: {
      activities: [activity],
    },
  };

  return LULUCFParentInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`F${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.2.1.5 Soil Organic Stock Losses', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.2-lulucf.xlsx',
      '16.2.1.5',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_2_1_5_SoilOrganicStockLosses,
      '16.2',
    );
  });
});
