import { getSheet } from '@/test/common/sheets';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getSimpleCalculatorInput as getCalculatorInput } from './common';
import {
  calculateAtmosphericDepositionN2OEmissionsForSwine,
  calculateDirectN2OEmissionsForSwine,
  calculateLeachingAndRunoffN2OEmissionsForSwine,
} from '@/modules/scope1/4-manure-management/4.5-swine-manure/calculate';

const extractInputsAndOutput = (cell: string) =>
  createSheetExtractor(getCalculatorInput, cell, {
    rowInterval: 4,
  });

describe('4.5.1.3 & 4.5.1.4 Swine Manure Management Direct N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-swine-manure/4.5-swine-manure.xlsx',
      '4.5.1.3',
    );

    const inputsAndOutputs = extractInputsAndOutput('BL')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForSwine,
    );
  });

  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-swine-manure/4.5-swine-manure.xlsx',
      '4.5.1.4',
    );

    const inputsAndOutputs = extractInputsAndOutput('BL')(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForSwine,
    );
  });
});

describe('4.5 Swine Manure Management Atmospheric Deposition N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-swine-manure/4.5-swine-manure.xlsx',
      'Atmospheric Deposition',
    );

    const inputsAndOutputs = extractInputsAndOutput('BO')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateAtmosphericDepositionN2OEmissionsForSwine,
    );
  });
  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-swine-manure/4.5-swine-manure.xlsx',
      'Atmospheric Deposition (2)',
    );

    const inputsAndOutputs = extractInputsAndOutput('BO')(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateAtmosphericDepositionN2OEmissionsForSwine,
    );
  });
});

describe('4.5 Swine Manure Management Leaching and Runoff N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-swine-manure/4.5-swine-manure.xlsx',
      'Leaching and Runoff',
    );

    const inputsAndOutputs = extractInputsAndOutput('AC')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateLeachingAndRunoffN2OEmissionsForSwine,
    );
  });
  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-swine-manure/4.5-swine-manure.xlsx',
      'Leaching and Runoff (2)',
    );

    const inputsAndOutputs = extractInputsAndOutput('AC')(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateLeachingAndRunoffN2OEmissionsForSwine,
    );
  });
});
