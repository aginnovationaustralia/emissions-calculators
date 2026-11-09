import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateDirectN2OEmissionsForOtherLivestockHerd } from '../../scope1/4-manure-management/4.7-other-livestock-manure';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import {
  getOtherLivestockHerdInput,
  otherLivestockManureSheetColumns,
} from './4.7-other-livestock-manure-helpers';

const { columnOutputDirectN2o: columnOutput } =
  otherLivestockManureSheetColumns;

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getOtherLivestockHerdInput,
  getExpectedOutput,
);

describe('4.7.1.3 Other livestock manure direct N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.7-other-livestock-manure/4.7-other-livestock-manure.xlsx',
      '4.7.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForOtherLivestockHerd,
      '4.7',
    );
  });
});
