import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateManureManagementSoilDirectN2OForHerd } from '../../scope1/4-manure-management/4.2-beef-pasture/4.2-beef-pasture-manure-n2o';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { columnExpectedEN2ODir, getMonthlyCalculatorInput } from './common';

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnExpectedEN2ODir}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getMonthlyCalculatorInput,
  getExpectedOutput,
  { rowInterval: 100 },
);

describe('4.2. Beef Pasture Manure soil direct n2o monthly', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.2-beef-pasture/4.2-beef.xlsx',
      '4.2.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 771, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementSoilDirectN2OForHerd,
      '4.2',
    );
  });

  it('handles a leap year correctly', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.2-beef-pasture/4.2-beef.xlsx',
      '4.2.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 901, '1', {
      isLeapYear: true,
      expectedTests: 1,
    });

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementSoilDirectN2OForHerd,
      '4.2',
    );
  });
});
