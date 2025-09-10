import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { GoatInput } from '../../types/Goat/input';
import { goatComplete, goatTestData } from './goats.data';
import { veg1, veg2 } from './vegetation.data';

describe('validating Goat test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(GoatInput, goatTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(GoatInput);
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

  const classedInput = plainToClass(GoatInput, input);
  const errors = validateSync(classedInput);

  test('validation should result in no errors', () => {
    expect(errors).toEqual([]);
  });
});

describe('support for single goat instance', () => {
  const t = () =>
    validateCalculatorInput(GoatInput, {
      ...goatTestData,
      goats: goatTestData.goats[0],
    });

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(GoatInput);
    expect(t().goats).toEqual([goatTestData.goats[0]]);
  });
});

describe('invalid requests', () => {
  test('validation should fail with invalid electricityRenewable', () => {
    const tHigh = () =>
      validateCalculatorInput(GoatInput, {
        ...goatTestData,
        goats: [{ ...goatTestData.goats[0], electricityRenewable: 2 }],
      });
    expect(tHigh).toThrow(InputValidationError);

    const tLow = () =>
      validateCalculatorInput(GoatInput, {
        ...goatTestData,
        goats: [{ ...goatTestData.goats[0], electricityRenewable: -1 }],
      });
    expect(tLow).toThrow(InputValidationError);
  });
});
