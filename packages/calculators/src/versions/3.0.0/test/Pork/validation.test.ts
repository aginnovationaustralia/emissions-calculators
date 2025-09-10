import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { PorkInput } from '../../types/Pork/input';
import { porkTestData } from './pork.data';

describe('validating Pork test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(PorkInput, porkTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(PorkInput);
  });
});

describe('validating Pork test inputs for incorrect inputs', () => {
  const classedInput = plainToClass(PorkInput, {
    ...porkTestData,
    state: 'vic2',
  });
  const errors = validateSync(classedInput);

  test('validation should result in 1 error', () => {
    expect(errors.length).toEqual(1);
  });

  test('validation error should contain message for state value', () => {
    expect(errors[0].constraints && errors[0].constraints.isEnum).toEqual(
      'state must be one of the following values: ',
    );
  });
});

describe('support for single pork instance', () => {
  const t = () =>
    validateCalculatorInput(PorkInput, {
      ...porkTestData,
      pork: porkTestData.pork[0],
    });

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(PorkInput);
    expect(t().pork).toEqual([
      {
        ...porkTestData.pork[0],
        fertiliser: {
          ...porkTestData.pork[0].fertiliser,
          otherType: 'Urea-Ammonium Nitrate (UAN)',
        },
      },
    ]);
  });
});

describe('validate no pork instance', () => {
  const classedInput = plainToClass(PorkInput, {
    ...porkTestData,
    pork: [],
  });
  const errors = validateSync(classedInput);

  test('validation should result in no errors', () => {
    expect(errors.length).toEqual(0);
  });
});
