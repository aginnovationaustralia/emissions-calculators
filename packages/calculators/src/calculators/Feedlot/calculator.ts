import { calculate10SolidWasteEmissions } from '@/modules/scope1/10-solid-waste';
import { calculate31BeefFeedlotEntericMethane } from '@/modules/scope1/3-enteric-methane/3.1-beef-feedlot';
import { calculate41BeefFeedlotManureManagement } from '@/modules/scope1/4-manure-management/4.1-feedlot-manure';
import {
  calculate81TransportFuel,
  calculate82StationaryFuel,
} from '@/modules/scope1/8-fuel-use';
import { calculatePurchasedLivestockEmissions } from '@/modules/scope3/15.1-purchased-livestock';
import { calculateScope3EmissionsFromFuel } from '@/modules/scope3/15.10-fuel';
import { calculateScope3SolidWasteEmissions } from '@/modules/scope3/15.12-waste';
import { calculatePurchasedFeed } from '@/modules/scope3/15.2-purchased-feed';
import { calculatePurchasedMineralSupplements } from '@/modules/scope3/15.3-purchased-mineral-supplements';
import { calculateScope3ServicesForActivity } from '@/modules/scope3/15.7-services';
import { calculateOtherPurchasedGoodsAndServicesEmissions } from '@/modules/scope3/15.9-other-purchases';
import { IntermediateScope1, IntermediateScope23 } from '@/tools/calculators';
import { Container } from '@/tools/containers';
import { exposeMassValue } from '@/tools/extract';
import { generateIntensity } from '@/tools/intensity';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { createCalculator } from '../common/calculator';
import { ExecutionContext } from '../executionContext';
import { ConstantsForFeedlotCalculator } from './constants';
import { FeedlotLotInputTransformed } from './types/feedlot-lot.input';
import { FeedlotIntensitiesOutput } from './types/intensities.output';
import { FeedlotIntermediateIntensitiesOutput } from './types/intermediate-intensities.output';
import { FeedlotOutputSchema } from './types/output';
import { FeedlotScope1Output } from './types/scope1.output';
import { FeedlotScope3Output } from './types/scope3.output';

function getSingleIntensities(
  netEmissions: Container<Mass<'CO2e'>>,
  feedlot: FeedlotLotInputTransformed,
): FeedlotIntermediateIntensitiesOutput {
  const liveweightProduced = feedlot.liveweightSoldKg;

  return {
    liveweightIntensity: generateIntensity(netEmissions, liveweightProduced),
    liveweightProducedKg: exposeMassValue(liveweightProduced),
  };
}

function getTotalIntensities(
  netTotalEmissions: Container<Mass<'CO2e'>>,
  netLulucf: Container<Mass<'CO2e'>>,
  feedlots: FeedlotLotInputTransformed[],
): FeedlotIntensitiesOutput {
  const liveweightProduced = sum(
    feedlots.map((feedlot) => feedlot.liveweightSoldKg),
  );

  return {
    liveweightProducedKg: exposeMassValue(liveweightProduced),
    liveweightIntensityExcludingLULUCF: generateIntensity(
      netTotalEmissions.minus(netLulucf),
      liveweightProduced,
    ),
    liveweightIntensityIncludingLULUCF: generateIntensity(
      netTotalEmissions,
      liveweightProduced,
    ),
  };
}

export function calculateScope1FeedlotLot(
  lot: FeedlotLotInputTransformed,
  context: ExecutionContext<ConstantsForFeedlotCalculator>,
): IntermediateScope1<FeedlotScope1Output> {
  // 3.1
  const entericCH4 = calculate31BeefFeedlotEntericMethane(lot, context);

  // 4.1
  const {
    manureManagementCH4,
    manureDirectN2O,
    manureAtmosphericDepositionN2O,
    manureLeachingRunoffN2O,
  } = calculate41BeefFeedlotManureManagement(lot, context);

  // 8.1
  const { fuelTransportCO2, fuelTransportCH4, fuelTransportN2O } =
    calculate81TransportFuel(lot, context);

  // 8.2
  const { fuelStationaryCO2, fuelStationaryCH4, fuelStationaryN2O } =
    calculate82StationaryFuel(lot, context);

  //10.1
  const { solidWasteCO2, solidWasteCH4, solidWasteN2O } =
    calculate10SolidWasteEmissions(lot, context);

  return {
    entericCH4,
    manureManagementCH4,
    manureDirectN2O,
    manureAtmosphericDepositionN2O,
    manureLeachingRunoffN2O,
    fuelTransportCO2,
    fuelTransportCH4,
    fuelTransportN2O,
    fuelStationaryCO2,
    fuelStationaryCH4,
    fuelStationaryN2O,
    solidWasteCO2,
    solidWasteCH4,
    solidWasteN2O,
  };
}

const calculateScope3FeedlotLot = (
  lot: FeedlotLotInputTransformed,
  enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForFeedlotCalculator>,
): IntermediateScope23<FeedlotScope3Output> => {
  // Purchased Livestock 15.1
  const purchasedLivestock = calculatePurchasedLivestockEmissions(lot, context);

  // Purchased Feed 15.2
  const purchasedFeed = calculatePurchasedFeed(lot, context);

  // Purchased Mineral Supplements 15.3
  const purchasedMineralSupplements = calculatePurchasedMineralSupplements(
    lot,
    context,
  );

  // Purchased Services/Contractors 15.7
  const services = calculateScope3ServicesForActivity(lot, context);

  // Other Purchased Goods and Services 15.9
  const otherPurchasedGoodsAndServices =
    calculateOtherPurchasedGoodsAndServicesEmissions(lot);

  // Upstream Emissions from Fuel 15.10
  const fuel = calculateScope3EmissionsFromFuel(lot, context);

  // Upstream emissions of Purchased Electricity 15.11
  const electricity = enterpriseScope3Electricity.multiply(
    lot.electricityAllocation,
  );

  // Management of Waste 15.12.1.2
  const solidWaste = calculateScope3SolidWasteEmissions(lot, context);

  return {
    purchasedLivestock,
    purchasedFeed,
    purchasedMineralSupplements,
    electricity,
    fuel,
    services,
    solidWaste,
    otherPurchasedGoodsAndServices,
  };
};

export const calculateFeedlot = createCalculator(
  'feedlot',
  'lots',
  FeedlotOutputSchema.shape,
  calculateScope1FeedlotLot,
  calculateScope3FeedlotLot,
  getSingleIntensities,
  getTotalIntensities,
);
