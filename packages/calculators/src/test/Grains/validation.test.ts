import { GrainsInputSchema } from '@/types/Grains/input';
import { InputValidationError } from '../..';
import { validateCalculatorInput } from '../../calculators/validate';
import { grainsTestData } from './grains.data';

describe('validating Grains test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(GrainsInputSchema, grainsTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
  });
});

describe('validating Grains test inputs for incorrect inputs', () => {
  const invalidInput = {
    ...grainsTestData,
    state: 'vic2',
  };
  const result = GrainsInputSchema.safeParse(invalidInput);

  test('validation should result in 1 error', () => {
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toEqual(1);
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
