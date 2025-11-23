import { HorticultureInputSchema } from '@/types/Horticulture/input';
import { InputValidationError } from '../..';
import { validateCalculatorInput } from '../../calculators/validate';
import { horticultureTestData } from './horticulture.data';

describe('validating Horticulture test inputs, all types of inputs', () => {
  const t = () =>
    validateCalculatorInput(HorticultureInputSchema, horticultureTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
  });

  test.skip('inhibitor fields are optional', () => {
    const data = {
      ...horticultureTestData,
      ureaseInhibitorUsed: undefined,
      nitrificationInhibitorUsed: undefined,
    };
    const result = HorticultureInputSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

describe('validating Horticulture test inputs for incorrect inputs', () => {
  const invalidInput = {
    ...horticultureTestData,
    state: 'vic2',
  };
  const result = HorticultureInputSchema.safeParse(invalidInput);

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
