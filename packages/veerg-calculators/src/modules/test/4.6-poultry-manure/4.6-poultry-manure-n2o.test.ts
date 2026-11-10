import { getSheet } from '@/test/common/sheets';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getSimpleCalculatorInput as getCalculatorInput } from './common';
import {
  calculateAtmosphericDepositionN2OEmissionsForPoultryFlock,
  calculateDirectN2OEmissionsForPoultryFlock,
  calculateLeachingAndRunoffN2OEmissionsForPoultryFlock,
} from '@/modules/scope1/4-manure-management/4.6-poultry-manure/calculate';

const extractInputsAndOutput = (cell: string) =>
  createSheetExtractor(getCalculatorInput, cell, {
    rowInterval: 4,
  });

describe('4.6.1.3 & 4.6.1.4 Poultry Manure Direct N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.6-poultry-manure/4.6-poultry-manure.xlsx',
      '4.6.1.3',
    );

    const inputsAndOutputs = extractInputsAndOutput('BZ')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForPoultryFlock,
      '4.6',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.6-poultry-manure/4.6-poultry-manure.xlsx',
      '4.6.1.4',
    );

    const inputsAndOutputs = extractInputsAndOutput('BZ')(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForPoultryFlock,
      '4.6',
    );
  });
});

describe('4.6.1.5 & 4.6.1.6 Poultry Manure Atmospheric Deposition N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.6-poultry-manure/4.6-poultry-manure.xlsx',
      '4.6.1.5',
    );

    const inputsAndOutputs = extractInputsAndOutput('CB')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateAtmosphericDepositionN2OEmissionsForPoultryFlock,
      '4.6',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.6-poultry-manure/4.6-poultry-manure.xlsx',
      '4.6.1.6',
    );

    const inputsAndOutputs = extractInputsAndOutput('CB')(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateAtmosphericDepositionN2OEmissionsForPoultryFlock,
      '4.6',
    );
  });
});

describe('4.6.1.7 & 4.6.1.8 Poultry Manure Leaching and Runoff N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.6-poultry-manure/4.6-poultry-manure.xlsx',
      '4.6.1.7',
    );

    const inputsAndOutputs = extractInputsAndOutput('BR')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateLeachingAndRunoffN2OEmissionsForPoultryFlock,
      '4.6',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.6-poultry-manure/4.6-poultry-manure.xlsx',
      '4.6.1.8',
    );

    const inputsAndOutputs = extractInputsAndOutput('BR')(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateLeachingAndRunoffN2OEmissionsForPoultryFlock,
      '4.6',
    );
  });
});
