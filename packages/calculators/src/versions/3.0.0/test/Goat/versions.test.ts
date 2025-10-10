import { validateCalculatorInput } from '../../calculators';
import { GoatInputSchema } from '../../types/Goat/input';
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

    const validatedInput = validateCalculatorInput(GoatInputSchema, input);

    test('validation should result in no errors', () => {
      expect(validatedInput).toBeDefined();
    });

    test('should have goat proportion', () => {
      expect(validatedInput.vegetation[0].goatProportion).toBeCloseTo(1.0);
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

    const validatedInput = validateCalculatorInput(GoatInputSchema, input);

    test('validation should throw error for invalid input', () => {
      expect(() => validateCalculatorInput(GoatInputSchema, input)).toThrow();
    });
  });
});
