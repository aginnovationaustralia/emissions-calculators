import { tryCalculate } from '@/calculate';
import { AllConstants } from '@/constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculateCropping as calculateCroppingInternal } from './calculator';
import { CroppingOutput } from './types';
import {
  CroppingInput,
  CroppingInputSchema,
  CroppingInputTransformed,
} from './types/input';

function calculateCroppingParsed(
  input: CroppingInputTransformed,
  options?: CalculatorOptions,
): CroppingOutput {
  return executeCalculator(
    calculateCroppingInternal,
    input,
    'cropping',
    new BrowserEnvironment(options),
  );
}

function calculateCropping(input: CroppingInput, options?: CalculatorOptions) {
  return tryCalculate(
    CroppingInputSchema,
    input,
    calculateCroppingParsed,
    options,
  );
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
  CroppingCropInput,
  CropWithCropResidueInput as CroppingCropWithCropResidueInput,
  CropWithPastureResidueInput as CroppingCropWithPastureResidueInput,
} from './types/crop.input';
export { calculateCropping, calculateCroppingParsed, CroppingInputSchema };
export type {
  AllConstants,
  CroppingInput,
  CroppingInputTransformed,
  CroppingOutput,
};
