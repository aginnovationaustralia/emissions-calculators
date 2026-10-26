import { calculateLULUCF } from '@/modules/lulucf/calculate';
import { LULUCFOutput } from '@/modules/lulucf/output';
import { calculate10SolidWasteEmissions } from '@/modules/scope1/10-solid-waste';
import {
  calculate51InorganicFertiliser,
  calculate52OrganicFertiliser,
} from '@/modules/scope1/5-fertiliser';
import {
  calculate81TransportFuel,
  calculate82StationaryFuel,
} from '@/modules/scope1/8-fuel-use';
import { calculateElectricityScope2 } from '@/modules/scope2/14-electricity';
import { calculateScope3EmissionsFromFuel } from '@/modules/scope3/15.10-fuel';
import { calculateElectricityScope3 } from '@/modules/scope3/15.11-electricity';
import { calculateScope3SolidWasteEmissions } from '@/modules/scope3/15.12-waste';
import { calculateScope3Fertiliser } from '@/modules/scope3/15.4-fertiliser';
import { calculateScope3Agrichemicals } from '@/modules/scope3/15.5-agrichemicals';
import { calculateScope3Services } from '@/modules/scope3/15.7-services';
import { calculateOtherPurchasedGoodsAndServicesEmissions } from '@/modules/scope3/15.9-other-purchases';
import {
  IntermediateScope1,
  mergeScopeOutputs,
  wrapScopesAsOutputs,
} from '@/tools/calculators';
import { Container } from '@/tools/containers';
import {
  addScope1Totals,
  addScope23Totals,
  sumTonnesCO2e,
} from '@/tools/totals';
import { Mass } from '@/tools/units';
import { calculateScope2 } from '../common/calculator';
import { ExecutionContext } from '../executionContext';
import { Scope2Output } from '../types/scope2.output';
import { ConstantsForForestryCalculator } from './constants';
import {
  ForestryInputTransformed,
  ForestryOutputSchema,
  ForestryScope1Output,
  ForestryScope3Output,
} from './types';
import { ForestryPlantationInputTransformed } from './types/plantation.input';

type ForestryCalculatorScopes = {
  scope1: ForestryScope1Output;
  scope2: Scope2Output;
  scope3: ForestryScope3Output;
};

/*
  Module mapping
  Direct GHG emissions (Scope 1)

  Fertiliser Use 5.1 - 5.2
  Transport Fuel 8.1
  Stationary Fuel 8.2
  Solid Waste Treatment 10.1
*/
const calculateScope1Forestry = (
  plantation: ForestryPlantationInputTransformed,
  context: ExecutionContext<ConstantsForForestryCalculator>,
  lulucf: IntermediateScope1<LULUCFOutput>,
): IntermediateScope1<ForestryScope1Output> => {
  // 5.1 Inorganic and urea fertiliser application
  const { inorganicFertiliserN2O, inorganicFertiliserCO2 } =
    calculate51InorganicFertiliser(plantation, context);
  // 5.2 Organic fertiliser application
  const organicFertiliserN2O = calculate52OrganicFertiliser(
    plantation,
    context,
  );

  // Transport Fuel 8.1
  const { fuelTransportCO2, fuelTransportCH4, fuelTransportN2O } =
    calculate81TransportFuel(plantation, context);
  // Stationary Fuel 8.2
  const { fuelStationaryCO2, fuelStationaryCH4, fuelStationaryN2O } =
    calculate82StationaryFuel(plantation, context);
  // Solid Waste Treatment 10.1
  const { solidWasteCO2, solidWasteCH4, solidWasteN2O } =
    calculate10SolidWasteEmissions(plantation, context);

  /*
   * Specific LULUCF chapters: 16.2.1.2, 16.2.1.7, 16.2.1.8
   * Additional lulucf chapters can also be triggered if the right activity types are supplied on the plantation
   */

  return {
    fuelTransportCO2,
    fuelTransportCH4,
    fuelTransportN2O,
    fuelStationaryCO2,
    fuelStationaryCH4,
    fuelStationaryN2O,
    inorganicFertiliserN2O,
    inorganicFertiliserCO2,
    organicFertiliserN2O,
    solidWasteCO2,
    solidWasteCH4,
    solidWasteN2O,
    ...lulucf,
  };
};

