import {
  GoatProductivitySystems,
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

const otherBaseFields = {
  type: z.literal('Other'),
  ...HeadPurchasedSchema.shape,
};

// `livestockType` drives both method 1 emission factor (a scaling factor off
// the beef/sheep average) and method 1 liveweight (an average per type), so
// it's shared between the two method 1 field groups below. Goats additionally
// need `productivitySystem`, which selects their method 1 liveweight, so goats
// and every other type are separate field groups (and so separate variants
// below), each a plain shape that can be spread into a complete schema.
const otherLivestockTypeFields = {
  livestockType: enumInput(OtherLivestockTypesWithoutGoats, {
    name: 'Livestock type',
    description: 'The specific type of "Other" livestock',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
};

const goatLivestockTypeFields = {
  livestockType: literalInput('Goats', {
    name: 'Livestock type',
    description: 'The specific type of "Other" livestock',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
  productivitySystem: enumInput(GoatProductivitySystems, {
    name: 'Goat productivity',
    description: 'The productivity system of the goats',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
};

// Emission factor method 2 (`method2EmissionFactor`, supplied directly) and
// liveweight method 2 (`method2LiveweightKilograms`, supplied directly). Method 1
// of either is the livestock type field group above.
const otherEmissionFactorMethod2Fields =
  PurchasedLivestockEmissionFactorMethod2Schema.shape;

const otherLiveweightMethod2Fields =
  PurchasedLivestockLiveweightMethod2Schema.shape;

// Emission factor method and liveweight method are each independently
// method 1 xor method 2 - any combination of the two is valid. See
// `purchased-beef.input.ts` for why this is spelled out as complete schemas
// rather than composed from smaller pieces with `.and()`. Every combination
// that uses method 1 for either needs a livestock type, so has a goat and a
// non-goat variant; method 2 for both needs neither.
const OtherPurchasedLivestockMethod1EFMethod1LWSchema = object({
  ...otherBaseFields,
  ...otherLivestockTypeFields,
}).meta({ title: 'Method 1 emission factor, method 1 liveweight' });

const GoatPurchasedLivestockMethod1EFMethod1LWSchema = object({
  ...otherBaseFields,
  ...goatLivestockTypeFields,
}).meta({ title: 'Goats, method 1 emission factor, method 1 liveweight' });

const OtherPurchasedLivestockMethod1EFMethod2LWSchema = object({
  ...otherBaseFields,
  ...otherLivestockTypeFields,
  ...otherLiveweightMethod2Fields,
}).meta({ title: 'Method 1 emission factor, method 2 liveweight' });

const GoatPurchasedLivestockMethod1EFMethod2LWSchema = object({
  ...otherBaseFields,
  ...goatLivestockTypeFields,
  ...otherLiveweightMethod2Fields,
}).meta({ title: 'Goats, method 1 emission factor, method 2 liveweight' });

const OtherPurchasedLivestockMethod2EFMethod1LWSchema = object({
  ...otherBaseFields,
  ...otherEmissionFactorMethod2Fields,
  ...otherLivestockTypeFields,
}).meta({ title: 'Method 2 emission factor, method 1 liveweight' });

const GoatPurchasedLivestockMethod2EFMethod1LWSchema = object({
  ...otherBaseFields,
  ...otherEmissionFactorMethod2Fields,
  ...goatLivestockTypeFields,
}).meta({ title: 'Goats, method 2 emission factor, method 1 liveweight' });

const OtherPurchasedLivestockMethod2EFMethod2LWSchema = object({
  ...otherBaseFields,
  ...otherEmissionFactorMethod2Fields,
  ...otherLiveweightMethod2Fields,
}).meta({ title: 'Method 2 emission factor, method 2 liveweight' });

export const OtherPurchasedLivestockSchema = z
  .xor([
    OtherPurchasedLivestockMethod1EFMethod1LWSchema,
    GoatPurchasedLivestockMethod1EFMethod1LWSchema,
    OtherPurchasedLivestockMethod1EFMethod2LWSchema,
    GoatPurchasedLivestockMethod1EFMethod2LWSchema,
    OtherPurchasedLivestockMethod2EFMethod1LWSchema,
    GoatPurchasedLivestockMethod2EFMethod1LWSchema,
    OtherPurchasedLivestockMethod2EFMethod2LWSchema,
  ])
  .meta({ title: 'Other' });

export type OtherPurchasedLivestockInput = z.input<
  typeof OtherPurchasedLivestockSchema
>;
export type OtherPurchasedLivestockInputTransformed = z.output<
  typeof OtherPurchasedLivestockSchema
>;
