import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import {
  getOtherLivestockHerdInput,
  otherLivestockManureSheetColumns,
} from './4.7-other-livestock-manure-helpers';
import { calculateManureManagementCH4ForOtherLivestockHerd } from '@/modules/scope1/4-manure-management/4.7-other-livestock-manure';

const { columnOutputMethane: columnOutput } = otherLivestockManureSheetColumns;

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getOtherLivestockHerdInput,
  getExpectedOutput,
);

describe('4.7.1.1 Other livestock manure methane', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.7-other-livestock-manure/4.7-other-livestock-manure.xlsx',
      '4.7.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementCH4ForOtherLivestockHerd,
      '4.7',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.7-other-livestock-manure/4.7-other-livestock-manure.xlsx',
      '4.7.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 41, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementCH4ForOtherLivestockHerd,
      '4.7',
    );
  });
});
