import { calculate10SolidWasteEmissions } from '@/modules/scope1/10-solid-waste';
import { calculate11Scope1WastewaterTreatment } from '@/modules/scope1/11-wastewater';
import { calculate12Scope1SupplementaryCO2 } from '@/modules/scope1/12-supplementary-co2';
import {
  calculate81TransportFuel,
  calculate82StationaryFuel,
} from '@/modules/scope1/8-fuel-use';
import { calculateScope1RefrigerantUse } from '@/modules/scope1/9-refrigerant-use';
import { calculateElectricityScope2 } from '@/modules/scope2/14-electricity';
import { calculateScope3EmissionsFromFuel } from '@/modules/scope3/15.10-fuel';
import { calculateElectricityScope3 } from '@/modules/scope3/15.11-electricity';
import { calculateScope3SolidWasteEmissions } from '@/modules/scope3/15.12-waste';
import { calculateFreightEmissions } from '@/modules/scope3/15.13-freight';
import { calculatePurchasedPackaging } from '@/modules/scope3/15.8-purchased-packaging';
import { calculateOtherPurchasedGoodsAndServicesEmissions } from '@/modules/scope3/15.9-other-purchases';
import { IntermediateScope1, IntermediateScope23 } from '@/tools/calculators';
import { Container, num } from '@/tools/containers';
import { exposeMassValue, exposeRealNumberValue } from '@/tools/extract';
import { generateIntensityPerUnit } from '@/tools/intensity';
import {
  buildCalculatorLedger,
  serialiseCalculatorLedger,
} from '@/tools/ledger';
import { Mass } from '@/tools/units';
import { ExecutionContext } from '../executionContext';
import { Scope2Output } from '../types/scope2.output';
import { ConstantsForPostProductionCalculator } from './constants';
import { PostProductionInputTransformed } from './types/input';
import { PostProductionIntensitiesInputTransformed } from './types/intensities.input';
import { PostProductionIntensitiesOutput } from './types/intensities.output';
import { PostProductionScope1Output } from './types/scope1.output';

export function getIntensities(
  input: PostProductionIntensitiesInputTransformed | undefined,
  postProductionEmissions: Container<Mass<'CO2e'>>,
): PostProductionIntensitiesOutput {
  if (!input) {
    return {
      unitsProduced: { value: 0 },
      productionEmissionsKgCO2e: { value: 0 },
      postProductionAllocation: { value: 0 },
      postProductionEmissionsKgCO2e: exposeMassValue(postProductionEmissions),
      productionIntensityKgCO2ePerUnit: { value: 0 },
      postProductionIntensityKgCO2ePerUnit: { value: 0 },
      combinedIntensityKgCO2ePerUnit: { value: 0 },
    };
  }

  const {
    unitsProduced,
    productionEmissionsKgCO2e: productionEmissions,
    postProductionAllocation,
  } = input;

  // Only the allocated share of post-production emissions relates to these units
  const allocatedPostProductionEmissions = postProductionEmissions.multiply(
    postProductionAllocation ?? num(1),
  );

  return {
    combinedIntensityKgCO2ePerUnit: generateIntensityPerUnit(
      productionEmissions.plus(allocatedPostProductionEmissions),
      unitsProduced,
    ),
    postProductionIntensityKgCO2ePerUnit: generateIntensityPerUnit(
      allocatedPostProductionEmissions,
      unitsProduced,
    ),
    productionIntensityKgCO2ePerUnit: generateIntensityPerUnit(
      productionEmissions,
      unitsProduced,
    ),
    postProductionEmissionsKgCO2e: exposeMassValue(postProductionEmissions),
    productionEmissionsKgCO2e: exposeMassValue(productionEmissions),
    unitsProduced: exposeRealNumberValue(unitsProduced),
    postProductionAllocation: postProductionAllocation
      ? exposeRealNumberValue(postProductionAllocation)
      : { value: 0 },
  };
}

const calculateScope1PostProduction = (
  input: PostProductionInputTransformed,
  context: ExecutionContext<ConstantsForPostProductionCalculator>,
): IntermediateScope1<PostProductionScope1Output> => {
  // Transport Fuel 8.1
  const { fuelTransportCO2, fuelTransportCH4, fuelTransportN2O } =
    calculate81TransportFuel(input, context);
  // Stationary Fuel 8.2
  const { fuelStationaryCO2, fuelStationaryCH4, fuelStationaryN2O } =
    calculate82StationaryFuel(input, context);
  // Refrigerant Use 9.1
  const refrigerantHFCs = calculateScope1RefrigerantUse(input, context);
  // Solid Waste Treatment 10.1
  const { solidWasteCO2, solidWasteCH4, solidWasteN2O } =
    calculate10SolidWasteEmissions(input, context);

  // Wastewater Treatment 11.1
  const { wastewaterCH4, wastewaterN2O } = calculate11Scope1WastewaterTreatment(
    input,
    context,
  );

  // Supplementary CO2 12.1
  const supplementaryCO2 = calculate12Scope1SupplementaryCO2(input);

  return {
    fuelTransportCO2,
    fuelTransportCH4,
    fuelTransportN2O,
    fuelStationaryCO2,
    fuelStationaryCH4,
    fuelStationaryN2O,
    refrigerantHFCs,
    solidWasteCO2,
    solidWasteCH4,
    solidWasteN2O,
    wastewaterCH4,
    wastewaterN2O,
    supplementaryCO2,
  };
};

const calculateScope2 = (
  input: PostProductionInputTransformed,
  context: ExecutionContext<ConstantsForPostProductionCalculator>,
): IntermediateScope23<Scope2Output> => {
  // Purchased Electricity 14.1
  const electricity = calculateElectricityScope2(input.electricity, context);

  return {
    electricity,
  };
};

const calculateScope3PostProduction = (
  input: PostProductionInputTransformed,
  context: ExecutionContext<ConstantsForPostProductionCalculator>,
) => {
  // Purchased packaging 15.8
  const purchasedPackaging = calculatePurchasedPackaging(input, context);

  // Other Purchased Goods and Services 15.9
  const otherPurchasedGoodsAndServices =
    calculateOtherPurchasedGoodsAndServicesEmissions(input);

  // Upstream Emissions from Fuel 15.10
  const fuel = calculateScope3EmissionsFromFuel(input, context);

  // Upstream emissions of Purchased Electricity 15.11
  const electricity = calculateElectricityScope3(input.electricity, context);

  // Management of Waste 15.12
  const solidWaste = calculateScope3SolidWasteEmissions(input, context);

  // Upstream freight 15.13
  const freight = calculateFreightEmissions(input, context);

  return {
    electricity,
    freight,
    fuel,
    solidWaste,
    otherPurchasedGoodsAndServices,
    purchasedPackaging,
  };
};

export const calculatePostProduction = (
  input: PostProductionInputTransformed,
  context: ExecutionContext<ConstantsForPostProductionCalculator>,
) => {
  const scope1 = calculateScope1PostProduction(input, context);

  const scope2 = calculateScope2(input, context);

  const scope3 = calculateScope3PostProduction(input, context);

  const ledger = buildCalculatorLedger({ scope1, scope2, scope3 });

  return {
    ...serialiseCalculatorLedger(ledger),
    intensities: getIntensities(input.intensities, ledger.net),
  };
};
