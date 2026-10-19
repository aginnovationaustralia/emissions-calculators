import { calculate10SolidWasteEmissions } from '@/modules/scope1/10-solid-waste';
import { calculate33EntericMethaneForHerd } from '@/modules/scope1/3-enteric-methane/3.3-dairy-enteric';
import { calculate43DairyManureManagement } from '@/modules/scope1/4-manure-management/4.3-dairy-manure/calculate';
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
import { calculateScope1RefrigerantUse } from '@/modules/scope1/9-refrigerant-use';
import { calculateMilkProduction } from '@/modules/scope1/shared/dairy/calculate';
import {
  getLengthOfStay,
  totalLiveweightFromSale,
} from '@/modules/scope1/shared/dairy/helpers';
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
import { selectConstant } from '@/tools/constants';
import { Container, root } from '@/tools/containers';
import { valueObject } from '@/tools/outputs';
import { sum } from '@/tools/sum';
import { mass, Mass } from '@/tools/units';
import { createCalculator } from '../common/calculator';
import { divideBySafeFromZero } from '../common/tools';
import { ExecutionContext } from '../executionContext';
import { ConstantsForDairyCalculator } from './constants';
import { DairyHerdInputTransformed } from './types/herd.input';
import { DairyIntensitiesOutput } from './types/intensities.output';
import { DairyIntermediateIntensitiesOutput } from './types/intermediate-intensities.output';
import { DairyOutputSchema } from './types/output';
import { isDairySaleMature } from './types/sale.input';
import { DairyScope1Output } from './types/scope1.output';
import { DairyScope3Output } from './types/scope3.output';

const calculateScope1DairyHerd = (
  herd: DairyHerdInputTransformed,
  context: ExecutionContext<ConstantsForDairyCalculator>,
): IntermediateScope1<DairyScope1Output> => {
  // 3.3 Enteric Methane
  const entericCH4 = calculate33EntericMethaneForHerd(herd, context);

  // 4.3 Manure Management
  const {
    manureManagementCH4,
    manureDirectN2O,
    manureAtmosphericDepositionN2O,
    manureLeachingRunoffN2O,
  } = calculate43DairyManureManagement(herd, context);

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

  // Refrigerant Use 9.1
  const refrigerantCO2e = calculateScope1RefrigerantUse(herd, context);

  // Solid Waste Treatment 10.1
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
    refrigerantCO2e,
  };
};

