import { calculate10SolidWasteEmissions } from '@/modules/scope1/10-solid-waste';
import { calculate35PigsEntericMethane } from '@/modules/scope1/3-enteric-methane/3.5-pigs-enteric';
import { calculate45PigsManureManagement } from '@/modules/scope1/4-manure-management/4.5-pigs-manure';
import {
  calculate81TransportFuel,
  calculate82StationaryFuel,
} from '@/modules/scope1/8-fuel-use';
import { calculatePurchasedLivestockEmissions } from '@/modules/scope3/15.1-purchased-livestock';
import { calculateScope3EmissionsFromFuel } from '@/modules/scope3/15.10-fuel';
import { calculateScope3SolidWasteEmissions } from '@/modules/scope3/15.12-waste';
import { calculatePurchasedFeed } from '@/modules/scope3/15.2-purchased-feed';
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
import { ConstantsForPigsCalculator } from './constants';
import { PigsIntensitiesOutput } from './types/intensities.output';
import { PigsIntermediateIntensitiesOutput } from './types/intermediate-intensities.output';
import { PigsOutputSchema } from './types/output';
import { PigsHerdInputTransformed } from './types/pigs-herd.input';
import { PigsScope1Output } from './types/scope1.output';
import { PigsScope3Output } from './types/scope3.output';

function getSingleIntensities(
  netEmissions: Container<Mass<'CO2e'>>,
  herd: PigsHerdInputTransformed,
): PigsIntermediateIntensitiesOutput {
  const liveweightProduced = herd.liveweightSoldKg;

  return {
    liveweightIntensity: generateIntensity(netEmissions, liveweightProduced),
    liveweightProducedKg: exposeMassValue(liveweightProduced),
  };
}

function getTotalIntensities(
  netTotalEmissions: Container<Mass<'CO2e'>>,
  netLulucf: Container<Mass<'CO2e'>>,
  herds: PigsHerdInputTransformed[],
): PigsIntensitiesOutput {
  const liveweightProduced = sum(herds.map((herd) => herd.liveweightSoldKg));

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

export function calculateScope1PigsHerd(
  herd: PigsHerdInputTransformed,
  context: ExecutionContext<ConstantsForPigsCalculator>,
): IntermediateScope1<PigsScope1Output> {
  // 3.5
  const entericCH4 = calculate35PigsEntericMethane(herd, context);

  // 4.5
  const {
    manureManagementCH4,
    manureDirectN2O,
    manureAtmosphericDepositionN2O,
    manureLeachingRunoffN2O,
  } = calculate45PigsManureManagement(herd, context);

  // 8.1
  const { fuelTransportCO2, fuelTransportCH4, fuelTransportN2O } =
    calculate81TransportFuel(herd, context);
  // 8.2
  const { fuelStationaryCO2, fuelStationaryCH4, fuelStationaryN2O } =
    calculate82StationaryFuel(herd, context);

  // 10.1
  const { solidWasteCO2, solidWasteCH4, solidWasteN2O } =
    calculate10SolidWasteEmissions(herd, context);

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

const calculateScope3PigsHerd = (
  herd: PigsHerdInputTransformed,
  enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForPigsCalculator>,
): IntermediateScope23<PigsScope3Output> => {
  // Purchased Livestock 15.1
  const purchasedLivestock = calculatePurchasedLivestockEmissions(
    herd,
    context,
  );

  // Purchased Feed 15.2
  const purchasedFeed = calculatePurchasedFeed(herd, context);

  // Purchased Services/Contractors 15.7
  const services = calculateScope3ServicesForActivity(herd, context);

  // Other Purchased Goods and Services 15.9
  const otherPurchasedGoodsAndServices =
    calculateOtherPurchasedGoodsAndServicesEmissions(herd);

  // Upstream Emissions from Fuel 15.10
  const fuel = calculateScope3EmissionsFromFuel(herd, context);

  // Upstream emissions of Purchased Electricity 15.11
  const electricity = enterpriseScope3Electricity.multiply(
    herd.electricityAllocation,
  );

  // Management of Waste 15.12.1.2
  const solidWaste = calculateScope3SolidWasteEmissions(herd, context);

  return {
    purchasedLivestock,
    purchasedFeed,
    electricity,
    fuel,
    services,
    solidWaste,
    otherPurchasedGoodsAndServices,
  };
};

export const calculatePigs = createCalculator(
  'pigs',
  'herds',
  PigsOutputSchema.shape,
  calculateScope1PigsHerd,
  calculateScope3PigsHerd,
  getSingleIntensities,
  getTotalIntensities,
);
