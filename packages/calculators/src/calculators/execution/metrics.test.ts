// Mock the config module
jest.mock('./config', () => ({
  CalculatorConfig: {
    isMetricsEnabled: jest.fn(),
    mixpanelKey: jest.fn(),
    packageVersion: jest.fn(),
    organisation: jest.fn(),
  },
}));

// Mock the mixpanel module
const mockMixpanelInstance = {
  track: jest.fn(),
};

jest.mock('./mixpanel', () => ({
  mixPanelInstance: mockMixpanelInstance,
}));

import { CalculatorConfig } from './config';

const mockCalculatorConfig = CalculatorConfig as unknown as {
  isMetricsEnabled: jest.MockedFunction<() => boolean>;
  mixpanelKey: jest.MockedFunction<() => string>;
  packageVersion: jest.MockedFunction<() => string>;
  organisation: jest.MockedFunction<() => string | undefined>;
};

import { trackCalculatorExecution } from './metrics';

describe('metrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the track mock function
    mockMixpanelInstance.track.mockClear();
  });

  describe('trackCalculatorExecution', () => {
    it.each([
      [true, '1.0.0', 'test-org', 'Beef', '3.0.0', false],
      [true, '2.0.0', 'test-org2', 'Rice', '4.0.0', true],
      [false, '2.0.0', 'test-org2', 'Rice', '4.0.0', true],
    ])(
      'pass values to trackCalculatorExecution',
      (
        metricsEnabled,
        packageVersion,
        organisation,
        calculator,
        calculatorVersion,
        failed,
      ) => {
        // Mock config to return enabled metrics
        mockCalculatorConfig.isMetricsEnabled.mockReturnValue(metricsEnabled);
        mockCalculatorConfig.mixpanelKey.mockReturnValue('test-key');
        mockCalculatorConfig.packageVersion.mockReturnValue(packageVersion);
        mockCalculatorConfig.organisation.mockReturnValue(organisation);

        trackCalculatorExecution(calculator, calculatorVersion, failed);

        if (metricsEnabled) {
          expect(mockMixpanelInstance.track).toHaveBeenCalledWith(
            'Execute package calculation',
            {
              calculator,
              calculatorVersion,
              packageVersion,
              failed,
              organisation,
            },
          );
        } else {
          expect(mockMixpanelInstance.track).not.toHaveBeenCalled();
        }
      },
    );
  });
});
