import { GoatInputSchema } from '@/types/Goat/input';
import {
  InputValidationError,
  validateCalculatorInput,
} from '../../calculators/validate';
import { goatComplete } from './goats.data';
import { veg1, veg2 } from './vegetation.data';

describe('GoatInputSchema vegetation transformation', () => {
  describe('validating Goat test input using original veg schema', () => {
    const input = {
      state: 'vic',
      northOfTropicOfCapricorn: false,
      rainfallAbove600: true,
      goats: [goatComplete],
      vegetation: [veg1, veg2],
    };

    test('validation should result in an error', () => {
      expect(validateCalculatorInput(GoatInputSchema, input)).toEqual(
        expect.objectContaining({
          valid: false,
          error: expect.any(InputValidationError),
        }),
      );
    });
  });

  describe('validating Goat test input using bad veg schema', () => {
    const input = {
      state: 'vic',
      northOfTropicOfCapricorn: false,
      rainfallAbove600: true,
      goats: [goatComplete],
      vegetation: [veg1, veg2, { random: 'a' }],
    };

    test('validation should generate an error for invalid input', () => {
      expect(validateCalculatorInput(GoatInputSchema, input)).toEqual(
        expect.objectContaining({
          valid: false,
          error: expect.any(InputValidationError),
        }),
      );
    });
  });
});
