import { InputValidationError } from '@/utils/io';
import { parseValidationError } from '@/validators/errorConversion';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { calculateBeef as calculateBeefInternal } from './Beef/calculator';
import {
  loadConstants
} from './constants/constantsLoader';
import { BeefInput } from './types/Beef/input';
import { BeefOutput } from './types/Beef/output';

export function validateCalculatorInput<T extends object>(
  cls: ClassConstructor<T>,
  input: unknown,
) {
  const classedInput = plainToClass(cls, input, { exposeDefaultValues: true });
  const errors = validateSync(classedInput);

  if (errors && errors.length > 0) {
    throw new InputValidationError(...parseValidationError(errors));
  }

  return classedInput;
}

function contextFor(calculator: string) {
  return {
    calculator,
    version: '3.0.0',
    constants: loadConstants(),
    timestamp: new Date().toISOString(),
  };
}

export function calculateBeef(input: BeefInput): BeefOutput {
  return calculateBeefInternal(input, contextFor('beef'));
}
