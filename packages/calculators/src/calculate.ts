import { ZodType } from 'zod';
import { CalculatorOptions } from './calculators/execution/types';
import {
  validateCalculatorInput,
  ValidationIssue,
} from './calculators/validate';

export type CalculateEmissionsStatus = 'OK' | 'INVALID_INPUT' | 'ERROR';

export type CalculateEmissionsResult<O extends object> =
  | {
      status: 'OK';
      emissions: O;
    }
  | {
      status: 'INVALID_INPUT';
      issues: ValidationIssue[];
      message: string;
    }
  | {
      status: 'ERROR';
      error: Error;
    };

export const tryCalculate = <
  S extends object,
  Z extends ZodType<S>,
  O extends object,
>(
  schema: Z,
  input: unknown,
  calculator: (input: S, options?: CalculatorOptions) => O,
  options?: CalculatorOptions,
): CalculateEmissionsResult<O> => {
  try {
    const validatedInput = validateCalculatorInput(schema, input);
    if (!validatedInput.valid) {
      const message = validatedInput.issues
        .map((issue) => `${issue.path}: ${issue.message}`)
        .join(', ');
      return {
        status: 'INVALID_INPUT',
        issues: validatedInput.issues,
        message,
      };
    }
    const emissions = calculator(validatedInput.result, options);
    return {
      status: 'OK',
      emissions,
    };
  } catch (error) {
    return {
      status: 'ERROR',
      error: error as Error,
    };
  }
};
