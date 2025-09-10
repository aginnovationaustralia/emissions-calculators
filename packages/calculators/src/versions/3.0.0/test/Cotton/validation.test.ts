import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { CottonInput } from '../../types/Cotton/input';
import { CustomisedFertiliser } from '../../types/types';
import { cottonTestData } from './cotton.data';

describe('validating Cotton test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(CottonInput, cottonTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(CottonInput);
  });
});

describe('validating Cotton test inputs for incorrect inputs', () => {
  const classedInput = plainToClass(CottonInput, {
    ...cottonTestData,
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

describe('compatibility for migrated valid inputs', () => {
  test('old syntax for UAN is supported', () => {
    const cottonCrop = { ...cottonTestData.crops[0] };
    cottonCrop.otherFertiliserType =
      ' Urea-Ammonium Nitrate (UAN)' as CustomisedFertiliser;
    const classedInput = plainToClass(CottonInput, {
      ...cottonTestData,
      crops: [cottonCrop],
    });
    const errors = validateSync(classedInput);
    expect(classedInput.crops[0].otherFertiliserType).toEqual(
      'Urea-Ammonium Nitrate (UAN)',
    );

    expect(errors.length).toEqual(0);
  });

  test('new syntax for UAN is supported', () => {
    const cottonCrop = { ...cottonTestData.crops[0] };
    cottonCrop.otherFertiliserType = 'Urea-Ammonium Nitrate (UAN)';
    const classedInput = plainToClass(CottonInput, {
      ...cottonTestData,
      crops: [cottonCrop],
    });
    const errors = validateSync(classedInput);
    expect(errors.length).toEqual(0);

    expect(classedInput.crops[0].otherFertiliserType).toEqual(
      'Urea-Ammonium Nitrate (UAN)',
    );
  });
});
