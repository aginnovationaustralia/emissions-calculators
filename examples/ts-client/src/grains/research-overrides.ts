import {
  calculateGrains,
  executeCalculator,
} from '@aginnovationaustralia/emissions-calculator-research';
import {
  GrainsInputSchema,
  GrainsOutput,
} from '@aginnovationaustralia/emissions-calculators/grains';
import { grainsInputDataMethod1 } from './input';

/**
 * Calculate grains emissions with a custom value for one of the constants, using the research package.
 *
 * Any constant can be overridden by passing a partial copy of the constants structure to
 * `ResearchEnvironment.run`. Every calculator executed via the research `executeCalculator` inside the
 * callback will use the overridden values. Override values are written directly into the constant's
 * storage units, which can differ from the units in the source data. The stored value of each constant
 * used by a calculation is listed in the `constants` trace of its output, which is a good reference for
 * the scale of an override.
 *
 * @returns The baseline and overridden grains emissions
 */
export const calculateGrainsWithOverrides = (): {
  baseline: GrainsOutput;
  overridden: GrainsOutput;
} => {
  const input = GrainsInputSchema.parse(grainsInputDataMethod1);
  const options = { disableMetrics: true };

  const baseline = executeCalculator(calculateGrains, input, 'grains', options);

  // Double the scope 1 CO2 emission factor for gasoline used in cars and light commercial vehicles.
  // The source value is 67.4 kg CO2 / GJ, which is stored as 0.0000674.
  const gasolineCO2Factor = 0.0000674 * 2;

  const overrides = {
    COMMON: {
      TRANSPORT_FUEL_FACTORS: {
        'Cars and light commercial vehicles': {
          Gasoline: { SCOPE1_EF: { CO2: gasolineCO2Factor } },
        },
      },
    },
  };

  const optionsWithOverrides = {
    ...options,
    overrides,
  };

  const overridden = executeCalculator(
    calculateGrains,
    input,
    'grains',
    optionsWithOverrides,
  );

  console.log(
    'Transport fuel CO2 (kg CO2e), baseline vs overridden:',
    baseline.scope1.fuelTransportCO2.amountTonnesCO2e,
    overridden.scope1.fuelTransportCO2.amountTonnesCO2e,
  );

  return { baseline, overridden };
};
