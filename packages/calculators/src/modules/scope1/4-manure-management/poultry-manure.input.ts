import { input } from '@/tools/inputs';
import {
  days,
  head,
  massPerHeadPerDay,
  massPerMass,
  realNumber,
} from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { mapOptional } from '@/tools/zod';
import { z } from 'zod';
import { MeanAnnualTemperatures } from '@/constants/enums';

const createPoultryMMSAllocationInputSchema = <
  M extends '10' | '11a' | '11b' | '14',
>(
  m: M,
  system: string,
) =>
  object({
    allocationStage1: proportion(
      `Fraction of manure initially treated in a ${system} manure management system in initial stage of treatment`,
    ).transform((val) => input(`MMSm=${m}T=1`, realNumber(val))),
    solidStorage: proportion(
      `Fraction of the manure initially treated in a ${system} manure management system that was then stored in solid storage`,
    ).transform((val) => input('MMSm=4T=2', realNumber(val))),
    composting: proportion(
      `Fraction of the manure initially treated in a ${system} manure management system that was then composted`,
    ).transform((val) => input('MMSm=6T=2', realNumber(val))),
    digester: proportion(
      `Fraction of the manure initially treated in a ${system} manure management system that was then digested`,
    ).transform((val) => input('MMSm=7T=2', realNumber(val))),
    deepLitter: proportion(
      `Fraction of the manure initially treated in a ${system} manure management system that was then moved to a deep litter system`,
    ).transform((val) => input('MMSm=8T=2', realNumber(val))),
    directProcessing: proportion(
      `Fraction of the manure initially treated in a ${system} manure management system that was then processed directly`,
    ).transform((val) => input('MMSm=12T=2', realNumber(val))),
    directApplication: proportion(
      `Fraction of the manure initially applied directly to soil after being treated in a ${system} manure management system`,
    ).transform((val) => input('MMSm=13T=2', realNumber(val))),
  });

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
      .transform(mapOptional((val) => input(`NRj=${j}`, realNumber(val)))),
    method2DryMatterIntake: z
      .number()
      .gt(0)
      .optional()
      .transform(
        mapOptional((val) =>
          input(`Ij=${j}`, massPerHeadPerDay('DryMatter', val)),
        ),
      ),
    method2CrudeProtein: z
      .number()
      .gt(0)
      .optional()
      .transform(
        mapOptional((val) =>
          input(`CPj=${j}`, massPerMass('CrudeProtein', 'DryMatter', val)),
        ),
      ),

    temperatureZone: z
      .literal(MeanAnnualTemperatures)
      .optional()
      .transform(mapOptional((val) => input(`i`, val)))
      .meta({
        description: 'Average annual temperature',
      }),

    manureAllocation: object({
      manureWithLitter: createPoultryMMSAllocationInputSchema(
        '10',
        'manure with litter',
      ),
      beltManureRemoval: createPoultryMMSAllocationInputSchema(
        '11a',
        'belt removal (without litter)',
      ),
      manureStoredInHouse: createPoultryMMSAllocationInputSchema(
        '11b',
        'in house storage (without litter)',
      ),
      pastureRangeAndPaddock: proportion(
        'Fraction of manure stored in pasture range and paddock. There is no secondary system for manure treated this way.',
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

export const PoultryManureInputSchema = object({
  type: z.literal('poultry'),
  classes: PoultryManureClassesInputSchema,
  fractionAppliedToSoils: proportion(
    'Fraction of manure applied to soil within the activity boundary',
  ).transform((val) => input('PF', realNumber(val))),
});

export type PoultryManureInput = z.input<typeof PoultryManureInputSchema>;
export type PoultryManureInputTransformed = z.output<
  typeof PoultryManureInputSchema
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
