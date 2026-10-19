import { PoultryWeightClasses } from '@/constants/enums';
import { enumInput } from '@/tools/inputs';
import { PURCH_LIVESTOCK_15_1 } from '@/tools/modules';
import { object } from '@/types/schemas';
import z from 'zod';
import {
  HeadPurchasedSchema,
  PurchasedLivestockEmissionFactorMethod2Schema,
  PurchasedLivestockLiveweightMethod2Schema,
} from './base.input';

const poultryBaseFields = {
  type: z.literal('Poultry'),
  ...HeadPurchasedSchema.shape,
};

// Emission factor: method 1 looks up a single flat constant, so it needs no
// input of its own; method 2 (`emissionFactorMethod2`) overrides it directly.
const poultryEmissionFactorMethod1Fields = {};

const poultryEmissionFactorMethod2Fields =
  PurchasedLivestockEmissionFactorMethod2Schema.shape;

// Liveweight: method 1 (`weightClass`, looked up against constants) xor
// method 2 (`liveweightMethod2`, supplied directly).
const poultryLiveweightMethod1Fields = {
  weightClass: enumInput(PoultryWeightClasses, {
    name: 'Poultry class',
    description: 'The weight class of the purchased poultry',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
};

const poultryLiveweightMethod2Fields =
  PurchasedLivestockLiveweightMethod2Schema.shape;

// Emission factor method and liveweight method are each independently
// method 1 xor method 2 - any combination of the two is valid. See
// `purchased-beef.input.ts` for why this is spelled out as four complete
// schemas rather than composed from smaller pieces with `.and()`.
const PoultryPurchasedLivestockMethod1EFMethod1LWSchema = object({
  ...poultryBaseFields,
  ...poultryEmissionFactorMethod1Fields,
  ...poultryLiveweightMethod1Fields,
}).meta({ title: 'Method 1 emission factor, method 1 liveweight' });

const PoultryPurchasedLivestockMethod1EFMethod2LWSchema = object({
  ...poultryBaseFields,
  ...poultryEmissionFactorMethod1Fields,
  ...poultryLiveweightMethod2Fields,
}).meta({ title: 'Method 1 emission factor, method 2 liveweight' });

const PoultryPurchasedLivestockMethod2EFMethod1LWSchema = object({
  ...poultryBaseFields,
  ...poultryEmissionFactorMethod2Fields,
  ...poultryLiveweightMethod1Fields,
}).meta({ title: 'Method 2 emission factor, method 1 liveweight' });

const PoultryPurchasedLivestockMethod2EFMethod2LWSchema = object({
  ...poultryBaseFields,
  ...poultryEmissionFactorMethod2Fields,
  ...poultryLiveweightMethod2Fields,
}).meta({ title: 'Method 2 emission factor, method 2 liveweight' });

export const PoultryPurchasedLivestockSchema = z
  .xor([
    PoultryPurchasedLivestockMethod1EFMethod1LWSchema,
    PoultryPurchasedLivestockMethod1EFMethod2LWSchema,
    PoultryPurchasedLivestockMethod2EFMethod1LWSchema,
    PoultryPurchasedLivestockMethod2EFMethod2LWSchema,
  ])
  .meta({ title: 'Poultry' });

export type PoultryPurchasedLivestockInput = z.input<
  typeof PoultryPurchasedLivestockSchema
>;
export type PoultryPurchasedLivestockInputTransformed = z.output<
  typeof PoultryPurchasedLivestockSchema
>;
