import { loadConstants } from '@/constants/loader';
import { AllConstants } from '@/constants/types';
import { contextFor, ExecutionContext } from '../../executionContext';
import { CalculatorNames } from '../../strings';
import { CALCULATOR_VERSION } from '../constants';
import { packageVersion } from '../version';
import { trackCalculatorExecution } from './metrics';

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
  const context = contextFor(calculatorName, loadConstants());
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
