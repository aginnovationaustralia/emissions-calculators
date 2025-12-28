import Decimal from 'decimal.js-light';
import { selectConstant } from './constants';
import { formatOrigin } from './format';
import { input } from './inputs';
import { multiply } from './multiply';
import {
  BinaryOrigin,
  ConstantSelectionOrigin,
  RootOrigin,
  SummedOrigin,
} from './origins';
import { output } from './output';
import {
  mass,
  Mass,
  MassCO2ePerMassRefrigerant,
  massCO2ePerMassRefrigerant,
  sum,
} from './overloads';

describe('formatOrigin', () => {
  const mockConstants = {
    COMMON: {
      REFRIGERANT_GWP: {
        unit: massCO2ePerMassRefrigerant(),
        values: {
          'HFC-152a': new Decimal(138),
          'HFC-134a': new Decimal(1300),
          'HFC-23': new Decimal(12400),
        } as Record<string, Decimal>,
      },
    },
  };
  const inputChargeSize: RootOrigin<Mass<'Refrigerant'>> = input(
    'testInputCH4',
    mass('Refrigerant', new Decimal(100)),
  );
  const constantGWPCH4: ConstantSelectionOrigin<MassCO2ePerMassRefrigerant> =
    selectConstant(
      mockConstants.COMMON,
      'REFRIGERANT_GWP',
      input('inputRefrigerantType', 'HFC-152a'),
    );
  const intermediateVariableMultiply: BinaryOrigin<Mass<'CO2e'>> = multiply(
    constantGWPCH4,
    inputChargeSize,
    { valueType: 'intermediate' },
  );
  const namedSum: SummedOrigin<Mass<'CO2e'>> = sum(
    { items: [intermediateVariableMultiply], unit: mass('CO2e') },
    { valueType: 'variable', name: 'testSum' },
  );
  const testOutput = output('testOutput', 3, namedSum);

  it.each([
    [
      testOutput,
      'testOutput = sum(REFRIGERANT_GWP[inputRefrigerantType] * CHARGE_SIZE[testInputCH4])',
    ],
  ])('should format an origin', (origin, actualText) => {
    expect(formatOrigin(origin)).toBe(actualText);
  });
});