/*
  Module Map
  Indirect GHG emissions (Scope 3)

  Purchased Fertiliser 15.4
  Purchased Agrichemicals 15.5
  Purchased Services/Contractors 15.7
  Other Purchased Goods and Services 15.9
  Upstream Emissions from Fuel 15.10
  Upstream Emissions of Purchased Electricity 15.11
  Management of Waste 15.12
*/
const calculateScope3Forestry = (
  plantation: ForestryPlantationInputTransformed,
  enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
  context: ExecutionContext<ConstantsForForestryCalculator>,
) => {
  // Purchased Fertiliser 15.4
  const fertiliser = calculateScope3Fertiliser(plantation, context);

  // Purchased Agrichemicals 15.5
  const agrichemicals = calculateScope3Agrichemicals(plantation, context);

  // Purchased Services/Contractors 15.7
  const services = calculateScope3Services(plantation, context);

  // Other Purchased Goods and Services 15.9
  const otherPurchasedGoodsAndServices =
    calculateOtherPurchasedGoodsAndServicesEmissions(plantation);

  // Upstream Emissions from Fuel 15.10
  const fuel = calculateScope3EmissionsFromFuel(plantation, context);

  // Upstream emissions of Purchased Electricity 15.11
  const electricity = enterpriseScope3Electricity.multiply(
    plantation.electricityAllocation,
  );

  // Management of Waste 15.12
  const solidWaste = calculateScope3SolidWasteEmissions(plantation, context);

  return {
    fertiliser,
    agrichemicals,
    electricity,
    fuel,
    services,
    solidWaste,
    otherPurchasedGoodsAndServices,
  };
};

const calculatorName = 'forestry';

export const calculateForestry = (
  input: ForestryInputTransformed,
  context: ExecutionContext<ConstantsForForestryCalculator>,
) => {
  const enterpriseScope2Electricity = calculateElectricityScope2(
    input.electricity,
    context,
  );
  const enterpriseScope3Electricity = calculateElectricityScope3(
    input.electricity,
    context,
  );
  const activities = input.plantations;
  const activityResults = activities.map((activity, ix) => {
    const lulucfForActivity = calculateLULUCF(activity, context);
    return {
      scope1: calculateScope1Forestry(activity, context, lulucfForActivity),
      scope2: calculateScope2(activity, enterpriseScope2Electricity),
      scope3: calculateScope3Forestry(
        activity,
        enterpriseScope3Electricity,
        context,
      ),
      meta: {
        id: activity.id || calculatorName + ix.toString(),
      },
    };
  });

  const merged = mergeScopeOutputs(activityResults, ForestryOutputSchema.shape);

  const mergedScopes = wrapScopesAsOutputs(merged);

  const scope1WithTotals = addScope1Totals(mergedScopes.scope1);
  const scope2WithTotals = addScope23Totals(mergedScopes.scope2);
  const scope3WithTotals = addScope23Totals(mergedScopes.scope3);

  const net = {
    total: {
      tonnesCO2e: sumTonnesCO2e(
        scope1WithTotals.total,
        scope2WithTotals.total,
        scope3WithTotals.total,
      ),
    },
  };

  return {
    scope1: scope1WithTotals,
    scope2: scope2WithTotals,
    scope3: scope3WithTotals,
    net,
    intermediate: activityResults.map((activity) => {
      const activityOutputs =
        wrapScopesAsOutputs<ForestryCalculatorScopes>(activity);
      const scope1 = addScope1Totals(activityOutputs.scope1);
      const scope2 = addScope23Totals(activityOutputs.scope2);
      const scope3 = addScope23Totals(activityOutputs.scope3);
      const net = {
        total: {
          tonnesCO2e: sumTonnesCO2e(scope1.total, scope2.total, scope3.total),
        },
      };
      return {
        id: activity.meta.id,
        scope1,
        scope2,
        scope3,
        net,
      };
    }),
  };
};
