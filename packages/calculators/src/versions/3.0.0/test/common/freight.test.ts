import { calculateFreight } from '../../common/freight';
import { FreightInput } from '../../types/common/freight.input';
import { FreightTypes } from '../../types/types';
import { testContext, V2_0_0 } from './context';
import { defaultPrecision } from './emissions';

const context = testContext(V2_0_0);

it('Freight calculation for all types is correct', () => {
  const freightInput: FreightInput[] = Object.values(FreightTypes).map(
    (type) => ({ type, totalKmTonnes: 10000 }),
  );
  const freight = calculateFreight(freightInput, context);

  expect(freight).toBeCloseTo(15758.75, defaultPrecision);
});
