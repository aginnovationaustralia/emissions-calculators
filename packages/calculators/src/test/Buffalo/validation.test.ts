import { BuffaloInputSchema } from '@/types/Buffalo/input';
import { InputValidationError } from '../..';
import { validateCalculatorInput } from '../../calculators/validate';
import { buffaloTestData } from './buffalo.data';

describe('validating Buffalo test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(BuffaloInputSchema, buffaloTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
  });
});
