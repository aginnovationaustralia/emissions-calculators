import { ExecutionContext } from '@/calculators/executionContext';
import { HasCommonConstants } from '@/constants/types';
import {
  emissionsOfGasForFuel,
  TransportFuelInputTransformed,
} from '@/modules/scope1/8-fuel-use';
import { selectConstant } from '@/tools/constants';
import { captureMethod1Or2Value } from '@/tools/multi';
import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { voidUnit } from '@/tools/units';
import { freightIsMethod1 } from './freight.input';
import { FreightsInputTransformed } from './freights.input';

const directEmissionsFromFuel = (
  fuel: TransportFuelInputTransformed,
  context: ExecutionContext<HasCommonConstants>,
) => {
  const { constants } = context;
  return emissionsOfGasForFuel(fuel, constants, 'CO2e');
};

export const calculateFreightEmissions = (
  input: FreightsInputTransformed,
  context: ExecutionContext<HasCommonConstants>,
) => {
  const { constants } = context;
  /**
   * E = SUMf ((Wf * Df) * EFf)
   */
  const freightEmissions = input.freight.map((freight) => {
    // Method 1 uses freight type, distance, and weight. Method 2 uses known fuel use.
    if (freightIsMethod1(freight)) {
      const emissionsFactor = selectConstant(
        constants.COMMON,
        'FREIGHT_EMISSIONS',
        freight.freightType,
      );
      return captureMethod1Or2Value(
        emissionsFactor
          .multiply(freight.distance)
          .multiply(freight.weight)
          .reference('15.13.1.1 (1)'),
        undefined,
      );
    }

    return captureMethod1Or2Value(
      voidUnit(),
      directEmissionsFromFuel(freight.fuel, context),
    );
  });
  return sum(freightEmissions, zeroCO2e).named('E');
};
