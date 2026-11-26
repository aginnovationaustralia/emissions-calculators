import {
  GoatProductivitySystems,
  OtherLivestockTypes,
  OtherLivestockTypesWithoutGoats,
} from '@/constants/enums';
import { enumInput, literalInput } from '@/tools/inputs';
import { PURCH_LIVESTOCK_15_1 } from '@/tools/modules';
import { object } from '@/types/schemas';
import z from 'zod';
import {
  HeadPurchasedSchema,
  PurchasedLivestockEmissionFactorMethod2Schema,
  PurchasedLivestockLiveweightMethod2Schema,
} from './base.input';

const livestockTypeOptions: Parameters<typeof enumInput>[1] = {
  name: 'Livestock type',
  description: 'The specific type of "Other" livestock',
  modules: [PURCH_LIVESTOCK_15_1],
};

const OtherPurchasedLivestockBaseSchema = HeadPurchasedSchema.safeExtend({
  type: z.literal('Other'),
});

// `livestockType` drives both method 1 emission factor (a scaling factor off
// the beef/sheep average) and method 1 liveweight (an average per type).
// When only the emission factor is method 1, any type is accepted.
const AnyLivestockTypeSchema = object({
  livestockType: enumInput(OtherLivestockTypes, livestockTypeOptions),
});

// Method 1 liveweight is an average per type, except for goats, where it
// depends on `productivitySystem`. Goats and every other type are separate
// schemas, discriminated on `livestockType`.
const NonGoatLivestockTypeSchema = object({
  livestockType: enumInput(
    OtherLivestockTypesWithoutGoats,
    livestockTypeOptions,
  ),
});

const GoatLivestockTypeSchema = object({
  livestockType: literalInput('Goats', livestockTypeOptions),
  productivitySystem: enumInput(GoatProductivitySystems, {
    name: 'Goat productivity',
    description: 'The productivity system of the goats',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
});

/**
 * Method 1 liveweight on top of `base`: a goat variant requiring
 * `productivitySystem`, and a variant for every other type without it.
 */
const withLiveweightMethod1 = <
  T extends typeof OtherPurchasedLivestockBaseSchema,
>(
  base: T,
) =>
  z.discriminatedUnion('livestockType', [
    base
      .safeExtend(NonGoatLivestockTypeSchema.shape)
      .meta({ title: 'Other livestock' }),
    base.safeExtend(GoatLivestockTypeSchema.shape).meta({ title: 'Goats' }),
  ]);

// Emission factor method and liveweight method are each independently
// method 1 xor method 2 - any combination of the two is valid. See
// `purchased-beef.input.ts` for why these are complete schemas rather than
// composed from partial schemas with `.and()`.
const OtherPurchasedLivestockMethod1EFMethod1LWSchema = withLiveweightMethod1(
  OtherPurchasedLivestockBaseSchema,
).meta({ title: 'Method 1 emission factor, method 1 liveweight' });

const OtherPurchasedLivestockMethod1EFMethod2LWSchema =
  OtherPurchasedLivestockBaseSchema.safeExtend({
    ...AnyLivestockTypeSchema.shape,
    ...PurchasedLivestockLiveweightMethod2Schema.shape,
  }).meta({ title: 'Method 1 emission factor, method 2 liveweight' });

const OtherPurchasedLivestockMethod2EFMethod1LWSchema = withLiveweightMethod1(
  OtherPurchasedLivestockBaseSchema.safeExtend(
    PurchasedLivestockEmissionFactorMethod2Schema.shape,
  ),
).meta({ title: 'Method 2 emission factor, method 1 liveweight' });

const OtherPurchasedLivestockMethod2EFMethod2LWSchema =
  OtherPurchasedLivestockBaseSchema.safeExtend({
    ...PurchasedLivestockEmissionFactorMethod2Schema.shape,
    ...PurchasedLivestockLiveweightMethod2Schema.shape,
  }).meta({ title: 'Method 2 emission factor, method 2 liveweight' });

export const OtherPurchasedLivestockSchema = z
  .xor([
    OtherPurchasedLivestockMethod1EFMethod1LWSchema,
    OtherPurchasedLivestockMethod1EFMethod2LWSchema,
    OtherPurchasedLivestockMethod2EFMethod1LWSchema,
    OtherPurchasedLivestockMethod2EFMethod2LWSchema,
  ])
  .meta({ title: 'Other' });

export type OtherPurchasedLivestockInput = z.input<
  typeof OtherPurchasedLivestockSchema
>;
export type OtherPurchasedLivestockInputTransformed = z.output<
  typeof OtherPurchasedLivestockSchema
>;
