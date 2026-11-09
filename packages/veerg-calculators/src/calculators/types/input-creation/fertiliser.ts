import type { FeedlotManureInput } from '@/modules/scope1/4-manure-management/4.1-feedlot-manure/feedlot-manure.input';
import type {
  InorganicFertiliserInput,
  InorganicFertiliserInputScope3Method1,
} from '@/modules/scope1/5-fertiliser/inorganic-fertiliser.input';
import type { InorganicFertilisersScope1Method2Input } from '@/modules/scope1/5-fertiliser/inorganic-fertilisers.input';
import type { Item, Prop } from './type-helpers';

export type { FeedlotManureInput } from '@/modules/scope1/4-manure-management/4.1-feedlot-manure/feedlot-manure.input';
export type { LivestockManuresInput } from '@/modules/scope1/4-manure-management/livestock-manures.input';
export type {
  FertiliserInput,
  FertiliserInputInorganicScope1Method1,
  FertiliserInputInorganicScope1Method2,
} from '@/modules/scope1/5-fertiliser/fertiliser.input';
export type {
  InorganicFertiliserInput,
  InorganicFertiliserInputScope3Method1,
} from '@/modules/scope1/5-fertiliser/inorganic-fertiliser.input';
export type {
  InorganicFertilisersScope1Method1Input,
  InorganicFertilisersScope1Method2Input,
} from '@/modules/scope1/5-fertiliser/inorganic-fertilisers.input';
export type { OrganicFertiliserTracedInput } from '@/modules/scope1/5-fertiliser/organic-fertiliser-traced.input';
export type { OrganicFertiliserUntracedInput } from '@/modules/scope1/5-fertiliser/organic-fertiliser-untraced.input';
export type { OrganicFertiliserInput } from '@/modules/scope1/5-fertiliser/organic-fertiliser.input';
export type { OrganicFertilisersInput } from '@/modules/scope1/5-fertiliser/organic-fertilisers.input';
export type InorganicFertiliserInputScope3Method2 = Exclude<
  InorganicFertiliserInput,
  InorganicFertiliserInputScope3Method1
>;
export type InorganicFertiliserScope1Method2Input = Item<
  InorganicFertilisersScope1Method2Input['applications']
>;
export type InorganicFertiliserComponentInput = Item<
  Prop<InorganicFertiliserInputScope3Method1, 'components'>
>;
export type FeedlotManureGroupInput = Item<FeedlotManureInput['groups']>;
export type FeedlotManureGroupManureAllocationsInput =
  FeedlotManureGroupInput['manureAllocations'];
