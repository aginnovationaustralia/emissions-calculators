import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import {
  calculateCommercialFlights,
  calculateFreight,
} from '../common/freight';
import { calculateScope1And3Fuel } from '../common/fuel';
import { calculateScope1Refrigerant } from '../common/refrigerant';
import { addTotalValue } from '../common/tools';
import {
  sumIntermediateResults,
  SummableObject,
} from '../common/tools/intermediate-results';
import { calculateScope1WasteWater } from '../common/waste/Scope1WasteWater';
import { calculateSolidWaste } from '../common/waste/SolidWaste';
import { ExecutionContext } from '../executionContext';
import { Scope2Output } from '../types/scope2.output';
import { State } from '../types/types';
import { WildCatchFisheryInput } from '../types/WildCatchFishery/input';
import { WildCatchFisheryOutput } from '../types/WildCatchFishery/output';
import { WildCatchFisheryScope1Output } from '../types/WildCatchFishery/scope1.output';
import { WildCatchFisheryScope3Output } from '../types/WildCatchFishery/scope3.output';
import { WildCatchFisheryEnterpriseInput } from '../types/WildCatchFishery/wildcatchfishery.input';
import { ConstantsForWildCatchFisheryCalculator } from './constants';
import { getIntensities } from './functions';
import { calculateCustomBait, calculatePurchasedBait } from './PurchasedBait';

type WildCatchFisheryScopesOutput = {
  scope1: WildCatchFisheryScope1Output & SummableObject;
  scope2: Scope2Output & SummableObject;
  scope3: WildCatchFisheryScope3Output & SummableObject;
};

export function calculateSingleWildCatchFisheryEnterprise(
  state: State,
  enterprise: WildCatchFisheryEnterpriseInput,
  context: ExecutionContext<ConstantsForWildCatchFisheryCalculator>,
  carbonSequestration: number,
  id: string,
) {
  const fuelTotals = calculateScope1And3Fuel(enterprise.fuel, state, context);

  const electricity = calculateElectricityScope2And3(
    state,
    enterprise.electricitySource,
    enterprise.electricityRenewable,
    enterprise.electricityUse,
    context,
  );

  const refrigerant = calculateScope1Refrigerant(
    enterprise.refrigerants,
    context,
  );

  const fuelCO2 = fuelTotals.co2;
  const fuelCH4 = fuelTotals.ch4;
  const fuelN2O = fuelTotals.n2o;

  const baitCO2 = calculatePurchasedBait(enterprise.bait, context);
  const customBaitCO2 = calculateCustomBait(enterprise.customBait);

  const wasteWaterCO2 = calculateScope1WasteWater(
    enterprise.fluidWaste,
    context,
  );

  const { compostedSolidWasteCO2, solidWasteSentOffsite } = calculateSolidWaste(
    enterprise.solidWaste,
    context,
  );

  const inboundFreightCO2 = calculateFreight(
    enterprise.inboundFreight,
    context,
  );
  const outboundFreightCO2 = calculateFreight(
    enterprise.outboundFreight,
    context,
  );
  const commercialFlightsCO2 = calculateCommercialFlights(
    enterprise.totalCommercialFlightsKm,
    context,
  );

  const res: WildCatchFisheryScopesOutput = {
    scope1: addTotalValue({
      hfcsRefrigerantLeakage: refrigerant,
      fuelN2O,
      fuelCH4,
      fuelCO2,
      wasteWaterCO2,
      compostedSolidWasteCO2,

      totalCH4: fuelCH4,
      totalCO2: fuelCO2 + wasteWaterCO2 + compostedSolidWasteCO2,
      totalN2O: fuelN2O,
      totalHFCs: refrigerant,
    }),
    scope2: addTotalValue({
      electricity: electricity.scope2,
    }),
    scope3: addTotalValue({
      electricity: electricity.scope3,
      fuel: fuelTotals.scope3Total,
      purchasedBait: baitCO2 + customBaitCO2,
      inboundFreight: inboundFreightCO2,
      outboundFreight: outboundFreightCO2,
      commercialFlights: commercialFlightsCO2,
      solidWasteSentOffsite,
    }),
  };

  return {
    output: res,
    net: {
      total:
        res.scope1.total +
        res.scope2.total +
        res.scope3.total -
        (enterprise.carbonOffsets ?? 0),
    },
    extensions: {
      carbonOffsets: enterprise.carbonOffsets,
      totalHarvestKg: enterprise.totalHarvestKg,
      carbonSequestration,
    },
    meta: {
      id,
    },
  };
}

export function calculateWildCatchFishery(
  input: WildCatchFisheryInput,
  context: ExecutionContext<ConstantsForWildCatchFisheryCalculator>,
): WildCatchFisheryOutput {
  const wildCatchFisheryResults = input.enterprises.map((enterprise, ix) =>
    calculateSingleWildCatchFisheryEnterprise(
      enterprise.state,
      enterprise,
      context,
      0,
      enterprise.id ?? ix.toString(),
    ),
  );

  const wildCatchFisheryResult = sumIntermediateResults(
    {
      output: {
        scope1: {
          hfcsRefrigerantLeakage: 0,
          fuelN2O: 0,
          fuelCH4: 0,
          fuelCO2: 0,
          wasteWaterCO2: 0,
          compostedSolidWasteCO2: 0,
          totalCH4: 0,
          totalCO2: 0,
          totalN2O: 0,
          totalHFCs: 0,
          total: 0,
        },
        scope2: {
          electricity: 0,
          total: 0,
        },
        scope3: {
          electricity: 0,
          fuel: 0,
          purchasedBait: 0,
          inboundFreight: 0,
          outboundFreight: 0,
          commercialFlights: 0,
          solidWasteSentOffsite: 0,
          total: 0,
        },
      },
      net: {
        total: 0,
      },
      extensions: {
        carbonOffsets: 0,
        totalHarvestKg: 0,
        carbonSequestration: 0,
      },
      meta: {
        id: '',
      },
    },
    wildCatchFisheryResults,
  );

  const emissionsTotal =
    wildCatchFisheryResult.output.scope1.total +
    wildCatchFisheryResult.output.scope2.total +
    wildCatchFisheryResult.output.scope3.total;

  const netTotal =
    emissionsTotal - (wildCatchFisheryResult.extensions.carbonOffsets ?? 0);

  const baseEmissions = {
    ...wildCatchFisheryResult.output,
    net: {
      total: netTotal,
    },
  };

  const intensities = getIntensities(
    netTotal,
    wildCatchFisheryResult.extensions.carbonOffsets ?? 0,
    wildCatchFisheryResult.extensions.totalHarvestKg,
  );

  const intermediate = wildCatchFisheryResults.map((result) => {
    return {
      scope1: result.output.scope1,
      scope2: result.output.scope2,
      scope3: result.output.scope3,
      carbonSequestration: {
        total: result.extensions.carbonSequestration,
      },
      intensities: getIntensities(
        result.net.total,
        result.extensions.carbonOffsets ?? 0,
        result.extensions.totalHarvestKg,
      ),
      net: {
        total: result.net.total,
      },
      id: result.meta.id,
    };
  });

  return {
    ...baseEmissions,
    intensities,
    intermediate,
    purchasedOffsets: {
      total: wildCatchFisheryResult.extensions.carbonOffsets ?? 0,
    },
    carbonSequestration: {
      total: 0,
      intermediate: wildCatchFisheryResults.map(() => 0),
    },
  };
}
