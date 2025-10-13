import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { DeerInputSchema } from '../../types/Deer/input';
import { deerTestData } from './deer.data';

describe('validating Deer test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(DeerInputSchema, deerTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
  });
});
