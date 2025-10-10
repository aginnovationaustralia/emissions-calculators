import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { SugarInputSchema } from '../../types/Sugar/input';
import { sugar1, sugarTestData } from './sugar.data';

describe('validating Sugar test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(SugarInputSchema, sugarTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
  });
});

describe('validating Sugar test inputs for incorrect inputs', () => {
  const invalidInput = {
    crops: [sugar1],
    electricityUse: 4000,
    electricityRenewable: 0,
    state: 'vic2', // Invalid state
    // Missing vegetation field
  };

  test('validation should throw InputValidationError for invalid input', () => {
    expect(() =>
      validateCalculatorInput(SugarInputSchema, invalidInput),
    ).toThrow(InputValidationError);
  });
});
