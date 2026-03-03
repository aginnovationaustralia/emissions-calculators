import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  LimeInput,
  LimeInputSchema,
  LimeInputTransformed,
} from '../scope1/5-fertiliser/lime.input';
import { calculateScope3Lime } from '../scope3/15.6-lime';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): LimeInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  // The formula 15.6.1.1 is clearly in tonnes, this adjustment corrects for the input being in kg
  const limestone = Number(cell('A')) * 1000;
  const customEmissionsFactor = cell('C');

  const limeInput: LimeInput = {
    dolomiteFraction: 0,
    limestoneFraction: 0,
    limestone,
    ...(method === '2' && customEmissionsFactor
      ? { customScope3EmissionsFactor: Number(customEmissionsFactor) }
      : {}),
  };

  return LimeInputSchema.parse(limeInput);
};

const extractInputsAndOutputs = createSheetExtractor(getCalculatorInput, 'D');

describe('15.6.1.1 Agrichemicals', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.6-lime.xlsx',
      '15.6.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope3Lime);
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.6-lime.xlsx',
      '15.6.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 11, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope3Lime);
  });
});
