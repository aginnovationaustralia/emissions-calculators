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
import {
  ClimateZoneTypes,
  GrazingProductionSystemsWithRainfall,
  MeanAnnualTemperatures,
  PureStates,
} from '@/constants/enums';

const PoultryMMS2AllocationInputSchema = object({
  solidStorage: proportion(
    'Fraction of manure stored in solid storage',
  ).transform((val) => input('MMSm=4T=2', realNumber(val))),
  composting: proportion('Fraction of manure composted').transform((val) =>
    input('MMSm=6T=2', realNumber(val)),
  ),
  digester: proportion('Fraction of manure digested').transform((val) =>
    input('MMSm=7T=2', realNumber(val)),
  ),
  directProcessing: proportion(
    'Fraction of manure processed directly',
  ).transform((val) => input('MMSm=12T=2', realNumber(val))),
  directApplication: proportion(
    'Fraction of manure applied directly',
  ).transform((val) => input('MMSm=13T=2', realNumber(val))),
});

const PoultryMMS1To2AllocationInputSchema = object({
  manureWithLitter: PoultryMMS2AllocationInputSchema,
  beltManureRemoval: PoultryMMS2AllocationInputSchema,
  manureStoredInHouse: PoultryMMS2AllocationInputSchema,
});

export type PoultryMMS1To2AllocationInput = z.input<
  typeof PoultryMMS1To2AllocationInputSchema
>;
export type PoultryMMS1To2AllocationInputTransformed = z.output<
  typeof PoultryMMS1To2AllocationInputSchema
>;

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

    manureAllocation: object({
      manureWithLitter: proportion(
        'Fraction of all manure produced by this class initially stored/treated in a manure with litter system.',
      ).transform((val) => input(`MMSj=${j}m=10T=1'`, realNumber(val))),
      beltManureRemoval: proportion(
        'Fraction of all manure produced by this class initially stored/treated in a belt-removal system.',
      ).transform((val) => input(`MMSj=${j}m=11aT=1`, realNumber(val))),
      manureStoredInHouse: proportion(
        'Fraction of all manure produced by this class initially stored/treated in-house.',
      ).transform((val) => input(`MMSj=${j}m=11bT=1`, realNumber(val))),
      pastureRangeAndPaddock: proportion(
        'Fraction of all manure produced by this class deposited directly onto pasture range/paddock. There is no secondary system for manure treated this way.',
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

const PoultryManureClassesInputSchema = object({
  layers: PoultryManureClassInputSchemaLayers,
  meatChickenGrowers: PoultryManureClassInputSchemaMeatChickenGrowers,
  meatChickenBreeder: PoultryManureClassInputSchemaMeatChickenBreeder,
  meatOther: PoultryManureClassInputSchemaMeatOther,
});

export type PoultryManureClassesInput = z.input<
  typeof PoultryManureClassesInputSchema
>;
export type PoultryManureClassesInputTransformed = z.output<
  typeof PoultryManureClassesInputSchema
>;

const CommonPoultryManureInputSchema = object({
  classes: PoultryManureClassesInputSchema,
  mms1To2Allocation: PoultryMMS1To2AllocationInputSchema,
});

export const CropPoultryManureInputSchema =
  CommonPoultryManureInputSchema.extend({
    type: z.literal('poultry'),
    /**
     * REVISIT: This description is *slightly* incorrect/misleading, this is the proportion
     * of all manure excluding the manure applied/deposited directly to soil. This will
     * slightly skew the scope 1 and 3 values of *MNsoil* depending on how manure gets
     * allocated.
     */
    fractionAppliedToSoils: proportion(
      'Fraction of manure applied to soil within the activity boundary',
    ).transform((val) => input('PF', realNumber(val))),
  });
export type CropPoultryManureInput = z.input<
  typeof CropPoultryManureInputSchema
>;
export type CropPoultryManureInputTransformed = z.output<
  typeof CropPoultryManureInputSchema
>;

export const LivestockPoultryInputSchema =
  CommonPoultryManureInputSchema.extend({
    temperatureZone: z
      .literal(MeanAnnualTemperatures)
      .optional()
      .transform(mapOptional((val) => input('MAT', val)))
      .meta({
        description: 'Average annual temperature, if known',
      }),
    // TODO: Transform?
    state: z
      .literal(PureStates)
      .transform((val) => input('state', val))
      .meta({
        description: 'TODO',
      }),
    climateZone: z.literal(ClimateZoneTypes).meta({
      description: 'TODO',
    }),
    // REVISIT: The description in section 4.6 says: Select the value based on the production system which most accurately describes the land surrounding the housing area. "productionSystem" might not be the most appropriate name for this input.
    productionSystem: z.literal(GrazingProductionSystemsWithRainfall).meta({
      description: 'TODO',
    }),
    isInLeachingZone: z.boolean().meta({
      description: 'TODO',
    }),
  });
export type LivestockPoultryManureInput = z.input<
  typeof LivestockPoultryInputSchema
>;
export type LivestockPoultryManureInputTransformed = z.output<
  typeof LivestockPoultryInputSchema
>;
