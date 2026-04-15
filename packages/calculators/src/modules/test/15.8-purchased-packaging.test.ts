import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import {
  PurchasedPackagingsInputSchema,
  PurchasedPackagingsInputTransformed,
} from '../scope3/15.8-purchased-packaging/purchased-packagings.input';
import { checkPurchasedPackagingType } from './purchased-packaging';
import { calculatePurchasedPackaging } from '../scope3/15.8-purchased-packaging/calculate';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): PurchasedPackagingsInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (method === '1' && cell('A') === undefined) {
    return undefined;
  }
  if (method === '2' && cell('B') === undefined) {
    return undefined;
  }

  const amount = Number(cell('B'));

  if (method === '2')
    return PurchasedPackagingsInputSchema.parse({
      purchasedPackaging: [
        {
          amount,
          customEmissionsFactor: Number(cell('C')),
        },
      ],
    });
  return PurchasedPackagingsInputSchema.parse({
    purchasedPackaging: [
      {
        amount,
        type: checkPurchasedPackagingType(cell('A')),
      },
    ],
  });
};

const extractInputsAndOutputs = createSheetExtractor(getCalculatorInput, 'D');

describe('15.8.1 Purchased Packaging', () => {
  it('Method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.8-purchased-packaging.xlsx',
      '15.8.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculatePurchasedPackaging);
  });
  it('Method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.8-purchased-packaging.xlsx',
      '15.8.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 19, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculatePurchasedPackaging);
  });
});
