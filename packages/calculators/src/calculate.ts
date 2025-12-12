import { ZodType } from 'zod';
import { CalculatorOptions } from './calculators/execution/types';
import {
  validateCalculatorInput,
  ValidationIssue,
} from './calculators/validate';

export enum CalculateEmissionsStatus {
  OK,
  INVALID_INPUT,
  ERROR,
}
export type CalculateEmissionsResult<O extends object> =
  | {
      status: CalculateEmissionsStatus.OK;
      emissions: O;
    }
  | {
      status: CalculateEmissionsStatus.INVALID_INPUT;
      issues: ValidationIssue[];
    }
  | {
      status: CalculateEmissionsStatus.ERROR;
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
      return {
        status: CalculateEmissionsStatus.INVALID_INPUT,
        issues: validatedInput.issues,
      };
    }
    const emissions = calculator(validatedInput.result, options);
    return {
      status: CalculateEmissionsStatus.OK,
      emissions,
    };
  } catch (error) {
    return {
      status: CalculateEmissionsStatus.ERROR,
      error: error as Error,
    };
  }
};
