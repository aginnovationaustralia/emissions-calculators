import { calculate_16_5_1_2_SavannaCarbonChange } from '@/modules/lulucf/16.5-burning';
import { BurningInput } from '@/modules/lulucf/burning-input';
import {
  LULUCFParentInput,
  LULUCFParentInputSchema,
  LULUCFParentInputTransformed,
} from '@/modules/lulucf/input';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
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
): LULUCFParentInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const burning: BurningInput = {
    emissionsFromBurningLowRainfallZone: nv(0),
    emissionsFromBurningHighRainfallZone: nv(0),
    carbonStockChangeLowRainfallZone: nv(
      Number(cell(columnCarbonStockChangeLowRainfallZone)),
    ),
    carbonStockChangeHighRainfallZone: nv(
      Number(cell(columnCarbonStockChangeHighRainfallZone)),
    ),
  };

  const lulucfInput: LULUCFParentInput = {
    landUse: {
      burning: [burning],
    },
  };

  return LULUCFParentInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`D${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.5.1.2 Savanna Burning - woody carbon stocks', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.5-lulucf.xlsx',
      '16.5.1.2',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_5_1_2_SavannaCarbonChange,
      '16.5',
    );
  });
});
