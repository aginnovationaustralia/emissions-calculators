import { calculate32BeefPastureEntericMethaneForHerd } from '@/modules/scope1/3-enteric-methane/3.2-beef-pasture';
import { calculate42BeefPastureManure } from '@/modules/scope1/4-manure-management/4.2-beef-pasture/calculate';
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
} from '@/modules/scope1/6-residue-mgmt';

import { calculate10SolidWasteEmissions } from '@/modules/scope1/10-solid-waste';
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
import { exposeMassValue } from '@/tools/extract';
import { generateIntensity } from '@/tools/intensity';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { createCalculator } from '../common/calculator';
import { ExecutionContext } from '../executionContext';
import { ConstantsForBeefCalculator } from './constants';
import { BeefHerdInputTransformed } from './types/beef-herd.input';
import { BeefInputTransformed } from './types/input';
import { BeefOutputSchema } from './types/output';
import { BeefScope1Output } from './types/scope1.output';
import { BeefScope3Output } from './types/scope3.output';

function getSingleIntensities(
  netEmissions: Container<Mass<'CO2e'>>,
  herd: BeefHerdInputTransformed,
) {
  const liveweightProduced = herd.liveweightSoldKg;

  return {
    liveweightIntensity: generateIntensity(netEmissions, liveweightProduced),
    liveweightProducedKg: exposeMassValue(liveweightProduced),
  };
}

function getTotalIntensities(
  netTotalEmissions: Container<Mass<'CO2e'>>,
  netLulucf: Container<Mass<'CO2e'>>,
  herds: BeefHerdInputTransformed[],
) {
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

/*
    2.2.1 Module map
    Direct GHG emissions (Scope 1)

    Enteric Methane 3.2
    Manure Management 4.2
    Fertiliser Use 5.1 - 5.5
    Agriculture Residue Management 6.2 - 6.3
    Transport Fuel 8.1
    Stationary Fuel 8.2
    Solid Waste Treatment 10.1
*/
const calculateScope1BeefHerd = (
  herd: BeefHerdInputTransformed,
  context: ExecutionContext<ConstantsForBeefCalculator>,
  input: BeefInputTransformed,
): IntermediateScope1<BeefScope1Output> => {
  const herdWithLeapYear = {
    ...herd,
    isFebruaryInLeapYear: input.isFebruaryInLeapYear,
  };

  // 3.2 Enteric Methane
  const entericCH4 = calculate32BeefPastureEntericMethaneForHerd(
    herdWithLeapYear,
    context,
  );

  // 4.2 Manure Management
  const {
    manureManagementCH4,
    manureAtmosphericDepositionN2O,
    manureLeachingRunoffN2O,
    manureSoilDirectN2O,
  } = calculate42BeefPastureManure(herdWithLeapYear, context);

  // 5.1 Inorganic and urea fertiliser application
  const { inorganicFertiliserN2O, inorganicFertiliserCO2 } =
    calculate51InorganicFertiliser(herd, context);
  // 5.2 Organic fertiliser application
  const organicFertiliserN2O = calculate52OrganicFertiliser(herd, context);
  // 5.3 Lime application
  const limeCO2 = calculate53Lime(herd, context);
  // 5.4 Atmospheric deposition
  const {
    inorganicFertiliserAtmosphericDepositionN2O,
    organicFertiliserAtmosphericDepositionN2O,
  } = calculate54AtmosphericDeposition(herd, context);
  // 5.5 Fertiliser leaching and run-off resulting from fertiliser application
  const { fertiliserLeachingAndRunoffN2O } = calculate55LeachingAndRunoff(
    herd,
    context,
  );

  // 6 residue management
  // 6.2 Return of pasture residues to soils
  const pastureResidueN2O = calculate62PastureResidueN2O(herd, context);
  // 6.3 Residue leaching and run-off from crop and pasture residues
  const residueLeachingAndRunoffN2O = calculate63ResidueLeachingAndRunoffN2O(
    herd,
    context,
  );

  // Transport Fuel 8.1
  const { fuelTransportCO2, fuelTransportCH4, fuelTransportN2O } =
    calculate81TransportFuel(herd, context);
  // Stationary Fuel 8.2
  const { fuelStationaryCO2, fuelStationaryCH4, fuelStationaryN2O } =
    calculate82StationaryFuel(herd, context);
  // Solid Waste Treatment 10.1
  const { solidWasteCO2, solidWasteCH4, solidWasteN2O } =
    calculate10SolidWasteEmissions(herd, context);

  return {
    entericCH4,
    manureManagementCH4,
    manureAtmosphericDepositionN2O,
    manureLeachingRunoffN2O,
    manureSoilDirectN2O,
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
    pastureResidueN2O,
    residueLeachingAndRunoffN2O,
    solidWasteCO2,
    solidWasteCH4,
    solidWasteN2O,
  };
};

/*
    2.2.1 Module Map
    Indirect GHG emissions (Scope 3)

    Purchased Livestock 15.1
    Purchased Feed 15.2
    Purchased Mineral Supplements 15.3
    Purchased Fertiliser 15.4
    Purchased Agrichemicals 15.5
    Purchased Lime 15.6
    Purchased Services/Contractors 15.7
    Other Purchased Goods and Services 15.9
    Upstream Emissions from Fuel 15.10
    Upstream Emissions of Purchased Electricity 15.11
    Management of Waste 15.12
*/
const calculateScope3BeefHerd = (
  herd: BeefHerdInputTransformed,
  enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForBeefCalculator>,
): IntermediateScope23<BeefScope3Output> => {
  // Purchased Livestock 15.1
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

  // Management of Waste 15.12
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

export const calculateBeef = createCalculator(
  'beef',
  'herds',
  BeefOutputSchema.shape,
  calculateScope1BeefHerd,
  calculateScope3BeefHerd,
  getSingleIntensities,
  getTotalIntensities,
);
