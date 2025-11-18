import { AllConstants } from '@/constants/types';
import { contextFor, ExecutionContext } from '../../executionContext';
import { CalculatorNames } from '../../strings';
import { CALCULATOR_VERSION } from '../constants';
import { packageVersion } from '../version';
import { CalculationEnvironment } from './environment';
import { trackCalculatorExecution } from './metrics';

export function executeCalculator<Input extends object, Output extends object>(
  calculator: (input: Input, context: ExecutionContext<AllConstants>) => Output,
  input: Input,
  calculatorName: CalculatorNames,
): Output {
  const context = contextFor(
    calculatorName,
    CalculationEnvironment.loadConstants(),
  );
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
