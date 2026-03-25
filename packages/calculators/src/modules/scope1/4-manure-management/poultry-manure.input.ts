import { input } from '@/tools/inputs';
import { days, head, massPerHeadPerDay, realNumber } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

const createPoultryManureClassInputSchema = <
  J extends '1' | '2a' | '2b' | '2c',
>(
  j: J,
) =>
  object({
    head: z
      .number()
      .min(0)
      .meta({ description: 'Number of heads' })
      .transform((val) => input(`Nj=${j}`, head(val))),
    days: z
      .number()
      .min(0)
      .meta({ description: 'Number of days' })
      .transform((val) => input(`Dj=${j}`, days(val))),
    method2NitrogenRetentionRate: proportion('Nitrogen retention rate')
      .optional()
      .transform((val) =>
        val === undefined ? undefined : input(`NRj=${j}`, realNumber(val)),
      ),
    method2DryMatterIntake: z
      .number()
      .gt(0)
      .optional()
      .transform((val) =>
        val === undefined
          ? undefined
          : input(`Ij=${j}`, massPerHeadPerDay('DryMatter', val)),
      ),

    manureAllocation: object({
      manureWithLitter: proportion('Fraction of manure with litter').transform(
        (val) => input(`MMSj=${j}m=10T=1`, realNumber(val)),
      ),
      beltManureRemoval: proportion(
        'Fraction of manure to belt manure removal',
      ).transform((val) => input(`MMSj=${j}m=11aT=1`, realNumber(val))),
      manureStoredInStorage: proportion(
        'Fraction of manure stored in storage',
      ).transform((val) => input(`MMSj=${j}m=11bT=1`, realNumber(val))),
      pastureRangeAndPaddock: proportion(
        'Fraction of manure stored in pasture range and paddock',
      ).transform((val) => input(`MMSj=${j}m=14T=1`, realNumber(val))),
    }),
  }).transform((val) => ({ ...val, classNumber: j }));

const PoultryManureClassInputSchemaLayers = createPoultryManureClassInputSchema(
  '1',
).transform((val) => ({
  ...val,
  className: 'layers' as const,
  classNumber: '1' as const,
}));
const PoultryManureClassInputSchemaMeatChickenGrowers =
  createPoultryManureClassInputSchema('2a').transform((val) => ({
    ...val,
    className: 'meatChickenGrowers' as const,
    classNumber: '2a' as const,
  }));
const PoultryManureClassInputSchemaMeatChickenBreeder =
  createPoultryManureClassInputSchema('2b').transform((val) => ({
    ...val,
    className: 'meatChickenBreeder' as const,
    classNumber: '2b' as const,
  }));
const PoultryManureClassInputSchemaMeatOther =
  createPoultryManureClassInputSchema('2c').transform((val) => ({
    ...val,
    className: 'meatOther' as const,
    classNumber: '2c' as const,
  }));

const PoultryManureClassesInputSchema = object({
  layers: PoultryManureClassInputSchemaLayers,
  meatChickenGrowers: PoultryManureClassInputSchemaMeatChickenGrowers,
  meatChickenBreeder: PoultryManureClassInputSchemaMeatChickenBreeder,
  meatOther: PoultryManureClassInputSchemaMeatOther,
});

const PoultryMMS2AllocationInputSchema = object({
  solidStorage: proportion(
    'Fraction of manure stored in solid storage',
  ).transform((val) => input('MMSmT=2', realNumber(val))),
  composting: proportion('Fraction of manure composted').transform((val) =>
    input('MMSmT=2', realNumber(val)),
  ),
  digester: proportion('Fraction of manure digested').transform((val) =>
    input('MMSmT=2', realNumber(val)),
  ),
  directProcessing: proportion(
    'Fraction of manure processed directly',
  ).transform((val) => input('MMSmT=2', realNumber(val))),
  directApplication: proportion(
    'Fraction of manure applied directly',
  ).transform((val) => input('MMSmT=2', realNumber(val))),
});

const PoultryMMS1To2AllocationInputSchema = object({
  manureWithLitter: PoultryMMS2AllocationInputSchema,
  beltManureRemoval: PoultryMMS2AllocationInputSchema,
  manureStoredInStorage: PoultryMMS2AllocationInputSchema,
});

export const PoultryManureInputSchema = object({
  type: z.literal('poultry'),
  classes: PoultryManureClassesInputSchema,
  mms1To2Allocation: PoultryMMS1To2AllocationInputSchema,
  fractionAppliedToSoils: proportion(
    'Fraction of manure applied to soil within the activity boundary',
  ).transform((val) => input('PF', realNumber(val))),
});

export type PoultryManureInput = z.input<typeof PoultryManureInputSchema>;
export type PoultryManureInputTransformed = z.output<
  typeof PoultryManureInputSchema
>;

export type PoultryMMS1To2AllocationInput = z.input<
  typeof PoultryMMS1To2AllocationInputSchema
>;
export type PoultryMMS1To2AllocationInputTransformed = z.output<
  typeof PoultryMMS1To2AllocationInputSchema
>;

export type PoultryManureClassesInput = z.input<
  typeof PoultryManureClassesInputSchema
>;
export type PoultryManureClassesInputTransformed = z.output<
  typeof PoultryManureClassesInputSchema
>;

export type PoultryManureClassLayersInput = z.input<
  typeof PoultryManureClassInputSchemaLayers
>;
export type PoultryManureClassLayersInputTransformed = z.output<
  typeof PoultryManureClassInputSchemaLayers
>;

export type PoultryManureClassMeatChickenGrowersInput = z.input<
  typeof PoultryManureClassInputSchemaMeatChickenGrowers
>;
export type PoultryManureClassMeatChickenGrowersInputTransformed = z.output<
  typeof PoultryManureClassInputSchemaMeatChickenGrowers
>;

export type PoultryManureClassMeatChickenBreederInput = z.input<
  typeof PoultryManureClassInputSchemaMeatChickenBreeder
>;
export type PoultryManureClassMeatChickenBreederInputTransformed = z.output<
  typeof PoultryManureClassInputSchemaMeatChickenBreeder
>;

export type PoultryManureClassMeatOtherInput = z.input<
  typeof PoultryManureClassInputSchemaMeatOther
>;
export type PoultryManureClassMeatOtherInputTransformed = z.output<
  typeof PoultryManureClassInputSchemaMeatOther
>;

export type PoultryManureClassInputTransformed =
  | PoultryManureClassLayersInputTransformed
  | PoultryManureClassMeatChickenGrowersInputTransformed
  | PoultryManureClassMeatChickenBreederInputTransformed
  | PoultryManureClassMeatOtherInputTransformed;
