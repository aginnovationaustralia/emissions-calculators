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
  calculate62PastureResidueN2O,
  calculate63ResidueLeachingAndRunoffN2O,
  calculate64FieldBurning,
  getAmountProduced,
} from '@/modules/scope1/6-residue-mgmt';
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
import { calculateScope3ServicesForActivity } from '@/modules/scope3/15.7-services';
import { calculateOtherPurchasedGoodsAndServicesEmissions } from '@/modules/scope3/15.9-other-purchases';
import { IntermediateScope1 } from '@/tools/calculators';
import { Container } from '@/tools/containers';
import { exposeMassValue } from '@/tools/extract';
import { generateIntensity } from '@/tools/intensity';
import { zeroMassDryMatter } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { createCalculator } from '../common/calculator';
import { ExecutionContext } from '../executionContext';
import { ConstantsForCroppingCalculator } from './constants';
import { CroppingOutputSchema, CroppingScope1Output } from './types';
import { CroppingCropInputTransformed } from './types/crop.input';
import { CroppingIntensitiesOutput } from './types/intensities.output';
import { CroppingIntermediateIntensitiesOutput } from './types/intermediate-intensities.output';

function getSingleIntensities(
  netEmissions: Container<Mass<'CO2e'>>,
  crop: CroppingCropInputTransformed,
  context: ExecutionContext<ConstantsForCroppingCalculator>,
): CroppingIntermediateIntensitiesOutput {
  const harvested = getAmountProduced(crop, context.constants);

  return {
    cropIntensity: generateIntensity(netEmissions, harvested),
    cropHarvestedKg: exposeMassValue(harvested),
  };
}

function getTotalIntensities(
  netTotalEmissions: Container<Mass<'CO2e'>>,
  netLulucf: Container<Mass<'CO2e'>>,
  crops: CroppingCropInputTransformed[],
  context: ExecutionContext<ConstantsForCroppingCalculator>,
): CroppingIntensitiesOutput {
  const { constants } = context;
  const harvested = sum(
    crops.map((crop) => getAmountProduced(crop, constants)),
    zeroMassDryMatter,
  );

  return {
    cropIntensityExcludingLULUCF: generateIntensity(
      netTotalEmissions.minus(netLulucf),
      harvested,
    ),
    cropIntensityIncludingLULUCF: generateIntensity(
      netTotalEmissions,
      harvested,
    ),
    cropHarvestedKg: exposeMassValue(harvested),
  };
}

/*
  2.3.1 Module mapping
  Direct GHG emissions (Scope 1)

  Fertiliser Use 5.1 - 5.5
  Agriculture Residue Management 6.1 - 6.4
  Rice Cultivation (only applicable to rice-growers) 7.1
  Transport Fuel 8.1
  Stationary Fuel 8.2
  Refrigerant Use 9.1
  Solid Waste Treatment 10.1
*/
const calculateScope1Cropping = (
  crop: CroppingCropInputTransformed,
  context: ExecutionContext<ConstantsForCroppingCalculator>,
): IntermediateScope1<CroppingScope1Output> => {
  // 5.1 Inorganic and urea fertiliser application
  const { inorganicFertiliserN2O, inorganicFertiliserCO2 } =
    calculate51InorganicFertiliser(crop, context);
  // 5.2 Organic fertiliser application
  const organicFertiliserN2O = calculate52OrganicFertiliser(crop, context);
  // 5.3 Lime application
  const limeCO2 = calculate53Lime(crop, context);
  // 5.4 Atmospheric deposition
  const {
    inorganicFertiliserAtmosphericDepositionN2O,
    organicFertiliserAtmosphericDepositionN2O,
  } = calculate54AtmosphericDeposition(crop, context);
  // 5.5 Fertiliser leaching and run-off resulting from fertiliser application
  const { fertiliserLeachingAndRunoffN2O } = calculate55LeachingAndRunoff(
    crop,
    context,
  );

  // 6 residue management
  // 6.1 Return of crop residues to soils
  const cropResidueN2O = calculate61CropResidueN2O(crop, context);
  // 6.2 Return of pasture residues to soils
  const pastureResidueN2O = calculate62PastureResidueN2O(crop, context);
  // 6.3 Residue leaching and run-off from crop and pasture residues
  const residueLeachingAndRunoffN2O = calculate63ResidueLeachingAndRunoffN2O(
    crop,
    context,
  );
  // 6.4 Field burning of crop residues
  const { fieldBurningN2O, fieldBurningCH4 } = calculate64FieldBurning(
    crop,
    context,
  );

  // Transport Fuel 8.1
  const { fuelTransportCO2, fuelTransportCH4, fuelTransportN2O } =
    calculate81TransportFuel(crop, context);
  // Stationary Fuel 8.2
  const { fuelStationaryCO2, fuelStationaryCH4, fuelStationaryN2O } =
    calculate82StationaryFuel(crop, context);
  // Refrigerant Use 9.1
  const refrigerantHFCs = calculateScope1RefrigerantUse(crop, context);
  // Solid Waste Treatment 10.1
  const { solidWasteCO2, solidWasteCH4, solidWasteN2O } =
    calculate10SolidWasteEmissions(crop, context);

  return {
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
    cropResidueN2O,
    pastureResidueN2O,
    residueLeachingAndRunoffN2O,
    fieldBurningN2O,
    fieldBurningCH4,
    refrigerantHFCs,
    solidWasteCO2,
    solidWasteCH4,
    solidWasteN2O,
  };
};

/*
  2.3.1 Module Map
  Indirect GHG emissions (Scope 3)

  Purchased Fertiliser 15.4
  Purchased Agrichemicals 15.5
  Purchased Lime 15.6
  Purchased Services/Contractors 15.7
  Other Purchased Goods and Services 15.9
  Upstream Emissions from Fuel 15.10
  Upstream emissions of Purchased Electricity 15.11
  Management of Waste 15.12
*/
const calculateScope3Cropping = (
  crop: CroppingCropInputTransformed,
  enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForCroppingCalculator>,
) => {
  // Purchased Fertiliser 15.4
  const fertiliser = calculateScope3Fertiliser(crop, context);

  // Purchased Agrichemicals 15.5
  const agrichemicals = calculateScope3Agrichemicals(crop, context);

  // Purchased Soil Ameliorants 15.6
  const soilAmeliorants = calculateScope3SoilAmeliorants(crop, context);

  // Purchased Services/Contractors 15.7
  const services = calculateScope3ServicesForActivity(crop, context);

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

export const calculateCropping = createCalculator(
  'cropping',
  'crops',
  CroppingOutputSchema.shape,
  calculateScope1Cropping,
  calculateScope3Cropping,
  getSingleIntensities,
  getTotalIntensities,
);
