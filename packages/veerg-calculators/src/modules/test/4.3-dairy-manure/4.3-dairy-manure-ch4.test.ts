import { calculateDairyManureCH4ForHerd } from '@/modules/scope1/4-manure-management/4.3-dairy-manure/calculate';
import { getSheet } from '@/test/common/sheets';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getCalculatorInput } from './common';

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'BO', {
  rowInterval: 7,
});

describe('4.3.1.1 & 4.3.1.2 Dairy Manure Management CH4', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.3-dairy-manure/4.3-dairy-manure.xlsx',
      '4.3.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 8, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDairyManureCH4ForHerd,
      '4.3',
    );
  });
  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.3-dairy-manure/4.3-dairy-manure.xlsx',
      '4.3.1.2',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 8, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDairyManureCH4ForHerd,
      '4.3',
    );
  });
});
