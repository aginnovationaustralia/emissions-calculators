import {
  Calculator,
  CalculatorNames,
  executeCalculator as executeCalculatorInternal,
} from '@aginnovationaustralia/emissions-calculators/internal';
import {
  ResearchCalculatorOptions,
  ResearchNodeEnvironment,
} from './environment';

/**
 * Execute a calculator, using constants with any overrides passed in via options.
 */
export function executeCalculator<Input extends object, Output extends object>(
  calculator: Calculator<Input, Output>,
  input: Input,
  calculatorName: CalculatorNames,
  options?: ResearchCalculatorOptions,
): Output {
  return executeCalculatorInternal(
    calculator,
    input,
    calculatorName,
    new ResearchNodeEnvironment(options),
  );
}
