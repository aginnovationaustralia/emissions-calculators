import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { SugarInput } from '../../types/Sugar/input';
import { sugar1, sugarTestData } from './sugar.data';

describe('validating Sugar test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(SugarInput, sugarTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(SugarInput);
  });
});

describe('validating Sugar test inputs for incorrect inputs', () => {
  const input = {
    crops: [sugar1],
    electricityUse: 4000,
    electricityRenewable: 0,
    state: 'nsw',
  };

  const classedInput = plainToClass(SugarInput, {
    ...input,
    state: 'vic2',
  });
  const errors = validateSync(classedInput);

  test('validation should result in 2 errors', () => {
    expect(errors).toHaveLength(2);
  });

  test('validation error should contain message for state value', () => {
    expect(errors[0].constraints && errors[0].constraints.isEnum).toEqual(
      'state must be one of the following values: ',
    );
  });

  test('validation error should contain message for vegetation', () => {
    expect(errors[1].constraints && errors[1].constraints.isDefined).toEqual(
      'vegetation should not be null or undefined',
    );
  });
});
