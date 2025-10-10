import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { RiceInputSchema } from '../../types/Rice/input';
import { riceTestData } from './rice.data';

describe('validating Rice test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(RiceInputSchema, riceTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(RiceInputSchema);
  });
});

describe('validating Rice test inputs for incorrect inputs', () => {
  const invalidInput = {
    ...riceTestData,
    state: 'vic2',
  };
  const result = RiceInputSchema.safeParse(invalidInput);

  test('validation should result in 1 error', () => {
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  test('validation error should contain message for state value', () => {
    expect(result.success).toBe(false);
    if (!result.success) {
      const stateError = result.error.issues.find((issue) =>
        issue.path.includes('state'),
      );
      expect(stateError).toBeDefined();
    }
  });
});
