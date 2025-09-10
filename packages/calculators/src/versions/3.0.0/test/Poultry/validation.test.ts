import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { PoultryInput } from '../../types/Poultry/input';
import { poultryTestData } from './poultry.data';

describe('validating Poultry test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(PoultryInput, poultryTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrowError(InputValidationError);
    expect(t()).toBeInstanceOf(PoultryInput);
  });
});

describe('validating Poultry test inputs for incorrect inputs', () => {
  const classedInput = plainToClass(PoultryInput, {
    ...poultryTestData,
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
