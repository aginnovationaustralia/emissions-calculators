import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateScope3Agrichemicals } from '../scope3/15.5-agrichemicals';
import {
  AgrichemicalsInput,
  AgrichemicalsInputSchema,
  AgrichemicalsInputTransformed,
} from '../scope3/15.5-agrichemicals/agrichemicals.input';
import { checkAgrichemicalType } from './agrichemicals-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): AgrichemicalsInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const amountKg = Number(cell('A'));
  const type = checkAgrichemicalType(cell('B'));
  const customEmissionsFactor = cell('D');

  const agrichemicalsInput: AgrichemicalsInput = {
    chemicals: [
      {
        amountKg,
        type,
        ...(method === '2' && customEmissionsFactor
          ? { customEmissionsFactor: Number(customEmissionsFactor) }
          : {}),
      },
    ],
  };

  return AgrichemicalsInputSchema.parse(agrichemicalsInput);
};

const extractInputsAndOutputs = createSheetExtractor(getCalculatorInput, 'E');

describe('15.5.1.1 Agrichemicals', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.5-agrichemicals.xlsx',
      '15.5.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope3Agrichemicals);
  });

  it('method 1 matches spreadsheet results market-based', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.5-agrichemicals.xlsx',
      '15.5.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 11, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope3Agrichemicals);
  });
});