const calculateScope3DairyHerd = (
  herd: DairyHerdInputTransformed,
  enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForDairyCalculator>,
): IntermediateScope23<DairyScope3Output> => {
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

function getLiveweightProducedKgForHerd(
  herd: DairyHerdInputTransformed,
  context: ExecutionContext<ConstantsForDairyCalculator>,
) {
  return sum(
    herd.livestockSales.map((sale) =>
      totalLiveweightFromSale(sale, herd.breed, context.constants),
    ),
  );
}

function getMilkProducedKgForHerd(
  herd: DairyHerdInputTransformed,
  context: ExecutionContext<ConstantsForDairyCalculator>,
) {
  if (!herd.classes.milkingCows) {
    return root(mass('Milk', 0));
  }
  const densityOfMilk = selectConstant(
    context.constants.DAIRY,
    'MILK_CONSTANTS',
    'DENSITY_OF_MILK',
  );
  const litresPerHeadPerDay = calculateMilkProduction(
    herd.milkProduction,
    context.constants,
  );
  const kgMilkPerHeadPerDay = litresPerHeadPerDay.multiply(densityOfMilk);
  const lengthOfStay = getLengthOfStay(
    herd.classes.milkingCows,
    context.constants,
  );
  const { head } = herd.classes.milkingCows;

  return kgMilkPerHeadPerDay.multiply(head).multiply(lengthOfStay);
}

/**
 * Calculate the fraction of emissions that should be allocated to milk production.
 * This allocation is energy based. Surplus calves and culled cows are included as
 * "meat".
 *
 * The method for determining this allocation comes from the International Dairy
 * Foundation (Bulletin of the IDF N°518/2022: The World Dairy Situation Report 2022),
 * which builds upon the work of [Ineichen et al. (2022)](https://www.sciencedirect.com/science/article/pii/S1871141322001342)
 * and [Nemecek and Thoma (2020)](https://ira.agroscope.ch/en-US/Page/Einzelpublikation/Download?einzelpublikationId=47637)
 */
function getAllocationToMilkProduction(
  herds: DairyHerdInputTransformed[],
  context: ExecutionContext<ConstantsForDairyCalculator>,
) {
  const { constants } = context;
  const energyForMeatProduction = sum(
    herds.map((herd) =>
      sum(
        herd.livestockSales.map((sale) => {
          const totalLiveweight = totalLiveweightFromSale(
            sale,
            herd.breed,
            constants,
          );

          const energyForGrowth = isDairySaleMature(sale)
            ? selectConstant(
                constants.DAIRY,
                'CLASSES',
                sale.class,
                'netEnergyForGrowth',
              )
            : selectConstant(
                constants.DAIRY,
                'CLASSES',
                sale.class,
                'netEnergyForGrowth',
                sale.weaned ? 'weaned' : 'preWeaned',
              );

          return energyForGrowth.multiply(totalLiveweight);
        }),
      ),
    ),
  );

  // See constants/values.ts for notes on the difference between this and `NET_ENERGY`.
  const milkNetEnergy = selectConstant(
    constants.DAIRY,
    'MILK_CONSTANTS',
    'NET_ENERGY_FOR_INTENSITY_ALLOCATION',
  );

  const milkProduced = sum(
    herds.map((herd) => getMilkProducedKgForHerd(herd, context)),
  );

  const energyForMilkProduction = milkNetEnergy.multiply(milkProduced);

  /**
   * From the International Dairy Foundation:
   *
   * AFmilk = NEL * Mmilk / NEL * Mmilk + NEG * Mmeat
   */
  return energyForMilkProduction.divide(
    energyForMilkProduction.plus(energyForMeatProduction),
  );
}

function getSingleIntensities(
  netEmissionsKgCO2e: number,
  herd: DairyHerdInputTransformed,
  context: ExecutionContext<ConstantsForDairyCalculator>,
): DairyIntermediateIntensitiesOutput {
  const liveweightProducedKg = getLiveweightProducedKgForHerd(
    herd,
    context,
  ).unit.store.toNumber();
  const milkProducedKg = getMilkProducedKgForHerd(
    herd,
    context,
  ).unit.store.toNumber();

  const allocationToMilk = getAllocationToMilkProduction(
    [herd],
    context,
  ).unit.store.toNumber();
  const allocationToMeat = 1 - allocationToMilk;

  const liveweightIntensity = valueObject(
    divideBySafeFromZero(
      netEmissionsKgCO2e * allocationToMeat,
      liveweightProducedKg,
    ),
  );
  const milkIntensity = valueObject(
    divideBySafeFromZero(netEmissionsKgCO2e * allocationToMilk, milkProducedKg),
  );

  return {
    liveweightIntensity,
    liveweightProducedKg: valueObject(liveweightProducedKg),
    milkIntensity,
    milkProducedKg: valueObject(milkProducedKg),
  };
}

function getTotalIntensities(
  netTotalEmissionsKgCO2e: number,
  netLulucfKgCO2e: number,
  herds: DairyHerdInputTransformed[],
  context: ExecutionContext<ConstantsForDairyCalculator>,
): DairyIntensitiesOutput {
  const liveweightProducedKg = sum(
    herds.map((herd) => getLiveweightProducedKgForHerd(herd, context)),
  ).unit.store.toNumber();

  const milkProducedKg = sum(
    herds.map((herd) => getMilkProducedKgForHerd(herd, context)),
  ).unit.store.toNumber();

  const allocationToMilk = getAllocationToMilkProduction(
    herds,
    context,
  ).unit.store.toNumber();
  const allocationToMeat = 1 - allocationToMilk;

  const netTotalEmissionsIncludingLULUCF =
    netTotalEmissionsKgCO2e + netLulucfKgCO2e;

  const liveweightIntensityExcludingLULUCF = valueObject(
    divideBySafeFromZero(
      netTotalEmissionsKgCO2e * allocationToMeat,
      liveweightProducedKg,
    ),
  );
  const liveweightIntensityIncludingLULUCF = valueObject(
    divideBySafeFromZero(
      netTotalEmissionsIncludingLULUCF * allocationToMeat,
      liveweightProducedKg,
    ),
  );

  const milkIntensityExcludingLULUCF = valueObject(
    divideBySafeFromZero(
      netTotalEmissionsKgCO2e * allocationToMilk,
      milkProducedKg,
    ),
  );
  const milkIntensityIncludingLULUCF = valueObject(
    divideBySafeFromZero(
      netTotalEmissionsIncludingLULUCF * allocationToMilk,
      milkProducedKg,
    ),
  );
  return {
    liveweightIntensityExcludingLULUCF,
    liveweightIntensityIncludingLULUCF,
    liveweightProducedKg: valueObject(liveweightProducedKg),
    milkIntensityExcludingLULUCF,
    milkIntensityIncludingLULUCF,
    milkProducedKg: valueObject(milkProducedKg),
  };
}

export const calculateDairy = createCalculator(
  'dairy',
  'herds',
  DairyOutputSchema.shape,
  calculateScope1DairyHerd,
  calculateScope3DairyHerd,
  getSingleIntensities,
  getTotalIntensities,
);
