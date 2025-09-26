import { loadOverrideConstants } from './constants/constantsLoader';
import { AllConstants } from './constants/versionedConstants';
import { trackCalculatorExecution } from './execution/metrics';
import { ExecutionContext } from './executionContext';
import { CalculatorNames } from './strings';

function contextFor(calculator: string, version: string) {
  return {
    calculator,
    version,
    constants: loadOverrideConstants(),
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
    trackCalculatorExecution(calculatorName, calculatorVersion, failed);
  }

  return result;
}
