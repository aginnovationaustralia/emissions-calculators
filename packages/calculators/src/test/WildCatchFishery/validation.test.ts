import { WildCatchFisheryInputSchema } from '@/types/WildCatchFishery/input';
import { validateCalculatorInput } from '../../calculators/validate';
import { wildCatchFisheryTestData } from './input.data';

describe('validating WildCatchFishery test inputs, all types of inputs', () => {
  describe('when the input is valid', () => {
    test('validation should result in no errors', () => {
      const t = validateCalculatorInput(
        WildCatchFisheryInputSchema,
        wildCatchFisheryTestData,
      );

      expect(t.valid).toBe(true);
    });

    test('validation should allow optional keys to be omitted', () => {
      const validTestData = {
        ...wildCatchFisheryTestData,
        enterprises: [
          {
            ...wildCatchFisheryTestData.enterprises[0],
            bait: [
              {
                ...wildCatchFisheryTestData.enterprises[0].bait[0],
                emissionsIntensity: undefined,
              },
            ],
          },
        ],
      };

      const t = validateCalculatorInput(
        WildCatchFisheryInputSchema,
        validTestData,
      );

      expect(t.valid).toBe(true);
    });
  });

  describe('when the input is invalid', () => {
    test('validation should result in errors', () => {
      const invalidTestData = {
        ...wildCatchFisheryTestData,
        enterprises: [
          {
            ...wildCatchFisheryTestData.enterprises[0],
            bait: [
              {
                ...wildCatchFisheryTestData.enterprises[0].bait[0],
                purchasedTonnes: undefined,
              },
            ],
          },
        ],
      };
      const t = validateCalculatorInput(
        WildCatchFisheryInputSchema,
        invalidTestData,
      );
      expect(t).toEqual(
        expect.objectContaining({
          valid: false,
          issues: expect.any(Array),
        }),
      );
    });
  });
});
