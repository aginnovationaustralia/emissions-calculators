import {
  feedlotEntericAndManureModules,
  feedlotManureModules,
} from '@/modules/scope1/shared/feedlot/modules';
import {
  isPercentage,
  isProportion,
  numberInput,
  numberInputOptional,
} from '@/tools/inputs';
import {
  ENTERIC_FEEDLOT_3_1,
  LivestockLocation,
  MANURE_FEEDLOT_4_1,
} from '@/tools/modules';
import { sum } from '@/tools/sum';
import {
  days,
  head,
  massPerHeadPerDay,
  massPerMass,
  percentage,
  realNumber,
} from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const feedlotMMSAllocationSchema = (location: LivestockLocation) =>
  object({
    solidStorage: numberInput(
      (val) => realNumber(val),
      {
        name: 'MMSjm=4T=1',
        method: '1',
        description:
          'Fraction of manure transferred out of drylot to solid storage',
        modules: feedlotManureModules(location),
      },
      isProportion,
    ),
    composting: numberInput(
      (val) => realNumber(val),
      {
        name: 'MMSjm=6T=1',
        method: '1',
        description:
          'Fraction of manure transferred out of drylot to a composting system',
        modules: feedlotManureModules(location),
      },
      isProportion,
    ),
    directApplication: numberInput(
      (val) => realNumber(val),
      {
        name: 'MMSjm=13T=1',
        method: '1',
        description:
          'Fraction of manure transferred out of drylot directly applied to soil',
        modules: feedlotManureModules(location),
      },
      isProportion,
    ),
  }).superRefine(({ solidStorage, composting, directApplication }, context) => {
    const total = sum([solidStorage, composting, directApplication]);
    if (!total.unit.store.value.eq(1)) {
      context.addIssue('Manure allocations must sum to 1!');
    }
  });

/**
 * Keys of a feedlot group read both by the livestock modules (3.1, 4.1) and the chapter
 * 5 nitrogen calculation. Used directly for the fertiliser scenario.
 */
export const feedlotGroupSharedInputSchema = (location: LivestockLocation) =>
  object({
    head: numberInput(
      (val) => head(val),
      {
        name: 'Nj',
        method: '1',
        description: 'Number of animals in group',
        modules: feedlotEntericAndManureModules(location),
      },
      (s) => s.min(0),
    ),
    averageLengthOfStayDays: numberInput(
      (val) => days(val),
      {
        name: 'Lj',
        method: '1',
        description: 'Average length of stay',
        modules: feedlotEntericAndManureModules(location),
      },
      (s) => s.min(0),
    ),
    method2DryMatterIntake: numberInputOptional(
      (val) => massPerHeadPerDay('DryMatter', val),
      {
        name: 'Ij',
        method: '2',
        description: 'Method 2: Average dry matter intake',
        modules: feedlotEntericAndManureModules(location),
      },
      (s) => s.min(0),
    ),
    method2CrudeProtein: numberInputOptional(
      (val) => massPerMass('CrudeProtein', 'DryMatter', val),
      {
        name: 'CPj',
        method: '2',
        description:
          'Method 2: Average crude protein content of the feed given to this cattle group, as a fraction',
        modules: feedlotManureModules(location),
      },
      isProportion,
    ),
    method2NitrogenRetentionRate: numberInputOptional(
      (val) => realNumber(val),
      {
        name: 'NRj',
        method: '2',
        description: 'Method 2: Nitrogen retention rate',
        modules: feedlotManureModules(location),
      },
      isProportion,
    ),

    manureAllocations: feedlotMMSAllocationSchema(location),
  });

export type FeedlotGroupSharedInputTransformed = z.output<
  ReturnType<typeof feedlotGroupSharedInputSchema>
>;

/**
 * A feedlot group as read by feedlot enteric methane (3.1) and manure management (4.1).
 * Adds the diet keys that only affect methane.
 */
export const FeedlotGroupLivestockInputSchema = feedlotGroupSharedInputSchema(
  'livestock',
).extend({
  method2AverageNeutralDetergentFibrePercentage: numberInputOptional(
    (val) => percentage(val),
    {
      name: 'NDFj',
      method: '2',
      description:
        'Method 2: Average neutral detergent fibre as a proportion of feed intake',
      modules: [ENTERIC_FEEDLOT_3_1],
    },
    isPercentage,
  ),
  method2DryMatterDigestibility: numberInputOptional(
    (val) => realNumber(val),
    {
      name: 'DMDj',
      method: '2',
      description:
        'Method 2: Dry matter digestibility of diet used within feedlot system for this cattle group',
      modules: [MANURE_FEEDLOT_4_1],
    },
    isProportion,
  ),
});

export type FeedlotGroupLivestockInput = z.input<
  typeof FeedlotGroupLivestockInputSchema
>;
export type FeedlotGroupLivestockInputTransformed = z.output<
  typeof FeedlotGroupLivestockInputSchema
>;
