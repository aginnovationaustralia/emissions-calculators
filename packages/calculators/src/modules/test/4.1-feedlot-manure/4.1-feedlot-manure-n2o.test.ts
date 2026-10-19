import { getSheet } from '@/test/common/sheets';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { getCalculatorInput } from './common';
import {
  calculateDirectN2OEmissionsForFeedlot,
  calculateAtmosphericDepositionN2OEmissionsForFeedlot,
} from '@/modules/scope1/4-manure-management/4.1-feedlot-manure';

const extractInputsAndOutput = (cell: string) =>
  createSheetExtractor(getCalculatorInput, cell);

describe('4.1.1.3 & 4.1.1.4 Feedlot Direct N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.1-feedlot-manure/4.1-feedlot-manure.xlsx',
      '4.1.1.3',
    );

    const inputsAndOutputs = extractInputsAndOutput('AK')(sheet, 8, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForFeedlot,
      '4.1',
    );
  });
  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.1-feedlot-manure/4.1-feedlot-manure.xlsx',
      '4.1.1.4',
    );

    const inputsAndOutputs = extractInputsAndOutput('AK')(sheet, 8, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateDirectN2OEmissionsForFeedlot,
      '4.1',
    );
  });
});

describe('4.1.1.5 & 4.1.1.6 Feedlot Atmospheric Deposition N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.1-feedlot-manure/4.1-feedlot-manure.xlsx',
      '4.1.1.5',
    );

    const inputsAndOutputs = extractInputsAndOutput('AM')(sheet, 8, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateAtmosphericDepositionN2OEmissionsForFeedlot,
      '4.1',
    );
  });
  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.1-feedlot-manure/4.1-feedlot-manure.xlsx',
      '4.1.1.6',
    );

    const inputsAndOutputs = extractInputsAndOutput('AM')(sheet, 8, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateAtmosphericDepositionN2OEmissionsForFeedlot,
      '4.1',
    );
  });
});
