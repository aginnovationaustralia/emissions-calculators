import { calculate10SolidWasteEmissions } from '@/modules/scope1/10-solid-waste';
import { calculate11Scope1WastewaterTreatment } from '@/modules/scope1/11-wastewater';
import {
  calculate81TransportFuel,
  calculate82StationaryFuel,
} from '@/modules/scope1/8-fuel-use';
import { calculateScope1RefrigerantUse } from '@/modules/scope1/9-refrigerant-use';
import { calculateElectricityScope2 } from '@/modules/scope2/14-electricity';
import { calculateScope3EmissionsFromFuel } from '@/modules/scope3/15.10-fuel';
import { calculateElectricityScope3 } from '@/modules/scope3/15.11-electricity';
import { calculateScope3SolidWasteEmissions } from '@/modules/scope3/15.12-waste';
import { calculatePurchasedFeed } from '@/modules/scope3/15.2-purchased-feed';
import { calculateOtherPurchasedGoodsAndServicesEmissions } from '@/modules/scope3/15.9-other-purchases';
import {
  IntermediateScope1,
  IntermediateScope23,
  mergeScopeOutputs,
} from '@/tools/calculators';
import { Container } from '@/tools/containers';
import { exposeMassValue } from '@/tools/extract';
import { generateIntensity } from '@/tools/intensity';
import {
  buildCalculatorLedger,
  serialiseCalculatorLedger,
} from '@/tools/ledger';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { calculateScope2 } from '../common/calculator';
import { ExecutionContext } from '../executionContext';
import { ConstantsForWildCatchFisheriesCalculator } from './constants';
import {
  WildCatchFisheriesInputTransformed,
  WildCatchFisheriesIntensitiesOutput,
  WildCatchFisheriesOutput,
  WildCatchFisheriesOutputSchema,
  WildCatchFisheriesScope1Output,
  WildCatchFisheriesScope3Output,
  WildCatchFisheryInputTransformed,
} from './types';

function getIntensities(
  netEmissions: Container<Mass<'CO2e'>>,
  fisheries: WildCatchFisheryInputTransformed[],
): WildCatchFisheriesIntensitiesOutput {
  const fishHarvested = sum(
    fisheries.map((fishery) => fishery.amountHarvested),
  );
  return {
    fishHarvestedKg: exposeMassValue(fishHarvested),
    emissionsIntensity: generateIntensity(netEmissions, fishHarvested),
  };
}

function calculateScope1WildcatchFishery(
  fishery: WildCatchFisheryInputTransformed,
  context: ExecutionContext<ConstantsForWildCatchFisheriesCalculator>,
): IntermediateScope1<WildCatchFisheriesScope1Output> {
  // Transport Fuel 8.1
  const { fuelTransportCO2, fuelTransportCH4, fuelTransportN2O } =
    calculate81TransportFuel(fishery, context);
  // Stationary Fuel 8.2
  const { fuelStationaryCO2, fuelStationaryCH4, fuelStationaryN2O } =
    calculate82StationaryFuel(fishery, context);
  // Refrigerant Use 9.1
  const refrigerantHFCs = calculateScope1RefrigerantUse(fishery, context);
  // Solid Waste Treatment 10.1
  const { solidWasteCO2, solidWasteCH4, solidWasteN2O } =
    calculate10SolidWasteEmissions(fishery, context);

  // Wastewater Treatment 11.1
  const { wastewaterCH4, wastewaterN2O } = calculate11Scope1WastewaterTreatment(
    fishery,
    context,
  );

  return {
    fuelTransportCO2,
    fuelTransportCH4,
    fuelTransportN2O,
    fuelStationaryCO2,
    fuelStationaryCH4,
    fuelStationaryN2O,
    wastewaterCH4,
    wastewaterN2O,
    refrigerantHFCs,
    solidWasteCO2,
    solidWasteCH4,
    solidWasteN2O,
  };
}

function calculateScope3WildcatchFishery(
  fishery: WildCatchFisheryInputTransformed,
  enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForWildCatchFisheriesCalculator>,
): IntermediateScope23<WildCatchFisheriesScope3Output> {
  // 15.2
  const purchasedFeed = calculatePurchasedFeed(fishery, context);

  // Other Purchased Goods and Services 15.9
  const otherPurchasedGoodsAndServices =
    calculateOtherPurchasedGoodsAndServicesEmissions(fishery);

  // Upstream Emissions from Fuel 15.10
  const fuel = calculateScope3EmissionsFromFuel(fishery, context);

  // Upstream emissions of Purchased Electricity 15.11
  const electricity = enterpriseScope3Electricity.multiply(
    fishery.electricityAllocation,
  );

  // Management of Waste 15.12
  const solidWaste = calculateScope3SolidWasteEmissions(fishery, context);

  return {
    purchasedFeed,
    electricity,
    fuel,
    solidWaste,
    otherPurchasedGoodsAndServices,
  };
}

export function calculateWildCatchFisheries(
  input: WildCatchFisheriesInputTransformed,
  context: ExecutionContext<ConstantsForWildCatchFisheriesCalculator>,
): WildCatchFisheriesOutput {
  const enterpriseScope2Electricity = calculateElectricityScope2(
    input.electricity,
    context,
  );
  const enterpriseScope3Electricity = calculateElectricityScope3(
    input.electricity,
    context,
  );

  const resultsPerFishery = input.fisheries.map((fishery, idx) => {
    return {
      scope1: calculateScope1WildcatchFishery(fishery, context),
      scope2: calculateScope2(fishery, enterpriseScope2Electricity),
      scope3: calculateScope3WildcatchFishery(
        fishery,
        enterpriseScope3Electricity,
        context,
      ),
      meta: {
        id: fishery.id || 'wildcatch' + idx.toString(),
        originalActivity: fishery,
      },
    };
  });

  const merged = mergeScopeOutputs(
    resultsPerFishery,
    WildCatchFisheriesOutputSchema.shape,
  );
  const enterprise = buildCalculatorLedger(merged);

  return {
    ...serialiseCalculatorLedger(enterprise),
    intermediate: resultsPerFishery.map((fishery) => {
      const ledger = buildCalculatorLedger(fishery);
      return {
        id: fishery.meta.id,
        ...serialiseCalculatorLedger(ledger),
        intensities: getIntensities(ledger.net, [
          fishery.meta.originalActivity,
        ]),
      };
    }),
    intensities: getIntensities(
      enterprise.net,
      resultsPerFishery.map((activity) => activity.meta.originalActivity),
    ),
  };
}
