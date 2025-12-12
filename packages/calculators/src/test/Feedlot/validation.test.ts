import { FeedlotInputSchema } from '@/types/Feedlot/input';
import { validateCalculatorInput } from '../../calculators/validate';
import { feedlotTestData } from './feedlot.data';

describe('validating Feedlot test inputs, all types of inputs', () => {
  test('validation should result in no errors', () => {
    const result = validateCalculatorInput(FeedlotInputSchema, feedlotTestData);
    expect(result.valid).toBe(true);
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
