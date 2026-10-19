import type { FeedlotGroupLivestockInput } from './feedlot-group.input';

export type { FeedlotLotLivestockInput } from '@/modules/scope1/shared/feedlot/input';
export type { FeedlotGroupLivestockInput } from './feedlot-group.input';
export type FeedlotGroupManureAllocationsInput =
  FeedlotGroupLivestockInput['manureAllocations'];
