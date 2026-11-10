import { tryCalculate } from '@/calculate';
import { AllConstants } from '@/constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculateAllModules as calculateAllModulesInternal } from './calculator';
import {
  AllModulesInput,
  AllModulesInputSchema,
  AllModulesInputTransformed,
} from './types/input';
import { AllModulesOutput } from './types/output';

function calculateAllModulesParsed(
  input: AllModulesInputTransformed,
  options?: CalculatorOptions,
): AllModulesOutput {
  return executeCalculator(
    calculateAllModulesInternal,
    input,
    'all-modules',
    new BrowserEnvironment(options),
  );
}

function calculateAllModules(
  input: AllModulesInput,
  options?: CalculatorOptions,
) {
  return tryCalculate(
    AllModulesInputSchema,
    input,
    calculateAllModulesParsed,
    options,
  );
}

export type * from '../Beef/types/input-creation';
export type * from '../Dairy/types/input-creation';
export type * from '../Feedlot/types/input-creation';
export type * from '../OtherLivestock/types/input-creation';
export type * from '../Pigs/types/input-creation';
export type * from '../Poultry/types/input-creation';
export type * from '../Rice/types/input-creation';
export type * from '../Sheep/types/input-creation';
export type * from '../types/input-creation/index';

export type {
  AllModulesBeefInput,
  AllModulesCropInput,
  AllModulesFertiliserInput,
  AllModulesFuelInput,
  AllModulesPastureInput,
  AllModulesRiceInput,
  AllModulesServicesInput,
  AllModulesSheepInput,
} from './types/input';
export {
  AllModulesInputSchema,
  calculateAllModules,
  calculateAllModulesParsed,
};
export type {
  AllConstants,
  AllModulesInput,
  AllModulesInputTransformed,
  AllModulesOutput,
};
