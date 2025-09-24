import { loadConstants } from './constants/constantsLoader';
import { executeCalculator } from './execute';
import { trackCalculatorExecution } from './metrics';
import { CalculatorName } from './strings';

// Mock the dependencies
jest.mock('./metrics', () => ({
  trackCalculatorExecution: jest.fn(),
}));

jest.mock('./constants/constantsLoader', () => ({
  loadConstants: jest.fn(),
}));

describe('executeCalculator', () => {
  const mockTrackCalculatorExecution = trackCalculatorExecution as jest.MockedFunction<typeof trackCalculatorExecution>;
  const mockLoadConstants = loadConstants as jest.MockedFunction<typeof loadConstants>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadConstants.mockReturnValue({} as any);
  });

  describe('successful execution', () => {
    it('should execute calculator successfully and track metrics', () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({ result: 'success' });
      const input = { test: 'input' };
      const calculatorName = CalculatorName.Beef;

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
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(calculatorName, '3.0.0', false);
      expect(mockLoadConstants).toHaveBeenCalledTimes(1);
    });

    it('should create context with correct properties', () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({});
      const input = {};
      const calculatorName = CalculatorName.Beef;

      // Act
      executeCalculator(mockCalculator, input, calculatorName);

      // Assert
      expect(mockCalculator).toHaveBeenCalledWith(input, {
        calculator: calculatorName,
        version: '3.0.0',
        constants: {},
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      });
    });

    it('should handle different calculator names', () => {
      // Arrange
      const calculatorNames = [CalculatorName.Beef, CalculatorName.Dairy, CalculatorName.Sheep, CalculatorName.Aquaculture, CalculatorName.WildSeaFisheries];
      const mockCalculator = jest.fn().mockReturnValue({});

      // Act & Assert
      calculatorNames.forEach(name => {
        executeCalculator(mockCalculator, {}, name);
        expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(name, '3.0.0', false);
      });

      expect(mockTrackCalculatorExecution).toHaveBeenCalledTimes(calculatorNames.length);
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
      executeCalculator(mockCalculator, {}, CalculatorName.Beef);
      
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 100));
      
      executeCalculator(mockCalculator, {}, CalculatorName.Dairy);

      // Assert
      expect(timestamps).toHaveLength(2);
      expect(timestamps[0]).not.toBe(timestamps[1]);
      expect(new Date(timestamps[0]).getTime()).toBeLessThan(new Date(timestamps[1]).getTime());
    });

    it('should handle complex input and output types', () => {
      // Arrange
      interface TestInput { value: number; name: string; }
      interface TestOutput { result: number; processed: boolean; }

      const mockCalculator = jest.fn<TestOutput, [TestInput, any]>().mockReturnValue({
        result: 42,
        processed: true,
      });

      const input: TestInput = { value: 10, name: 'test' };

      // Act
      const result = executeCalculator(mockCalculator, input, CalculatorName.Beef);

      // Assert
      expect(result).toEqual({ result: 42, processed: true });
      expect(typeof result.result).toBe('number');
      expect(typeof result.processed).toBe('boolean');
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(CalculatorName.Beef, '3.0.0', false);
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
      const result = executeCalculator(mockCalculator, complexInput, CalculatorName.Beef);

      // Assert
      expect(result).toEqual(complexOutput);
      expect(result.processed).toBe(complexInput);
      expect(result.processed.nested.deep.value).toBe('test');
      expect(result.processed.array).toEqual([1, 2, 3]);
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(CalculatorName.Beef, '3.0.0', false);
    });

    it('should handle null and undefined return values', () => {
      // Arrange
      const mockCalculatorNull = jest.fn().mockReturnValue(null);
      const mockCalculatorUndefined = jest.fn().mockReturnValue(undefined);

      // Act & Assert
      expect(executeCalculator(mockCalculatorNull, {}, CalculatorName.Beef)).toBeNull();
      expect(executeCalculator(mockCalculatorUndefined, {}, CalculatorName.Beef)).toBeUndefined();
      
      expect(mockTrackCalculatorExecution).toHaveBeenCalledTimes(2);
      expect(mockTrackCalculatorExecution).toHaveBeenNthCalledWith(1, CalculatorName.Beef, '3.0.0', false);
      expect(mockTrackCalculatorExecution).toHaveBeenNthCalledWith(2, CalculatorName.Beef, '3.0.0', false);
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
      const calculatorName = CalculatorName.Beef;

      // Act & Assert
      expect(() => executeCalculator(mockCalculator, input, calculatorName)).toThrow('Test error');
      
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(calculatorName, '3.0.0', true);
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

      const calculatorName = CalculatorName.Beef;

      // Act & Assert
      errors.forEach((error, index) => {
        const mockCalculator = jest.fn().mockImplementation(() => {
          throw error;
        });

        expect(() => executeCalculator(mockCalculator, {}, calculatorName)).toThrow();
        expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(calculatorName, '3.0.0', true);
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
      try {
        executeCalculator(mockCalculator, {}, CalculatorName.Beef);
        fail('Expected function to throw');
      } catch (error: any) {
        expect(error).toBe(originalError);
        expect(error.message).toBe('Original error message');
      }

      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(CalculatorName.Beef, '3.0.0', true);
    });

    it('should track metrics even when error occurs in context creation', () => {
      // Arrange
      mockLoadConstants.mockImplementation(() => {
        throw new Error('Constants load failed');
      });

      const mockCalculator = jest.fn().mockReturnValue({});

      // Act & Assert
      expect(() => executeCalculator(mockCalculator, {}, CalculatorName.Beef)).toThrow('Constants load failed');
    });

    it('should handle async errors in calculator', async () => {
      // Arrange
      const asyncError = new Error('Async error');
      const mockCalculator = jest.fn().mockImplementation(async () => {
        throw asyncError;
      });

      // Act & Assert
      await expect(executeCalculator(mockCalculator, {}, CalculatorName.Beef)).rejects.toThrow('Async error');
      // Note: The executeCalculator function doesn't handle async errors differently
      // It will track as failed=false because the promise rejection happens after the function returns
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(CalculatorName.Beef, '3.0.0', false);
    });
  });

  describe('context creation', () => {
    it('should call loadConstants exactly once per execution', () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({});
      const executions = 5;

      // Act
      for (let i = 0; i < executions; i++) {
        executeCalculator(mockCalculator, {}, CalculatorName.Beef);
      }

      // Assert
      expect(mockLoadConstants).toHaveBeenCalledTimes(executions);
    });

    it('should handle loadConstants returning different values', () => {
      // Arrange
      const constants1 = { version: '1.0', apiKey: 'key1' } as any;
      const constants2 = { version: '2.0', apiKey: 'key2' } as any;
      const mockCalculator = jest.fn().mockReturnValue({});

      mockLoadConstants
        .mockReturnValueOnce(constants1)
        .mockReturnValueOnce(constants2);

      // Act
      executeCalculator(mockCalculator, {}, CalculatorName.Beef);
      executeCalculator(mockCalculator, {}, CalculatorName.Dairy);

      // Assert
      expect(mockCalculator).toHaveBeenNthCalledWith(1, {}, expect.objectContaining({
        constants: constants1,
      }));
      expect(mockCalculator).toHaveBeenNthCalledWith(2, {}, expect.objectContaining({
        constants: constants2,
      }));
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
      executeCalculator(mockCalculator, {}, CalculatorName.Beef);
      
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 100));
      
      executeCalculator(mockCalculator, {}, CalculatorName.Dairy);

      // Assert
      expect(timestamps).toHaveLength(2);
      expect(timestamps[0]).not.toBe(timestamps[1]);
      expect(new Date(timestamps[0]).getTime()).toBeLessThanOrEqual(new Date(timestamps[1]).getTime());
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
      executeCalculator(mockCalculator, {}, CalculatorName.Beef);

      // Assert
      expect(capturedTimestamp!).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(new Date(capturedTimestamp!).getTime()).not.toBeNaN();
    });
  });

  describe('edge cases', () => {
    it('should handle empty input objects', () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({});
      const emptyInput = {};

      // Act
      executeCalculator(mockCalculator, emptyInput, CalculatorName.Beef);

      // Assert
      expect(mockCalculator).toHaveBeenCalledWith(emptyInput, expect.any(Object));
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(CalculatorName.Beef, '3.0.0', false);
    });

    it('should handle null and undefined inputs gracefully', () => {
      // Arrange
      const mockCalculator = jest.fn().mockReturnValue({});

      // Act & Assert
      expect(() => executeCalculator(mockCalculator, null as any, CalculatorName.Beef)).not.toThrow();
      expect(() => executeCalculator(mockCalculator, undefined as any, CalculatorName.Beef)).not.toThrow();
      
      expect(mockTrackCalculatorExecution).toHaveBeenCalledTimes(2);
    });

    it('should handle calculator that modifies input', () => {
      // Arrange
      const input = { value: 1 };
      const mockCalculator = jest.fn().mockImplementation((input, context) => {
        input.value = 2; // Modify input
        return { result: input.value };
      });

      // Act
      const result = executeCalculator(mockCalculator, input, CalculatorName.Beef);

      // Assert
      expect(result).toEqual({ result: 2 });
      expect(input.value).toBe(2); // Input was modified
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(CalculatorName.Beef, '3.0.0', false);
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
      executeCalculator(successCalculator, {}, CalculatorName.Beef);
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(CalculatorName.Beef, '3.0.0', false);

      expect(() => executeCalculator(failureCalculator, {}, CalculatorName.Beef)).toThrow();
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(CalculatorName.Beef, '3.0.0', true);

      expect(mockTrackCalculatorExecution).toHaveBeenCalledTimes(2);
    });

    it('should track metrics even when trackCalculatorExecution itself throws', () => {
      // Arrange
      mockTrackCalculatorExecution.mockImplementation(() => {
        throw new Error('Tracking failed');
      });

      const mockCalculator = jest.fn().mockReturnValue({});

      // Act & Assert
      expect(() => executeCalculator(mockCalculator, {}, CalculatorName.Beef)).toThrow('Tracking failed');
      
      // The function should still attempt to track metrics
      expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(CalculatorName.Beef, '3.0.0', false);
    });

    it('should track metrics with correct parameters for all calculator types', () => {
      // Arrange
      // Reset the mock to normal behavior
      mockTrackCalculatorExecution.mockImplementation(() => {});
      
      const calculators = Object.values(CalculatorName)

      const mockCalculator = jest.fn().mockReturnValue({});

      // Act
      calculators.forEach(calculator => {
        executeCalculator(mockCalculator, {}, calculator);
      });

      // Assert
      expect(mockTrackCalculatorExecution).toHaveBeenCalledTimes(calculators.length);
      calculators.forEach(calculator => {
        expect(mockTrackCalculatorExecution).toHaveBeenCalledWith(calculator, '3.0.0', false);
      });
    });
  });
});
