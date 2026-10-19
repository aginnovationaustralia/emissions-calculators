import { tryCalculate } from '@/calculate';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculateHorticulture as calculateHorticultureInternal } from './calculator';
import {
  HorticultureOutput,
  HorticultureInput,
  HorticultureInputSchema,
  HorticultureInputTransformed,
} from './types';

function calculateHorticultureParsed(
  input: HorticultureInputTransformed,
  options?: CalculatorOptions,
): HorticultureOutput {
  return executeCalculator(
    calculateHorticultureInternal,
    input,
    'horticulture',
    new NodeEnvironment(options),
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
  HorticultureInput,
  HorticultureInputTransformed,
  HorticultureOutput,
};
