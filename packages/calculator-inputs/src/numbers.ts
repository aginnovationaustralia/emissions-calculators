import { z } from 'zod';

/** Adds validation to a number schema, e.g. `(schema) => schema.min(0)`. */
export type NumberSchemaTweaker = (schema: z.ZodNumber) => z.ZodNumber;

export const isNonNegative: NumberSchemaTweaker = (schema) => schema.min(0);
export const isPositive: NumberSchemaTweaker = (schema) => schema.gt(0);
export const isProportion: NumberSchemaTweaker = (schema) =>
  schema.min(0).max(1);
export const isPercentage: NumberSchemaTweaker = (schema) =>
  schema.min(0).max(100);

type NumberSchema = z.ZodType<number, number>;

/** Fingerprint a number schema's JSON Schema constraints (ignoring $schema). */
const numberConstraintKey = (schema: z.ZodNumber): string => {
  const json = z.toJSONSchema(schema);
  const { $schema: _schema, ...rest } = json;
  return JSON.stringify(rest);
};

/**
 * Stable, description-free number schemas, each with an OpenAPI component id, so the common
 * constraints are emitted once and shared by `$ref`.
 */
const builtInNumberSchemas: [string, NumberSchemaTweaker | undefined][] = [
  ['NumberInput', undefined],
  ['NonNegativeNumberInput', isNonNegative],
  ['ProportionNumberInput', isProportion],
  ['PercentageNumberInput', isPercentage],
  ['PositiveNumberInput', isPositive],
  ['MinOneNumberInput', (schema) => schema.min(1)],
];

const numberSchemasByConstraint = new Map<string, NumberSchema>();

/**
 * Registers a stable number schema for a set of constraints. Any number input whose constraints
 * match exactly uses it, and is emitted as a `$ref` to the component `id`.
 */
export const registerNumberSchema = (
  id: string,
  tweaker?: NumberSchemaTweaker,
) => {
  const schema = tweaker ? tweaker(z.number()) : z.number();
  numberSchemasByConstraint.set(
    numberConstraintKey(schema),
    schema.meta({ id }),
  );
};

for (const [id, tweaker] of builtInNumberSchemas) {
  registerNumberSchema(id, tweaker);
}

/**
 * The number schema for a set of constraints: the registered component if one matches, otherwise
 * an inline schema with those constraints.
 */
export const resolveNumberSchema = (
  tweaker?: NumberSchemaTweaker,
): NumberSchema => {
  const schema = tweaker ? tweaker(z.number()) : z.number();
  return numberSchemasByConstraint.get(numberConstraintKey(schema)) ?? schema;
};
