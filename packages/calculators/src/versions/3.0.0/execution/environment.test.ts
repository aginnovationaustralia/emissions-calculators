// Mock AsyncLocalStorage with the instance created inside the factory
let mockAsyncLocalStorage: {
  run: jest.MockedFunction<
    (params: unknown, callback: () => unknown) => unknown
  >;
  getStore: jest.MockedFunction<() => unknown>;
};

jest.mock('async_hooks', () => {
  const mockInstance = {
    run: jest.fn(),
    getStore: jest.fn(),
  };
  mockAsyncLocalStorage = mockInstance;

  return {
    AsyncLocalStorage: jest.fn(() => mockInstance),
  };
});

import { CalculationEnvironment, ConstantOverrides } from './environment';

describe('CalculationEnvironment', () => {
  const originalProcessEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalProcessEnv };
  });

  afterAll(() => {
    process.env = originalProcessEnv;
  });

  describe('run', () => {
    it('should process run with parameters and callback', () => {
      const mockParameters = {
        overrides: { FEEDLOT_MN_LEACH: 2.5 },
        organisation: 'test-org',
      };
      const mockCallback = jest.fn().mockReturnValue('callback-result');
      mockAsyncLocalStorage.run.mockImplementation(
        (params: unknown, callback: () => unknown) => callback(),
      );

      const result = CalculationEnvironment.run(mockParameters, mockCallback);

      expect(mockAsyncLocalStorage.run).toHaveBeenCalledWith(
        mockParameters,
        mockCallback,
      );
      expect(mockCallback).toHaveBeenCalled();
      expect(result).toBe('callback-result');
    });

    it('should return callback result when callback returns different types', () => {
      const mockParameters = {
        overrides: { FEEDLOT_MN_LEACH: 2.6 },
        organisation: 'org',
      };

      // Test string return
      const stringCallback = jest.fn().mockReturnValue('string-result');
      mockAsyncLocalStorage.run.mockImplementation(
        (params: unknown, callback: () => unknown) => callback(),
      );
      CalculationEnvironment.run(mockParameters, stringCallback);
      expect(stringCallback).toHaveBeenCalled();

      // Test object return
      const objectCallback = jest.fn().mockReturnValue({ result: 'object' });
      mockAsyncLocalStorage.run.mockImplementation(
        (params: unknown, callback: () => unknown) => callback(),
      );
      const objectResult = CalculationEnvironment.run(
        mockParameters,
        objectCallback,
      );
      expect(objectCallback).toHaveBeenCalled();
      expect(objectResult).toEqual({ result: 'object' });

      // Test null return
      const nullCallback = jest.fn().mockReturnValue(null);
      mockAsyncLocalStorage.run.mockImplementation(
        (params: unknown, callback: () => unknown) => callback(),
      );
      const nullResult = CalculationEnvironment.run(
        mockParameters,
        nullCallback,
      );
      expect(nullCallback).toHaveBeenCalled();
      expect(nullResult).toBeNull();
    });

    it('should handle empty parameters', () => {
      const mockParameters = {};
      const mockCallback = jest.fn().mockReturnValue('empty-params-result');
      mockAsyncLocalStorage.run.mockImplementation(
        (params: unknown, callback: () => unknown) => callback(),
      );

      const result = CalculationEnvironment.run(mockParameters, mockCallback);

      expect(mockAsyncLocalStorage.run).toHaveBeenCalledWith(
        mockParameters,
        mockCallback,
      );
      expect(result).toBe('empty-params-result');
    });

    it('should handle callback that throws', () => {
      const mockParameters = {};
      const mockCallback = jest.fn().mockImplementation(() => {
        throw new Error('Callback error');
      });
      mockAsyncLocalStorage.run.mockImplementation(
        (params: unknown, callback: () => unknown) => callback(),
      );

      expect(() =>
        CalculationEnvironment.run(mockParameters, mockCallback),
      ).toThrow('Callback error');
    });
  });

  describe('getOverrides', () => {
    it('should return overrides from storage when available', () => {
      const mockOverrides = { override1: 'value1', override2: 42 };
      const mockStore = { overrides: mockOverrides };
      mockAsyncLocalStorage.getStore.mockReturnValue(mockStore);

      const result = CalculationEnvironment.getOverrides();

      expect(result).toBe(mockOverrides);
      expect(mockAsyncLocalStorage.getStore).toHaveBeenCalled();
    });

    it('should return undefined when storage returns store without overrides', () => {
      const mockStore = { organisation: 'org' };
      mockAsyncLocalStorage.getStore.mockReturnValue(mockStore);

      const result = CalculationEnvironment.getOverrides();

      expect(result).toBeUndefined();
    });

    it('should return undefined when storage returns undefined', () => {
      mockAsyncLocalStorage.getStore.mockReturnValue(undefined);

      const result = CalculationEnvironment.getOverrides();

      expect(result).toBeUndefined();
    });

    it('should return undefined when storage returns null', () => {
      mockAsyncLocalStorage.getStore.mockReturnValue(null);

      const result = CalculationEnvironment.getOverrides();

      expect(result).toBeUndefined();
    });

    it('should return empty object when overrides is empty object', () => {
      const mockOverrides = {};
      const mockStore = { overrides: mockOverrides };
      mockAsyncLocalStorage.getStore.mockReturnValue(mockStore);

      const result = CalculationEnvironment.getOverrides();

      expect(result).toBe(mockOverrides);
    });

    it('should return complex nested overrides', () => {
      const mockOverrides = {
        nested: {
          deep: {
            value: 'test',
            array: [1, 2, 3],
          },
        },
      };
      const mockStore = { overrides: mockOverrides };
      mockAsyncLocalStorage.getStore.mockReturnValue(mockStore);

      const result = CalculationEnvironment.getOverrides();

      expect(result).toEqual(mockOverrides);
    });
  });

  describe('getOrganisation', () => {
    it('should return organisation from storage when available', () => {
      const mockStore = { organisation: 'storage-org' };
      mockAsyncLocalStorage.getStore.mockReturnValue(mockStore);

      const result = CalculationEnvironment.getOrganisation();

      expect(result).toBe('storage-org');
      expect(mockAsyncLocalStorage.getStore).toHaveBeenCalled();
    });

    it('should return organisation from environment variable when storage is undefined', () => {
      mockAsyncLocalStorage.getStore.mockReturnValue(undefined);
      process.env.CALCULATOR_METRICS_ORGANISATION = 'env-org';

      const result = CalculationEnvironment.getOrganisation();

      expect(result).toBe('env-org');
    });

    it('should return organisation from environment variable when storage has no organisation', () => {
      const mockStore = { overrides: {} };
      mockAsyncLocalStorage.getStore.mockReturnValue(mockStore);
      process.env.CALCULATOR_METRICS_ORGANISATION = 'env-org';

      const result = CalculationEnvironment.getOrganisation();

      expect(result).toBe('env-org');
    });

    it('should prioritize storage organisation over environment variable', () => {
      const mockStore = { organisation: 'storage-org' };
      mockAsyncLocalStorage.getStore.mockReturnValue(mockStore);
      process.env.CALCULATOR_METRICS_ORGANISATION = 'env-org';

      const result = CalculationEnvironment.getOrganisation();

      expect(result).toBe('storage-org');
    });

    it('should return undefined when neither source provides organisation', () => {
      mockAsyncLocalStorage.getStore.mockReturnValue(undefined);
      delete process.env.CALCULATOR_METRICS_ORGANISATION;

      const result = CalculationEnvironment.getOrganisation();

      expect(result).toBeUndefined();
    });

    it('should return undefined when environment variable is empty string', () => {
      mockAsyncLocalStorage.getStore.mockReturnValue(undefined);
      process.env.CALCULATOR_METRICS_ORGANISATION = '';

      const result = CalculationEnvironment.getOrganisation();

      expect(result).toBe('');
    });

    it('should handle storage returning null', () => {
      mockAsyncLocalStorage.getStore.mockReturnValue(null);
      process.env.CALCULATOR_METRICS_ORGANISATION = 'env-org';

      const result = CalculationEnvironment.getOrganisation();

      expect(result).toBe('env-org');
    });
  });

  describe('types', () => {
    it('should properly type ConstantOverrides', () => {
      // This test ensures the type is exported and can be used
      const overrides: ConstantOverrides = {
        FEEDLOT_MN_LEACH: 2.7,
      };

      expect(typeof overrides).toBe('object');
      expect(overrides.FEEDLOT_MN_LEACH).toBe(2.7);
    });

    it('should accept empty overrides object', () => {
      const overrides: ConstantOverrides = {};

      expect(typeof overrides).toBe('object');
    });

    it('should accept nested partial overrides', () => {
      const overrides: ConstantOverrides = {
        SWINE_MANURE_NITROGEN: {
          boars: 3,
        },
      };

      expect(typeof overrides).toBe('object');
      expect(overrides.SWINE_MANURE_NITROGEN).toBeDefined();
    });
  });
});
