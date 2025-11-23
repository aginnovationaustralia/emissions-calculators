import { CalculatorNames } from '../../strings';
import { Calculator, executeCalculator } from '../execute';
import { CalculatorOptions } from '../types';
import { BrowserEnvironment } from './environment';

type BrowserCalculator<Input extends object, Output extends object> = (
  input: Input,
  calculatorOptions?: CalculatorOptions,
) => Output;

export function createBrowserCalculator<
  Input extends object,
  Output extends object,
>(
  calculator: Calculator<Input, Output>,
  calculatorName: CalculatorNames,
): BrowserCalculator<Input, Output> {
  return (input: Input, calculatorOptions?: CalculatorOptions): Output =>
    executeCalculator(
      calculator,
      input,
      calculatorName,
      new BrowserEnvironment(calculatorOptions),
    );
}
