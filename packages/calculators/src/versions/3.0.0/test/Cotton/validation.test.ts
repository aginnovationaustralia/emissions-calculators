import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { CottonInputSchema } from '../../types/Cotton/input';
import { CustomisedFertiliser } from '../../types/types';
import { cottonTestData } from './cotton.data';

describe('validating Cotton test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(CottonInputSchema, cottonTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(CottonInputSchema);
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

describe('compatibility for migrated valid inputs', () => {
  test('old syntax for UAN is supported', () => {
    const cottonCrop = { ...cottonTestData.crops[0] };
    cottonCrop.otherFertiliserType =
      ' Urea-Ammonium Nitrate (UAN)' as CustomisedFertiliser;
    const inputWithUAN = {
      ...cottonTestData,
      crops: [cottonCrop],
    };
    const result = CottonInputSchema.safeParse(inputWithUAN);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.crops[0].otherFertiliserType).toEqual(
        'Urea-Ammonium Nitrate (UAN)',
      );
    }
  });

  test('new syntax for UAN is supported', () => {
    const cottonCrop = { ...cottonTestData.crops[0] };
    cottonCrop.otherFertiliserType = 'Urea-Ammonium Nitrate (UAN)';
    const inputWithUAN = {
      ...cottonTestData,
      crops: [cottonCrop],
    };
    const result = CottonInputSchema.safeParse(inputWithUAN);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.crops[0].otherFertiliserType).toEqual(
        'Urea-Ammonium Nitrate (UAN)',
      );
    }
  });
});
