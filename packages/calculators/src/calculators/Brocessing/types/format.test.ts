import Decimal from 'decimal.js-light';
import { selectConstant } from './constants';
import { formatNames } from './format';
import { input } from './inputs';
import { multiply } from './multiply';
import {
  BinaryOrigin,
  ConstantSelectionOrigin,
  RootOrigin,
  SummedOrigin,
} from './origins';
import { output } from './output';
import { sum } from './sum';
import {
  mass,
  Mass,
  massCO2ePerMassRefrigerant,
  MassCO2ePerMassRefrigerant,
} from './units';

describe('formatNames', () => {
  const mockConstants = {
    COMMON: {
      REFRIGERANT_GWP: {
        'HFC-152a': new Decimal(138),
        'HFC-134a': new Decimal(1300),
        'HFC-23': new Decimal(12400),
      },
    },
  };
  const inputChargeSizeHFC152a: RootOrigin<Mass<'Refrigerant'>> = input(
    'inputChargeSize',
    mass('Refrigerant', new Decimal(100)),
  );
  const constantHFC152a: ConstantSelectionOrigin<MassCO2ePerMassRefrigerant> =
    selectConstant(
      mockConstants.COMMON,
      (value) => massCO2ePerMassRefrigerant(value),
      'REFRIGERANT_GWP',
      input('inputRefrigerantType', 'HFC-152a'),
    );
  const intermediateVariableMultiplyHFC152a: BinaryOrigin<Mass<'CO2e'>> =
    multiply(constantHFC152a, inputChargeSizeHFC152a, {
      valueType: 'intermediate',
    });
  const inputChargeSizeHFC23: RootOrigin<Mass<'Refrigerant'>> = input(
    'inputChargeSize',
    mass('Refrigerant', new Decimal(100)),
  );
  const constantHFC23: ConstantSelectionOrigin<MassCO2ePerMassRefrigerant> =
    selectConstant(
      mockConstants.COMMON,
      (value) => massCO2ePerMassRefrigerant(value),
      'REFRIGERANT_GWP',
      input('inputRefrigerantType', 'HFC-23'),
    );
  const intermediateVariableMultiplyHFC23: BinaryOrigin<Mass<'CO2e'>> =
    multiply(constantHFC23, inputChargeSizeHFC23, {
      valueType: 'intermediate',
    });
  const namedSum: SummedOrigin<Mass<'CO2e'>> = sum(
    {
      items: [
        intermediateVariableMultiplyHFC152a,
        intermediateVariableMultiplyHFC23,
      ],
      unit: mass('CO2e'),
    },
    { unit: mass('CO2e'), valueType: 'variable', name: 'testSum' },
  );
  const testOutput = output('testOutput', 3, namedSum);

  it.each([
    [
      testOutput,
      'testOutput = sum(REFRIGERANT_GWP.[inputRefrigerantType] * inputChargeSize)',
    ],
  ])('should format an origin', (origin, actualText) => {
    expect(formatNames(origin)).toBe(actualText);
  });
});
