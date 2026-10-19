import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculatePurchasedPackaging } from '../scope3/15.8-purchased-packaging/calculate';
import {
  PurchasedPackagingsInputSchema,
  PurchasedPackagingsInputTransformed,
} from '../scope3/15.8-purchased-packaging/purchased-packagings.input';
import {
  checkPurchasedPackagingByMassType,
  checkPurchasedPackagingByUnitsType,
} from './packaging-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInputByUnits = (
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

  const amountUnits = nv(Number(cell('B')));

  if (method === '2')
    return PurchasedPackagingsInputSchema.parse({
      purchasedPackaging: [
        {
          amountUnits,
          customEmissionsFactor: nv(Number(cell('D'))),
        },
      ],
    });
  return PurchasedPackagingsInputSchema.parse({
    purchasedPackaging: [
      {
        amountUnits,
        type: checkPurchasedPackagingByUnitsType(cell('A')),
      },
    ],
  });
};

const getCalculatorInputByMass = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): PurchasedPackagingsInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (method === '1' && cell('A') === undefined) {
    return undefined;
  }
  if (method === '2' && cell('B') === undefined && cell('C') === undefined) {
    return undefined;
  }

  const amountMass = nv(Number(cell('C')));

  if (method === '2')
    return PurchasedPackagingsInputSchema.parse({
      purchasedPackaging: [
        {
          amountMass,
          customEmissionsFactor: nv(Number(cell('D'))),
        },
      ],
    });
  return PurchasedPackagingsInputSchema.parse({
    purchasedPackaging: [
      {
        amountMass,
        type: checkPurchasedPackagingByMassType(cell('A')),
      },
    ],
  });
};

const extractInputsAndOutputsByUnits = createSheetExtractor(
  getCalculatorInputByUnits,
  'E',
);

const extractInputsAndOutputsByMass = createSheetExtractor(
  getCalculatorInputByMass,
  'E',
);

describe('15.8.1 Purchased Packaging', () => {
  it('Method 1 matches spreadsheet results by units', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.8-purchased-packaging.xlsx',
      '15.8.1',
    );

    const inputsAndOutputs = extractInputsAndOutputsByUnits(sheet, 11, '1', {
      expectedTests: 5,
    });

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculatePurchasedPackaging,
      '15.8',
    );
  });
  it('Method 2 matches spreadsheet results by units', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.8-purchased-packaging.xlsx',
      '15.8.1',
    );

    const inputsAndOutputs = extractInputsAndOutputsByUnits(sheet, 23, '2', {
      expectedTests: 3,
    });

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculatePurchasedPackaging,
      '15.8',
    );
  });

  it('Method 1 matches spreadsheet results by mass', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.8-purchased-packaging.xlsx',
      '15.8.1',
    );

    const inputsAndOutputs = extractInputsAndOutputsByMass(sheet, 17, '1', {
      expectedTests: 3,
    });

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculatePurchasedPackaging,
      '15.8',
    );
  });
  it('Method 2 matches spreadsheet results by mass', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.8-purchased-packaging.xlsx',
      '15.8.1',
    );

    const inputsAndOutputs = extractInputsAndOutputsByMass(sheet, 27, '2', {
      expectedTests: 2,
    });

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculatePurchasedPackaging,
      '15.8',
    );
  });
});
