import { calculate42BeefPastureManureCH4ForHerd } from '@/modules/scope1/4-manure-management/4.2-beef-pasture/4.2-beef-pasture-manure-methane';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { columnTotalECH4, getMonthlyCalculatorInput } from './common';

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnTotalECH4}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getMonthlyCalculatorInput,
  getExpectedOutput,
  { rowInterval: 100 },
);

describe('4.2. Beef Pasture Manure methane monthly', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.2-beef-pasture/4.2-beef.xlsx',
      '4.2.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 771, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate42BeefPastureManureCH4ForHerd,
      '4.2',
    );
  });
});
