import { CottonInputSchema } from '@/types/Cotton/input';
import { validateCalculatorInput } from '../../calculators/validate';
import { cottonTestData } from './cotton.data';

describe('validating Cotton test inputs, all types of inputs', () => {
  test('validation should result in no errors', () => {
    const result = validateCalculatorInput(CottonInputSchema, cottonTestData);
    expect(result.valid).toBe(true);
  });
});

describe('validating Cotton test inputs for incorrect inputs', () => {
  const invalidInput = {
    ...cottonTestData,
    state: 'vic2',
  };
  const result = CottonInputSchema.safeParse(invalidInput);

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
