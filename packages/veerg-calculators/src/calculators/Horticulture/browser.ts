import { tryCalculate } from '@/calculate';
import { AllConstants } from '@/constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateHorticulture as calculateHorticultureInternal } from './calculator';
import { HorticultureOutput } from './types';
import {
  HorticultureInput,
  HorticultureInputSchema,
  HorticultureInputTransformed,
} from './types/input';

function calculateHorticultureParsed(
  input: HorticultureInputTransformed,
  options?: CalculatorOptions,
): HorticultureOutput {
  return executeCalculator(
    calculateHorticultureInternal,
    input,
    'horticulture',
    new BrowserEnvironment(options),
  );
}

function calculateHorticulture(
  input: HorticultureInput,
  options?: CalculatorOptions,
) {
  return tryCalculate(
    HorticultureInputSchema,
    input,
    calculateHorticultureParsed,
    options,
  );
}

export {
  calculateHorticulture,
  calculateHorticultureParsed,
  HorticultureInputSchema,
};
export type {
  AllConstants,
  HorticultureInput,
  HorticultureInputTransformed,
  HorticultureOutput,
};
