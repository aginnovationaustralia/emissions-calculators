import { DeerInputSchema } from '@/types/Deer/input';
import { validateCalculatorInput } from '../../calculators/validate';
import { deerTestData } from './deer.data';

describe('validating Deer test inputs, all types of inputs', () => {
  test('validation should result in no errors', () => {
    const result = validateCalculatorInput(DeerInputSchema, deerTestData);
    expect(result.valid).toBe(true);
  });
});
