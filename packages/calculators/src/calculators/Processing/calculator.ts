import { State } from '@/types/enums';
import { ProcessingInput } from '@/types/Processing/input';
import { ProcessingOutput } from '@/types/Processing/output';
import { ProductProcessingInput } from '@/types/Processing/processing.input';
import { ProductUnit } from '@/types/Processing/product.input';
import { ProcessingScope1Output } from '@/types/Processing/scope1.output';
import { ProcessingScope3Output } from '@/types/Processing/scope3.output';
import { Scope2Output } from '@/types/scope2.output';
import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import { calculateScope1And3Fuel } from '../common/fuel';
import { calculateScope1Refrigerant } from '../common/refrigerant';
import { addTotalValue, divideBySafeFromZero } from '../common/tools/calculate';
import {
  sumIntermediateResults,
  SummableObject,
} from '../common/tools/intermediate-results';
import { calculateScope1WasteWater } from '../common/waste/Scope1WasteWater';
import { calculateSolidWaste } from '../common/waste/SolidWaste';
import { ExecutionContext } from '../executionContext';
import { ConstantsForProcessingCalculator } from './constants';

function getIntensities(
  netTotal: number,
  carbonOffsets: number,
  unitsProduced: number,
  unitOfProduct: ProductUnit,
) {
  return {
    processingExcludingCarbonOffsets: divideBySafeFromZero(
      netTotal + carbonOffsets,
      unitsProduced,
    ),
    processingIncludingCarbonOffsets: divideBySafeFromZero(
      netTotal,
      unitsProduced,
    ),
    unitsProduced,
    unitOfProduct,
  };
}

type ProcessingScopesOutput = {
  scope1: ProcessingScope1Output & SummableObject;
  scope2: Scope2Output & SummableObject;
  scope3: ProcessingScope3Output & SummableObject;
};

export function calculateSingleProcessingEnterprise(
  state: State,
  product: ProductProcessingInput,
  context: ExecutionContext<ConstantsForProcessingCalculator>,
  id: string,
) {
  const fuelTotals = calculateScope1And3Fuel(product.fuel, state, context);

  const electricity = calculateElectricityScope2And3(
    state,
    product.electricitySource,
    product.electricityRenewable,
    product.electricityUse,
    context,
  );

  const refrigerant = calculateScope1Refrigerant(product.refrigerants, context);

  const fuelCO2 = fuelTotals.co2;
  const fuelCH4 = fuelTotals.ch4;
  const fuelN2O = fuelTotals.n2o;

  const wastewaterCO2 = calculateScope1WasteWater(product.fluidWaste, context);

  const { compostedSolidWasteCO2, solidWasteSentOffsite } = calculateSolidWaste(
    product.solidWaste,
    context,
  );

  const purchasedCO2Tonnes = product.purchasedCO2 / 1000;

  const res: ProcessingScopesOutput = {
    scope1: addTotalValue({
      hfcsRefrigerantLeakage: refrigerant,
      fuelN2O,
      fuelCH4,
      fuelCO2,
      totalCH4: fuelCH4,
      totalCO2:
        fuelCO2 + wastewaterCO2 + compostedSolidWasteCO2 + purchasedCO2Tonnes,
      totalN2O: fuelN2O,
      purchasedCO2: purchasedCO2Tonnes,
      wastewaterCO2,
      compostedSolidWasteCO2,
      totalHFCs: refrigerant,
    }),
    scope2: addTotalValue({
      electricity: electricity.scope2,
    }),
    scope3: addTotalValue({
      electricity: electricity.scope3,
      fuel: fuelTotals.scope3Total,
      solidWasteSentOffsite,
    }),
  };

  const netTotal =
    res.scope1.total +
    res.scope2.total +
    res.scope3.total -
    (product.carbonOffsets ?? 0);

  return {
    output: res,
    net: {
      total: netTotal,
    },
    extensions: {
      carbonOffsets: product.carbonOffsets,
      unitsProduced: product.product.amountMadePerYear,
    },
    meta: {
      unitOfProduct: product.product.unit,
      id,
    },
  };
}

export function calculateProcessing(
  input: ProcessingInput,
  context: ExecutionContext<ConstantsForProcessingCalculator>,
): ProcessingOutput {
  const processingResults = input.products.map((product, i) =>
    calculateSingleProcessingEnterprise(
      input.state,
      product,
      context,
      product.id ?? i.toString(),
    ),
  );

  const processingResult = sumIntermediateResults(
    {
      output: {
        scope1: {
          hfcsRefrigerantLeakage: 0,
          fuelN2O: 0,
          fuelCH4: 0,
          fuelCO2: 0,
          totalCH4: 0,
          totalCO2: 0,
          totalN2O: 0,
          purchasedCO2: 0,
          wastewaterCO2: 0,
          compostedSolidWasteCO2: 0,
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
          solidWasteSentOffsite: 0,
          total: 0,
        },
      },
      net: {
        total: 0,
      },
      extensions: {
        carbonOffsets: 0,
        unitsProduced: 0,
      },
      meta: {
        id: '',
        unitOfProduct: ProductUnit.UNIT,
      },
    },
    processingResults,
  );

  const emissionsTotal =
    processingResult.output.scope1.total +
    processingResult.output.scope2.total +
    processingResult.output.scope3.total;

  const netTotal =
    emissionsTotal - (processingResult.extensions.carbonOffsets ?? 0);

  const baseEmissions = {
    ...processingResult.output,
    net: {
      total: netTotal,
    },
  };

  const intensities = processingResults.map((result) =>
    getIntensities(
      result.net.total,
      result.extensions.carbonOffsets ?? 0,
      result.extensions.unitsProduced,
      result.meta.unitOfProduct,
    ),
  );

  const intermediate = processingResults.map((result) => ({
    ...result.output,
    id: result.meta.id,
    intensities: getIntensities(
      result.net.total,
      result.extensions.carbonOffsets ?? 0,
      result.extensions.unitsProduced,
      result.meta.unitOfProduct,
    ),
    net: result.net,
    carbonSequestration: {
      total: 0,
    },
  }));

  return {
    ...baseEmissions,
    intensities,
    intermediate,
    purchasedOffsets: {
      total: processingResult.extensions.carbonOffsets ?? 0,
    },
    carbonSequestration: {
      total: 0,
    },
  };
}
