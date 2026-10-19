import { calculate10SolidWasteEmissions } from '@/modules/scope1/10-solid-waste';
import { calculate46PoultryManureManagement } from '@/modules/scope1/4-manure-management/4.6-poultry-manure';
import {
  calculate81TransportFuel,
  calculate82StationaryFuel,
} from '@/modules/scope1/8-fuel-use';
import { calculatePurchasedLivestockEmissions } from '@/modules/scope3/15.1-purchased-livestock';
import { calculateScope3EmissionsFromFuel } from '@/modules/scope3/15.10-fuel';
import { calculateScope3SolidWasteEmissions } from '@/modules/scope3/15.12-waste';
import { calculatePurchasedFeed } from '@/modules/scope3/15.2-purchased-feed';
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
import { ConstantsForPoultryCalculator } from './constants';
import { PoultryIntensitiesOutput } from './types/intensities.output';
import { PoultryIntermediateIntensitiesOutput } from './types/intermediate-intensities.output';
import { PoultryOutputSchema } from './types/output';
import { PoultryFlockInputTransformed } from './types/poultry-flock.input';
import { PoultryScope1Output } from './types/scope1.output';
import { PoultryScope3Output } from './types/scope3.output';

function getMeatEggAllocation(
  liveweightProducedKg: number,
  eggsProducedKg: number,
) {
  const meatAllocation =
    liveweightProducedKg / (liveweightProducedKg + eggsProducedKg);
  const eggAllocation = 1 - meatAllocation;

  return { meatAllocation, eggAllocation };
}

function getSingleIntensities(
  netEmissionsKgCO2e: number,
  flock: PoultryFlockInputTransformed,
): PoultryIntermediateIntensitiesOutput {
  const eggsProducedKg = flock.eggsSoldKg.unit.store.toNumber();
  const liveweightProducedKg = flock.liveweightSoldKg.unit.store.toNumber();

  const { meatAllocation, eggAllocation } = getMeatEggAllocation(
    liveweightProducedKg,
    eggsProducedKg,
  );

  const liveweightIntensity = valueObject(
    divideBySafeFromZero(
      netEmissionsKgCO2e * meatAllocation,
      liveweightProducedKg,
    ),
  );
  const eggsIntensity = valueObject(
    divideBySafeFromZero(netEmissionsKgCO2e * eggAllocation, eggsProducedKg),
  );

  return {
    liveweightProducedKg: valueObject(liveweightProducedKg),
    liveweightIntensity,
    eggsProducedKg: valueObject(eggsProducedKg),
    eggsIntensity,
  };
}

function getTotalIntensities(
  netTotalEmissionsKgCO2e: number,
  netLulucfKgCO2e: number,
  flocks: PoultryFlockInputTransformed[],
): PoultryIntensitiesOutput {
  const eggsProducedKg = sum(
    flocks.map((flock) => flock.eggsSoldKg),
  ).unit.store.toNumber();

  const liveweightProducedKg = sum(
    flocks.map((flock) => flock.liveweightSoldKg),
  ).unit.store.toNumber();

  const { meatAllocation, eggAllocation } = getMeatEggAllocation(
    liveweightProducedKg,
    eggsProducedKg,
  );

  const totalEmissionsIncludingLulucf =
    netTotalEmissionsKgCO2e + netLulucfKgCO2e;
  const liveweightIntensityExcludingLULUCF = valueObject(
    divideBySafeFromZero(
      netTotalEmissionsKgCO2e * meatAllocation,
      liveweightProducedKg,
    ),
  );
  const liveweightIntensityIncludingLULUCF = valueObject(
    divideBySafeFromZero(
      totalEmissionsIncludingLulucf * meatAllocation,
      liveweightProducedKg,
    ),
  );

  const eggsIntensityExcludingLULUCF = valueObject(
    divideBySafeFromZero(
      netTotalEmissionsKgCO2e * eggAllocation,
      eggsProducedKg,
    ),
  );
  const eggsIntensityIncludingLULUCF = valueObject(
    divideBySafeFromZero(
      totalEmissionsIncludingLulucf * eggAllocation,
      eggsProducedKg,
    ),
  );

  return {
    liveweightProducedKg: valueObject(liveweightProducedKg),
    liveweightIntensityExcludingLULUCF,
    liveweightIntensityIncludingLULUCF,
    eggsProducedKg: valueObject(eggsProducedKg),
    eggsIntensityExcludingLULUCF,
    eggsIntensityIncludingLULUCF,
  };
}

const calculateScope1PoultryFlock = (
  flock: PoultryFlockInputTransformed,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
): IntermediateScope1<PoultryScope1Output> => {
  // 4.6
  const {
    manureManagementCH4,
    manureDirectN2O,
    manureAtmosphericDepositionN2O,
    manureLeachingRunoffN2O,
  } = calculate46PoultryManureManagement(flock, context);

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
};

const calculateScope3PoultryFlock = (
  flock: PoultryFlockInputTransformed,
  enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
): IntermediateScope23<PoultryScope3Output> => {
  // Purchased Livestock 15.1
  const purchasedLivestock = calculatePurchasedLivestockEmissions(
    flock,
    context,
  );

  // Purchased Feed 15.2
  const purchasedFeed = calculatePurchasedFeed(flock, context);

  // Purchased Services/Contractors 15.7
  const services = calculateScope3Services(flock, context);

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
    electricity,
    fuel,
    services,
    solidWaste,
    otherPurchasedGoodsAndServices,
  };
};

export const calculatePoultry = createCalculator(
  'poultry',
  'flocks',
  PoultryOutputSchema.shape,
  calculateScope1PoultryFlock,
  calculateScope3PoultryFlock,
  getSingleIntensities,
  getTotalIntensities,
);
