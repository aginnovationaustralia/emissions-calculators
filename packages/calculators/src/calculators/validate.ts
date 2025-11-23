import { ZodType } from 'zod';
import { $ZodIssue } from 'zod/v4/core';

export type ValidationErrorResult = {
  /**
   * The path to the property that failed validation.
   */
  path: string;

  /**
   * Message explaining why the validation failed.
   */
  message: string;

  /**
   * Input/current value.
   */
  value: unknown;
};

export class InputValidationError extends Error {
  public errors: ValidationErrorResult[];

  constructor(...errors: ValidationErrorResult[]) {
    super(errors.map((x) => `${x.path}: ${x.message}`).join(', '));
    Object.setPrototypeOf(this, InputValidationError.prototype);

    this.errors = errors;
  }
}

function parseValidationError(errors: $ZodIssue[]): ValidationErrorResult[] {
  return errors.reduce((acc, error) => {
    return [
      ...acc,
      {
        path: error.path.join('.'),
        message: error.message,
        value: error.input,
      },
    ];
  }, [] as ValidationErrorResult[]);
}

export function validateCalculatorInput<T extends object>(
  schema: ZodType<T>,
  input: unknown,
) {
  const parseResult = schema.safeParse(input);

  if (!parseResult.success) {
    throw new InputValidationError(
      ...parseValidationError(parseResult.error.issues),
    );
  } else {
    return parseResult.data;
  }
}
