import { isDefined } from '@/common/filters';
import { calculate10SolidWasteEmissions } from '@/modules/scope1/10-solid-waste';
import { calculate34SheepEntericMethane } from '@/modules/scope1/3-enteric-methane/3.4-sheep-enteric';
import { calculate44SheepManureManagement } from '@/modules/scope1/4-manure-management/4.4-sheep-manure';
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
import { calculateScope3ServicesForActivity } from '@/modules/scope3/15.7-services';
import { calculateOtherPurchasedGoodsAndServicesEmissions } from '@/modules/scope3/15.9-other-purchases';
import { IntermediateScope1, IntermediateScope23 } from '@/tools/calculators';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { valueObject } from '@/tools/outputs';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { createCalculator } from '../common/calculator';
import { divideBySafeFromZero, entriesFromObject } from '../common/tools';
import { ExecutionContext } from '../executionContext';
import { ConstantsForSheepCalculator } from './constants';
import { SheepInputTransformed } from './types/input';
import { SheepIntensitiesOutput } from './types/intensities.output';
import { SheepIntermediateIntensitiesOutput } from './types/intermediate-intensities.output';
import { SheepOutputSchema } from './types/output';
import { SheepScope1Output } from './types/scope1.output';
import { SheepScope3Output } from './types/scope3.output';
import { SheepFlockInputTransformed } from './types/sheep-flock.input';

function getCleanWoolProducedForFlock(flock: SheepFlockInputTransformed) {
  const { period: _period, ...classes } = flock.classes;
  return sum(
    entriesFromObject(classes)
      .map(([_className, classInput]) => classInput)
      .filter(isDefined)
      .map(({ greasyWoolProduction, cleanWoolYieldProportion }) =>
        greasyWoolProduction.multiply(cleanWoolYieldProportion),
      ),
  );
}

/**
 * From the Common Requirements Framework:
 * > Allocation between sheep meat and wool should be based on a biophysical
 * > relationship, using protein mass allocation as recommended by Wiedemann et al.
 * > (2015). This assumes 18% of liveweight and 100% of clean fleece dry matter is
 * > protein.
 *
 * From [Wiedemann et al. (2015)](https://link.springer.com/content/pdf/10.1007/s11367-015-0849-z.pdf):
 * > The protein content of greasy wool was estimated from the protein content of clean
 * > wool on a dry matter basis (i.e. 100 %) adjusted for the dry matter content of
 * > clean wool (84 %) and ratio of clean wool to greasy wool. The protein content of
 * > live weight was assumed to be 18 % based on Sanson et al.
 *
 * The NIR 2024 volume 1 also defines 84% as the value for dry matter content, which
 * equation 4.4.1.3 (6) also uses
 */
function getMeatWoolAllocation(
  liveweightProduced: Container<Mass<'Liveweight'>>,
  cleanWoolProduced: Container<
    ReturnType<typeof getCleanWoolProducedForFlock>['unit']
  >,
  constants: ConstantsForSheepCalculator,
) {
  const proteinInLiveweight = selectConstant(
    constants.SHEEP,
    'LIVEWEIGHT_PROTEIN',
  );
  const liveweightProteinKg = liveweightProduced
    .multiply(proteinInLiveweight)
    .unit.store.toNumber();

  const proteinInCleanWool = selectConstant(constants.SHEEP, 'WOOL_PROTEIN');
  const woolProteinKg = cleanWoolProduced
    .multiply(proteinInCleanWool)
    .unit.store.toNumber();

  const woolAllocation = divideBySafeFromZero(
    woolProteinKg,
    woolProteinKg + liveweightProteinKg,
  );
  const meatAllocation = 1 - woolAllocation;

  return { meatAllocation, woolAllocation };
}

function getSingleIntensities(
  netEmissionsKgCO2e: number,
  flock: SheepFlockInputTransformed,
  context: ExecutionContext<ConstantsForSheepCalculator>,
): SheepIntermediateIntensitiesOutput {
  const { constants } = context;
  const liveweightProduced = flock.liveweightSoldKg;
  const cleanWoolProduced = getCleanWoolProducedForFlock(flock);

  const liveweightProducedKg = liveweightProduced.unit.store.toNumber();
  const cleanWoolProducedKg = cleanWoolProduced.unit.store.toNumber();

  const { meatAllocation, woolAllocation } = getMeatWoolAllocation(
    liveweightProduced,
    cleanWoolProduced,
    constants,
  );

  const liveweightIntensity = valueObject(
    divideBySafeFromZero(
      netEmissionsKgCO2e * meatAllocation,
      liveweightProducedKg,
    ),
  );
  const woolIntensity = valueObject(
    divideBySafeFromZero(
      netEmissionsKgCO2e * woolAllocation,
      cleanWoolProducedKg,
    ),
  );

  return {
    liveweightProducedKg: valueObject(liveweightProducedKg),
    liveweightIntensity,
    woolProducedKg: valueObject(cleanWoolProducedKg),
    woolIntensity,
  };
}

