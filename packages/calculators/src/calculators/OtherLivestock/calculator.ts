import { calculate10SolidWasteEmissions } from '@/modules/scope1/10-solid-waste';
import { calculate36OtherLivestockEntericMethaneForHerd } from '@/modules/scope1/3-enteric-methane/3.6-other-livestock';
import { calculate47OtherLivestockManureManagement } from '@/modules/scope1/4-manure-management/4.7-other-livestock-manure';
import {
  calculate51InorganicFertiliser,
  calculate52OrganicFertiliser,
  calculate53Lime,
  calculate54AtmosphericDeposition,
  calculate55LeachingAndRunoff,
} from '@/modules/scope1/5-fertiliser';
import {
  calculate62PastureResidueN2O,
  calculate63ResidueLeachingAndRunoffN2O,
  calculate64FieldBurning,
} from '@/modules/scope1/6-residue-mgmt';
import {
  calculate81TransportFuel,
  calculate82StationaryFuel,
} from '@/modules/scope1/8-fuel-use';
import { calculatePurchasedLivestockEmissions } from '@/modules/scope3/15.1-purchased-livestock';
import { calculateScope3EmissionsFromFuel } from '@/modules/scope3/15.10-fuel';
import { calculateScope3SolidWasteEmissions } from '@/modules/scope3/15.12-waste';
import { calculatePurchasedFeed } from '@/modules/scope3/15.2-purchased-feed';
import { calculatePurchasedMineralSupplements } from '@/modules/scope3/15.3-purchased-mineral-supplements';
import { calculateScope3Fertiliser } from '@/modules/scope3/15.4-fertiliser';
import { calculateScope3Agrichemicals } from '@/modules/scope3/15.5-agrichemicals';
import { calculateScope3SoilAmeliorants } from '@/modules/scope3/15.6-lime';
import { calculateScope3Services } from '@/modules/scope3/15.7-services';
import { calculateOtherPurchasedGoodsAndServicesEmissions } from '@/modules/scope3/15.9-other-purchases';
import { IntermediateScope1, IntermediateScope23 } from '@/tools/calculators';
import { Container } from '@/tools/containers';
import { valueObject } from '@/tools/outputs';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { createCalculator } from '../common/calculator';
import { divideBySafeFromZero } from '../common/tools';
import { ExecutionContext } from '../executionContext';
import { ConstantsForOtherLivestockCalculator } from './constants';
import { OtherLivestockHerdInputTransformed } from './types/herd.input';
import { OtherLivestockIntensitiesOutput } from './types/intensities.output';
import { OtherLivestockIntermediateIntensitiesOutput } from './types/intermediate-intensities.output';
import { OtherLivestockOutputSchema } from './types/output';
import { OtherLivestockScope1Output } from './types/scope1.output';
import { OtherLivestockScope3Output } from './types/scope3.output';

function getSingleIntensities(
  netEmissionsKgCO2e: number,
  herd: OtherLivestockHerdInputTransformed,
): OtherLivestockIntermediateIntensitiesOutput {
  const liveweightProducedKg = herd.liveweightSoldKg.unit.store.toNumber();
  const liveweightIntensity = valueObject(
    divideBySafeFromZero(netEmissionsKgCO2e, liveweightProducedKg),
  );

  return {
    liveweightIntensity,
    liveweightProducedKg: valueObject(liveweightProducedKg),
  };
}

function getTotalIntensities(
  netTotalEmissionsKgCO2e: number,
  netLulucfKgCO2e: number,
  herds: OtherLivestockHerdInputTransformed[],
): OtherLivestockIntensitiesOutput {
  const liveweightProduced = sum(herds.map((herd) => herd.liveweightSoldKg));

  const liveweightProducedKg = liveweightProduced.unit.store.toNumber();

  const totalEmissionsIncludingLulucf =
    netTotalEmissionsKgCO2e + netLulucfKgCO2e;

  const liveweightIntensityExcludingLULUCF = valueObject(
    divideBySafeFromZero(netTotalEmissionsKgCO2e, liveweightProducedKg),
  );

  const liveweightIntensityIncludingLULUCF = valueObject(
    divideBySafeFromZero(totalEmissionsIncludingLulucf, liveweightProducedKg),
  );

  return {
    liveweightProducedKg: valueObject(liveweightProducedKg),
    liveweightIntensityExcludingLULUCF,
    liveweightIntensityIncludingLULUCF,
  };
}

