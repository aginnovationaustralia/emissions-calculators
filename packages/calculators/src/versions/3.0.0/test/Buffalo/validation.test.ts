import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { BuffaloInput } from '../../types/Buffalo/input';
import { buffaloTestData } from './buffalo.data';

describe('validating Buffalo test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(BuffaloInput, buffaloTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(BuffaloInput);
  });
});
