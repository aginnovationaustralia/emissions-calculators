import { CalculatorNames } from '../../strings';
import { Calculator, executeCalculator } from '../execute';
import { NodeEnvironment } from './environment';

type NodeCalculator<Input extends object, Output extends object> = (
  input: Input,
) => Output;

export function createNodeCalculator<
  Input extends object,
  Output extends object,
>(
  calculator: Calculator<Input, Output>,
  calculatorName: CalculatorNames,
): NodeCalculator<Input, Output> {
  return (input: Input): Output =>
    executeCalculator(calculator, input, calculatorName, new NodeEnvironment());
}
