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
  getAmountProduced,
} from '@/modules/scope1/6-residue-mgmt';
import { ConstantsForResidueManagement } from '@/modules/scope1/6-residue-mgmt/constants';
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
import { IntermediateScope1 } from '@/tools/calculators';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { valueObject } from '@/tools/outputs';
import { oneMinus } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { createCalculator } from '../common/calculator';
import { divideBySafeFromZero } from '../common/tools';
import { ExecutionContext } from '../executionContext';
import { ConstantsForCottonCalculator } from './constants';
import {
  CottonIntensitiesOutput,
  CottonIntermediateIntensitiesOutput,
  CottonIntermediateSeedAndLintIntensitiesOutput,
  CottonOutputSchema,
  CottonScope1Output,
  CottonSeedAndLintIntensitiesOutput,
} from './types';
import { CottonCropInputTransformed } from './types/crop.input';

function getCottonHarvestedForCrop(
  crop: CottonCropInputTransformed,
  constants: ConstantsForResidueManagement,
) {
  return getAmountProduced(crop, constants);
}

function getCottonLintHarvestedForCrop(
  crop: CottonCropInputTransformed,
  constants: ConstantsForResidueManagement,
) {
  return getAmountProduced(crop, constants).multiply(
    crop.crop.fractionSeedCottonLint,
  );
}

function getCottonSeedHarvestedForCrop(
  crop: CottonCropInputTransformed,
  constants: ConstantsForResidueManagement,
) {
  return getAmountProduced(crop, constants).multiply(
    oneMinus(crop.crop.fractionSeedCottonLint),
  );
}

function getSingleIntensities(
  netEmissionsKgCO2e: number,
  crop: CottonCropInputTransformed,
  context: ExecutionContext<ConstantsForResidueManagement>,
): CottonIntermediateIntensitiesOutput {
  const { constants } = context;
  const cottonHarvestedKg = getCottonHarvestedForCrop(
    crop,
    constants,
  ).unit.store.value.toNumber();
  const cottonLintHarvestedKg = getCottonLintHarvestedForCrop(
    crop,
    constants,
  ).unit.store.value.toNumber();
  const cottonSeedHarvestedKg = getCottonSeedHarvestedForCrop(
    crop,
    constants,
  ).unit.store.value.toNumber();

  const economicLintAllocation = selectConstant(
    constants.CROP,
    'COTTON_ECONOMIC_LINT_ALLOCATION',
  ).unit.store.value.toNumber();
  const economicSeedAllocation = 1 - economicLintAllocation;

  const massLintAllocation = divideBySafeFromZero(
    cottonLintHarvestedKg,
    cottonHarvestedKg,
  );
  const massSeedAllocation = divideBySafeFromZero(
    cottonSeedHarvestedKg,
    cottonHarvestedKg,
  );

  const cottonIntensity = valueObject(
    divideBySafeFromZero(netEmissionsKgCO2e, cottonHarvestedKg),
  );

  // Lint and cottonseed intensities based on economic allocation of 83%
  const economicIntensities: CottonIntermediateSeedAndLintIntensitiesOutput = {
    cottonLint: valueObject(
      divideBySafeFromZero(
        netEmissionsKgCO2e * economicLintAllocation,
        cottonLintHarvestedKg,
      ),
    ),
    cottonSeed: valueObject(
      divideBySafeFromZero(
        netEmissionsKgCO2e * economicSeedAllocation,
        cottonSeedHarvestedKg,
      ),
    ),
  };

  // Lint and cottonseed intensities based on mass
  const massIntensities: CottonIntermediateSeedAndLintIntensitiesOutput = {
    cottonLint: valueObject(
      divideBySafeFromZero(
        netEmissionsKgCO2e * massLintAllocation,
        cottonLintHarvestedKg,
      ),
    ),
    cottonSeed: valueObject(
      divideBySafeFromZero(
        netEmissionsKgCO2e * massSeedAllocation,
        cottonSeedHarvestedKg,
      ),
    ),
  };

  return {
    cottonHarvestedKg: valueObject(cottonHarvestedKg),
    cottonLintHarvestedKg: valueObject(cottonLintHarvestedKg),
    cottonSeedHarvestedKg: valueObject(cottonSeedHarvestedKg),
    cottonIntensity,
    economicIntensities,
    massIntensities,
  };
}

