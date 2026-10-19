import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculatePurchasedMineralSupplements } from '../scope3/15.3-purchased-mineral-supplements/calculate';
import {
  PurchasedMineralSupplementsInput,
  PurchasedMineralSupplementsInputSchema,
  PurchasedMineralSupplementsInputTransformed,
} from '../scope3/15.3-purchased-mineral-supplements/purchased-mineral-supplements.input';
import { checkPurchasedMineralSupplementType } from './purchased-mineral-supplementation-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): PurchasedMineralSupplementsInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (method === '1' && cell('A') === undefined) {
    return undefined;
  }
  if (method === '2' && cell('B') === undefined) {
    return undefined;
  }

  const amount = nv(Number(cell('B')));

  const input: PurchasedMineralSupplementsInput =
    method === '1'
      ? {
          purchasedMineralSupplements: [
            {
              amount,
              type: checkPurchasedMineralSupplementType(cell('A')),
            },
          ],
        }
      : {
          purchasedMineralSupplements: [
            {
              amount,
              customEmissionsFactor: nv(Number(cell('C'))),
            },
          ],
        };
  return PurchasedMineralSupplementsInputSchema.parse(input);
};

const extractInputsAndOutputs = createSheetExtractor(getCalculatorInput, 'D');

describe('15.3.1 Purchased 15.3.', () => {
  it('Method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.3-purchased-mineral-supplements.xlsx',
      '15.3.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculatePurchasedMineralSupplements,
      '15.3',
    );
  });
  it('Method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.3-purchased-mineral-supplements.xlsx',
      '15.3.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 17, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculatePurchasedMineralSupplements,
      '15.3',
    );
  });
});
