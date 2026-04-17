import { calculate_16_4_1_4_SavannaBiomassBurning } from '@/modules/lulucf/16.4-burning';
import { BurningInput } from '@/modules/lulucf/burning-input';
import {
  LULUCFInput,
  LULUCFInputSchema,
  LULUCFInputTransformed,
} from '@/modules/lulucf/input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';

const columnEmissionsLowRainfallZone = 'A';
const columnEmissionsHighRainfallZone = 'B';

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

  const burning: BurningInput = {
    emissionsFromBurningLowRainfallZone: Number(
      cell(columnEmissionsLowRainfallZone),
    ),
    emissionsFromBurningHighRainfallZone: Number(
      cell(columnEmissionsHighRainfallZone),
    ),
    carbonStockChangeLowRainfallZone: 0,
    carbonStockChangeHighRainfallZone: 0,
  };

  const lulucfInput: LULUCFInput = {
    isInLeachingZone: false,
    activities: [],
    burning: [burning],
  };

  return LULUCFInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`C${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.4.1.4 Savanna Biomass Burning', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.4-lulucf.xlsx',
      '16.4.1.4',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_4_1_4_SavannaBiomassBurning,
    );
  });
});
