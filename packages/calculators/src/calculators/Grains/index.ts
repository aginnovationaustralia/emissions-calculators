import { tryCalculate } from '@/calculate';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculateGrains as calculateGrainsInternal } from './calculator';
import {
  GrainsOutput,
  GrainsInput,
  GrainsInputSchema,
  GrainsInputTransformed,
} from './types';

function calculateGrainsParsed(
  input: GrainsInputTransformed,
  options?: CalculatorOptions,
): GrainsOutput {
  return executeCalculator(
    calculateGrainsInternal,
    input,
    'grains',
    new NodeEnvironment(options),
  );
}

function calculateGrains(input: GrainsInput, options?: CalculatorOptions) {
  return tryCalculate(GrainsInputSchema, input, calculateGrainsParsed, options);
}

export type * from '../types/input-creation/agrichemicals';
export type * from '../types/input-creation/common';
export type * from '../types/input-creation/electricity';
export type * from '../types/input-creation/fertiliser';
export type * from '../types/input-creation/fuel';
export type * from '../types/input-creation/land-use';
export type * from '../types/input-creation/lime';
export type * from '../types/input-creation/other-purchases';
export type * from '../types/input-creation/refrigerants';
export type * from '../types/input-creation/residues';
export type * from '../types/input-creation/services';
export type * from '../types/input-creation/solid-waste';
export type {
  GrainsCropInput,
  GrainsCropResidueInput,
} from './types/crop.input';
export { calculateGrains, calculateGrainsParsed, GrainsInputSchema };
export type { GrainsInput, GrainsInputTransformed, GrainsOutput };
