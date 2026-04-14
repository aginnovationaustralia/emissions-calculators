import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateManureManagementCH4 } from '../../scope1/4-manure-management/4.1-beef-pasture/4.1-beef-pasture-manure-methane';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getCalculatorInput } from './common';

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`BO${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 40 },
);

describe('4.2. Beef Pasture Manure methane', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.2-beef-pasture/4.1-beef.xlsx',
      '4.2.1 methane',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateManureManagementCH4);
  });

  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.2-beef-pasture/4.1-beef.xlsx',
      '4.2.1 methane',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 141, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculateManureManagementCH4);
  });
});
