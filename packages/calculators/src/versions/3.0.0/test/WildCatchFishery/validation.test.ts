import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { WildCatchFisheryInput } from '../../types/WildCatchFishery/input';
import { wildCatchFisheryTestData } from './input.data';

describe('validating WildCatchFishery test inputs, all types of inputs', () => {
  describe('when the input is valid', () => {
    test('validation should result in no errors', () => {
      const t = () =>
        validateCalculatorInput(
          WildCatchFisheryInput,
          wildCatchFisheryTestData,
        );

      expect(t).not.toThrow();
      expect(t).not.toThrowError(InputValidationError);
      expect(t()).toBeInstanceOf(WildCatchFisheryInput);
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
        validateCalculatorInput(WildCatchFisheryInput, validTestData);

      expect(t).not.toThrowError(InputValidationError);
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
        validateCalculatorInput(WildCatchFisheryInput, invalidTestData);
      expect(t).toThrowError(InputValidationError);
    });
  });
});
