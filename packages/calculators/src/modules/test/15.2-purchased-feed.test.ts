import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  PurchasedFeedsInputSchema,
  PurchasedFeedsInputTransformed,
} from '../scope3/15.2-purchased-feed/purchased-feeds.input';
import { PurchasedFeedInput } from '../scope3/15.2-purchased-feed/purchased-feed.input';
import { checkPurchasedFeedType } from './purchased-feed-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import { calculatePurchasedFeed } from '../scope3/15.2-purchased-feed';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): PurchasedFeedsInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (method === '1' && cell('A') === undefined) {
    return undefined;
  }
  if (method === '2' && cell('B') === undefined) {
    return undefined;
  }

  const amount = Number(cell('B'));

  const purchasedFeed: PurchasedFeedInput =
    method === '1'
      ? {
          type: checkPurchasedFeedType(cell('A')),
          amount,
        }
      : {
          amount,
          customEmissionsFactor: Number(cell('C')),
        };

  // eslint-disable-next-line no-console
  console.log(cell('D'));

  return PurchasedFeedsInputSchema.parse({ purchasedFeed: [purchasedFeed] });
};

const extractInputsAndOutputs = createSheetExtractor(getCalculatorInput, 'D');

describe('15.2.1 Purchased Feed', () => {
  it('Method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.2-purchased-feed.xlsx',
      '15.2.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculatePurchasedFeed);
  });
  it('Method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.2-purchased-feed.xlsx',
      '15.2.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 24, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculatePurchasedFeed);
  });
});