export function calculateScope1OtherLivestockHerd(
  herd: OtherLivestockHerdInputTransformed,
  context: ExecutionContext<ConstantsForOtherLivestockCalculator>,
): IntermediateScope1<OtherLivestockScope1Output> {
  // 3.6
  const entericCH4 = calculate36OtherLivestockEntericMethaneForHerd(
    herd,
    context,
  );

  // 4.7
  const {
    manureManagementCH4,
    manureDirectN2O,
    manureAtmosphericDepositionN2O,
    manureLeachingRunoffN2O,
  } = calculate47OtherLivestockManureManagement(herd, context);

  // 5.1
  const { inorganicFertiliserN2O, inorganicFertiliserCO2 } =
    calculate51InorganicFertiliser(herd, context);
  // 5.2
  const organicFertiliserN2O = calculate52OrganicFertiliser(herd, context);
  // 5.3
  const limeCO2 = calculate53Lime(herd, context);
  // 5.4
  const {
    inorganicFertiliserAtmosphericDepositionN2O,
    organicFertiliserAtmosphericDepositionN2O,
  } = calculate54AtmosphericDeposition(herd, context);
  // 5.5
  const { fertiliserLeachingAndRunoffN2O } = calculate55LeachingAndRunoff(
    herd,
    context,
  );

  // 6.2
  const pastureResidueN2O = calculate62PastureResidueN2O(herd, context);
  // 6.3
  const residueLeachingAndRunoffN2O = calculate63ResidueLeachingAndRunoffN2O(
    herd,
    context,
  );
  // 6.4
  const { fieldBurningN2O, fieldBurningCH4 } = calculate64FieldBurning(
    herd,
    context,
  );

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
    fieldBurningN2O,
    fieldBurningCH4,
    fuelTransportCO2,
    fuelTransportCH4,
    fuelTransportN2O,
    fuelStationaryCO2,
    fuelStationaryCH4,
    fuelStationaryN2O,
    limeCO2,
    inorganicFertiliserN2O,
    inorganicFertiliserCO2,
    organicFertiliserN2O,
    inorganicFertiliserAtmosphericDepositionN2O,
    organicFertiliserAtmosphericDepositionN2O,
    fertiliserLeachingAndRunoffN2O,
    residueLeachingAndRunoffN2O,
    pastureResidueN2O,
    solidWasteCO2,
    solidWasteCH4,
    solidWasteN2O,
  };
}

const calculateScope3OtherLivestockHerd = (
  herd: OtherLivestockHerdInputTransformed,
  enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForOtherLivestockCalculator>,
): IntermediateScope23<OtherLivestockScope3Output> => {
  // Purchased livestock 15.1
  const purchasedLivestock = calculatePurchasedLivestockEmissions(
    herd,
    context,
  );

  // Purchased Feed 15.2
  const purchasedFeed = calculatePurchasedFeed(herd, context);

  // Purchased Mineral Supplements 15.3
  const purchasedMineralSupplements = calculatePurchasedMineralSupplements(
    herd,
    context,
  );

  // Purchased Fertiliser 15.4
  const fertiliser = calculateScope3Fertiliser(herd, context);

  // Purchased Agrichemicals 15.5
  const agrichemicals = calculateScope3Agrichemicals(herd, context);

  // Purchased Soil Ameliorants 15.6
  const soilAmeliorants = calculateScope3SoilAmeliorants(herd, context);

  // Purchased Services/Contractors 15.7
  const services = calculateScope3Services(herd, context);

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
    purchasedMineralSupplements,
    electricity,
    fertiliser,
    agrichemicals,
    fuel,
    soilAmeliorants,
    services,
    solidWaste,
    otherPurchasedGoodsAndServices,
  };
};

export const calculateOtherLivestock = createCalculator(
  'other-livestock',
  'herds',
  OtherLivestockOutputSchema.shape,
  calculateScope1OtherLivestockHerd,
  calculateScope3OtherLivestockHerd,
  getSingleIntensities,
  getTotalIntensities,
);
