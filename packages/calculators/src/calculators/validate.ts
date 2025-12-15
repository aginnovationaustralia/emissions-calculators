import { ZodType } from 'zod';

export type ValidationIssue = {
  /**
   * The path to the property that failed validation.
   */
  path: string;

  /**
   * The path to the property that failed validation, as an array of elements.
   */
  pathElements: string[];

  /**
   * Message explaining why the validation failed.
   */
  message: string;
};

export type ValidationResult<T extends object> =
  | {
      valid: true;
      result: T;
    }
  | {
      valid: false;
      issues: ValidationIssue[];
      message: string;
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
        pathElements: x.path.map((x) => x.toString()),
        message: x.message,
      })),
      message: parseResult.error.issues
        .map((x) => `${x.path.join('.')}: ${x.message}`)
        .join(', '),
    };
  }
}
