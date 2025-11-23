import { AllConstants } from '../../constants/types';
import { SheepBeefInput, SheepBeefInputSchema, SheepBeefOutput } from '../../types/SheepBeef';
import { CalculatorNames } from '../browser';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateSheepBeef as calculateSheepBeefInternal } from './calculator';
export * from '../../types/SheepBeef';

function calculateSheepBeef(
  input: SheepBeefInput,
  options?: CalculatorOptions,
): SheepBeefOutput {
  return executeCalculator(
    calculateSheepBeefInternal,
    input,
    CalculatorNames.SheepBeef,
    new BrowserEnvironment(options),
  );
}

export { SheepBeefInputSchema, calculateSheepBeef };
export type { AllConstants, SheepBeefInput, SheepBeefOutput };

