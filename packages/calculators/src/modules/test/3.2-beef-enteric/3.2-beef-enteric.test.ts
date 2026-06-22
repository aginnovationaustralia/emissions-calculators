import { calculate32BeefPastureEntericMethane } from '@/modules/scope1/3-enteric-methane/3.2-beef-pasture';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { columnExpectedOutput, getCalculatorInput } from './common';

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnExpectedOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 50 },
);

describe('3.2. Beef enteric methane', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.2-beef-enteric/3.2-beef-enteric.xlsx',
      '3.2.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate32BeefPastureEntericMethane,
    );
  });

  it.skip('method 2 scenarios match spreadsheet n2o', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.2-beef-pasture/4.1-beef.xlsx',
      '4.2.1 methane',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 141, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate32BeefPastureEntericMethane,
    );
  });
});

/* TODO
- add a test case with no calving
*/
