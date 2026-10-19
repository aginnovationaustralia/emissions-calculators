import { testContext } from '@/test/Grains/context';
import { nv, nvo } from '@/tools/inputs';
import { calculate31BeefFeedlotEntericMethane } from '../../scope1/3-enteric-methane/3.1-beef-feedlot';
import { describeMethod2Propagation } from '../method2-propagation';
import {
  FeedlotLotLivestockInput,
  FeedlotLotLivestockInputSchema,
} from '@/modules/scope1/shared/feedlot/input';

const buildBaseFeedlotInput = (): FeedlotLotLivestockInput => ({
  groups: [
    {
      head: nv(100),
      averageLengthOfStayDays: nv(70),
      manureAllocations: {
        directApplication: nv(1),
        solidStorage: nv(0),
        composting: nv(0),
      },
    },
  ],
  grazingSystem: 'Irrigated crop',
  state: 'WA',
});

const withGroupOverride = (
  base: FeedlotLotLivestockInput,
  override: Partial<FeedlotLotLivestockInput['groups'][number]>,
): FeedlotLotLivestockInput => ({
  ...base,
  groups: [{ ...base.groups[0], ...override }],
});

describeMethod2Propagation({
  name: '3.1 beef feedlot enteric method-2 propagation',
  buildBase: buildBaseFeedlotInput,
  parse: (raw) => FeedlotLotLivestockInputSchema.parse(raw),
  run: (parsed) => calculate31BeefFeedlotEntericMethane(parsed, testContext()),
  cases: [
    {
      name: 'method2DryMatterIntake',
      apply: (base) =>
        withGroupOverride(base, {
          method2DryMatterIntake: nvo(12),
        }),
    },
    {
      name: 'method2AverageNeutralDetergentFibrePercentage',
      apply: (base) =>
        withGroupOverride(base, {
          method2AverageNeutralDetergentFibrePercentage: nv(30),
        }),
    },
  ],
});
