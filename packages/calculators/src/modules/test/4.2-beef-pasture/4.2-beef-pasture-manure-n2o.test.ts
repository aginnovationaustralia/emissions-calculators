import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateManureManagementN2O } from '../../scope1/4-manure-management/4.1-beef-pasture/4.1-beef-pasture-manure-n2o';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getCalculatorInput } from './common';

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`BN${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 40 },
);

describe('4.2. Beef Pasture Manure n2o', () => {
  it.skip('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.2-beef-pasture/4.1-beef.xlsx',
      '4.2.1 methane',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateManureManagementN2O);
  });

  // TODO: Need to rework beef pasture n2o for tranche 2a
  it.skip('method 2 scenarios match spreadsheet n2o', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.2-beef-pasture/4.1-beef.xlsx',
      '4.2.1 methane',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 141, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculateManureManagementN2O);
  });
});

/* TODO
- add a test case with no calving
*/
