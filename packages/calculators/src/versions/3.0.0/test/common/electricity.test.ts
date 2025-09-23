import { calculateElectricityScope2And3 } from '../../common-legacy/electricity';
import { testContext, V3_0_0 } from './context';
import { defaultPrecision } from './emissions';

const context = testContext(V3_0_0);

describe('Electricity Tests', () => {
  describe('NSW and ACT matches', () => {
    // The NGA considers ACT and NSW to be the same region. The purpose of this test is to catch
    // if updates to the constants for one region gets missed where the other does not.
    const act = calculateElectricityScope2And3(
      'act',
      'State Grid',
      0,
      1000,
      context,
    );
    const nsw = calculateElectricityScope2And3(
      'nsw',
      'State Grid',
      0,
      1000,
      context,
    );
    it('Scope 2 matches', () => {
      expect(act.scope2).toBeCloseTo(nsw.scope2, defaultPrecision);
    });
    it('Scope 3 matches', () => {
      expect(act.scope3).toBeCloseTo(nsw.scope3, defaultPrecision);
    });
  });
});
