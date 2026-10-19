import {
  calculateAtmosphericDepositionN2OEmissionsForDairyHerd,
  calculateDirectN2OEmissionsForDairyHerd,
  calculateLeachingAndRunoffN2OEmissionsForDairyHerd,
} from '@/modules/scope1/4-manure-management/4.3-dairy-manure/calculate';
import { getSheet } from '@/test/common/sheets';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getCalculatorInput } from './common';

const extractInputsAndOutput = (column: string) =>
  createSheetExtractor(getCalculatorInput, column, {
    rowInterval: 7,
  });

describe('4.3.1.3 & 4.3.1.4 Dairy Manure Direct N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.3-dairy-manure/4.3-dairy-manure.xlsx',
      '4.3.1.3',
    );

    const inputsAndOutputs = extractInputsAndOutput('BU')(sheet, 8, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForDairyHerd,
      '4.3',
    );
  });
  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.3-dairy-manure/4.3-dairy-manure.xlsx',
      '4.3.1.4',
    );

    const inputsAndOutputs = extractInputsAndOutput('BU')(sheet, 8, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForDairyHerd,
      '4.3',
    );
  });
});

describe('4.3.1.5 & 4.3.1.6 Dairy Manure Atmospheric Deposition N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.3-dairy-manure/4.3-dairy-manure.xlsx',
      '4.3.1.5',
    );

    const inputsAndOutputs = extractInputsAndOutput('BX')(sheet, 8, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateAtmosphericDepositionN2OEmissionsForDairyHerd,
      '4.3',
    );
  });
  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.3-dairy-manure/4.3-dairy-manure.xlsx',
      '4.3.1.6',
    );

    const inputsAndOutputs = extractInputsAndOutput('BX')(sheet, 8, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateAtmosphericDepositionN2OEmissionsForDairyHerd,
      '4.3',
    );
  });
});

describe('4.3.1.7 & 4.3.1.8 Dairy Manure Leaching and Runoff N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.3-dairy-manure/4.3-dairy-manure.xlsx',
      '4.3.1.7',
    );

    const inputsAndOutputs = extractInputsAndOutput('BP')(sheet, 8, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateLeachingAndRunoffN2OEmissionsForDairyHerd,
      '4.3',
    );
  });
  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.3-dairy-manure/4.3-dairy-manure.xlsx',
      '4.3.1.8',
    );

    const inputsAndOutputs = extractInputsAndOutput('BP')(sheet, 8, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateLeachingAndRunoffN2OEmissionsForDairyHerd,
      '4.3',
    );
  });
});
