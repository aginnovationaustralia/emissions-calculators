import {
  BeefClasses,
  BeefPurchaseCategories,
  ExtendedRegions,
  Seasons,
} from '@/constants/enums';
import { enumInput } from '@/tools/inputs';
import { PURCH_LIVESTOCK_15_1 } from '@/tools/modules';
import { object } from '@/types/schemas';
import z from 'zod';
import {
  HeadPurchasedSchema,
  PurchasedLivestockEmissionFactorMethod2Schema,
  PurchasedLivestockLiveweightMethod2Schema,
} from './base.input';

const beefBaseFields = {
  type: z.literal('Beef'),
  ...HeadPurchasedSchema.shape,
};

// Emission factor: method 1 (`category`, looked up against constants) xor
// method 2 (`emissionFactorMethod2`, supplied directly).
const beefEmissionFactorMethod1Fields = {
  category: enumInput(BeefPurchaseCategories, {
    name: 'Purchase category',
    description: 'The category of the purchased animals',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
};

const beefEmissionFactorMethod2Fields =
  PurchasedLivestockEmissionFactorMethod2Schema.shape;

// Liveweight: method 1 (`region` + `class` + `season`, looked up against
// constants) xor method 2 (`liveweightMethod2`, supplied directly).
const beefLiveweightMethod1Fields = {
  region: enumInput(ExtendedRegions, {
    name: 'Origin of purchase',
    description: ' The origin of the purchased livestock',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
  class: enumInput(BeefClasses, {
    name: 'Beef class',
    description: 'The class of the purchased livestock',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
  season: enumInput(Seasons, {
    name: 'Season',
    description: 'Season of the livestock purchase',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
};

const beefLiveweightMethod2Fields =
  PurchasedLivestockLiveweightMethod2Schema.shape;

/*
 * Emission factor method and liveweight method are each independently
 * method 1 xor method 2 - any combination of the two is valid. Every schema
 * built with `object()` (`z.strictObject`) rejects keys outside its own
 * shape, so combining two *partial* strict schemas with `.and()` doesn't
 * work: each side would reject the other's keys as unrecognized. Instead,
 * each of the four valid combinations is spelled out as its own complete,
 * flat schema (sharing the field groups above), and `z.xor` picks the one
 * that matches - this also renders in the generated OpenAPI as one clear
 * `oneOf` of the four shapes, rather than a nested (and here, non-working)
 * `allOf` of two independent choices.
 */
const BeefPurchasedLivestockMethod1EFMethod1LWSchema = object({
  ...beefBaseFields,
  ...beefEmissionFactorMethod1Fields,
  ...beefLiveweightMethod1Fields,
}).meta({ title: 'Method 1 emission factor, method 1 liveweight' });

const BeefPurchasedLivestockMethod1EFMethod2LWSchema = object({
  ...beefBaseFields,
  ...beefEmissionFactorMethod1Fields,
  ...beefLiveweightMethod2Fields,
}).meta({ title: 'Method 1 emission factor, method 2 liveweight' });

const BeefPurchasedLivestockMethod2EFMethod1LWSchema = object({
  ...beefBaseFields,
  ...beefEmissionFactorMethod2Fields,
  ...beefLiveweightMethod1Fields,
}).meta({ title: 'Method 2 emission factor, method 1 liveweight' });

const BeefPurchasedLivestockMethod2EFMethod2LWSchema = object({
  ...beefBaseFields,
  ...beefEmissionFactorMethod2Fields,
  ...beefLiveweightMethod2Fields,
}).meta({ title: 'Method 2 emission factor, method 2 liveweight' });

export const BeefPurchasedLivestockSchema = z
  .xor([
    BeefPurchasedLivestockMethod1EFMethod1LWSchema,
    BeefPurchasedLivestockMethod1EFMethod2LWSchema,
    BeefPurchasedLivestockMethod2EFMethod1LWSchema,
    BeefPurchasedLivestockMethod2EFMethod2LWSchema,
  ])
  .meta({ title: 'Beef' });

export type BeefPurchasedLivestockInput = z.input<
  typeof BeefPurchasedLivestockSchema
>;
export type BeefPurchasedLivestockInputTransformed = z.output<
  typeof BeefPurchasedLivestockSchema
>;
