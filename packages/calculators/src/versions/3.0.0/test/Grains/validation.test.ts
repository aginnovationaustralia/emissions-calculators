import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { GrainsInput } from '../../types/Grains/input';
import { grainsTestData } from './grains.data';

describe('validating Grains test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(GrainsInput, grainsTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(GrainsInput);
  });
});

describe('validating Grains test inputs for incorrect inputs', () => {
  const classedInput = plainToClass(GrainsInput, {
    ...grainsTestData,
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
