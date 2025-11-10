import { State } from '@/types/enums';
import { FeedlotComplete } from '@/types/Feedlot/feedlot.input';
import { FeedlotInput } from '@/types/Feedlot/input';
import { FeedlotOutput } from '@/types/Feedlot/output';
import {
  calculateScope3Fertiliser,
  mergeOtherFertilisers,
} from '../../calculators/common/fertiliser';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../../calculators/common/trees';
import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import {
  calculateFuelScope1CH4LPG,
  calculateFuelScope1CO2LPG,
  calculateFuelScope1N2OLPG,
  calculateScope3FuelWithLPGAverage,
} from '../common-legacy/fuel';
import {
  calculateScope1TransportCH4,
  calculateScope1TransportCO2,
  calculateScope1TransportN2O,
} from '../common-legacy/transport';
import { calculateScope3Herbicide } from '../common/herbicide';
import { calculateScope1Lime, calculateScope3Lime } from '../common/lime';
import { calculateScope3PurchasedFeed } from '../common/livestock';
import { addTotalValue } from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { valuesFromObject } from '../common/tools/object';
import { ExecutionContext } from '../executionContext';
import { ConstantsForFeedlotCalculator } from './constants';
import { getEmissionsIntensities } from './functions';
import { calculateScope1Atmospheric } from './Scope1Atmospheric';
import { calculateScope1Enteric } from './Scope1Enteric';
import { calculateScope1ManureDirectIndirect } from './Scope1ManureDirectIndirect';
import { calculateScope1ManureManagement } from './Scope1ManureManagement';
import { calculateScope1Urea } from './Scope1Urea';
import { calculateScope3PurchaseLivestock } from './Scope3PurchasedLivestock';

export function calculateSingleFeedlot(
  state: State,
  feedlot: FeedlotComplete,
  context: ExecutionContext<ConstantsForFeedlotCalculator>,
  carbonSequestration: number,
  id: string,
) {
  const mergedFertiliser = mergeOtherFertilisers(feedlot.fertiliser);

  const electricity = calculateElectricityScope2And3(
    state,
    feedlot.electricitySource,
    feedlot.electricityRenewable,
    feedlot.electricityUse,
    context,
  );

  const ureaCO2 = calculateScope1Urea(mergedFertiliser, context);

  const { lpg } = feedlot;

  const fuelCH4 = calculateFuelScope1CH4LPG(
    feedlot.diesel,
    feedlot.petrol,
    lpg,
    context,
  );
  const fuelCO2 = calculateFuelScope1CO2LPG(
    feedlot.diesel,
    feedlot.petrol,
    lpg,
    context,
  );
  const fuelN2O = calculateFuelScope1N2OLPG(
    feedlot.diesel,
    feedlot.petrol,
    lpg,
    context,
  );

  const scope1TransportCO2 = calculateScope1TransportCO2(
    feedlot.truckType,
    feedlot.distanceCattleTransported,
    context,
  );
  const scope1TransportCH4 = calculateScope1TransportCH4(
    feedlot.truckType,
    feedlot.distanceCattleTransported,
    context,
  );
  const scope1TransportN2O = calculateScope1TransportN2O(
    feedlot.truckType,
    feedlot.distanceCattleTransported,
    context,
  );
  const limeCO2 = calculateScope1Lime(
    feedlot.limestone,
    feedlot.limestoneFraction,
    context,
  );

  const scope3Fuel = calculateScope3FuelWithLPGAverage(
    feedlot.diesel,
    feedlot.petrol,
    lpg,
    context,
  );
  const scope3Lime = calculateScope3Lime(feedlot.limestone, context);
  const scope3Feed = calculateScope3PurchasedFeed(
    feedlot.grainFeed,
    feedlot.hayFeed,
    feedlot.cottonseedFeed,
    context,
  );
  const scope3Fertiliser = calculateScope3Fertiliser(mergedFertiliser, context);
  const scope3Herbicide = calculateScope3Herbicide(
    feedlot.herbicide,
    feedlot.herbicideOther,
    context,
  );
  const scope3PurchaseLivestock = calculateScope3PurchaseLivestock(
    feedlot.purchases,
    context,
  );

  const allFeedlotGroups = feedlot.groups.map((group) => {
    const stayResults = group.stays.map((stay) => {
      const scope1N2O = calculateScope1Atmospheric(
        stay,
        feedlot.system,
        context,
      );
      const scope1Manure = calculateScope1ManureDirectIndirect(stay, context);
      const scope1ManureCH4 = calculateScope1ManureManagement(
        stay,
        state,
        context,
      );

      const scope1Enteric = calculateScope1Enteric(stay, context);

      return {
        output: {
          scope1: {
            atmosphericDepositionN2O: scope1N2O.atmosphericDeposition,
            manureDirectN2O: scope1Manure.direct,
            manureIndirectN2O: scope1Manure.indirect,
            manureManagementCH4: scope1ManureCH4,
            manureAppliedToSoilN2O: scope1N2O.manureAppliedToSoil,
            entericCH4: scope1Enteric,
          },
          scope2: {},
          scope3: {},
        },
        extensions: {},
      };
    });

    return sumIntermediateResults(
      {
        output: {
          scope1: {
            atmosphericDepositionN2O: 0,
            manureDirectN2O: 0,
            manureIndirectN2O: 0,
            manureManagementCH4: 0,
            manureAppliedToSoilN2O: 0,
            entericCH4: 0,
          },
          scope2: {},
          scope3: {},
        },
        extensions: {},
      },
      stayResults,
    );
  });

  const groupEmissions = sumIntermediateResults(
    {
      output: {
        scope1: {
          atmosphericDepositionN2O: 0,
          manureDirectN2O: 0,
          manureIndirectN2O: 0,
          manureManagementCH4: 0,
          manureAppliedToSoilN2O: 0,
          entericCH4: 0,
        },
        scope2: {},
        scope3: {},
      },
      extensions: {},
    },
    allFeedlotGroups,
  );

  const totalSaleWeightKg = valuesFromObject(feedlot.sales)
    .flatMap((sales) => sales)
    .reduce((acc, sale) => {
      return acc + sale.head * sale.saleWeight;
    }, 0);

  const totalCO2 = fuelCO2 + ureaCO2 + limeCO2 + scope1TransportCO2;
  const totalCH4 =
    fuelCH4 +
    scope1TransportCH4 +
    groupEmissions.output.scope1.manureManagementCH4 +
    groupEmissions.output.scope1.entericCH4;
  const totalN2O =
    fuelN2O +
    scope1TransportN2O +
    groupEmissions.output.scope1.atmosphericDepositionN2O +
    groupEmissions.output.scope1.manureDirectN2O +
    groupEmissions.output.scope1.manureIndirectN2O +
    groupEmissions.output.scope1.manureAppliedToSoilN2O;

  const scope1 = addTotalValue({
    fuelCH4,
    fuelCO2,
    fuelN2O,
    transportCH4: scope1TransportCH4,
    transportCO2: scope1TransportCO2,
    transportN2O: scope1TransportN2O,
    ureaCO2,
    limeCO2,
    totalCO2,
    totalCH4,
    totalN2O,
    ...groupEmissions.output.scope1,
  });

  const scope2 = addTotalValue({ electricity: electricity.scope2 });

  const scope3 = addTotalValue({
    fertiliser: scope3Fertiliser,
    electricity: electricity.scope3,
    fuel: scope3Fuel,
    lime: scope3Lime,
    feed: scope3Feed.total,
    herbicide: scope3Herbicide.total,
    purchaseLivestock: scope3PurchaseLivestock.total,
  });

  const net = {
    total: scope1.total + scope2.total + scope3.total - carbonSequestration,
  };

  const output = {
    scope1,
    scope2,
    scope3,
    net,
  };

  const result = {
    output,
    extensions: {
      carbonSequestration,
      totalSaleWeightKg,
    },
    meta: {
      id,
    },
  };

  return result;
}

