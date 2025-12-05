import { core, z } from 'zod';
import { SequestrationTotalOutputSchema } from './sequestration.total.output';

export const deprecated = (description: string, deprecationNote?: string) => {
  return {
    description: deprecationNote
      ? `${description}. Deprecation note: ${deprecationNote}`
      : description,
    deprecated: true,
  };
};

export const proportion = (description?: string) =>
  z.number().min(0).max(1).meta({ description });

export const percentage = (description?: string) =>
  z.number().min(0).max(100).meta({ description });

export const SeasonalProportionsSchema = (description: string) =>
  z
    .object({
      spring: proportion(),
      summer: proportion(),
      autumn: proportion(),
      winter: proportion(),
    })
    .meta({ description });

type ZodLooseShape = core.$ZodLooseShape;
type DefaultLooseShape = Partial<Record<never, core.SomeType>>;

export const calculatorInput = <T extends ZodLooseShape = DefaultLooseShape>(
  calculatorName: string,
  shape: T,
) =>
  z.object(shape).meta({
    description: `Input data required for the ${calculatorName} calculator`,
  });

export const singleEnterpriseInput = <
  T extends 'id' extends keyof T ? never : ZodLooseShape = DefaultLooseShape,
>(
  calculatorName: string,
  shape: T,
) =>
  z
    .object({
      id: z
        .string()
        .optional()
        .meta({
          description: `Unique identifier for this ${calculatorName} activity`,
        }),
      ...shape,
    })
    .meta({
      description: `Input data required for a single ${calculatorName} enterprise`,
    });

export const vegetationInput = <T extends ZodLooseShape = DefaultLooseShape>(
  calculatorName: string,
  shape: T,
) =>
  z.object(shape).meta({
    description: `Non-productive vegetation inputs along with allocations to each ${calculatorName} activity`,
  });

export const emissionsOutput = <T extends ZodLooseShape = DefaultLooseShape>(
  calculatorName: string,
  shape: T,
) =>
  z.object(shape).meta({
    description: `Emissions calculation output for the ${calculatorName} calculator`,
  });

export const intermediateEmissionsOutput = <
  T extends 'id' extends keyof T
    ? never
    : 'carbonSequestration' extends keyof T
    ? never
    : ZodLooseShape = DefaultLooseShape,
>(
  calculatorName: string,
  shape: T,
) =>
  z
    .object({
      id: z.string().meta({
        description: `Unique identifier for this ${calculatorName} activity`,
      }),
      ...shape,
      carbonSequestration: SequestrationTotalOutputSchema,
    })
    .meta({
      description: `Intermediate emissions calculation output for the ${calculatorName} calculator`,
    });

export const object = <T extends ZodLooseShape = DefaultLooseShape>(shape: T) =>
  z.strictObject(shape);
