import { InputValidationError } from '@/utils/io';
import { parseValidationError } from '@/validators/errorConversion';
import { ZodType } from 'zod';

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