export function calculateEntireFeedlot(
  feedlot: FeedlotInput,
  context: ExecutionContext<ConstantsForFeedlotCalculator>,
): FeedlotOutput {
  const carbonSequestration = calculateAllCarbonSequestrationWithKeyProportion(
    feedlot.vegetation,
    'feedlotProportion',
    feedlot.feedlots,
    context,
  );

  const results = feedlot.feedlots.map((enterprise, ix) =>
    calculateSingleFeedlot(
      feedlot.state,
      enterprise,
      context,
      carbonSequestration.intermediate[ix],
      enterprise.id ?? ix.toString(),
    ),
  );

  const totals = sumIntermediateResults(
    {
      output: {
        scope1: {
          atmosphericDepositionN2O: 0,
          manureDirectN2O: 0,
          manureIndirectN2O: 0,
          manureManagementCH4: 0,
          manureAppliedToSoilN2O: 0,
          entericCH4: 0,
          fuelCH4: 0,
          fuelCO2: 0,
          fuelN2O: 0,
          transportCH4: 0,
          transportCO2: 0,
          transportN2O: 0,
          ureaCO2: 0,
          limeCO2: 0,
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
          electricity: 0,
          fertiliser: 0,
          fuel: 0,
          lime: 0,
          feed: 0,
          herbicide: 0,
          purchaseLivestock: 0,
          total: 0,
        },
        net: {
          total: 0,
        },
      },
      extensions: {
        carbonSequestration: 0,
        totalSaleWeightKg: 0,
      },
      meta: {
        id: '',
      },
    },
    results,
  );

  const baseEmissions = {
    ...totals.output,
    net: {
      total:
        totals.output.scope1.total +
        totals.output.scope2.total +
        totals.output.scope3.total -
        carbonSequestration.total,
    },
  };

  const intensities = getEmissionsIntensities(
    baseEmissions.net.total,
    carbonSequestration.total,
    totals.extensions.totalSaleWeightKg,
  );

  return {
    ...baseEmissions,
    carbonSequestration,
    intermediate: results.map((i) => ({
      scope1: i.output.scope1,
      scope2: i.output.scope2,
      scope3: i.output.scope3,
      carbonSequestration: {
        total: i.extensions.carbonSequestration,
      },
      net: i.output.net,
      intensities: getEmissionsIntensities(
        i.output.net.total,
        i.extensions.carbonSequestration,
        i.extensions.totalSaleWeightKg,
      ),
      id: i.meta.id,
    })),
    intensities,
  };
}
