import {
  calculateGrains,
  executeCalculator,
} from '@aginnovationaustralia/emissions-calculator-research';
import {
  GrainsInputSchema,
  GrainsOutput,
} from '@aginnovationaustralia/veerg-calculators/grains';
import { grainsInputDataMethod1 } from './input';

/**
 * Calculate grains emissions with a custom value for one of the constants, using the research package.
 *
 * Any constant can be overridden by passing a partial copy of the constants structure as the
 * `overrides` option to the research `executeCalculator`. Only that execution uses the overridden
 * values. Override values are written directly into the constant's
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

  // Double the scope 1 CO2 emission factor for diesel used in off-road agriculture and forestry
  // equipment, which is the transport fuel used by the example input.
  // The source value is 69.9 kg CO2 / GJ, which is stored as 0.0000699.
  const dieselCO2Factor = 0.0000699 * 2;

  const overrides = {
    COMMON: {
      TRANSPORT_FUEL_FACTORS: {
        'Off-road Agriculture and forestry equipment': {
          Diesel: { SCOPE1_EF: { CO2: dieselCO2Factor } },
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
    'Transport fuel CO2 (tonnes CO2e), baseline vs overridden:',
    baseline.scope1.fuelTransportCO2.amountTonnesCO2e,
    overridden.scope1.fuelTransportCO2.amountTonnesCO2e,
  );

  return { baseline, overridden };
};
