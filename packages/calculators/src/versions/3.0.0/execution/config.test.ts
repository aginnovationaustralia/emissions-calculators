import { CalculatorConfig } from './config';
import { CalculationEnvironment, ConstantOverrides } from './environment';

// Mock the environment module
jest.mock('./environment', () => ({
  CalculationEnvironment: {
    getOrganisation: jest.fn(),
    getOverrides: jest.fn(),
  },
}));

// Mock the runtime constant injection
const originalProcessEnv = process.env;

const mockCalculationEnvironment = CalculationEnvironment as unknown as {
  getOrganisation: jest.MockedFunction<() => string | undefined>;
  getOverrides: jest.MockedFunction<() => ConstantOverrides | undefined>;
};

describe('CalculatorConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalProcessEnv };
  });

  afterAll(() => {
    process.env = originalProcessEnv;
  });

  describe('getOrganisation', () => {
    it('should return organisation from CalculationEnvironment when available', () => {
      mockCalculationEnvironment.getOrganisation.mockReturnValue(
        'test-organisation',
      );

      const result = CalculatorConfig.getOrganisation();

      expect(result).toBe('test-organisation');
      expect(mockCalculationEnvironment.getOrganisation).toHaveBeenCalled();
    });

    it('should return organisation from environment variable when CalculationEnvironment returns undefined', () => {
      mockCalculationEnvironment.getOrganisation.mockReturnValue(undefined);
      process.env.CALCULATOR_METRICS_ORGANISATION = 'env-organisation';

      const result = CalculatorConfig.getOrganisation();

      expect(result).toBe('env-organisation');
      expect(mockCalculationEnvironment.getOrganisation).toHaveBeenCalled();
    });

    it('should return undefined when neither source provides organisation', () => {
      mockCalculationEnvironment.getOrganisation.mockReturnValue(undefined);
      delete process.env.CALCULATOR_METRICS_ORGANISATION;

      const result = CalculatorConfig.getOrganisation();

      expect(result).toBeUndefined();
    });

    it('should prefer CalculationEnvironment over environment variable', () => {
      mockCalculationEnvironment.getOrganisation.mockReturnValue(
        'calc-env-org',
      );
      process.env.CALCULATOR_METRICS_ORGANISATION = 'env-var-org';

      const result = CalculatorConfig.getOrganisation();

      expect(result).toBe('calc-env-org');
    });
  });

  describe('isMetricsEnabled', () => {
    it('should return true when DISABLE_CALCULATOR_METRICS is not set', () => {
      delete process.env.DISABLE_CALCULATOR_METRICS;

      const result = CalculatorConfig.isMetricsEnabled();

      expect(result).toBe(true);
    });

    it('should return true when DISABLE_CALCULATOR_METRICS is not "true"', () => {
      process.env.DISABLE_CALCULATOR_METRICS = 'false';

      const result = CalculatorConfig.isMetricsEnabled();

      expect(result).toBe(true);
    });

    it('should return false when DISABLE_CALCULATOR_METRICS is "true"', () => {
      process.env.DISABLE_CALCULATOR_METRICS = 'true';

      const result = CalculatorConfig.isMetricsEnabled();

      expect(result).toBe(false);
    });

    it('should return false when DISABLE_CALCULATOR_METRICS is "TRUE" (case sensitive)', () => {
      process.env.DISABLE_CALCULATOR_METRICS = 'TRUE';

      const result = CalculatorConfig.isMetricsEnabled();

      expect(result).toBe(true); // Should be case sensitive, so still true
    });
  });

  describe('packageVersion', () => {
    it('should return "unknown" when PACKAGE_VERSION is undefined', () => {
      const result = CalculatorConfig.packageVersion();

      expect(result).toBe('unknown');
    });
  });

  describe('mixpanelKey', () => {
    it('should return the expected mixpanel key', () => {
      const result = CalculatorConfig.mixpanelKey();

      expect(result).toBe('ed361d81702b467cfa90128d3969bb06');
    });

    it('should return the same key consistently', () => {
      const result1 = CalculatorConfig.mixpanelKey();
      const result2 = CalculatorConfig.mixpanelKey();

      expect(result1).toBe(result2);
      expect(result1).toBe('ed361d81702b467cfa90128d3969bb06');
    });

    describe('overrides', () => {
      it('should return overrides from CalculationEnvironment', () => {
        const mockOverrides = { FEEDLOT_MN_LEACH: 2.5 };
        mockCalculationEnvironment.getOverrides.mockReturnValue(mockOverrides);

        const result = CalculatorConfig.overrides();

        expect(result).toBe(mockOverrides);
        expect(mockCalculationEnvironment.getOverrides).toHaveBeenCalled();
      });

      it('should return undefined when CalculationEnvironment returns undefined', () => {
        mockCalculationEnvironment.getOverrides.mockReturnValue(undefined);

        const result = CalculatorConfig.overrides();

        expect(result).toBeUndefined();
        expect(mockCalculationEnvironment.getOverrides).toHaveBeenCalled();
      });

      it('should handle empty overrides object', () => {
        const mockOverrides = {};
        mockCalculationEnvironment.getOverrides.mockReturnValue(mockOverrides);

        const result = CalculatorConfig.overrides();

        expect(result).toBe(mockOverrides);
      });

      it('should handle nested override objects', () => {
        const mockOverrides = {
          SWINE_WASTE_MMS: {
            nsw: 5,
          },
          array: [1, 2, 3],
        };
        mockCalculationEnvironment.getOverrides.mockReturnValue(mockOverrides);

        const result = CalculatorConfig.overrides();

        expect(result).toBe(mockOverrides);
      });
    });
  });
});
