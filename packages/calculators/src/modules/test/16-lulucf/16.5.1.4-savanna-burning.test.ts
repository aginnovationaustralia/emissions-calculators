import { calculate_16_5_1_4_SavannaBiomassBurning } from '@/modules/lulucf/16.5-burning';
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

const columnEmissionsLowRainfallZone = 'A';
const columnEmissionsHighRainfallZone = 'B';

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
    emissionsFromBurningLowRainfallZone: nv(
      Number(cell(columnEmissionsLowRainfallZone)),
    ),
    emissionsFromBurningHighRainfallZone: nv(
      Number(cell(columnEmissionsHighRainfallZone)),
    ),
    carbonStockChangeLowRainfallZone: nv(0),
    carbonStockChangeHighRainfallZone: nv(0),
  };

  const lulucfInput: LULUCFParentInput = {
    landUse: {
      burning: [burning],
    },
  };

  return LULUCFParentInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`C${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.5.1.4 Savanna Biomass Burning', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.5-lulucf.xlsx',
      '16.5.1.4',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_5_1_4_SavannaBiomassBurning,
      '16.5',
    );
  });
});
