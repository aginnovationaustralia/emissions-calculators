import { calculate10SolidWasteEmissions } from '@/modules/scope1/10-solid-waste';
import {
  calculate51InorganicFertiliser,
  calculate52OrganicFertiliser,
  calculate53Lime,
  calculate54AtmosphericDeposition,
  calculate55LeachingAndRunoff,
} from '@/modules/scope1/5-fertiliser';
import {
  calculate61CropResidueN2O,
  calculate63ResidueLeachingAndRunoffN2O,
  calculate64FieldBurning,
} from '@/modules/scope1/6-residue-mgmt';
import { calculateScope1RiceCultivation } from '@/modules/scope1/7-rice-cultivation';
import {
  calculate81TransportFuel,
  calculate82StationaryFuel,
} from '@/modules/scope1/8-fuel-use';
import { calculateScope1RefrigerantUse } from '@/modules/scope1/9-refrigerant-use';
import { calculateScope3EmissionsFromFuel } from '@/modules/scope3/15.10-fuel';
import { calculateScope3SolidWasteEmissions } from '@/modules/scope3/15.12-waste';
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
import { ConstantsForRiceCalculator } from './constants';
import {
  RiceCropInputTransformed,
  RiceOutputSchema,
  RiceScope1Output,
  RiceScope3Output,
} from './types';
import { RiceIntermediateIntensitiesOutput } from './types/intermediate-intensities.output';

function getSingleIntensities(
  netEmissions: Container<Mass<'CO2e'>>,
  crop: RiceCropInputTransformed,
): RiceIntermediateIntensitiesOutput {
  const riceHarvested = crop.crop.totalYieldKg;

  return {
    riceIntensity: generateIntensity(netEmissions, riceHarvested),
    riceHarvestedKg: exposeMassValue(riceHarvested),
  };
}

function getTotalIntensities(
  netTotalEmissions: Container<Mass<'CO2e'>>,
  netLulucf: Container<Mass<'CO2e'>>,
  crops: RiceCropInputTransformed[],
) {
  const riceHarvested = sum(crops.map(({ crop }) => crop.totalYieldKg));

  return {
    riceExcludingLULUCF: generateIntensity(
      netTotalEmissions.minus(netLulucf),
      riceHarvested,
    ),
    riceIncludingLULUCF: generateIntensity(netTotalEmissions, riceHarvested),
    riceHarvestedKg: exposeMassValue(riceHarvested),
  };
}

function calculateScope1Rice(
  crop: RiceCropInputTransformed,
  context: ExecutionContext<ConstantsForRiceCalculator>,
): IntermediateScope1<RiceScope1Output> {
  // 5.1
  const { inorganicFertiliserN2O, inorganicFertiliserCO2 } =
    calculate51InorganicFertiliser(crop, context);
  // 5.2
  const organicFertiliserN2O = calculate52OrganicFertiliser(crop, context);
  // 5.3
  const limeCO2 = calculate53Lime(crop, context);
  // 5.4
  const {
    inorganicFertiliserAtmosphericDepositionN2O,
    organicFertiliserAtmosphericDepositionN2O,
  } = calculate54AtmosphericDeposition(crop, context);
  // 5.5
  const { fertiliserLeachingAndRunoffN2O } = calculate55LeachingAndRunoff(
    crop,
    context,
  );

  // 6.1 Return of crop residues to soils
  const cropResidueN2O = calculate61CropResidueN2O(crop, context);
  // 6.3 Residue leaching and run-off from crop and pasture residues
  const residueLeachingAndRunoffN2O = calculate63ResidueLeachingAndRunoffN2O(
    crop,
    context,
  );
  // 6.4
  const { fieldBurningN2O, fieldBurningCH4 } = calculate64FieldBurning(
    crop,
    context,
  );

  // 7.1
  const riceCultivationCH4 = calculateScope1RiceCultivation(crop, context);

  // 8.1
  const { fuelTransportCO2, fuelTransportCH4, fuelTransportN2O } =
    calculate81TransportFuel(crop, context);
  // 8.2
  const { fuelStationaryCO2, fuelStationaryCH4, fuelStationaryN2O } =
    calculate82StationaryFuel(crop, context);

  // 9.1
  const refrigerantHFCs = calculateScope1RefrigerantUse(crop, context);

  // 10.1
  const { solidWasteCO2, solidWasteCH4, solidWasteN2O } =
    calculate10SolidWasteEmissions(crop, context);

  return {
    fuelTransportCO2,
    fuelTransportCH4,
    fuelTransportN2O,
    fuelStationaryCO2,
    fuelStationaryCH4,
    fuelStationaryN2O,
    inorganicFertiliserN2O,
    inorganicFertiliserCO2,
    riceCultivationCH4,
    limeCO2,
    organicFertiliserN2O,
    inorganicFertiliserAtmosphericDepositionN2O,
    organicFertiliserAtmosphericDepositionN2O,
    fertiliserLeachingAndRunoffN2O,
    residueLeachingAndRunoffN2O,
    cropResidueN2O,
    fieldBurningN2O,
    fieldBurningCH4,
    refrigerantHFCs,
    solidWasteCO2,
    solidWasteCH4,
    solidWasteN2O,
  };
}

function calculateScope3Rice(
  crop: RiceCropInputTransformed,
  enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForRiceCalculator>,
): IntermediateScope23<RiceScope3Output> {
  // Purchased Fertiliser 15.4
  const fertiliser = calculateScope3Fertiliser(crop, context);

  // Purchased Agrichemicals 15.5
  const agrichemicals = calculateScope3Agrichemicals(crop, context);

  // Purchased Soil Ameliorants 15.6
  const soilAmeliorants = calculateScope3SoilAmeliorants(crop, context);

  // Purchased Services/Contractors 15.7
  const services = calculateScope3Services(crop, context);

  // Other Purchased Goods and Services 15.9
  const otherPurchasedGoodsAndServices =
    calculateOtherPurchasedGoodsAndServicesEmissions(crop);

  // Upstream Emissions from Fuel 15.10
  const fuel = calculateScope3EmissionsFromFuel(crop, context);

  // Upstream emissions of Purchased Electricity 15.11
  const electricity = enterpriseScope3Electricity.multiply(
    crop.electricityAllocation,
  );

  // Management of Waste 15.12
  const solidWaste = calculateScope3SolidWasteEmissions(crop, context);
  return {
    services,
    otherPurchasedGoodsAndServices,
    fuel,
    soilAmeliorants,
    solidWaste,
    fertiliser,
    agrichemicals,
    electricity,
  };
}

export const calculateRice = createCalculator(
  'rice',
  'crops',
  RiceOutputSchema.shape,
  calculateScope1Rice,
  calculateScope3Rice,
  getSingleIntensities,
  getTotalIntensities,
);
