import { AllConstants } from '../../constants/types';
import {
  WildSeaFisheriesInput,
  WildSeaFisheriesInputSchema,
  WildSeaFisheriesOutput,
} from '../../types/WildSeaFisheries';
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
    'wildseafisheries',
    new NodeEnvironment(options),
  );
}

export { calculateWildSeaFisheries, WildSeaFisheriesInputSchema };
export type { AllConstants, WildSeaFisheriesInput, WildSeaFisheriesOutput };
