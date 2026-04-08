import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  PurchasedFeedsInputSchema,
  PurchasedFeedsInputTransformed,
} from '../scope3/15.2-purchased-feed/purchased-feeds.input';
import {
  checkPurchasedFeedRegion,
  checkPurchasedFeedTypeInRegion,
} from './purchased-feed-domain';
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
  if (method === '2' && cell('C') === undefined) {
    return undefined;
  }

  const amount = Number(cell('C'));
  const region = checkPurchasedFeedRegion(cell('B')?.trim() || undefined);

  if (method === '2')
    return PurchasedFeedsInputSchema.parse({
      purchasedFeed: [
        {
          amount,
          customEmissionsFactor: Number(cell('D')),
        },
      ],
    });

  const purchasedFeed =
    region === undefined
      ? {
          type: checkPurchasedFeedTypeInRegion(cell('A')),
          amount,
        }
      : {
          amount,
          type: checkPurchasedFeedTypeInRegion(cell('A'), region),
          region,
        };
  return PurchasedFeedsInputSchema.parse({
    purchasedFeed: [purchasedFeed],
  });
};

const extractInputsAndOutputs = createSheetExtractor(getCalculatorInput, 'E');

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

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 98, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculatePurchasedFeed);
  });
});
