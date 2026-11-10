import {
  calculateAtmosphericDepositionN2OEmissionsForPigsHerd,
  calculateDirectN2OEmissionsForPigsHerd,
  calculateLeachingAndRunoffN2OEmissionsForPigsHerd,
} from '@/modules/scope1/4-manure-management/4.5-pigs-manure/calculate';
import { getSheet } from '@/test/common/sheets';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getSimpleCalculatorInput as getCalculatorInput } from './common';

const extractInputsAndOutput = (cell: string) =>
  createSheetExtractor(getCalculatorInput, cell, {
    rowInterval: 4,
  });

describe('4.5.1.3 & 4.5.1.4 Pigs Manure Management Direct N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-pigs-manure/4.5-pigs-manure.xlsx',
      '4.5',
    );

    const inputsAndOutputs = extractInputsAndOutput('EX')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForPigsHerd,
      '4.5',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-pigs-manure/4.5-pigs-manure.xlsx',
      '4.5',
    );

    const inputsAndOutputs = extractInputsAndOutput('EX')(sheet, 38, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForPigsHerd,
      '4.5',
    );
  });
});

describe('4.5 Pigs Manure Management Atmospheric Deposition N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-pigs-manure/4.5-pigs-manure.xlsx',
      '4.5',
    );

    const inputsAndOutputs = extractInputsAndOutput('FM')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateAtmosphericDepositionN2OEmissionsForPigsHerd,
      '4.5',
    );
  });
  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-pigs-manure/4.5-pigs-manure.xlsx',
      '4.5',
    );

    const inputsAndOutputs = extractInputsAndOutput('FM')(sheet, 38, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateAtmosphericDepositionN2OEmissionsForPigsHerd,
      '4.5',
    );
  });
});

describe('4.5 Pigs Manure Management Leaching and Runoff N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-pigs-manure/4.5-pigs-manure.xlsx',
      '4.5',
    );

    const inputsAndOutputs = extractInputsAndOutput('FS')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateLeachingAndRunoffN2OEmissionsForPigsHerd,
      '4.5',
    );
  });
  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.5-pigs-manure/4.5-pigs-manure.xlsx',
      '4.5',
    );

    const inputsAndOutputs = extractInputsAndOutput('FS')(sheet, 38, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateLeachingAndRunoffN2OEmissionsForPigsHerd,
      '4.5',
    );
  });
});
