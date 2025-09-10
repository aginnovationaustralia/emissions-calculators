import { TypeHelpOptions, TypeOptions, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export const IsNumberArray = () => IsNumber({}, { each: true });

/**
 * Simpler decorator for adding a description to a JSONSchema
 */
export const SchemaDescription = (description: string) =>
  JSONSchema({ description });

function addDeprecatedNote(description: string, deprecatedNote?: string) {
  const descriptionWithoutFullStop = description.endsWith('.')
    ? description.slice(0, -1)
    : description;

  if (deprecatedNote) {
    return `${descriptionWithoutFullStop}. Deprecated note: ${deprecatedNote}`;
  }
  return description;
}

export const DeprecatedSchemaDescription = (
  description: string,
  deprecatedNote?: string,
) =>
  JSONSchema({
    description: addDeprecatedNote(description, deprecatedNote),
    deprecated: true,
  });

/**
 * This is a decorator that combined an automated JSONSchema ref definition of the
 * type name for arrays, as well as `Type`. This is so we don't need manually
 * overwritten schema refs.
 */
export function TypeWithArraySchema(
  // eslint-disable-next-line @typescript-eslint/ban-types
  typeFunction?: (type?: TypeHelpOptions) => Function,
  description?: string,
  options?: TypeOptions,
) {
  const descriptionObj = description ? { description } : {};

  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: object | Function, key?: string) => {
    if (typeFunction !== undefined) {
      JSONSchema({
        items: {
          $ref: `#/definitions/${typeFunction().name}`,
        },
        ...descriptionObj,
      })(target, key);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Type(typeFunction, options)(target, key);
  };
}
