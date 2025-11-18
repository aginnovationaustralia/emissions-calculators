import { AllConstants } from '@/constants/types';
import { ExecutionContext } from '../../executionContext';
import { CalculatorNames } from '../../strings';
import { packageVersion } from '../version';
import { CalculationEnvironment } from './environment';
import { trackCalculatorExecution } from './metrics';

function contextFor(calculator: string, version: string) {
  return {
    calculator,
    version,
    constants: CalculationEnvironment.loadConstants(),
    timestamp: new Date().toISOString(),
  };
}

export function executeCalculator<Input extends object, Output extends object>(
  calculator: (input: Input, context: ExecutionContext<AllConstants>) => Output,
  input: Input,
  calculatorName: CalculatorNames,
): Output {
  const calculatorVersion = '3.0.0';
  const context = contextFor(calculatorName, calculatorVersion);
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
        calculatorVersion,
        failed,
        packageVersion: packageVersion(),
        organisation: CalculationEnvironment.getOrganisation(),
      });
    }
  }

  return result;
}