function getTotalIntensities(
  netTotalEmissionsKgCO2e: number,
  netLulucfKgCO2e: number,
  crops: CottonCropInputTransformed[],
  context: ExecutionContext<ConstantsForResidueManagement>,
): CottonIntensitiesOutput {
  const { constants } = context;
  const cottonHarvestedKg = sum(
    crops.map((crop) => getCottonHarvestedForCrop(crop, constants)),
  ).unit.store.value.toNumber();

  const cottonLintHarvestedKg = sum(
    crops.map((crop) => getCottonLintHarvestedForCrop(crop, constants)),
  ).unit.store.value.toNumber();

  const cottonSeedHarvestedKg = sum(
    crops.map((crop) => getCottonSeedHarvestedForCrop(crop, constants)),
  ).unit.store.value.toNumber();

  const totalEmissionsExcludingLulucf =
    netTotalEmissionsKgCO2e - netLulucfKgCO2e;

  const economicLintAllocation = selectConstant(
    constants.CROP,
    'COTTON_ECONOMIC_LINT_ALLOCATION',
  ).unit.store.value.toNumber();
  const economicSeedAllocation = 1 - economicLintAllocation;

  const cottonExcludingLULUCF = valueObject(
    divideBySafeFromZero(totalEmissionsExcludingLulucf, cottonHarvestedKg),
  );

  const cottonIncludingLULUCF = valueObject(
    divideBySafeFromZero(netTotalEmissionsKgCO2e, cottonHarvestedKg),
  );

  // Lint and cottonseed intensities based on economic allocation of 83%
  const economicIntensities: CottonSeedAndLintIntensitiesOutput = {
    cottonLintExcludingLULUCF: valueObject(
      divideBySafeFromZero(
        totalEmissionsExcludingLulucf * economicLintAllocation,
        cottonLintHarvestedKg,
      ),
    ),
    cottonLintIncludingLULUCF: valueObject(
      divideBySafeFromZero(
        netTotalEmissionsKgCO2e * economicLintAllocation,
        cottonLintHarvestedKg,
      ),
    ),
    cottonSeedExcludingLULUCF: valueObject(
      divideBySafeFromZero(
        totalEmissionsExcludingLulucf * economicSeedAllocation,
        cottonSeedHarvestedKg,
      ),
    ),
    cottonSeedIncludingLULUCF: valueObject(
      divideBySafeFromZero(
        netTotalEmissionsKgCO2e * economicSeedAllocation,
        cottonSeedHarvestedKg,
      ),
    ),
  };

  // Lint and cottonseed intensities based on mass
  const massLintAllocation = divideBySafeFromZero(
    cottonLintHarvestedKg,
    cottonHarvestedKg,
  );
  const massSeedAllocation = divideBySafeFromZero(
    cottonSeedHarvestedKg,
    cottonHarvestedKg,
  );

  const massIntensities: CottonSeedAndLintIntensitiesOutput = {
    cottonLintExcludingLULUCF: valueObject(
      divideBySafeFromZero(
        totalEmissionsExcludingLulucf * massLintAllocation,
        cottonLintHarvestedKg,
      ),
    ),
    cottonLintIncludingLULUCF: valueObject(
      divideBySafeFromZero(
        netTotalEmissionsKgCO2e * massLintAllocation,
        cottonLintHarvestedKg,
      ),
    ),
    cottonSeedExcludingLULUCF: valueObject(
      divideBySafeFromZero(
        totalEmissionsExcludingLulucf * massSeedAllocation,
        cottonSeedHarvestedKg,
      ),
    ),
    cottonSeedIncludingLULUCF: valueObject(
      divideBySafeFromZero(
        netTotalEmissionsKgCO2e * massSeedAllocation,
        cottonSeedHarvestedKg,
      ),
    ),
  };

  return {
    cottonHarvestedKg: valueObject(cottonHarvestedKg),
    cottonLintHarvestedKg: valueObject(cottonLintHarvestedKg),
    cottonSeedHarvestedKg: valueObject(cottonSeedHarvestedKg),
    cottonExcludingLULUCF,
    cottonIncludingLULUCF,
    economicIntensities,
    massIntensities,
  };
}

const calculateScope1Cotton = (
  crop: CottonCropInputTransformed,
  context: ExecutionContext<ConstantsForCottonCalculator>,
): IntermediateScope1<CottonScope1Output> => {
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
    residueLeachingAndRunoffN2O,
    fieldBurningN2O,
    fieldBurningCH4,
    refrigerantHFCs,
    solidWasteCO2,
    solidWasteCH4,
    solidWasteN2O,
  };
};

const calculateScope3Cotton = (
  crop: CottonCropInputTransformed,
  enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForCottonCalculator>,
) => {
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
export const calculateCotton = createCalculator(
  'Cotton',
  'crops',
  CottonOutputSchema.shape,
  calculateScope1Cotton,
  calculateScope3Cotton,
  getSingleIntensities,
  getTotalIntensities,
);
