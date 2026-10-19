import { calculateManureManagementSoilLeachingRunoffN2OForHerd } from '@/modules/scope1/4-manure-management/4.2-beef-pasture/4.2-beef-pasture-manure-leaching-runoff-n2o';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { columnExpectedEN2OLeach, getMonthlyCalculatorInput } from './common';

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnExpectedEN2OLeach}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getMonthlyCalculatorInput,
  getExpectedOutput,
  { rowInterval: 100 },
);

describe('4.2. Beef Pasture Manure soil leaching runoff n2o monthly', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.2-beef-pasture/4.2-beef.xlsx',
      '4.2.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 771, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementSoilLeachingRunoffN2OForHerd,
      '4.2',
    );
  });
});
