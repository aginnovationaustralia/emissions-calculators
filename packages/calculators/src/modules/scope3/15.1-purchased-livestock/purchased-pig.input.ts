import {
  PigPurchaseCategories,
  PigsLiveweightClasses,
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

const pigBaseFields = {
  type: z.literal('Pig'),
  ...HeadPurchasedSchema.shape,
};

// Emission factor: method 1 (`category`, looked up against constants) xor
// method 2 (`emissionFactorMethod2`, supplied directly).
const pigEmissionFactorMethod1Fields = {
  category: enumInput(PigPurchaseCategories, {
    name: 'Purchase category',
    description: 'The category of the purchased pigs',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
};

const pigEmissionFactorMethod2Fields =
  PurchasedLivestockEmissionFactorMethod2Schema.shape;

// Liveweight: method 1 (`weightClass`, looked up against constants) xor
// method 2 (`liveweightMethod2`, supplied directly).
const pigLiveweightMethod1Fields = {
  weightClass: enumInput(PigsLiveweightClasses, {
    name: 'Pig class',
    description: 'The weight class of the purchased pigs',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
};

const pigLiveweightMethod2Fields =
  PurchasedLivestockLiveweightMethod2Schema.shape;

// Emission factor method and liveweight method are each independently
// method 1 xor method 2 - any combination of the two is valid. See
// `purchased-beef.input.ts` for why this is spelled out as four complete
// schemas rather than composed from smaller pieces with `.and()`.
const PigPurchasedLivestockMethod1EFMethod1LWSchema = object({
  ...pigBaseFields,
  ...pigEmissionFactorMethod1Fields,
  ...pigLiveweightMethod1Fields,
}).meta({ title: 'Method 1 emission factor, method 1 liveweight' });

const PigPurchasedLivestockMethod1EFMethod2LWSchema = object({
  ...pigBaseFields,
  ...pigEmissionFactorMethod1Fields,
  ...pigLiveweightMethod2Fields,
}).meta({ title: 'Method 1 emission factor, method 2 liveweight' });

const PigPurchasedLivestockMethod2EFMethod1LWSchema = object({
  ...pigBaseFields,
  ...pigEmissionFactorMethod2Fields,
  ...pigLiveweightMethod1Fields,
}).meta({ title: 'Method 2 emission factor, method 1 liveweight' });

const PigPurchasedLivestockMethod2EFMethod2LWSchema = object({
  ...pigBaseFields,
  ...pigEmissionFactorMethod2Fields,
  ...pigLiveweightMethod2Fields,
}).meta({ title: 'Method 2 emission factor, method 2 liveweight' });

export const PigPurchasedLivestockSchema = z
  .xor([
    PigPurchasedLivestockMethod1EFMethod1LWSchema,
    PigPurchasedLivestockMethod1EFMethod2LWSchema,
    PigPurchasedLivestockMethod2EFMethod1LWSchema,
    PigPurchasedLivestockMethod2EFMethod2LWSchema,
  ])
  .meta({ title: 'Pig' });

export type PigPurchasedLivestockInput = z.input<
  typeof PigPurchasedLivestockSchema
>;
export type PigPurchasedLivestockInputTransformed = z.output<
  typeof PigPurchasedLivestockSchema
>;
