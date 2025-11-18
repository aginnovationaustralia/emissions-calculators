import { loadConstants } from '@/constants/loader';
import { AllConstants } from '@/constants/types';
import { ExecutionContext } from '../../executionContext';
import { CalculatorNames } from '../../strings';
import { CALCULATOR_VERSION } from '../constants';
import { packageVersion } from '../version';
import { trackCalculatorExecution } from './metrics';

function contextFor(calculator: string) {
  return {
    calculator,
    version: CALCULATOR_VERSION,
    constants: loadConstants(),
    timestamp: new Date().toISOString(),
  };
}

export type CalculatorOptions = {
  disableMetrics?: boolean;
  organisation?: string;
};

export function executeCalculator<Input extends object, Output extends object>(
  calculator: (input: Input, context: ExecutionContext<AllConstants>) => Output,
  input: Input,
  calculatorName: CalculatorNames,
  options?: CalculatorOptions,
): Output {
  const context = contextFor(calculatorName);
  let result: Output;
  let failed = false;

  const trackingDisabled = Boolean(options && options.disableMetrics === false);

  try {
    result = calculator(input, context);
  } catch (error) {
    failed = true;
    throw error;
  } finally {
    if (!trackingDisabled) {
      trackCalculatorExecution({
        calculator: calculatorName,
        calculatorVersion: CALCULATOR_VERSION,
        failed,
        packageVersion: packageVersion(),
        organisation: options?.organisation,
      });
    }
  }

  return result;
}
