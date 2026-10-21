import { core, object, z } from 'zod';
import { QualityTableSchema } from './quality';

/** Curried helper for Zod `.optional().transform(...)` so `undefined` is never passed to unit wrappers. */
export const mapOptional =
  <T, U>(fn: (value: T) => U) =>
  (value: T | undefined): U | undefined =>
    value === undefined ? undefined : fn(value);

const outputKeyShape = {
  amountGasKg: z.number(),
  gas: z.enum(['CO2', 'CH4', 'N2O', 'CO2e']),
  amountTonnesCO2e: z.number(),
  references: z.array(z.string()),
  constants: z.array(
    object({ name: z.string(), value: z.number(), units: z.string() }).meta({
      id: 'OutputConstant',
    }),
  ),
  inputs: z.array(
    object({
      name: z.string(),
      value: z.union([z.number(), z.string(), z.boolean()]),
      method: z.enum(['1', '2']),
      modules: z.array(z.string()),
      quality: QualityTableSchema.optional(),
    }).meta({ id: 'OutputInput' }),
  ),
};

/** A method 1 result has no method 2 value to report, so the key is omitted */
const outputMethod1 = z
  .strictObject({
    ...outputKeyShape,
    method: z.literal('1'),
    amountGasKgMethod1: z.number(),
  })
  .meta({ id: 'OutputMethod1', title: 'Method 1' });

/** A method 2 result will sometimes include a method 1 value as well */
const outputMethod2 = z
  .strictObject({
    ...outputKeyShape,
    method: z.literal('2'),
    amountGasKgMethod1: z.number().optional(),
    amountGasKgMethod2: z.number(),
  })
  .meta({ id: 'OutputMethod2', title: 'Method 2' });

export const outputKey = (description?: string) => {
  return z
    .discriminatedUnion('method', [outputMethod1, outputMethod2])
    .meta({ description });
};

export const outputTonnesCO2e = (description?: string) => {
  return z
    .strictObject({
      tonnesCO2e: z.number(),
    })
    .meta({ description });
};

/** A unitless or derived value; the description must state its units */
export const outputValue = (description: string) => {
  return z
    .strictObject({
      value: z.number(),
    })
    .meta({ description });
};

type ZodLooseShape = core.$ZodLooseShape;
type DefaultLooseShape = Partial<Record<never, core.SomeType>>;
export const emissionsOutput = <T extends ZodLooseShape = DefaultLooseShape>(
  calculatorName: string,
  shape: T,
) =>
  object(shape).meta({
    description: `Emissions calculation output for the ${calculatorName} calculator`,
  });
