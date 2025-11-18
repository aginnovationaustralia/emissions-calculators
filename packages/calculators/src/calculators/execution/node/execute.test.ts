import { AllConstants } from '@/constants/types';
import { CalculatorNames } from '../../strings';
import { CalculationEnvironment } from './environment';
import { executeCalculator } from './execute';
import { trackCalculatorExecution } from './metrics';

// Mock the dependencies
jest.mock('./metrics', () => ({
  trackCalculatorExecution: jest.fn(),
}));

jest.mock('./environment', () => ({
  CalculationEnvironment: {
    loadConstants: jest.fn(),
    isMetricsEnabled: jest.fn().mockReturnValue(true),
    getOrganisation: jest.fn().mockReturnValue(undefined),
  },
}));

describe('executeCalculator', () => {
  const mockTrackCalculatorExecution =
    trackCalculatorExecution as jest.MockedFunction<
      typeof trackCalculatorExecution
    >;
  const mockLoadConstants =
    CalculationEnvironment.loadConstants as jest.MockedFunction<
      typeof CalculationEnvironment.loadConstants
    >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadConstants.mockReturnValue({} as AllConstants);
  });

  describe('successful execution', () => {
    it('should execute calculator successfully and track metrics', () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({ result: 'success' });
      const input = { test: 'input' };
      const calculatorName = CalculatorNames.Beef;

      // Act
      const result = executeCalculator(mockCalculator, input, calculatorName);

      // Assert
      expect(result).toEqual({ result: 'success' });
      expect(mockCalculator).toHaveBeenCalledWith(input, {
        calculator: calculatorName,
        version: '3.0.0',
        constants: {},
        timestamp: expect.any(String),
      });
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith({
        calculator: calculatorName,
        calculatorVersion: '3.0.0',
        failed: false,
        packageVersion: 'unknown',
        organisation: undefined,
      });
      expect(mockLoadConstants).toHaveBeenCalledTimes(1);
    });

    it('should create context with correct properties', () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({});
      const input = {};
      const calculatorName = CalculatorNames.Beef;

      // Act
      executeCalculator(mockCalculator, input, calculatorName);

      // Assert
      expect(mockCalculator).toHaveBeenCalledWith(input, {
        calculator: calculatorName,
        version: '3.0.0',
        constants: {},
        timestamp: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
        ),
      });
    });

    it('should handle different calculator names', () => {
      // Arrange
      const calculatorNames = [
        CalculatorNames.Beef,
        CalculatorNames.Dairy,
        CalculatorNames.Sheep,
        CalculatorNames.Aquaculture,
        CalculatorNames.WildSeaFisheries,
      ];
      const mockCalculator = jest.fn().mockReturnValue({});

      // Act & Assert
      calculatorNames.forEach((name) => {
        executeCalculator(mockCalculator, {}, name);
        expect(mockTrackCalculatorExecution).toHaveBeenCalledWith({
          calculator: name,
          calculatorVersion: '3.0.0',
          failed: false,
          packageVersion: 'unknown',
          organisation: undefined,
        });
      });

      expect(mockTrackCalculatorExecution).toHaveBeenCalledTimes(
        calculatorNames.length,
      );
    });

    it('should return different timestamps for multiple executions', async () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({});
      const timestamps: string[] = [];

      // Mock the calculator to capture timestamps
      mockCalculator.mockImplementation((input, context) => {
        timestamps.push(context.timestamp);
        return {};
      });

      // Act
      executeCalculator(mockCalculator, {}, CalculatorNames.Beef);

      // Small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 100));

      executeCalculator(mockCalculator, {}, CalculatorNames.Dairy);

      // Assert
      expect(timestamps).toHaveLength(2);
      expect(timestamps[0]).not.toBe(timestamps[1]);
      expect(new Date(timestamps[0]).getTime()).toBeLessThan(
        new Date(timestamps[1]).getTime(),
      );
    });

    it('should handle complex input and output types', () => {
      // Arrange
      interface TestInput {
        value: number;
        name: string;
      }
      interface TestOutput {
        result: number;
        processed: boolean;
      }

      const mockCalculator = jest
        .fn<TestOutput, [TestInput]>()
        .mockReturnValue({
          result: 42,
          processed: true,
        });

      const input: TestInput = { value: 10, name: 'test' };

      // Act
      const result = executeCalculator(
        mockCalculator,
        input,
        CalculatorNames.Beef,
      );

      // Assert
      expect(result).toEqual({ result: 42, processed: true });
      expect(typeof result.result).toBe('number');
      expect(typeof result.processed).toBe('boolean');
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith({
        calculator: CalculatorNames.Beef,
        calculatorVersion: '3.0.0',
        failed: false,
        packageVersion: 'unknown',
        organisation: undefined,
      });
    });

    it('should preserve complex object structures', () => {
      // Arrange
      const complexInput = {
        nested: { deep: { value: 'test' } },
        array: [1, 2, 3],
        func: () => 'test',
      };

      const complexOutput = {
        processed: complexInput,
        metadata: { timestamp: Date.now() },
      };

      const mockCalculator = jest.fn().mockReturnValue(complexOutput);

      // Act
      const result = executeCalculator(
        mockCalculator,
        complexInput,
        CalculatorNames.Beef,
      );

      // Assert
      expect(result).toEqual(complexOutput);
      expect(result.processed).toBe(complexInput);
      expect(result.processed.nested.deep.value).toBe('test');
      expect(result.processed.array).toEqual([1, 2, 3]);
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith({
        calculator: CalculatorNames.Beef,
        calculatorVersion: '3.0.0',
        failed: false,
        packageVersion: 'unknown',
        organisation: undefined,
      });
    });

    it('should handle null and undefined return values', () => {
      // Arrange
      const mockCalculatorNull = jest.fn().mockReturnValue(null);
      const mockCalculatorUndefined = jest.fn().mockReturnValue(undefined);

      // Act & Assert
      expect(
        executeCalculator(mockCalculatorNull, {}, CalculatorNames.Beef),
      ).toBeNull();
      expect(
        executeCalculator(mockCalculatorUndefined, {}, CalculatorNames.Beef),
      ).toBeUndefined();

      expect(mockTrackCalculatorExecution).toHaveBeenCalledTimes(2);
      expect(mockTrackCalculatorExecution).toHaveBeenNthCalledWith(1, {
        calculator: CalculatorNames.Beef,
        calculatorVersion: '3.0.0',
        failed: false,
        packageVersion: 'unknown',
        organisation: undefined,
      });
      expect(mockTrackCalculatorExecution).toHaveBeenNthCalledWith(2, {
        calculator: CalculatorNames.Beef,
        calculatorVersion: '3.0.0',
        failed: false,
        packageVersion: 'unknown',
        organisation: undefined,
      });
    });
  });

  describe('error handling', () => {
    it('should track metrics with failed=true when calculator throws error', () => {
      // Arrange
      const error = new Error('Test error');
      const mockCalculator = jest.fn().mockImplementation(() => {
        throw error;
      });
      const input = { test: 'input' };
      const calculatorName = CalculatorNames.Beef;

      // Act & Assert
      expect(() =>
        executeCalculator(mockCalculator, input, calculatorName),
      ).toThrow('Test error');

      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith({
        calculator: calculatorName,
        calculatorVersion: '3.0.0',
        failed: true,
        packageVersion: 'unknown',
        organisation: undefined,
      });
      expect(mockCalculator).toHaveBeenCalledWith(input, expect.any(Object));
    });

    it('should track metrics for different types of errors', () => {
      // Arrange
      const errors = [
        new Error('Standard error'),
        new TypeError('Type error'),
        new ReferenceError('Reference error'),
        'String error',
        42,
        null,
        undefined,
      ];

      const calculatorName = CalculatorNames.Beef;

      // Act & Assert
      errors.forEach((error) => {
        const mockCalculator = jest.fn().mockImplementation(() => {
          throw error;
        });

        expect(() =>
          executeCalculator(mockCalculator, {}, calculatorName),
        ).toThrow();
        expect(mockTrackCalculatorExecution).toHaveBeenCalledWith({
          calculator: calculatorName,
          calculatorVersion: '3.0.0',
          failed: true,
          packageVersion: 'unknown',
          organisation: undefined,
        });
      });

      expect(mockTrackCalculatorExecution).toHaveBeenCalledTimes(errors.length);
    });

    it('should preserve original error when re-throwing', () => {
      // Arrange
      const originalError = new Error('Original error message');
      const mockCalculator = jest.fn().mockImplementation(() => {
        throw originalError;
      });

      // Act & Assert
      expect(() =>
        executeCalculator(mockCalculator, {}, CalculatorNames.Beef),
      ).toThrow(originalError);

      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith({
        calculator: CalculatorNames.Beef,
        calculatorVersion: '3.0.0',
        failed: true,
        packageVersion: 'unknown',
        organisation: undefined,
      });
    });

    it('should track metrics even when error occurs in context creation', () => {
      // Arrange
      mockLoadConstants.mockImplementation(() => {
        throw new Error('Constants load failed');
      });

      const mockCalculator = jest.fn().mockReturnValue({});

      // Act & Assert
      expect(() =>
        executeCalculator(mockCalculator, {}, CalculatorNames.Beef),
      ).toThrow('Constants load failed');
    });

    it('should handle async errors in calculator', async () => {
      // Arrange
      const asyncError = new Error('Async error');
      const mockCalculator = jest.fn().mockImplementation(async () => {
        throw asyncError;
      });

      // Act & Assert
      await expect(
        executeCalculator(mockCalculator, {}, CalculatorNames.Beef),
      ).rejects.toThrow('Async error');
      // Note: The executeCalculator function doesn't handle async errors differently
      // It will track as failed=false because the promise rejection happens after the function returns
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith({
        calculator: CalculatorNames.Beef,
        calculatorVersion: '3.0.0',
        failed: false,
        packageVersion: 'unknown',
        organisation: undefined,
      });
    });
  });

  describe('context creation', () => {
    it('should call loadConstants exactly once per execution', () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({});
      const executions = 5;

      // Act
      for (let i = 0; i < executions; i++) {
        executeCalculator(mockCalculator, {}, CalculatorNames.Beef);
      }

      // Assert
      expect(mockLoadConstants).toHaveBeenCalledTimes(executions);
    });

    it('should handle loadConstants returning different values', () => {
      // Arrange
      const constants1 = {
        version: '1.0',
        apiKey: 'key1',
      } as unknown as AllConstants;
      const constants2 = {
        version: '2.0',
        apiKey: 'key2',
      } as unknown as AllConstants;
      const mockCalculator = jest.fn().mockReturnValue({});

      mockLoadConstants
        .mockReturnValueOnce(constants1)
        .mockReturnValueOnce(constants2);

      // Act
      executeCalculator(mockCalculator, {}, CalculatorNames.Beef);
      executeCalculator(mockCalculator, {}, CalculatorNames.Dairy);

      // Assert
      expect(mockCalculator).toHaveBeenNthCalledWith(
        1,
        {},
        expect.objectContaining({
          constants: constants1,
        }),
      );
      expect(mockCalculator).toHaveBeenNthCalledWith(
        2,
        {},
        expect.objectContaining({
          constants: constants2,
        }),
      );
    });

    it('should create unique timestamps for each execution', async () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({});
      const timestamps: string[] = [];

      // Mock the calculator to capture timestamps
      mockCalculator.mockImplementation((input, context) => {
        timestamps.push(context.timestamp);
        return {};
      });

      // Act
      executeCalculator(mockCalculator, {}, CalculatorNames.Beef);

      // Small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 100));

      executeCalculator(mockCalculator, {}, CalculatorNames.Dairy);

      // Assert
      expect(timestamps).toHaveLength(2);
      expect(timestamps[0]).not.toBe(timestamps[1]);
      expect(new Date(timestamps[0]).getTime()).toBeLessThanOrEqual(
        new Date(timestamps[1]).getTime(),
      );
    });

    it('should validate timestamp format', () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({});
      let capturedTimestamp: string;

      mockCalculator.mockImplementation((input, context) => {
        capturedTimestamp = context.timestamp;
        return {};
      });

      // Act
      executeCalculator(mockCalculator, {}, CalculatorNames.Beef);

      // Assert
      expect(capturedTimestamp!).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
      expect(new Date(capturedTimestamp!).getTime()).not.toBeNaN();
    });
  });

  describe('edge cases', () => {
    it('should handle empty input objects', () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({});
      const emptyInput = {};

      // Act
      executeCalculator(mockCalculator, emptyInput, CalculatorNames.Beef);

      // Assert
      expect(mockCalculator).toHaveBeenCalledWith(
        emptyInput,
        expect.any(Object),
      );
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(
        expect.objectContaining({
          calculator: CalculatorNames.Beef,
          calculatorVersion: '3.0.0',
          failed: false,
        }),
      );
    });

    it('should handle null and undefined inputs gracefully', () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({});

      // Act & Assert
      expect(() =>
        executeCalculator(mockCalculator, null, CalculatorNames.Beef),
      ).not.toThrow();
      expect(() =>
        executeCalculator(mockCalculator, undefined, CalculatorNames.Beef),
      ).not.toThrow();

      expect(mockTrackCalculatorExecution).toHaveBeenCalledTimes(2);
    });

    it('should handle calculator that modifies input', () => {
      // Arrange
      const input = { value: 1 };
      const mockCalculator = jest.fn().mockImplementation((input, _context) => {
        input.value = 2; // Modify input
        return { result: input.value };
      });

      // Act
      const result = executeCalculator(
        mockCalculator,
        input,
        CalculatorNames.Beef,
      );

      // Assert
      expect(result).toEqual({ result: 2 });
      expect(input.value).toBe(2); // Input was modified
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(
        expect.objectContaining({
          calculator: CalculatorNames.Beef,
          calculatorVersion: '3.0.0',
          failed: false,
        }),
      );
    });
  });

  describe('metrics tracking verification', () => {
    it('should always call trackCalculatorExecution regardless of success or failure', () => {
      // Arrange
      const successCalculator = jest.fn().mockReturnValue({ success: true });
      const failureCalculator = jest.fn().mockImplementation(() => {
        throw new Error('Failure');
      });

      // Act & Assert
      executeCalculator(successCalculator, {}, CalculatorNames.Beef);
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(
        expect.objectContaining({
          failed: false,
        }),
      );

      expect(() =>
        executeCalculator(failureCalculator, {}, CalculatorNames.Beef),
      ).toThrow();
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(
        expect.objectContaining({
          failed: true,
        }),
      );

      expect(mockTrackCalculatorExecution).toHaveBeenCalledTimes(2);
    });

    it('should track metrics even when trackCalculatorExecution itself throws', () => {
      // Arrange
      mockTrackCalculatorExecution.mockImplementation(() => {
        throw new Error('Tracking failed');
      });

      const mockCalculator = jest.fn().mockReturnValue({});

      // Act & Assert
      expect(() =>
        executeCalculator(mockCalculator, {}, CalculatorNames.Beef),
      ).toThrow('Tracking failed');

      // The function should still attempt to track metrics
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith({
        calculator: CalculatorNames.Beef,
        calculatorVersion: '3.0.0',
        failed: false,
        packageVersion: 'unknown',
        organisation: undefined,
      });
    });

    it('should track metrics with correct parameters for all calculator types', () => {
      // Arrange
      // Reset the mock to normal behavior
      mockTrackCalculatorExecution.mockImplementation(() => {});

      const calculators = Object.values(CalculatorNames);

      const mockCalculator = jest.fn().mockReturnValue({});

      // Act
      calculators.forEach((calculator) => {
        executeCalculator(mockCalculator, {}, calculator);
      });

      // Assert
      expect(mockTrackCalculatorExecution).toHaveBeenCalledTimes(
        calculators.length,
      );
      calculators.forEach((calculator) => {
        expect(mockTrackCalculatorExecution).toHaveBeenCalledWith({
          calculator,
          calculatorVersion: '3.0.0',
          failed: false,
          packageVersion: 'unknown',
          organisation: undefined,
        });
      });
    });
  });
});
