import { HasCommonConstants } from '../../common/constants';
import { AllConstants } from '../../constants/versionedConstants';
import { ExecutionContext } from '../../executionContext';
import { testContext, V2_0_0 } from './context';
import { executeEmissionsSpec } from './emissions';

type EmissionsKeysOnly = {
  net: {
    total: number;
  };
};

type Emissions<
  TKey extends string = 'intermediate',
  TIntermediate extends EmissionsKeysOnly = EmissionsKeysOnly,
> = EmissionsKeysOnly & {
  [K in TKey]: TIntermediate[];
};

type CompareEmissionsOptions<
  TIntermediate extends EmissionsKeysOnly = EmissionsKeysOnly,
  TKey extends string = 'intermediate',
  E extends Emissions<TKey, TIntermediate> = Emissions<TKey, TIntermediate>,
> = {
  intermediateKeyName?: TKey;
  transformIntermediate?: (
    intermediate: TIntermediate,
  ) => Omit<E, TKey | 'net' | 'purchasedOffsets' | 'intermediate'>;
};

/**
 * Compare full and intermediate emissions for a calculator. The tests applied will make sure:
 * 1. When there is a single activity, the intermediate emissions match the top level emissions
 * 2. When there are 2 activities, the emissions match the sum of the 2 activities by themselves
 * 3. The differences between the original and second activity emissions are as expected
 *
 * For cases where emissions shape follow standard patterns, you should not need to supply explicit
 * generic type parameters. When supplying a transformIntermediate function, you will generally need
 * to supply the generic type parameters.
 *
 * @param calculatorName - The name of the calculator
 * @param calculateEmissions - The function to calculate the emissions
 * @param originalInput - An initial valid input with an activity
 * @param secondInput - An input with an activity modified in a predictable way ie 2x the yield
 * @param combinedInput - The input with both activities attached
 * @param expectOriginalVsSecond - Apply any reliable comparisons between the 2 emissions results
 * @param options - Optional configuration for intermediate emissions comparison
 * @param options.intermediateKeyName - Supply an alternate key name for intermediate emissions
 * @param options.transformIntermediate - Transform the shape of intermediate emissions before
 *   comparing them to the top level emissions object
 */
export const compareEmissionsFrom2Inputs = <
  Input,
  TIntermediate extends EmissionsKeysOnly = EmissionsKeysOnly,
  TKey extends string = 'intermediate',
  E extends Emissions<TKey, TIntermediate> = Emissions<TKey, TIntermediate>,
  C extends Partial<AllConstants> & HasCommonConstants = Partial<AllConstants> &
    HasCommonConstants,
>(
  calculatorName: string,
  calculateEmissions: (input: Input, context: ExecutionContext<C>) => E,
  originalInput: Input,
  secondInput: Input,
  combinedInput: Input,
  expectOriginalVsSecond: (originalEmissions: E, secondEmissions: E) => void,
  options: CompareEmissionsOptions<TIntermediate, TKey, E> = {},
) => {
  const {
    intermediateKeyName = 'intermediate' as TKey,
    transformIntermediate,
  } = options;

  describe(`Compare full and intermediate emissions: ${calculatorName}`, () => {
    // As we're using executeEmissionsSpec we can't be inside a test, or rely on a beforeAll etc
    const context = testContext(V2_0_0, calculatorName) as ExecutionContext<C>;
    const originalEmissions = calculateEmissions(originalInput, context);
    const secondEmissions = calculateEmissions(secondInput, context);
    const combinedEmissions = calculateEmissions(combinedInput, context);

    // Check the first activity in the original emissions matches the intermediate emissions
    describe('single original activity should match intermediate emissions', () => {
      const originalIntermediate = originalEmissions[intermediateKeyName][0];
      const expectations = transformIntermediate
        ? transformIntermediate(originalIntermediate)
        : originalEmissions;
      executeEmissionsSpec(V2_0_0, originalEmissions, expectations);
    });

    // Check the second activity in the second emissions matches the intermediate emissions
    describe('single second activity should match intermediate emissions', () => {
      const secondIntermediate = secondEmissions[intermediateKeyName][0];
      const expectations = transformIntermediate
        ? transformIntermediate(secondIntermediate)
        : secondEmissions;
      executeEmissionsSpec(V2_0_0, secondEmissions, expectations);
    });

    // Check the combined emissions match the sum of the original and second emissions
    it('combined emissions should match sum of original and second emissions', () => {
      expect(combinedEmissions.net.total).toBeCloseTo(
        originalEmissions.net.total + secondEmissions.net.total,
        7,
      );
      expect(combinedEmissions[intermediateKeyName]).toHaveLength(2);
    });

    // Check the differences between the original and second emissions
    // eslint-disable-next-line jest/expect-expect
    it('check differences between original vs second emissions', () => {
      expectOriginalVsSecond(originalEmissions, secondEmissions);
    });
  });
};

export const transformCarbonSequestration = <
  TIntermediate extends EmissionsKeysOnly & { carbonSequestration: number },
>(
  intermediate: TIntermediate,
) => ({
  ...intermediate,
  carbonSequestration: {
    total: intermediate.carbonSequestration,
    intermediate: [],
  },
});

export const transformIntensitiesWithSequestration = <
  TIntermediate extends EmissionsKeysOnly & {
    intensitiesWithSequestration: Record<string, number>;
  },
>(
  intermediate: TIntermediate,
) => {
  const { intensitiesWithSequestration, ...rest } = intermediate;
  return {
    ...rest,
    intensitiesWithSequestration: [intensitiesWithSequestration],
  };
};
