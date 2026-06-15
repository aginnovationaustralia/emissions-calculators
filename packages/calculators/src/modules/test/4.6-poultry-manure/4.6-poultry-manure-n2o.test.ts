import { getSheet } from '@/test/common/sheets';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getSimpleCalculatorInput as getCalculatorInput } from './common';
import {
  calculateAtmosphericDepositionN2OEmissionsForPoultry,
  calculateDirectN2OEmissionsForPoultry,
  calculateLeachingAndRunoffN2OEmissionsForPoultry,
} from '@/modules/scope1/4-manure-management/4.6-poultry-manure/calculate';

const extractInputsAndOutput = (cell: string) =>
  createSheetExtractor(getCalculatorInput, cell, {
    rowInterval: 4,
  });

/**
 * TODO:
 * - Method 2 tests
 * - Scenario with more granular stage 2 allocations
 */

describe('4.6.1.3 Poultry Manure Direct N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.6-poultry-manure/4.6-poultry-manure.xlsx',
      '4.6.1.3',
    );

    const inputsAndOutputs = extractInputsAndOutput('BZ')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForPoultry,
    );
  });
});

describe('4.6.1.5 Poultry Manure Atmospheric Deposition N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.6-poultry-manure/4.6-poultry-manure.xlsx',
      '4.6.1.5',
    );

    const inputsAndOutputs = extractInputsAndOutput('CB')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateAtmosphericDepositionN2OEmissionsForPoultry,
    );
  });
});

describe('4.6.1.7 Poultry Manure Leaching and Runoff N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.6-poultry-manure/4.6-poultry-manure.xlsx',
      '4.6.1.7',
    );

    const inputsAndOutputs = extractInputsAndOutput('BR')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateLeachingAndRunoffN2OEmissionsForPoultry,
    );
  });
});
