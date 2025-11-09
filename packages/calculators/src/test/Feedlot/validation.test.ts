import { FeedlotInputSchema } from '@/types/Feedlot/input';
import { InputValidationError } from '../..';
import { validateCalculatorInput } from '../../calculators/calculators';
import { feedlotTestData } from './feedlot.data';

describe('validating Feedlot test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(FeedlotInputSchema, feedlotTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
  });
});

describe('validating Feedlot test inputs for incorrect inputs', () => {
  const invalidInput = {
    ...feedlotTestData,
    state: 'vic2',
  };
  const result = FeedlotInputSchema.safeParse(invalidInput);

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
