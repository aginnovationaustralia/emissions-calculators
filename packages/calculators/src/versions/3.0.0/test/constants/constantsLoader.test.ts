/* eslint-disable camelcase */
import {
  loadConstants,
  loadOverrideConstants,
} from '../../constants/constantsLoader';
import { STATES } from '../../constants/versionedConstants';
import { CalculationEnvironment } from '../../execution/environment';

describe('constantsLoader', () => {
  describe('loadConstants', () => {
    it('should load constants for current version with overrides', () => {
      const overrides = {
        BEEF: {
          DRYMATTERDIGESTIBILITY: {
            spring: {
              [STATES.VIC]: 90,
            },
          },
        },
      };
      const defaultConstants = loadConstants();
      const overriddenConstants = CalculationEnvironment.run(
        { overrides },
        () => loadOverrideConstants(),
      );
      expect(
        overriddenConstants.BEEF.DRYMATTERDIGESTIBILITY.spring.vic,
      ).toEqual(90);

      // Reset overridden value and ensure other values are not affected
      overriddenConstants.BEEF.DRYMATTERDIGESTIBILITY.spring.vic = 80;
      expect(overriddenConstants).toEqual(defaultConstants);
    });
  });
});
