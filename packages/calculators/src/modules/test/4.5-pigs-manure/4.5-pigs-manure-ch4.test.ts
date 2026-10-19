import { calculateManureManagementCH4ForPigsHerd } from '@/modules/scope1/4-manure-management/4.5-pigs-manure/calculate';
import { getSheet } from '@/test/common/sheets';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getSimpleCalculatorInput as getCalculatorInput } from './common';

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'DA', {
  rowInterval: 4,
});

describe('4.5.1.1 & 4.5.1.2 Pigs Manure Management CH4', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-pigs-manure/4.5-pigs-manure.xlsx',
      '4.5',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementCH4ForPigsHerd,
      '4.5',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-pigs-manure/4.5-pigs-manure.xlsx',
      '4.5',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 38, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementCH4ForPigsHerd,
      '4.5',
    );
  });
});
