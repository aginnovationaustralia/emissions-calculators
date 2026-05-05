import { ExecutionContext } from '@/calculators/executionContext';
import { AllConstants } from '@/constants/types';
import { FreightsInputTransformed } from './freights.input';
import { sum } from '@/tools/sum';
import { selectConstant } from '@/tools/constants';

export const calculateFreightEmissions = (
  input: FreightsInputTransformed,
  context: ExecutionContext<AllConstants>,
) => {
  const { constants } = context;
  /**
   * E = SUMf ((Wf * Df) * EFf)
   */
  const freightEmissions = input.freight.map((freight) => {
    const emissionsFactor = selectConstant(
      constants.COMMON,
      'FREIGHT_EMISSIONS',
      freight.freightType,
    );
    return emissionsFactor.multiply(freight.distance).multiply(freight.weight);
  });
  return sum(freightEmissions);
};
