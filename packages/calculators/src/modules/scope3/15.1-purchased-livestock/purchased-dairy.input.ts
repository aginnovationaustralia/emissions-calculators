import {
  DairyCattleBreeds,
  DairyClasses,
  DairyPurchaseCategories,
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

const dairyBaseFields = {
  type: z.literal('Dairy'),
  ...HeadPurchasedSchema.shape,
};

// Emission factor: method 1 (`category`, looked up against constants) xor
// method 2 (`emissionFactorMethod2`, supplied directly).
const dairyEmissionFactorMethod1Fields = {
  category: enumInput(DairyPurchaseCategories, {
    name: 'Purchase category',
    description: 'The category of the purchased animals',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
};

const dairyEmissionFactorMethod2Fields =
  PurchasedLivestockEmissionFactorMethod2Schema.shape;

// Liveweight: method 1 (`breed` + `class`, looked up against constants) xor
// method 2 (`liveweightMethod2`, supplied directly).
const dairyLiveweightMethod1Fields = {
  breed: enumInput(DairyCattleBreeds, {
    name: 'Dairy breed',
    description: 'The breed of the purchased dairy livestock',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
  class: enumInput(DairyClasses, {
    name: 'Dairy class',
    description: 'The class of the purchased dairy livestock',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
};

const dairyLiveweightMethod2Fields =
  PurchasedLivestockLiveweightMethod2Schema.shape;

// Emission factor method and liveweight method are each independently
// method 1 xor method 2 - any combination of the two is valid. See
// `purchased-beef.input.ts` for why this is spelled out as four complete
// schemas rather than composed from smaller pieces with `.and()`.
const DairyPurchasedLivestockMethod1EFMethod1LWSchema = object({
  ...dairyBaseFields,
  ...dairyEmissionFactorMethod1Fields,
  ...dairyLiveweightMethod1Fields,
}).meta({ title: 'Method 1 emission factor, method 1 liveweight' });

const DairyPurchasedLivestockMethod1EFMethod2LWSchema = object({
  ...dairyBaseFields,
  ...dairyEmissionFactorMethod1Fields,
  ...dairyLiveweightMethod2Fields,
}).meta({ title: 'Method 1 emission factor, method 2 liveweight' });

const DairyPurchasedLivestockMethod2EFMethod1LWSchema = object({
  ...dairyBaseFields,
  ...dairyEmissionFactorMethod2Fields,
  ...dairyLiveweightMethod1Fields,
}).meta({ title: 'Method 2 emission factor, method 1 liveweight' });

const DairyPurchasedLivestockMethod2EFMethod2LWSchema = object({
  ...dairyBaseFields,
  ...dairyEmissionFactorMethod2Fields,
  ...dairyLiveweightMethod2Fields,
}).meta({ title: 'Method 2 emission factor, method 2 liveweight' });

export const DairyPurchasedLivestockSchema = z
  .xor([
    DairyPurchasedLivestockMethod1EFMethod1LWSchema,
    DairyPurchasedLivestockMethod1EFMethod2LWSchema,
    DairyPurchasedLivestockMethod2EFMethod1LWSchema,
    DairyPurchasedLivestockMethod2EFMethod2LWSchema,
  ])
  .meta({ title: 'Dairy' });

export type DairyPurchasedLivestockInput = z.input<
  typeof DairyPurchasedLivestockSchema
>;
export type DairyPurchasedLivestockInputTransformed = z.output<
  typeof DairyPurchasedLivestockSchema
>;
