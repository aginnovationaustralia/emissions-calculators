import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateManureManagementSoilDirectN2OForHerd } from '../../scope1/4-manure-management/4.2-beef-pasture/4.2-beef-pasture-manure-n2o';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { columnExpectedEN2ODir, getCalculatorInput } from './common';

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnExpectedEN2ODir}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 50 },
);

describe('4.2. Beef Pasture Manure soil direct n2o seasonal', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.2-beef-pasture/4.2-beef.xlsx',
      '4.2.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementSoilDirectN2OForHerd,
      '4.2',
    );
  });
});
