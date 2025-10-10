import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { WildCatchFisheryInputSchema } from '../../types/WildCatchFishery/input';
import { wildCatchFisheryTestData } from './input.data';

describe('validating WildCatchFishery test inputs, all types of inputs', () => {
  describe('when the input is valid', () => {
    test('validation should result in no errors', () => {
      const t = () =>
        validateCalculatorInput(
          WildCatchFisheryInputSchema,
          wildCatchFisheryTestData,
        );

      expect(t).not.toThrow();
      expect(t).not.toThrow(InputValidationError);
      expect(t()).toBeInstanceOf(WildCatchFisheryInputSchema);
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

      const t = () =>
        validateCalculatorInput(WildCatchFisheryInputSchema, validTestData);

      expect(t).not.toThrow(InputValidationError);
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
      const t = () =>
        validateCalculatorInput(WildCatchFisheryInputSchema, invalidTestData);
      expect(t).toThrow(InputValidationError);
    });
  });
});
