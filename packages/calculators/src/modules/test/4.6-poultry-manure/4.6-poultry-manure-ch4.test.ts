import { getSheet } from '@/test/common/sheets';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getSimpleCalculatorInput as getCalculatorInput } from './common';
import { calculateManureManagementCH4ForPoultry } from '@/modules/scope1/4-manure-management/4.6-poultry-manure/calculate';

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'BO', {
  rowInterval: 4,
});

/**
 * TODO:
 * - Method 2 tests
 * - Scenario with more granular stage 2 allocations
 * - Multi-class scenario
 */

describe('4.6.1.1 Poultry Manure Management CH4', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.6-poultry-manure/4.6-poultry-manure.xlsx',
      '4.6.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementCH4ForPoultry,
    );
  });
});
