import { BuffaloInputSchema } from '@/types/Buffalo/input';
import { validateCalculatorInput } from '../../calculators/validate';
import { buffaloTestData } from './buffalo.data';

describe('validating Buffalo test inputs, all types of inputs', () => {
  test('validation should result in no errors', () => {
    const result = validateCalculatorInput(BuffaloInputSchema, buffaloTestData);
    expect(result.valid).toBe(true);
  });
});
