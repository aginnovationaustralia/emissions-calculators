import { SugarInputSchema } from '@/types/Sugar/input';
import { validateCalculatorInput } from '../../calculators/validate';
import { sugar1, sugarTestData } from './sugar.data';

describe('validating Sugar test inputs, all types of inputs', () => {
  const t = validateCalculatorInput(SugarInputSchema, sugarTestData);

  test('validation should result in no errors', () => {
    expect(t).toEqual(
      expect.objectContaining({
        valid: true,
        result: expect.any(Object),
      }),
    );
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
    expect(validateCalculatorInput(SugarInputSchema, invalidInput)).toEqual(
      expect.objectContaining({
        valid: false,
        issues: expect.any(Array),
      }),
    );
  });
});
