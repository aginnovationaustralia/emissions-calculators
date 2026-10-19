import { calculate_16_3_1_1_NitrogenMineralisationSoilLosses } from '@/modules/lulucf/16.3-nitrogen-soil-losses';
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
import { columnExpectedOutput163, getLandClearingEvent } from './16.3-common';

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

  const activity: LandUseChangeActivityInput = getLandClearingEvent(cell);

  const lulucfInput: LULUCFParentInput = {
    landUse: {
      activities: [activity],
    },
  };

  return LULUCFParentInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnExpectedOutput163}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.3.1.1 Nitrogen Mineralisation from Soil Losses', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.3-lulucf.xlsx',
      '16.3.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_3_1_1_NitrogenMineralisationSoilLosses,
      '16.3',
    );
  });
});
