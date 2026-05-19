import { calculate_16_4_1_2_SavannaCarbonChange } from '@/modules/lulucf/16.4-burning';
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

const columnCarbonStockChangeHighRainfallZone = 'A';
const columnCarbonStockChangeLowRainfallZone = 'B';

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
    emissionsFromBurningLowRainfallZone: 0,
    emissionsFromBurningHighRainfallZone: 0,
    carbonStockChangeLowRainfallZone: Number(
      cell(columnCarbonStockChangeLowRainfallZone),
    ),
    carbonStockChangeHighRainfallZone: Number(
      cell(columnCarbonStockChangeHighRainfallZone),
    ),
  };

  const lulucfInput: LULUCFInput = {
    isInLeachingZone: false,
    rainfallAbove600: false,
    activities: [],
    burning: [burning],
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

describe('16.4.1.2 Savanna Burning - woody carbon stocks', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.4-lulucf.xlsx',
      '16.4.1.2',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_4_1_2_SavannaCarbonChange,
    );
  });
});
