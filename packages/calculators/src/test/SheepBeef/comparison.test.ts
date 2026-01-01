import { validateCalculatorInput } from '@/calculators';
import { calculateSheepBeef } from '@/calculators/SheepBeef/calculator';
import { SheepBeefInput, SheepBeefInputSchema } from '@/types';
import XLSX from 'xlsx-populate';
import { testContext } from '../common/context';
import { executeTest, traverseExpectations } from '../common/emissions';
import { getWorkbook } from '../common/sheets';
import {
  getAllSheepBeefVegetations,
  getBeefCalculatorInput,
  getExpectedSheepBeefOutput,
  getSheepCalculatorInput,
} from './sheet-comparison';

const getCalculatorInput = (workbook: XLSX.Workbook): SheepBeefInput => {
  const beefInput = getBeefCalculatorInput(workbook);
  const sheepInput = getSheepCalculatorInput(workbook);

  const sheetInputVegetation = workbook.sheet('Data input - vegetation');
  const vegetation = getAllSheepBeefVegetations(sheetInputVegetation);

  // NOTE: Assumes location is the same for sheep and beef
  const result: SheepBeefInput = {
    state: beefInput.state,
    beef: beefInput.beef,
    burning: beefInput.burning,
    northOfTropicOfCapricorn: beefInput.northOfTropicOfCapricorn,
    rainfallAbove600: beefInput.rainfallAbove600,
    sheep: sheepInput.sheep,
    vegetation,
  };

  return result;
};

describe('Compare beef calculator to spreadsheet', () => {
  test('should match spreadsheet', async () => {
    const workbook = await getWorkbook(
      './src/test/sheets/comparison/SB-GAFv2.6_Seasonal.xlsx',
    );
    const input = getCalculatorInput(workbook);
    const validatedInput = validateCalculatorInput(SheepBeefInputSchema, input);
    if (!validatedInput.valid) {
      throw new Error(validatedInput.message);
    }
    // console.dir(validatedInput, { depth: null });
    const expectedOutput = getExpectedSheepBeefOutput(workbook);
    const { metaData: _, ...calculatorData } = calculateSheepBeef(
      validatedInput.result,
      testContext('SheepBeef', workbook),
    );
    // console.dir(calculatorData, { depth: null });
    const tests = traverseExpectations(expectedOutput, calculatorData);
    tests.forEach(executeTest);
  });
});