function getTotalIntensities(
  netTotalEmissionsKgCO2e: number,
  netLulucfKgCO2e: number,
  flocks: SheepFlockInputTransformed[],
  context: ExecutionContext<ConstantsForSheepCalculator>,
): SheepIntensitiesOutput {
  const { constants } = context;
  const liveweightProduced = sum(flocks.map((flock) => flock.liveweightSoldKg));
  const cleanWoolProduced = sum(
    flocks.map((flock) => getCleanWoolProducedForFlock(flock)),
  );

  const liveweightProducedKg = liveweightProduced.unit.store.toNumber();

  const cleanWoolProducedKg = cleanWoolProduced.unit.store.toNumber();

  const totalEmissionsExcludingLulucf =
    netTotalEmissionsKgCO2e - netLulucfKgCO2e;

  const { meatAllocation, woolAllocation } = getMeatWoolAllocation(
    liveweightProduced,
    cleanWoolProduced,
    constants,
  );

  const liveweightIntensityExcludingLULUCF = valueObject(
    divideBySafeFromZero(
      totalEmissionsExcludingLulucf * meatAllocation,
      liveweightProducedKg,
    ),
  );

  const liveweightIntensityIncludingLULUCF = valueObject(
    divideBySafeFromZero(
      netTotalEmissionsKgCO2e * meatAllocation,
      liveweightProducedKg,
    ),
  );

  const woolIntensityExcludingLULUCF = valueObject(
    divideBySafeFromZero(
      totalEmissionsExcludingLulucf * woolAllocation,
      cleanWoolProducedKg,
    ),
  );

  const woolIntensityIncludingLULUCF = valueObject(
    divideBySafeFromZero(
      netTotalEmissionsKgCO2e * woolAllocation,
      cleanWoolProducedKg,
    ),
  );

  return {
    liveweightProducedKg: valueObject(liveweightProducedKg),
    liveweightIntensityExcludingLULUCF,
    liveweightIntensityIncludingLULUCF,
    woolProducedKg: valueObject(cleanWoolProducedKg),
    woolIntensityExcludingLULUCF,
    woolIntensityIncludingLULUCF,
  };
}

const calculateScope1SheepFlock = (
  flock: SheepFlockInputTransformed,
  context: ExecutionContext<ConstantsForSheepCalculator>,
  input: SheepInputTransformed,
): IntermediateScope1<SheepScope1Output> => {
  const flockWithLeapYear = {
    ...flock,
    isFebruaryInLeapYear: input.isFebruaryInLeapYear,
  };

  // 3.4
  const entericCH4 = calculate34SheepEntericMethane(flockWithLeapYear, context);

  // 4.4
  const {
    manureManagementCH4,
    manureDirectN2O,
    manureAtmosphericDepositionN2O,
    manureLeachingRunoffN2O,
  } = calculate44SheepManureManagement(flockWithLeapYear, context);

  // 5.1
  const { inorganicFertiliserN2O, inorganicFertiliserCO2 } =
    calculate51InorganicFertiliser(flock, context);
  // 5.2
  const organicFertiliserN2O = calculate52OrganicFertiliser(flock, context);
  // 5.3
  const limeCO2 = calculate53Lime(flock, context);
  // 5.4
  const {
    inorganicFertiliserAtmosphericDepositionN2O,
    organicFertiliserAtmosphericDepositionN2O,
  } = calculate54AtmosphericDeposition(flock, context);
  // 5.5
  const { fertiliserLeachingAndRunoffN2O } = calculate55LeachingAndRunoff(
    flock,
    context,
  );

  // 6.2
  const pastureResidueN2O = calculate62PastureResidueN2O(flock, context);
  // 6.3
  const residueLeachingAndRunoffN2O = calculate63ResidueLeachingAndRunoffN2O(
    flock,
    context,
  );

  // 8.1
  const { fuelTransportCO2, fuelTransportCH4, fuelTransportN2O } =
    calculate81TransportFuel(flock, context);
  // 8.2
  const { fuelStationaryCO2, fuelStationaryCH4, fuelStationaryN2O } =
    calculate82StationaryFuel(flock, context);

  // 10.1
  const { solidWasteCO2, solidWasteCH4, solidWasteN2O } =
    calculate10SolidWasteEmissions(flock, context);
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
};

const calculateScope3SheepFlock = (
  flock: SheepFlockInputTransformed,
  enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForSheepCalculator>,
): IntermediateScope23<SheepScope3Output> => {
  // Purchased Livestock 15.1
  const purchasedLivestock = calculatePurchasedLivestockEmissions(
    flock,
    context,
  );

  // Purchased Feed 15.2
  const purchasedFeed = calculatePurchasedFeed(flock, context);

  // Purchased Mineral Supplements 15.3
  const purchasedMineralSupplements = calculatePurchasedMineralSupplements(
    flock,
    context,
  );

  // Purchased Fertiliser 15.4
  const fertiliser = calculateScope3Fertiliser(flock, context);

  // Purchased Agrichemicals 15.5
  const agrichemicals = calculateScope3Agrichemicals(flock, context);

  // Purchased Soil Ameliorants 15.6
  const soilAmeliorants = calculateScope3SoilAmeliorants(flock, context);

  // Purchased Services/Contractors 15.7
  const services = calculateScope3ServicesForActivity(flock, context);

  // Other Purchased Goods and Services 15.9
  const otherPurchasedGoodsAndServices =
    calculateOtherPurchasedGoodsAndServicesEmissions(flock);

  // Upstream Emissions from Fuel 15.10
  const fuel = calculateScope3EmissionsFromFuel(flock, context);

  // Upstream emissions of Purchased Electricity 15.11
  const electricity = enterpriseScope3Electricity.multiply(
    flock.electricityAllocation,
  );

  // Management of Waste 15.12.1.2
  const solidWaste = calculateScope3SolidWasteEmissions(flock, context);

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

export const calculateSheep = createCalculator(
  'sheep',
  'flocks',
  SheepOutputSchema.shape,
  calculateScope1SheepFlock,
  calculateScope3SheepFlock,
  getSingleIntensities,
  getTotalIntensities,
);
