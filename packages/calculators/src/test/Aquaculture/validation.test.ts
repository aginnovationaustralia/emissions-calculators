import { AquacultureInputSchema } from '@/types/Aquaculture/input';
import { InputValidationError } from '../..';
import { validateCalculatorInput } from '../../calculators/validate';
import { aquacultureTestData } from './input.data';

describe('validating Aquaculture test inputs, all types of inputs', () => {
  describe('when the input is valid', () => {
    test('validation should result in no errors', () => {
      const t = () =>
        validateCalculatorInput(AquacultureInputSchema, aquacultureTestData);

      expect(t).not.toThrow();
      expect(t).not.toThrow(InputValidationError);
    });

    test('validation should allow optional keys to be omitted', () => {
      const validTestData = {
        ...aquacultureTestData,
        enterprises: [
          {
            ...aquacultureTestData.enterprises[0],
            bait: [
              {
                ...aquacultureTestData.enterprises[0].bait[0],
                emissionsIntensity: undefined,
              },
            ],
          },
        ],
      };

      const t = () =>
        validateCalculatorInput(AquacultureInputSchema, validTestData);

      expect(t).not.toThrow(InputValidationError);
    });
  });

  describe('when the input is invalid', () => {
    test('validation should result in errors', () => {
      const invalidTestData = {
        ...aquacultureTestData,
        enterprises: [
          {
            ...aquacultureTestData.enterprises[0],
            bait: [
              {
                ...aquacultureTestData.enterprises[0].bait[0],
                purchasedTonnes: undefined,
              },
            ],
          },
        ],
      };
      const t = () =>
        validateCalculatorInput(AquacultureInputSchema, invalidTestData);
      expect(t).toThrow(InputValidationError);
    });
  });
});
