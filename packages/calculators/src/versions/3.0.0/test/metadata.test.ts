import { calculateEmissions } from '../calculators';
import { beefTestData } from './Beef/input.data';
import { V2_0_0 } from './common/context';

describe('calculator metaData', () => {
  const input = {
    ...beefTestData,
    overrides: {
      BEEF_EF_URINEDUNGDEPOSITED: 0.0042,
    },
  };

  const draftResult = calculateEmissions('beef', V2_0_0, input, true);
  const normalResult = calculateEmissions('beef', V2_0_0, input, false);

  describe('with draft query parameters', () => {
    it('returns the full metaData object', () => {
      expect(draftResult).toHaveProperty('metaData');
      expect(draftResult.metaData.calculator).toEqual('beef');
      expect(draftResult.metaData.version).toEqual('2.0.0');
      expect(draftResult.metaData).toHaveProperty('timestamp'); // value is now
      expect(draftResult.metaData).toHaveProperty('overrides');
    });

    it('returns the overrides in the metaData', () => {
      const overrides = draftResult.metaData.overrides as Record<
        string,
        number
      >;
      expect(overrides).toHaveProperty('BEEF_EF_URINEDUNGDEPOSITED');
      expect(overrides!.BEEF_EF_URINEDUNGDEPOSITED).toEqual(0.0042);
    });
  });

  describe('without draft query parameters', () => {
    it('not return the overrides in the metaData', () => {
      expect(normalResult).toHaveProperty('metaData');
      expect(normalResult.metaData.calculator).toEqual('beef');
      expect(normalResult.metaData.version).toEqual('2.0.0');
      expect(normalResult.metaData).toHaveProperty('timestamp');
      expect(normalResult.metaData.overrides).toBeUndefined();
    });
  });

  describe('with draft query parameters', () => {
    it('returns a different result', () => {
      expect(draftResult).not.toEqual(normalResult);
    });

    it('returns a different net total', () => {
      expect(draftResult.net.total).not.toEqual(normalResult.net.total);
    });

    it('returns a different scope1 total', () => {
      expect(draftResult.scope1.total).not.toEqual(normalResult.scope1.total);
    });

    it('returns an unchanged scope2 total', () => {
      expect(draftResult.scope2.total).toEqual(normalResult.scope2.total);
    });
  });
});
