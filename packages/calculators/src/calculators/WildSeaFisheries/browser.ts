import { AllConstants } from '../../constants/types';
import { WildSeaFisheriesInput, WildSeaFisheriesInputSchema, WildSeaFisheriesOutput } from '../../types/WildSeaFisheries';
import { CalculatorNames } from '../browser';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateWildSeaFisheries as calculateWildSeaFisheriesInternal } from './calculator';
export * from '../../types/WildSeaFisheries';

function calculateWildSeaFisheries(
  input: WildSeaFisheriesInput,
  options?: CalculatorOptions,
): WildSeaFisheriesOutput {
  return executeCalculator(
    calculateWildSeaFisheriesInternal,
    input,
    CalculatorNames.WildSeaFisheries,
    new BrowserEnvironment(options),
  );
}

export { WildSeaFisheriesInputSchema, calculateWildSeaFisheries };
export type { AllConstants, WildSeaFisheriesInput, WildSeaFisheriesOutput };

