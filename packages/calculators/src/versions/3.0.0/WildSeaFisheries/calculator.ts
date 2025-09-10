import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import {
  calculateFuelScope1BaseLPGStationary,
  calculateScope3FuelWithLPGStationary,
} from '../common-legacy/fuel';
import { addTotalValue, divideBySafeFromZero } from '../common/tools/calculate';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { ExecutionContext } from '../executionContext';
import { WildSeaFisheriesEnterprise } from '../types/WildSeaFisheries/enterprise.input';
import { WildSeaFisheriesInput } from '../types/WildSeaFisheries/input';
import { WildSeaFisheriesOutput } from '../types/WildSeaFisheries/output';
import { calculateScope1And3Transport } from './Scope1And3Transport';
import { calculateScope1Refrigerant } from './Scope1Refrigerant';
import { calculateScope3Bait } from './Scope3Bait';

function getIntensities(
  netTotal: number,
  carbonOffsets: number,
  totalHarvestWeightKg: number,
) {
  const totalHarvestWeightTonnes = totalHarvestWeightKg / 1000;
  return {
    intensityExcludingCarbonOffset: divideBySafeFromZero(
      netTotal + carbonOffsets,
      totalHarvestWeightTonnes,
    ),
    intensityIncludingCarbonOffset: divideBySafeFromZero(
      netTotal,
      totalHarvestWeightTonnes,
    ),
    totalHarvestWeightTonnes,
  };
}

export function calculateSingleWildSeaFisheriesEnterprise(
  enterprise: WildSeaFisheriesEnterprise,
  context: ExecutionContext,
  id: string,
) {
  const scope1FuelN2O = calculateFuelScope1BaseLPGStationary(
    enterprise.diesel,
    enterprise.petrol,
    enterprise.lpg,
    'N2O',
    context,
  );
  const scope1FuelCH4 = calculateFuelScope1BaseLPGStationary(
    enterprise.diesel,
    enterprise.petrol,
    enterprise.lpg,
    'CH4',
    context,
  );
  const scope1FuelCO2 = calculateFuelScope1BaseLPGStationary(
    enterprise.diesel,
    enterprise.petrol,
    enterprise.lpg,
    'CO2',
    context,
  );

  const electricity = calculateElectricityScope2And3(
    enterprise.state,
    'State Grid',
    enterprise.electricityRenewable,
    enterprise.electricityUse,
    context,
  );

  const scope3Fuel = calculateScope3FuelWithLPGStationary(
    enterprise.diesel,
    enterprise.petrol,
    enterprise.lpg,
    context,
  );

  const refrigerant = calculateScope1Refrigerant(
    enterprise.refrigerants,
    context,
  );

  const transport = calculateScope1And3Transport(
    enterprise.transports,
    enterprise.flights,
    context,
  );

  const fuelCO2 = scope1FuelCO2 + transport.CO2;
  const fuelCH4 = scope1FuelCH4 + transport.CH4;
  const fuelN2O = scope1FuelN2O + transport.N2O;

  const bait = calculateScope3Bait(
    enterprise.bait,
    enterprise.custombait,
    context,
  );

  const res = {
    scope1: addTotalValue({
      hfcsRefrigerantLeakage: refrigerant,
      fuelN2O,
      fuelCH4,
      fuelCO2,
      totalCH4: fuelCH4,
      totalCO2: fuelCO2,
      totalN2O: fuelN2O,
      totalHFCs: refrigerant,
    }),
    scope2: addTotalValue({
      electricity: electricity.scope2,
    }),
    scope3: addTotalValue({
      electricity: electricity.scope3,
      bait,
      fuel: scope3Fuel + transport.scope3,
    }),
  };

  return {
    output: res,
    extensions: {
      carbonOffset: enterprise.carbonOffset,
      totalWholeWeightCaught: enterprise.totalWholeWeightCaught,
    },
    meta: { id },
    net: {
      total:
        res.scope1.total +
        res.scope2.total +
        res.scope3.total -
        enterprise.carbonOffset,
    },
  };
}

export function calculateWildSeaFisheries(
  input: WildSeaFisheriesInput,
  context: ExecutionContext,
): WildSeaFisheriesOutput {
  const fisheriesResults = input.enterprises.map((enterprise, i) =>
    calculateSingleWildSeaFisheriesEnterprise(
      enterprise,
      context,
      enterprise.id ?? i.toString(),
    ),
  );

  const fisheriesResult = sumIntermediateResults(
    {
      output: {
        scope1: {
          hfcsRefrigerantLeakage: 0,
          fuelCO2: 0,
          fuelCH4: 0,
          fuelN2O: 0,
          totalCO2: 0,
          totalCH4: 0,
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
          bait: 0,
          fuel: 0,
          total: 0,
        },
      },
      extensions: {
        carbonOffset: 0,
        totalWholeWeightCaught: 0,
      },
      net: {
        total: 0,
      },
      meta: {
        id: '',
      },
    },
    fisheriesResults,
  );

  const baseEmissions = {
    ...fisheriesResult.output,
    net: {
      total:
        fisheriesResult.output.scope1.total +
        fisheriesResult.output.scope2.total +
        fisheriesResult.output.scope3.total -
        fisheriesResult.extensions.carbonOffset,
      enterprises: [],
    },
  };

  const intensities = fisheriesResults.map((result) =>
    getIntensities(
      result.net.total,
      result.extensions.carbonOffset,
      result.extensions.totalWholeWeightCaught,
    ),
  );

  return {
    ...baseEmissions,
    intensities,
    purchasedOffsets: {
      total: fisheriesResult.extensions.carbonOffset,
    },
    intermediate: fisheriesResults.map((result) => ({
      carbonSequestration: 0,
      id: result.meta.id,
      net: result.net,
      scope1: result.output.scope1,
      scope2: result.output.scope2,
      scope3: result.output.scope3,
      purchasedOffsets: {
        total: result.extensions.carbonOffset,
      },
      intensities: getIntensities(
        result.net.total,
        result.extensions.carbonOffset,
        result.extensions.totalWholeWeightCaught,
      ),
    })),
  };
}
