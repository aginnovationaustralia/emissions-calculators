import { SheepBeefInput } from '../../types/SheepBeef/input';
import { beefTestInput } from '../Beef/beef.data';
import { sheepTestInput } from '../Sheep/sheep.data';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

export const sheepbeefTestData: SheepBeefInput = {
  beef: [beefTestInput],
  sheep: [sheepTestInput],
  burning: [
    {
      fireScarArea: 100,
      yearsSinceLastFire: 3,
      season: 'late dry season',
      rainfallZone: 'low',
      fuel: 'coarse',
      vegetation: 'Open woodland with mixed grass',
      patchiness: 'low',
    },
  ],
  state: 'vic',
  vegetation: [veg1, veg2, veg3, veg4],
  northOfTropicOfCapricorn: false,
  rainfallAbove600: true,
};
