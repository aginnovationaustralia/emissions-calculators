import { ZodType } from 'zod';
import { $ZodIssue } from 'zod/v4/core';
import { objectFromEntries } from './common/tools/object';

export type ValidationErrorResult = {
  /**
   * The path to the property that failed validation.
   */
  path: string;

  /**
   * Message explaining why the validation failed.
   */
  message: string;
};

export class InputValidationError extends Error {
  public errors: Record<string, string>;

  constructor(errors: $ZodIssue[]) {
    const formattedErrors = errors.map((x) => ({
      key: x.path.join('.'),
      message: x.message,
    }));
    super(
      formattedErrors
        .map(({ key, message }) => `${key}: ${message}`)
        .join(', '),
    );
    this.errors = objectFromEntries(
      formattedErrors.map(({ key, message }) => [key, message]),
    );
    Object.setPrototypeOf(this, InputValidationError.prototype);
  }
}

export type ValidationResult<T extends object> =
  | {
      valid: true;
      result: T;
    }
  | {
      valid: false;
      issues: ValidationErrorResult[];
    };
export function validateCalculatorInput<T extends object>(
  schema: ZodType<T>,
  input: unknown,
): ValidationResult<T> {
  const parseResult = schema.safeParse(input);

  if (parseResult.success) {
    return {
      valid: true,
      result: parseResult.data,
    };
  } else {
    return {
      valid: false,
      issues: parseResult.error.issues.map((x) => ({
        path: x.path.join('.'),
        message: x.message,
      })),
    };
  }
}
