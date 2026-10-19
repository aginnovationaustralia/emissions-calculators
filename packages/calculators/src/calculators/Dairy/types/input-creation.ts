import type { DairyHerdLivestockInput } from '@/modules/scope1/shared/dairy/input';
import type { Prop } from '../../types/input-creation/type-helpers';
import type { DairyClassesInput } from './dairy-classes.input';
import type { DairyMilkProductionInput } from './milk.input';
import type { DairySaleInput } from './sale.input';

export type {
  DairyHerdLivestockInput,
  DairyMMSAllocationInner,
} from '@/modules/scope1/shared/dairy/input';
export type { DairyClassesInput } from './dairy-classes.input';
export type { DairyMilkProductionInput } from './milk.input';
export type DairyClassInput = Prop<DairyClassesInput, 'milkingCows'>;
export type DairyMilkVolumeInput = Extract<
  DairyMilkProductionInput,
  { litresPerHeadPerDay: unknown }
>;
export type DairyMilkSolidsInput = Extract<
  DairyMilkProductionInput,
  { kgSolidsPerHeadPerDay: unknown }
>;
export type DairyManureAllocationsInput = Prop<
  DairyHerdLivestockInput,
  'manureAllocations'
>;
export type DairyTimeSpentInLocationsInput = Prop<
  DairyHerdLivestockInput,
  'method2TimeSpentInLocations'
>;

// -------- Dairy calculator --------

export type { DairySaleInput } from './sale.input';
export type DairyCalfSaleInput = Extract<DairySaleInput, { weaned: unknown }>;
export type DairyMatureSaleInput = Exclude<DairySaleInput, DairyCalfSaleInput>;
