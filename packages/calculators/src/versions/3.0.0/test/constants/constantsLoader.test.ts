/* eslint-disable camelcase */
import { constants } from '../../constants/constant_values';
import {
  loadConstants,
  loadOverrideConstants,
} from '../../constants/constantsLoader';
import { STATES } from '../../constants/versionedConstants';

describe('constantsLoader', () => {
  describe('loadConstants', () => {
    it('should load constants for current version', () => {
      const loadedConstants = loadConstants();
      expect(loadedConstants).toBeDefined();
      expect(loadedConstants).toEqual(constants);
    });
  });

  describe('loadOverrideConstants', () => {
    it('should load constants for current version with overrides', () => {
      const overrides = {
        BEEF_DRYMATTERDIGESTIBILITY: {
          spring: {
            [STATES.VIC]: 90,
          },
        },
      };
      const defaultConstants = loadConstants();
      const overriddenConstants = loadOverrideConstants(overrides);
      expect(
        overriddenConstants.BEEF_DRYMATTERDIGESTIBILITY.spring.vic,
      ).toEqual(90);

      // Reset overridden value and ensure other values are not affected
      overriddenConstants.BEEF_DRYMATTERDIGESTIBILITY.spring.vic = 80;
      expect(overriddenConstants).toEqual(defaultConstants);
    });
  });
});
