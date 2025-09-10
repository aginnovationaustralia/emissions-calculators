import { ValidationErrorResult } from '@/utils/io';
import { ValidationError } from 'class-validator';

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
  errors: ValidationError[],
  path: string = '',
): ValidationErrorResult[] {
  return errors.reduce((acc, error) => {
    if (error.children && error.children.length > 0) {
      return [
        ...acc,
        ...parseValidationError(
          error.children,
          path.length > 0 ? `${path}.${error.property}` : error.property,
        ),
      ];
    }

    return [
      ...acc,
      {
        path: path.length > 0 ? `${path}.${error.property}` : error.property,
        message: Object.values(error.constraints || {}).join(', '),
        property: error.property,
        constraint: Object.keys(error.constraints || {})[0],
        value: error.value,
      },
    ];
  }, [] as ValidationErrorResult[]);
}
