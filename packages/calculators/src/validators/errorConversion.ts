import { ValidationErrorResult } from '@/utils/io';
import { $ZodIssue } from 'zod/v4/core';

// export function parseValidationErrors(
//   errors: ValidationError[],
//   path: string = '',
// ): string {
//   return errors
//     .map((e) => {
//       if (e.children && e.children.length > 0) {
//         return `${e.property}:\n${errorsToString(
//           e.children,
//           `${path}.${e.property}`,
//         )}`;
//       }
//       return `${e.property}: ${Object.values(e.constraints || {}).join(
//         ', ',
//       )}\nFull object: ${JSON.stringify(e.target, null, 2)}`;
//     })
//     .join('\n');
// }

/**
 * Works on a single error due to the way errors should be handled, one at a
 * time.
 * @param error
 * @param path
 * @returns
 */
export function parseValidationError(
  errors: $ZodIssue[],
): ValidationErrorResult[] {
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
