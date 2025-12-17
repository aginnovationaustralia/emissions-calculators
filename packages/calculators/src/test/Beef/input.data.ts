import { BeefInput } from '@/types/Beef/input';
import { beefTestInput } from './beef.data';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

export const beefTestData: BeefInput = {
  beef: [beefTestInput],
  burning: [
    {
      burning: {
        fireScarArea: 100,
        yearsSinceLastFire: 3,
        season: 'late dry season',
        rainfallZone: 'low',
        fuel: 'coarse',
        vegetation: 'Open woodland with mixed grass',
        patchiness: 'low',
      },
      allocationToBeef: [1],
    },
  ],
  state: 'vic',
  vegetation: [veg1, veg2, veg3, veg4],
  northOfTropicOfCapricorn: false,
  rainfallAbove600: true,
};
