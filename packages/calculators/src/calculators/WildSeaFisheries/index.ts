import { AllConstants } from '../../constants/types';
import { WildSeaFisheriesInput, WildSeaFisheriesInputSchema, WildSeaFisheriesOutput } from '../../types/WildSeaFisheries';
import { CalculatorNames } from '../browser';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
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
    new NodeEnvironment(options),
  );
}

export { WildSeaFisheriesInputSchema, calculateWildSeaFisheries };
export type { AllConstants, WildSeaFisheriesInput, WildSeaFisheriesOutput };

