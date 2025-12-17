import { calculateEntireFeedlot } from '@/calculators/Feedlot/calculator';
import { FeedlotComplete } from '@/types/Feedlot/feedlot.input';
import { FeedlotInput } from '@/types/Feedlot/input';
import { FeedlotOutput } from '@/types/Feedlot/output';
import { FeedlotSale } from '@/types/Feedlot/sale.input';
import { FeedlotSales } from '@/types/Feedlot/sales.input';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';

const expectedScopes = {
  scope1: {
    fuelCO2: 0,
    fuelCH4: 0,
    fuelN2O: 0,
    transportCO2: 0,
    transportCH4: 0,
    transportN2O: 0,
    ureaCO2: 0,
    limeCO2: 0,
    atmosphericDepositionN2O: 0,
    manureDirectN2O: 0,
    manureIndirectN2O: 0,
    manureManagementCH4: 0,
    manureAppliedToSoilN2O: 0,
    entericCH4: 0,
    totalCO2: 0,
    totalCH4: 0,
    totalN2O: 0,
    total: 0,
  },
  scope2: {
    electricity: 0,
    total: 0,
  },
  scope3: {
    fertiliser: 0,
    herbicide: 0,
    electricity: 0,
    fuel: 0,
    lime: 0,
    feed: 0,
    purchaseLivestock: 0,
    total: 0,
  },
};

const expectations: FeedlotOutput = {
  ...expectedScopes,
  carbonSequestration: {
    total: 0,
  },
  net: {
    total: 0,
  },
  intensities: {
    liveweightProducedKg: 0,
    beefIncludingSequestration: 0,
    beefExcludingSequestration: 0,
  },
  intermediate: [],
};

const emptyFeedlotSale: FeedlotSale = {
  head: 0,
  saleWeight: 0,
};

const emptyFeedlotSales: FeedlotSales = {
  bullsGt1: [emptyFeedlotSale],
  bullsGt1Traded: [emptyFeedlotSale],
  steersLt1: [emptyFeedlotSale],
  steersLt1Traded: [emptyFeedlotSale],
  steers1To2: [emptyFeedlotSale],
  steers1To2Traded: [emptyFeedlotSale],
  steersGt2: [emptyFeedlotSale],
  steersGt2Traded: [emptyFeedlotSale],
  cowsGt2: [emptyFeedlotSale],
  cowsGt2Traded: [emptyFeedlotSale],
  heifersLt1: [emptyFeedlotSale],
  heifersLt1Traded: [emptyFeedlotSale],
  heifers1To2: [emptyFeedlotSale],
  heifers1To2Traded: [emptyFeedlotSale],
  heifersGt2: [emptyFeedlotSale],
  heifersGt2Traded: [emptyFeedlotSale],
};

const emptyFeedlot: FeedlotComplete = {
  system: 'Drylot',
  groups: [],
  fertiliser: {
    singleSuperphosphate: 0,
    pastureDryland: 0,
    pastureIrrigated: 0,
    cropsDryland: 0,
    cropsIrrigated: 0,
  },
  purchases: {},
  sales: emptyFeedlotSales,
  diesel: 0,
  petrol: 0,
  lpg: 0,
  electricitySource: 'State Grid',
  electricityRenewable: 0,
  electricityUse: 0,
  grainFeed: 0,
  hayFeed: 0,
  cottonseedFeed: 0,
  herbicide: 0,
  herbicideOther: 0,
  distanceCattleTransported: 0,
  truckType: '4 Deck Trailer',
  limestone: 0,
  limestoneFraction: 0,
};

const emptyInputWithEnterprise: FeedlotInput = {
  state: 'vic',
  feedlots: [emptyFeedlot],
  vegetation: [],
};

const emptyInput: FeedlotInput = {
  state: 'vic',
  feedlots: [],
  vegetation: [],
};

describe('Feedlot calculator, empty enterprise', () => {
  const context = testContext('Feedlot');
  const emissions = calculateEntireFeedlot(emptyInputWithEnterprise, context);

  const expectedWithEnterprise = {
    ...expectations,
    intermediate: [
      {
        ...expectedScopes,
        carbonSequestration: { total: 0 },
        intensities: expectations.intensities,
        net: {
          total: 0,
        },
      },
    ],
  };

  executeEmissionsSpec(
    emissions,
    expectedWithEnterprise as unknown as KeyValuePairs,
  );
});

describe('Feedlot calculator, no enterprise', () => {
  const context = testContext('Feedlot');
  const emissions = calculateEntireFeedlot(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
