import { AllConstants } from '@/constants/types';
import { ExecutionContext } from '../../executionContext';
import { CalculatorNames } from '../../strings';
import { CALCULATOR_VERSION } from '../constants';
import { packageVersion } from '../version';
import { CalculationEnvironment } from './environment';
import { trackCalculatorExecution } from './metrics';

function contextFor(calculator: string) {
  return {
    calculator,
    version: CALCULATOR_VERSION,
    constants: CalculationEnvironment.loadConstants(),
    timestamp: new Date().toISOString(),
  };
}

export function executeCalculator<Input extends object, Output extends object>(
  calculator: (input: Input, context: ExecutionContext<AllConstants>) => Output,
  input: Input,
  calculatorName: CalculatorNames,
): Output {
  const context = contextFor(calculatorName);
  let result: Output;
  let failed = false;

  try {
    result = calculator(input, context);
  } catch (error) {
    failed = true;
    throw error;
  } finally {
    if (CalculationEnvironment.isMetricsEnabled()) {
      trackCalculatorExecution({
        calculator: calculatorName,
        calculatorVersion: CALCULATOR_VERSION,
        failed,
        packageVersion: packageVersion(),
        organisation: CalculationEnvironment.getOrganisation(),
      });
    }
  }

  return result;
}
