import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { GoatInputSchema } from '../../types/Goat/input';
import { goatComplete, goatTestData } from './goats.data';
import { veg1, veg2 } from './vegetation.data';

describe('validating Goat test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(GoatInputSchema, goatTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(GoatInputSchema);
  });
});

describe('validating Goat test input using original veg schema', () => {
  const input = {
    state: 'vic',
    northOfTropicOfCapricorn: false,
    rainfallAbove600: true,
    goats: [goatComplete],
    vegetation: [veg1, veg2],
  };

  const result = GoatInputSchema.safeParse(input);

  test('validation should result in no errors', () => {
    expect(result.success).toBe(true);
  });
});

describe('support for single goat instance', () => {
  const t = () =>
    validateCalculatorInput(GoatInputSchema, {
      ...goatTestData,
      goats: goatTestData.goats[0],
    });

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(GoatInputSchema);
    expect(t().goats).toEqual([goatTestData.goats[0]]);
  });
});

describe('invalid requests', () => {
  test('validation should fail with invalid electricityRenewable', () => {
    const tHigh = () =>
      validateCalculatorInput(GoatInputSchema, {
        ...goatTestData,
        goats: [{ ...goatTestData.goats[0], electricityRenewable: 2 }],
      });
    expect(tHigh).toThrow(InputValidationError);

    const tLow = () =>
      validateCalculatorInput(GoatInputSchema, {
        ...goatTestData,
        goats: [{ ...goatTestData.goats[0], electricityRenewable: -1 }],
      });
    expect(tLow).toThrow(InputValidationError);
  });
});
