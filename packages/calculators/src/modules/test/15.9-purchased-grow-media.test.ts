import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import {
  PurchasedGrowMediasInputSchema,
  PurchasedGrowMediasInputTransformed,
} from '../scope3/15.9-grow-media/purchased-grow-media.input';
import { checkGrowMediaType } from './purchased-grow-media-domain';
import { calculatePurchasedGrowMedia } from '../scope3/15.9-grow-media/calculator';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): PurchasedGrowMediasInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const amount = Number(cell('B'));

  if (method === '2') {
    const unit = cell('A');
    return PurchasedGrowMediasInputSchema.parse({
      purchasedGrowMedia: [
        unit === 'Mass'
          ? {
              amount,
              customEmissionsFactorByMass: Number(cell('C')),
            }
          : {
              amount,
              customEmissionsFactorByVolume: Number(cell('C')),
            },
      ],
    });
  }
  return PurchasedGrowMediasInputSchema.parse({
    purchasedGrowMedia: [
      {
        amount,
        type: checkGrowMediaType(cell('A')),
      },
    ],
  });
};

const extractInputsAndOutputs = createSheetExtractor(getCalculatorInput, 'D');

describe('15.9 Purchased Grow Media', () => {
  it('Method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.9-purchased-grow-media.xlsx',
      '15.9.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculatePurchasedGrowMedia);
  });
  it('Method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.9-purchased-grow-media.xlsx',
      '15.9.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 16, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculatePurchasedGrowMedia);
  });
});
