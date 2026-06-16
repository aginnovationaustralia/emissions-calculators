import { getSheet } from '@/test/common/sheets';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getSimpleCalculatorInput as getCalculatorInput } from './common';
import { calculateManureManagementCH4ForSwine } from '@/modules/scope1/4-manure-management/4.5-swine-manure/calculate';

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'BK', {
  rowInterval: 4,
});

describe('4.5.1.1 & 4.5.1.2 Swine Manure Management CH4', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-swine-manure/4.5-swine-manure.xlsx',
      '4.5.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementCH4ForSwine,
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-swine-manure/4.5-swine-manure.xlsx',
      '4.5.1.2',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementCH4ForSwine,
    );
  });
});
