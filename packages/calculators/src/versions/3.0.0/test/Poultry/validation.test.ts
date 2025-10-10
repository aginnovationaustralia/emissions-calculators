import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { PoultryInputSchema } from '../../types/Poultry/input';
import { poultryTestData } from './poultry.data';

describe('validating Poultry test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(PoultryInputSchema, poultryTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(PoultryInputSchema);
  });
});

describe('validating Poultry test inputs for incorrect inputs', () => {
  const invalidInput = {
    ...poultryTestData,
    state: 'vic2',
  };
  const result = PoultryInputSchema.safeParse(invalidInput);

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
