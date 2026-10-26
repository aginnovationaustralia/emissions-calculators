import { core, object, z } from 'zod';
import { QualityTableSchema } from './quality';

/** Curried helper for Zod `.optional().transform(...)` so `undefined` is never passed to unit wrappers. */
export const mapOptional =
  <T, U>(fn: (value: T) => U) =>
  (value: T | undefined): U | undefined =>
    value === undefined ? undefined : fn(value);

const outputKeyShape = {
  amountGasKg: z.number().meta({
    description:
      'Amount of the gas emitted, in kg of that gas. Uses the method 2 value when one is available, otherwise method 1',
  }),
  gas: z.enum(['CO2', 'CH4', 'N2O', 'CO2e']).meta({
    description:
      'The gas this amount is measured in. CO2e is used for amounts already expressed as carbon dioxide equivalent',
  }),
  amountTonnesCO2e: z.number().meta({
    description:
      'Amount of the gas emitted, converted to tonnes of carbon dioxide equivalent (CO2e)',
  }),
  references: z.array(z.string()).meta({
    description: 'References to the equations used to calculate this result',
  }),
  constants: z
    .array(
      object({
        name: z.string().meta({ description: 'Name of the constant' }),
        value: z.number().meta({ description: 'Value of the constant' }),
        units: z
          .string()
          .meta({ description: 'Units the constant value is expressed in' }),
      }).meta({
        id: 'OutputConstant',
      }),
    )
    .meta({ description: 'Constants used in this calculation' }),
  inputs: z
    .array(
      object({
        name: z.string().meta({ description: 'Name of the input' }),
        value: z
          .union([z.number(), z.string(), z.boolean()])
          .meta({ description: 'Value of the input, as provided' }),
        method: z.enum(['1', '2']).meta({
          description: 'The calculation method this input contributes to',
        }),
        modules: z
          .array(z.string())
          .meta({ description: 'Modules this input is relevant to' }),
        quality: QualityTableSchema.meta({
          description: 'Data quality ratings for this input, where provided',
        }).optional(),
      }).meta({ id: 'OutputInput' }),
    )
    .meta({ description: 'Inputs used in this calculation' }),
};

const methodSchema = <M extends '1' | '2'>(method: M) =>
  z.literal(method).meta({
    description:
      'The calculation method used to produce amountGasKg. Method 2 uses more specific, optional inputs',
  });

const amountGasKgMethod1Description =
  'Amount of the gas emitted using method 1, in kg of that gas';

/** A method 1 result has no method 2 value to report, so the key is omitted */
const outputMethod1 = object({
  ...outputKeyShape,
  method: methodSchema('1'),
  amountGasKgMethod1: z
    .number()
    .meta({ description: amountGasKgMethod1Description }),
}).meta({ id: 'OutputMethod1', title: 'Method 1' });

/** A method 2 result will sometimes include a method 1 value as well */
const outputMethod2 = object({
  ...outputKeyShape,
  method: methodSchema('2'),
  amountGasKgMethod1: z
    .number()
    .meta({
      description: `${amountGasKgMethod1Description}, when a method 1 value can be calculated`,
    })
    .optional(),
  amountGasKgMethod2: z.number().meta({
    description: 'Amount of the gas emitted using method 2, in kg of that gas',
  }),
}).meta({ id: 'OutputMethod2', title: 'Method 2' });

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
