// Mock the config module
jest.mock('./config', () => ({
  CalculatorConfig: {
    isMetricsEnabled: jest.fn(),
    mixpanelKey: jest.fn(),
    packageVersion: jest.fn(),
    getOrganisation: jest.fn(),
  },
}));

// Mock the mixpanel module
const mockMixpanelInstance = {
  track: jest.fn(),
};

jest.mock('./mixpanel', () => ({
  mixPanelinstance: mockMixpanelInstance,
}));

import { CalculatorConfig } from './config';

const mockCalculatorConfig = CalculatorConfig as unknown as {
  isMetricsEnabled: jest.MockedFunction<() => boolean>;
  mixpanelKey: jest.MockedFunction<() => string>;
  packageVersion: jest.MockedFunction<() => string>;
  getOrganisation: jest.MockedFunction<() => string | undefined>;
};

import { trackCalculatorExecution } from './metrics';

describe('metrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the track mock function
    mockMixpanelInstance.track.mockClear();
  });

  describe('trackCalculatorExecution', () => {
    it('should track calculator execution when metrics are enabled', () => {
      // Mock config to return enabled metrics
      mockCalculatorConfig.isMetricsEnabled.mockReturnValue(true);
      mockCalculatorConfig.mixpanelKey.mockReturnValue('test-key');
      mockCalculatorConfig.packageVersion.mockReturnValue('1.0.0');
      mockCalculatorConfig.getOrganisation.mockReturnValue('test-org');

      trackCalculatorExecution('Beef', '3.0.0', false);

      expect(mockMixpanelInstance.track).toHaveBeenCalledWith(
        'Execute package calculation',
        {
          calculator: 'Beef',
          calculatorVersion: '3.0.0',
          packageVersion: '1.0.0',
          failed: false,
          organisation: 'test-org',
        },
      );
    });

    it('should track failed calculator execution when metrics are enabled', () => {
      // Mock config to return enabled metrics
      mockCalculatorConfig.isMetricsEnabled.mockReturnValue(true);
      mockCalculatorConfig.mixpanelKey.mockReturnValue('test-key');
      mockCalculatorConfig.packageVersion.mockReturnValue('1.0.0');
      mockCalculatorConfig.getOrganisation.mockReturnValue('test-org');

      trackCalculatorExecution('Dairy', '3.0.0', true);

      expect(mockMixpanelInstance.track).toHaveBeenCalledWith(
        'Execute package calculation',
        {
          calculator: 'Dairy',
          calculatorVersion: '3.0.0',
          packageVersion: '1.0.0',
          failed: true,
          organisation: 'test-org',
        },
      );
    });

    it('should not track when metrics are disabled at execution time', () => {
      mockCalculatorConfig.isMetricsEnabled.mockReturnValue(false);
      trackCalculatorExecution('Beef', '3.0.0', false);

      expect(mockMixpanelInstance.track).not.toHaveBeenCalled();
    });

    it('should handle undefined organisation', () => {
      mockCalculatorConfig.isMetricsEnabled.mockReturnValue(true);
      mockCalculatorConfig.mixpanelKey.mockReturnValue('test-key');
      mockCalculatorConfig.packageVersion.mockReturnValue('1.0.0');
      mockCalculatorConfig.getOrganisation.mockReturnValue(undefined);

      trackCalculatorExecution('Beef', '3.0.0', false);

      expect(mockMixpanelInstance.track).toHaveBeenCalledWith(
        'Execute package calculation',
        expect.objectContaining({
          organisation: undefined,
        }),
      );
    });

    it('should handle different calculator names and versions', () => {
      mockCalculatorConfig.isMetricsEnabled.mockReturnValue(true);
      mockCalculatorConfig.mixpanelKey.mockReturnValue('test-key');
      mockCalculatorConfig.packageVersion.mockReturnValue('2.1.3');
      mockCalculatorConfig.getOrganisation.mockReturnValue('another-org');

      trackCalculatorExecution('CustomCalculator', '4.1.0', false);

      expect(mockMixpanelInstance.track).toHaveBeenCalledWith(
        'Execute package calculation',
        {
          calculator: 'CustomCalculator',
          calculatorVersion: '4.1.0',
          packageVersion: '2.1.3',
          failed: false,
          organisation: 'another-org',
        },
      );
    });
  });
});
