import { SheepInput } from '../../types/Sheep/input';
import { lambingScenarioInput, sheepTestInput } from './sheep.data';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

export const sheepTestData: SheepInput = {
  sheep: [sheepTestInput],
  state: 'vic',
  vegetation: [veg1, veg2, veg3, veg4],
  northOfTropicOfCapricorn: false,
  rainfallAbove600: true,
};

export const lambingRatesTestData: SheepInput = {
  sheep: [lambingScenarioInput],
  state: 'vic',
  vegetation: [],
  northOfTropicOfCapricorn: false,
  rainfallAbove600: false,
};
