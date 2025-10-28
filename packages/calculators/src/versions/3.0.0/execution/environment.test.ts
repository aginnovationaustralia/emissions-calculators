import { CalculationEnvironment, ConstantOverrides } from './environment';

describe('CalculationEnvironment', () => {
  describe('run', () => {
    it('should run callback with parameters in async context', () => {
      const mockParameters = {
        overrides: { SHEEP: { FEEDAVAILABILITY: { spring: { nsw: 2.5 } } } },
        organisation: 'test-org',
      };

      let capturedOverrides: unknown;
      let capturedOrganisation: unknown;

      const result = CalculationEnvironment.run(mockParameters, () => {
        // Capture values from within the async context
        capturedOverrides = CalculationEnvironment.getOverrides();
        capturedOrganisation = CalculationEnvironment.getOrganisation();

        return 'callback-result';
      });

      expect(result).toBe('callback-result');
      expect(capturedOverrides).toEqual({
        SHEEP_FEEDAVAILABILITY: { spring: { nsw: 2.5 } },
      });
      expect(capturedOrganisation).toBe('test-org');
    });

    it('should handle nested async contexts correctly', () => {
      const outerParameters = {
        overrides: { SHEEP: { FEEDAVAILABILITY: { spring: { nsw: 2.5 } } } },
        organisation: 'outer-org',
      };

      const innerParameters = {
        overrides: {
          SHEEP: {
            FEEDAVAILABILITY: {
              spring: { nsw: 3.0 },
              summer: { nsw: 0.8 },
            },
          },
        },
        organisation: 'inner-org',
      };

      let outerOverrides: unknown;
      let outerOrganisation: unknown;
      let innerOverrides: unknown;
      let innerOrganisation: unknown;

      const result = CalculationEnvironment.run(outerParameters, () => {
        // Capture outer context values
        outerOverrides = CalculationEnvironment.getOverrides();
        outerOrganisation = CalculationEnvironment.getOrganisation();

        // Create nested context
        return CalculationEnvironment.run(innerParameters, () => {
          // Capture inner context values
          innerOverrides = CalculationEnvironment.getOverrides();
          innerOrganisation = CalculationEnvironment.getOrganisation();

          return 'nested-result';
        });
      });

      expect(result).toBe('nested-result');

      // Verify outer context
      expect(outerOverrides).toEqual({
        SHEEP_FEEDAVAILABILITY: { spring: { nsw: 2.5 } },
      });
      expect(outerOrganisation).toBe('outer-org');

      // Verify inner context
      expect(innerOverrides).toEqual({
        SHEEP_FEEDAVAILABILITY: { spring: { nsw: 3.0 }, summer: { nsw: 0.8 } },
      });
      expect(innerOrganisation).toBe('inner-org');
    });

    it('should handle async operations correctly', async () => {
      const parameters = {
        overrides: { SHEEP: { FEEDAVAILABILITY: { spring: { nsw: 3 } } } },
        organisation: 'async-org',
      };

      let beforeDelayOverrides: unknown;
      let beforeDelayOrganisation: unknown;
      let afterDelayOverrides: unknown;
      let afterDelayOrganisation: unknown;

      const promise = CalculationEnvironment.run(parameters, async () => {
        // Capture values before async delay
        beforeDelayOverrides = CalculationEnvironment.getOverrides();
        beforeDelayOrganisation = CalculationEnvironment.getOrganisation();

        // Simulate async work
        await new Promise((resolve) => setTimeout(resolve, 10));

        // Capture values after async delay (should still be available)
        afterDelayOverrides = CalculationEnvironment.getOverrides();
        afterDelayOrganisation = CalculationEnvironment.getOrganisation();

        return 'async-result';
      });

      const result = await promise;

      expect(result).toBe('async-result');

      // Values should be consistent before and after async delay
      expect(beforeDelayOverrides).toEqual({
        SHEEP_FEEDAVAILABILITY: { spring: { nsw: 3 } },
      });
      expect(afterDelayOverrides).toEqual({
        SHEEP_FEEDAVAILABILITY: { spring: { nsw: 3 } },
      });
      expect(beforeDelayOrganisation).toBe('async-org');
      expect(afterDelayOrganisation).toBe('async-org');
    });

    it('should handle promise returns correctly', async () => {
      const parameters = {
        overrides: { SHEEP: { FEEDAVAILABILITY: { spring: { nsw: 1.2 } } } },
        organisation: 'promise-org',
      };

      const result = await CalculationEnvironment.run(parameters, () => {
        const capturedOverrides = CalculationEnvironment.getOverrides();
        const capturedOrganisation = CalculationEnvironment.getOrganisation();

        return Promise.resolve({
          success: true,
          overrides: capturedOverrides,
          organisation: capturedOrganisation,
        });
      });

      expect(result).toEqual({
        success: true,
        overrides: { SHEEP_FEEDAVAILABILITY: { spring: { nsw: 1.2 } } },
        organisation: 'promise-org',
      });
    });

    it('should handle errors and maintain context', () => {
      const parameters = {
        overrides: { SHEEP: { FEEDAVAILABILITY: { spring: { nsw: 4.5 } } } },
        organisation: 'error-org',
      };

      let overridesInErrorContext: unknown;
      let organisationInErrorContext: unknown;

      expect(() => {
        CalculationEnvironment.run(parameters, () => {
          // Capture values before throwing error
          overridesInErrorContext = CalculationEnvironment.getOverrides();
          organisationInErrorContext = CalculationEnvironment.getOrganisation();

          throw new Error('Test error');
        });
      }).toThrow('Test error');

      // Context should still be available even when error occurred within it
      expect(overridesInErrorContext).toEqual({
        SHEEP_FEEDAVAILABILITY: { spring: { nsw: 4.5 } },
      });
      expect(organisationInErrorContext).toBe('error-org');
    });
  });

  describe('getOverrides', () => {
    it('should return overrides when in async context', () => {
      const mockOverrides = {
        SHEEP: {
          FEEDAVAILABILITY: {
            spring: { nsw: 0.6 },
            summer: { nsw: 0.65 },
          },
        },
      };

      let capturedOverrides: unknown;

      CalculationEnvironment.run({ overrides: mockOverrides }, () => {
        capturedOverrides = CalculationEnvironment.getOverrides()!;
      });

      expect(capturedOverrides).toEqual(mockOverrides);
    });

    it('should return undefined when not in async context', () => {
      const result = CalculationEnvironment.getOverrides();
      expect(result).toBeUndefined();
      expect(typeof result).toBe('undefined');
    });
  });

  describe('getOrganisation', () => {
    it('should return organisation from async context when available', () => {
      const organisation = 'context-org';

      let capturedOrganisation: unknown;

      CalculationEnvironment.run({ organisation }, () => {
        capturedOrganisation = CalculationEnvironment.getOrganisation();
      });

      expect(capturedOrganisation).toBe(organisation);
    });

    it('should return undefined when no organisation is set', () => {
      const result = CalculationEnvironment.getOrganisation();

      expect(result).toBeUndefined();
    });
  });

  describe('types', () => {
    it('should properly type ConstantOverrides', () => {
      const testOverrides: ConstantOverrides = {
        SHEEP: {
          FEEDAVAILABILITY: {
            spring: { nsw: 2.7 },
            summer: { nsw: 3 },
            autumn: { nsw: 2.5 },
          },
        },
      };

      let capturedOverrides: ConstantOverrides | undefined;

      CalculationEnvironment.run({ overrides: testOverrides }, () => {
        capturedOverrides = CalculationEnvironment.getOverrides();
      });

      expect(capturedOverrides).toBeDefined();
      expect(capturedOverrides?.SHEEP?.FEEDAVAILABILITY?.spring?.nsw).toBe(2.7);
      expect(capturedOverrides?.SHEEP?.FEEDAVAILABILITY?.summer?.nsw).toBe(3);
      expect(capturedOverrides?.SHEEP?.FEEDAVAILABILITY?.autumn?.nsw).toBe(2.5);
    });

    it('should handle empty overrides object', () => {
      const emptyOverrides: ConstantOverrides = {};

      let capturedOverrides: unknown;

      CalculationEnvironment.run({ overrides: emptyOverrides }, () => {
        capturedOverrides = CalculationEnvironment.getOverrides();
      });

      expect(capturedOverrides).toEqual({});
      expect(typeof capturedOverrides).toBe('object');
    });
  });

  describe('isolation', () => {
    it('should isolate contexts between different executions', () => {
      const context1 = {
        overrides: { SHEEP: { FEEDAVAILABILITY: { spring: { nsw: 2.5 } } } },
        organisation: 'org-1',
      };

      const context2 = {
        overrides: { SHEEP: { FEEDAVAILABILITY: { summer: { nsw: 0.6 } } } },
        organisation: 'org-2',
      };

      let context1Result: unknown;
      let context2Result: unknown;

      // First context
      CalculationEnvironment.run(context1, () => {
        context1Result = CalculationEnvironment.getOverrides();
      });

      // Second context (should be isolated)
      CalculationEnvironment.run(context2, () => {
        context2Result = CalculationEnvironment.getOverrides();
      });

      expect(context1Result).toEqual({
        SHEEP_FEEDAVAILABILITY: { spring: { nsw: 2.5 } },
      });
      expect(context2Result).toEqual({
        SHEEP_FEEDAVAILABILITY: { summer: { nsw: 0.6 } },
      });
      expect(context1Result).not.toEqual(context2Result);
    });
  });
});
