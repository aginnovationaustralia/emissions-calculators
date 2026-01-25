import { core, object, z } from 'zod';

export const outputKey = (description?: string) => {
  return z
    .strictObject({
      value: z.number(),
      references: z.array(z.string()),
      constants: z.array(z.object({ name: z.string(), value: z.number() })),
    })
    .meta({ description });
};

export const outputValue = (description?: string) => {
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
