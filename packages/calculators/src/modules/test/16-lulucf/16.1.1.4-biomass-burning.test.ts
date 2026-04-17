import { calculate_16_1_1_4_BiomassBurning } from '@/modules/lulucf/16.1-land-use-change-forestry';
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

const columnMassPerHectare = 'B';
const columnAreaBurnt = 'C';

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

  const massPerHectare = Number(cell(columnMassPerHectare));
  const areaBurnt = Number(cell(columnAreaBurnt));

  const activity: LandUseChangeActivityInput = {
    type: 'landClearingForestToGrassland',
    carbonMassInTreesCurrentYear: 0,
    carbonMassInTreesPreviousYear: 0,
    carbonMassInDebrisCurrentYear: 0,
    carbonMassInDebrisPreviousYear: 0,
    ghgMassFromBiomassBurningPerHectare: massPerHectare,
    areaBurnt,
    region: 'Arnhem Coast',
    activityArea: 100,
  };

  const lulucfInput: LULUCFInput = {
    isInLeachingZone: false,
    activities: [activity],
  };

  return LULUCFInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`D${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.1.1.4 Biomass Burning', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.1-lulucf.xlsx',
      '16.1.1.4',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_1_1_4_BiomassBurning,
    );
  });
});
