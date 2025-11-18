import { AllConstants } from '@/constants/types';
import { contextFor, ExecutionContext } from '../executionContext';
import { CalculatorNames } from '../strings';
import { Environment } from './types';

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
  const context = contextFor(calculatorName, environment.loadConstants());
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
