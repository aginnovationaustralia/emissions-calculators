import { Seasons, SheepClasses, States } from '@/constants/enums';
import { enumInput } from '@/tools/inputs';
import { PURCH_LIVESTOCK_15_1 } from '@/tools/modules';
import { object } from '@/types/schemas';
import z from 'zod';
import {
  HeadPurchasedSchema,
  PurchasedLivestockEmissionFactorMethod2Schema,
  PurchasedLivestockLiveweightMethod2Schema,
} from './base.input';

const sheepBaseFields = {
  type: z.literal('Sheep'),
  ...HeadPurchasedSchema.shape,
};

// Emission factor: method 1 has no input of its own - the purchase category
// (prime lamb vs mutton) is derived from `class` (see
// `calculate.ts#getSheepEmissionFactor`), which method 1 liveweight already
// requires - xor method 2 (`emissionFactorMethod2`, supplied directly).
const sheepEmissionFactorMethod1Fields = {
  class: enumInput(SheepClasses, {
    name: 'Sheep class',
    description: 'The class of the purchased livestock',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
};

const sheepEmissionFactorMethod2Fields =
  PurchasedLivestockEmissionFactorMethod2Schema.shape;

// Liveweight: method 1 (`state` + `season` + `class`, looked up against
// constants) xor method 2 (`liveweightMethod2`, supplied directly).
const sheepLiveweightMethod1Fields = {
  state: enumInput(States, {
    name: 'Origin state',
    description: 'The origin state of the purchased livestock',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
  season: enumInput(Seasons, {
    name: 'Season',
    description: 'The season of the livestock purchase',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
  class: enumInput(SheepClasses, {
    name: 'Sheep class',
    description: 'The class of the purchased livestock',
    modules: [PURCH_LIVESTOCK_15_1],
  }),
};

const sheepLiveweightMethod2Fields =
  PurchasedLivestockLiveweightMethod2Schema.shape;

// Emission factor method and liveweight method are each independently
// method 1 xor method 2 - any combination of the two is valid. See
// `purchased-beef.input.ts` for why this is spelled out as four complete
// schemas rather than composed from smaller pieces with `.and()`.
const SheepPurchasedLivestockMethod1EFMethod1LWSchema = object({
  ...sheepBaseFields,
  ...sheepEmissionFactorMethod1Fields,
  ...sheepLiveweightMethod1Fields,
}).meta({ title: 'Method 1 emission factor, method 1 liveweight' });

const SheepPurchasedLivestockMethod1EFMethod2LWSchema = object({
  ...sheepBaseFields,
  ...sheepEmissionFactorMethod1Fields,
  ...sheepLiveweightMethod2Fields,
}).meta({ title: 'Method 1 emission factor, method 2 liveweight' });

const SheepPurchasedLivestockMethod2EFMethod1LWSchema = object({
  ...sheepBaseFields,
  ...sheepEmissionFactorMethod2Fields,
  ...sheepLiveweightMethod1Fields,
}).meta({ title: 'Method 2 emission factor, method 1 liveweight' });

const SheepPurchasedLivestockMethod2EFMethod2LWSchema = object({
  ...sheepBaseFields,
  ...sheepEmissionFactorMethod2Fields,
  ...sheepLiveweightMethod2Fields,
}).meta({ title: 'Method 2 emission factor, method 2 liveweight' });

export const SheepPurchasedLivestockSchema = z
  .xor([
    SheepPurchasedLivestockMethod1EFMethod1LWSchema,
    SheepPurchasedLivestockMethod1EFMethod2LWSchema,
    SheepPurchasedLivestockMethod2EFMethod1LWSchema,
    SheepPurchasedLivestockMethod2EFMethod2LWSchema,
  ])
  .meta({ title: 'Sheep' });

export type SheepPurchasedLivestockInput = z.input<
  typeof SheepPurchasedLivestockSchema
>;
export type SheepPurchasedLivestockInputTransformed = z.output<
  typeof SheepPurchasedLivestockSchema
>;
