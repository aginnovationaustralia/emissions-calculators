import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculate53Lime } from '../scope1/5-fertiliser';
import {
  LimeInput,
  LimeInputSchema,
  LimeInputTransformed,
} from '../scope1/5-fertiliser/lime.input';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): LimeInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const massAppliedKg = Number(cell('A'));
  const limestoneFraction = Number(cell('B'));
  const dolomiteFraction = Number(cell('C'));

  const limeInput: LimeInput = {
    limestone: massAppliedKg,
    limestoneFraction,
    dolomiteFraction,
  };

  return LimeInputSchema.parse(limeInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`I${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('5.3.1.1 Lime N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet('./src/modules/test/5.3-lime.xlsx', '5.3.1.1');

    const inputsAndOutputs = extractInputsAndOutput(sheet, 4, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate53Lime);
  });
});
