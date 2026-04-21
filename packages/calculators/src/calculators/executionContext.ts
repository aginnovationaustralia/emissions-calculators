import { Environment } from '@/calculators/execution/types';
import { CalculatorNames } from '@/calculators/strings';
import { AllConstants, HasCommonConstants } from '@/constants/types';
import {
  beefPastureConstants,
  commonConstants,
  cropConstants,
  dairyConstants,
  feedlotConstants,
  livestockConstants,
  lulucfConstants,
  poultryConstants,
  riceConstants,
  swineConstants,
} from '@/constants/values';

type ExecutionMetadata = {
  calculator: string;
  version: string;
  timestamp: string;
  overrides?: object | undefined;
  checkpoint?: (
    sheetName: string,
    data: Record<string, { cell: string; value: number }>,
  ) => void;
};

export interface ExecutionContext<
  T extends HasCommonConstants = HasCommonConstants,
> extends ExecutionMetadata {
  constants: T;
}

export type WithExecutionMetadata<T> = T & { metaData: ExecutionMetadata };

export function contextFor(calculator: string, constants: AllConstants) {
  return {
    calculator,
    version: '4.0.0',
    constants,
    timestamp: new Date().toISOString(),
  };
}

export const loadConstants = (): AllConstants => {
  return {
    COMMON: commonConstants,
    CROP: cropConstants,
    SWINE: swineConstants,
    FEEDLOT: feedlotConstants,
    DAIRY: dairyConstants,
    POULTRY: poultryConstants,
    BEEF_PASTURE: beefPastureConstants,
    LIVESTOCK: livestockConstants,
    RICE: riceConstants,
    LULUCF: lulucfConstants,
  };
};

export type Calculator<Input extends object, Output extends object> = (
  input: Input,
  context: ExecutionContext<AllConstants>,
) => Output;

export function executeCalculator<Input extends object, Output extends object>(
  calculator: Calculator<Input, Output>,
  input: Input,
  calculatorName: CalculatorNames,
  environment: Environment,
): Output {
  const context = contextFor(calculatorName, loadConstants());
  let result: Output;
  let failed = false;

  try {
    result = calculator(input, context);
  } catch (error) {
    failed = true;
    throw error;
  } finally {
    if (environment.isMetricsEnabled()) {
      environment.trackCalculatorExecution(calculatorName, failed);
    }
  }

  return result;
}
