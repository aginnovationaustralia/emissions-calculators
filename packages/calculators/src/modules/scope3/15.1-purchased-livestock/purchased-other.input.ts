import { OtherLivestockTypes } from '@/constants/enums';
import { enumInput } from '@/tools/inputs';
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
// it's shared between the two method 1 field groups below.
const livestockTypeField = {
  livestockType: enumInput(OtherLivestockTypes, {
    name: 'Livestock type',
    description: 'The specific type of "Other" livestock',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
};

// Emission factor: method 1 (`livestockType`) xor method 2
// (`emissionFactorMethod2`, supplied directly).
const otherEmissionFactorMethod1Fields = livestockTypeField;

const otherEmissionFactorMethod2Fields =
  PurchasedLivestockEmissionFactorMethod2Schema.shape;

// Liveweight: method 1 (`livestockType`) xor method 2 (`liveweightMethod2`,
// supplied directly).
const otherLiveweightMethod1Fields = livestockTypeField;

const otherLiveweightMethod2Fields =
  PurchasedLivestockLiveweightMethod2Schema.shape;

// Emission factor method and liveweight method are each independently
// method 1 xor method 2 - any combination of the two is valid. See
// `purchased-beef.input.ts` for why this is spelled out as four complete
// schemas rather than composed from smaller pieces with `.and()`.
const OtherPurchasedLivestockMethod1EFMethod1LWSchema = object({
  ...otherBaseFields,
  ...otherEmissionFactorMethod1Fields,
  ...otherLiveweightMethod1Fields,
}).meta({ title: 'Method 1 emission factor, method 1 liveweight' });

const OtherPurchasedLivestockMethod1EFMethod2LWSchema = object({
  ...otherBaseFields,
  ...otherEmissionFactorMethod1Fields,
  ...otherLiveweightMethod2Fields,
}).meta({ title: 'Method 1 emission factor, method 2 liveweight' });

const OtherPurchasedLivestockMethod2EFMethod1LWSchema = object({
  ...otherBaseFields,
  ...otherEmissionFactorMethod2Fields,
  ...otherLiveweightMethod1Fields,
}).meta({ title: 'Method 2 emission factor, method 1 liveweight' });

const OtherPurchasedLivestockMethod2EFMethod2LWSchema = object({
  ...otherBaseFields,
  ...otherEmissionFactorMethod2Fields,
  ...otherLiveweightMethod2Fields,
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
