import { BrocessingInput } from '@/types/Brocessing';
import { BrocessingOutput } from '@/types/Brocessing/output';
import { State } from '@/types/enums';
import { ProductProcessingInputTransformed } from '@/types/Processing/processing.input';
import { ProductUnit } from '@/types/Processing/product.input';
import { ProcessingScope1Output } from '@/types/Processing/scope1.output';
import { ProcessingScope3Output } from '@/types/Processing/scope3.output';
import { Scope2Output } from '@/types/scope2.output';
import Decimal from 'decimal.js-light';
import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import { divideBySafeFromZero } from '../common/tools/calculate';
import { calculateSolidWaste } from '../common/waste/SolidWaste';
import { ExecutionContext } from '../executionContext';
import { calculateScope1And3Fuel } from './common/Scope1Fuel';
import { calculateScope1Refrigerant } from './common/Scope1Refrigerant';
import { calculateScope1WasteWater } from './common/Scope1WasteWater';
import { ConstantsForBrocessingCalculator } from './constants';
import { Output, outputsToNumbers, scope1Output } from './types/output';
import {
  addScope1Totals,
  addScope23Totals,
  calculateNet,
  sumIntermediateResults,
} from './types/totals';

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

// Define a generic type that maps over the values of an object that is purely string based keys, with number values
// Each number value is wrapped by a Scope1Output.
type Scope1Outputs<T extends Record<string, number>> = {
  [K in keyof T]: Output<1>;
};

type Scope2Outputs<T extends Record<string, number>> = {
  [K in keyof T]: Output<2>;
};

type Scope3Outputs<T extends Record<string, number>> = {
  [K in keyof T]: Output<3>;
};

type ProcessingScopesOutput = {
  scope1: Scope1Outputs<ProcessingScope1Output>;
  scope2: Scope2Outputs<Scope2Output>;
  scope3: Scope3Outputs<ProcessingScope3Output>;
};

type IntermediateOutputs = {
  scope1: Scope1Outputs<ProcessingScope1Output>;
  scope2: Scope2Outputs<Scope2Output>;
  scope3: Scope3Outputs<ProcessingScope3Output>;
  net: {
    total: Decimal;
  };
  extensions: {
    carbonOffsets: number;
    unitsProduced: number;
  };
  meta: {
    id: string;
    unitOfProduct: ProductUnit;
  };
};

export function calculateSingleProcessingEnterprise(
  state: State,
  product: ProductProcessingInputTransformed,
  context: ExecutionContext<ConstantsForBrocessingCalculator>,
  id: string,
): IntermediateOutputs {
  const { fuelCO2, fuelCH4, fuelN2O, fuel } = calculateScope1And3Fuel(
    product.fuel,
    state,
    context,
  );

  const electricity = calculateElectricityScope2And3(
    state,
    product.electricitySource,
    product.electricityRenewable,
    product.electricityUse,
    context,
  );

  const hfcsRefrigerantLeakage = calculateScope1Refrigerant(
    product.refrigerants,
    context,
  );

  const wastewaterCO2 = calculateScope1WasteWater(product.fluidWaste, context);

  const { compostedSolidWasteCO2, solidWasteSentOffsite } = calculateSolidWaste(
    product.solidWaste,
    context,
  );

  const purchasedCO2 = scope1Output('purchasedCO2', product.purchasedCO2);

  const res: ProcessingScopesOutput = {
    scope1: addScope1Totals({
      hfcsRefrigerantLeakage,
      fuelN2O,
      fuelCH4,
      fuelCO2,
      totalCH4: fuelCH4,
      totalCO2:
        fuelCO2 + wastewaterCO2 + compostedSolidWasteCO2 + purchasedCO2Tonnes,
      totalN2O: fuelN2O,
      purchasedCO2,
      wastewaterCO2,
      compostedSolidWasteCO2,
      totalHFCs: refrigerant,
    }),
    scope2: addScope23Totals({
      electricity: electricity.scope2,
    }),
    scope3: addScope23Totals({
      electricity: electricity.scope3,
      fuel,
      solidWasteSentOffsite,
    }),
  };

  const carbonOffsets = product.carbonOffsets ?? 0;

  return {
    ...res,
    net: calculateNet(res, [carbonOffsets]),
    extensions: {
      carbonOffsets: product.carbonOffsets ?? 0,
      unitsProduced: product.product.amountMadePerYear,
    },
    meta: {
      unitOfProduct: product.product.unit,
      id,
    },
  };
}

export function calculateBrocessing(
  input: BrocessingInput,
  context: ExecutionContext<ConstantsForBrocessingCalculator>,
): BrocessingOutput {
  const processingResults = input.products.map((product, i) =>
    calculateSingleProcessingEnterprise(
      input.state,
      product,
      context,
      product.id ?? i.toString(),
    ),
  );

  const processingResult = sumIntermediateResults(processingResults);

  // const netTotal =
  //   processingResult.net

  const intensities = processingResults.map((result) =>
    getIntensities(
      result.net.total.toNumber(),
      result.extensions.carbonOffsets ?? 0,
      result.extensions.unitsProduced,
      result.meta.unitOfProduct,
    ),
  );

  const intermediate = processingResults.map((result) => ({
    scope1: result.scope1,
    scope2: result.scope2,
    scope3: result.scope3,
    id: result.meta.id,
    intensities: getIntensities(
      result.net.total.toNumber(),
      result.extensions.carbonOffsets ?? 0,
      result.extensions.unitsProduced,
      result.meta.unitOfProduct,
    ),
    net: result.net,
    carbonSequestration: {
      total: 0,
    },
  }));

  const fullOutputs = {
    ...processingResult,
    intensities,
    intermediate,
    purchasedOffsets: {
      total: processingResult.extensions.carbonOffsets ?? 0,
    },
    carbonSequestration: {
      total: 0,
    },
  };

  const result = {
    scope1: outputsToNumbers(fullOutputs.scope1),
    scope2: outputsToNumbers(fullOutputs.scope2),
    scope3: outputsToNumbers(fullOutputs.scope3),
    net: {
      total: fullOutputs.net.total.toNumber(),
    },
    intensities,
    intermediate: intermediate.map((i) => ({
      ...i,
      scope1: outputsToNumbers(i.scope1),
      scope2: outputsToNumbers(i.scope2),
      scope3: outputsToNumbers(i.scope3),
      net: {
        total: i.net.total.toNumber(),
      },
    })),
    purchasedOffsets: {
      total: fullOutputs.extensions.carbonOffsets ?? 0,
    },
    carbonSequestration: {
      total: 0,
    },
  };

  return result;
}
