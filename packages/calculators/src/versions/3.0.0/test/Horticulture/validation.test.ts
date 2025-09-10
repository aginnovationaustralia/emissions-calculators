import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { HorticultureInput } from '../../types/Horticulture/input';
import { horticultureTestData } from './horticulture.data';

describe('validating Horticulture test inputs, all types of inputs', () => {
  const t = () =>
    validateCalculatorInput(HorticultureInput, horticultureTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrowError(InputValidationError);
    expect(t()).toBeInstanceOf(HorticultureInput);
  });

  test('inhibitor fields are optional', () => {
    const data = {
      ...horticultureTestData,
      ureaseInhibitorUsed: undefined,
      nitrificationInhibitorUsed: undefined,
    };
    const errors = validateSync(data);
    expect(errors.length).toEqual(0);
  });
});

describe('validating Horticulture test inputs for incorrect inputs', () => {
  const classedInput = plainToClass(HorticultureInput, {
    ...horticultureTestData,
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
