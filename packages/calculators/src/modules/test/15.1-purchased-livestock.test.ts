import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import { checkOtherLivestockClass } from './livestock-domain';
import {
  OtherPurchasedLivestocksInputSchema,
  OtherPurchasedLivestocksInputTransformed,
} from '../scope3/15.1-purchased-livestock/other-purchased-livestock';
import { calculateOtherPurchasedLivestockEmissions } from '../scope3/15.1-purchased-livestock';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): OtherPurchasedLivestocksInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const livestockType = checkOtherLivestockClass(cell('A'));
  const averageLiveweight = Number(cell('B')) || undefined;
  const headPurchased = Number(cell('C'));

  if (method === '2') {
    const emissionsFactor = Number(cell('D'));

    return OtherPurchasedLivestocksInputSchema.parse({
      livestockPurchases: [
        {
          type: livestockType,
          headPurchased,
          averageLiveweight,
          emissionsFactor,
        },
      ],
    });
  }

  return OtherPurchasedLivestocksInputSchema.parse({
    livestockPurchases: [
      {
        type: livestockType,
        headPurchased,
        averageLiveweight,
      },
    ],
  });
};

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'E');

describe('15.1 Purchased Livestock', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.1-purchased-livestock.xlsx',
      '15.1.1 (Other Livestock)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateOtherPurchasedLivestockEmissions,
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.1-purchased-livestock.xlsx',
      '15.1.1 (Other Livestock)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 31, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateOtherPurchasedLivestockEmissions,
    );
  });
});
