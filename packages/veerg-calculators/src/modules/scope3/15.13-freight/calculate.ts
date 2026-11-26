import { ExecutionContext } from '@/calculators/executionContext';
import { HasCommonConstants } from '@/constants/types';
import { emissionsOfGasForFuel } from '@/modules/scope1/8-fuel-use';
import { selectConstant } from '@/tools/constants';
import { captureMethod1Or2Value } from '@/tools/multi';
import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { voidUnit } from '@/tools/units';
import { calculateScope3EmissionsFromFuelTransport } from '../15.10-fuel';
import { freightIsMethod1 } from './freight.input';
import { FreightsInputTransformed } from './freights.input';

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
          .multiply(freight.distanceKilometres)
          .multiply(freight.weightTonnes)
          .reference('15.13.1.1 (1)'),
        undefined,
      );
    }

    /* 15.13.1.2
     * If fuel use is known, use Chapter 8.1.1.1 and 15.8.1.1 to estimate direct and upstream
     * emissions respectively associated with fuel consumption for freighting of goods.
     * */

    const directEmissions = emissionsOfGasForFuel(
      freight.fuel,
      constants,
      'CO2e',
    );
    const upstreamEmissions = calculateScope3EmissionsFromFuelTransport(
      { transport: [freight.fuel] },
      context,
    );

    return captureMethod1Or2Value(
      voidUnit(),
      directEmissions.plus(upstreamEmissions).reference('15.13.1.2'),
    );
  });
  return sum(freightEmissions, zeroCO2e).named('E');
};
