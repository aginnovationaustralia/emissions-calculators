import { getSheet } from '@/test/common/sheets';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getCalculatorInput } from './common';
import { calculateManureManagementCH4ForFeedlot } from '@/modules/scope1/4-manure-management/4.1-feedlot-manure';

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'AE');

describe('4.1.1.1 & 4.1.1.2 Feedlot Manure Management CH4', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.1-feedlot-manure/4.1-feedlot-manure.xlsx',
      '4.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 8, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementCH4ForFeedlot,
      '4.1',
    );
  });
  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.1-feedlot-manure/4.1-feedlot-manure.xlsx',
      '4.1.1.2',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 8, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementCH4ForFeedlot,
      '4.1',
    );
  });
});
