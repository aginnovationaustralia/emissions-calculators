import { PorkInputSchema } from '@/types/Pork/input';
import { validateCalculatorInput } from '../../calculators/validate';
import { porkTestData } from './pork.data';

describe('validating Pork test inputs, all types of inputs', () => {
  test('validation should result in no errors', () => {
    const result = validateCalculatorInput(PorkInputSchema, porkTestData);
    expect(result.valid).toBe(true);
  });
});

describe('validating Pork test inputs for incorrect inputs', () => {
  const invalidInput = {
    ...porkTestData,
    state: 'vic2',
  };
  const result = PorkInputSchema.safeParse(invalidInput);

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

describe('a single pork instance is not supported', () => {
  const t = validateCalculatorInput(PorkInputSchema, {
    ...porkTestData,
    pork: porkTestData.pork[0],
  });

  test('validation should result in no errors', () => {
    expect(t).toEqual(
      expect.objectContaining({
        valid: false,
        issues: expect.any(Array),
      }),
    );
  });
});

describe('validate no pork instance', () => {
  const inputWithNoPork = {
    ...porkTestData,
    pork: [],
  };
  const result = PorkInputSchema.safeParse(inputWithNoPork);

  test('validation should result in no errors', () => {
    expect(result.success).toBe(true);
  });
});
