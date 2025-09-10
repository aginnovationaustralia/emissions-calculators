import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { GoatInput } from '../../types/Goat/input';
import { goatComplete } from './goats.data';
import { veg1, veg2 } from './vegetation.data';

describe('GoatInput vegetation transformation', () => {
  describe('validating Goat test input using original veg schema', () => {
    const input = {
      state: 'vic',
      northOfTropicOfCapricorn: false,
      rainfallAbove600: true,
      goats: [goatComplete],
      vegetation: [veg1, veg2],
    };

    const classedInput = plainToClass(GoatInput, input);
    const errors = validateSync(classedInput);

    test('validation should result in no errors', () => {
      expect(errors).toEqual([]);
    });

    test('should have goat proportion', () => {
      expect(classedInput.vegetation[0].goatProportion).toBeCloseTo(1.0);
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

    const classedInput = plainToClass(GoatInput, input);
    const errors = validateSync(classedInput);

    test('validation should result in one error', () => {
      expect(errors.length).toEqual(1);
    });
  });
});
