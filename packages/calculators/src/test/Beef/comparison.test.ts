import { validateCalculatorInput } from '@/calculators';
import { calculateBeef } from '@/calculators/Beef/calculator';
import { BeefInputSchema } from '@/types';
import { testContext } from '../common/context';
import { executeTest, traverseExpectations } from '../common/emissions';
import { getWorkbook } from '../common/sheets';
import {
  getBeefCalculatorInput,
  getExpectedBeefOutput,
} from '../SheepBeef/sheet-comparison';

describe('Compare beef calculator to spreadsheet', () => {
  test('should match spreadsheet', async () => {
    const workbook = await getWorkbook(
      './src/test/sheets/comparison/SB-GAFv2.6_Seasonal.xlsx',
    );
    const input = getBeefCalculatorInput(workbook);
    const validatedInput = validateCalculatorInput(BeefInputSchema, input);
    if (!validatedInput.valid) {
      throw new Error(validatedInput.message);
    }
    const expectedOutput = getExpectedBeefOutput(workbook);
    // @ts-expect-error - total is not needed for this test
    delete expectedOutput.net.total;
    const calculatorData = calculateBeef(
      validatedInput.result,
      testContext('Beef', workbook),
    );
    const tests = traverseExpectations(expectedOutput, calculatorData);
    tests.forEach(executeTest);
  });
});
