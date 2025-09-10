import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { calculateSheepBeef } from '../../SheepBeef/calculator';
import { BeefComplete } from '../../types/Beef/beef.input';
import { beefTestInput } from '../Beef/beef.data';
import { testContext, V2_0_0 } from '../common/context';
import { sheepTestInput } from '../Sheep/sheep.data';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

describe('checking SheefBeef purchases as array', () => {
  // deep copy
  const beefInput = JSON.parse(JSON.stringify(beefTestInput));

  const classesKeys = Object.keys(
    beefInput.classes,
  ) as (keyof typeof beefInput.classes)[];

  classesKeys.forEach((key) => {
    beefInput.classes[key].purchases = [
      {
        head: beefInput.classes[key].headPurchased ?? 0,
        purchaseWeight: beefInput.classes[key].purchasedWeight ?? 0,
        purchaseSource: beefInput.classes[key].source ?? 'Dairy origin',
      },
      {
        head: beefInput.classes[key].headPurchased ?? 0,
        purchaseWeight: beefInput.classes[key].purchasedWeight ?? 0,
        purchaseSource: beefInput.classes[key].source ?? 'Dairy origin',
      },
    ];
  });

  const context = testContext(V2_0_0, 'SheepBeef');

  const emissions = calculateSheepBeef(
    {
      state: 'vic',
      northOfTropicOfCapricorn: false,
      rainfallAbove600: true,
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
      vegetation: [veg1, veg2, veg3, veg4],
    },
    context,
  );

  const emissionsPurchaseArray = calculateSheepBeef(
    {
      state: 'vic',
      northOfTropicOfCapricorn: false,
      rainfallAbove600: true,
      beef: [beefInput],
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
      vegetation: [veg1, veg2, veg3, veg4],
    },
    context,
  );

  test('scope 3 beef purchasedLivestock should be accurate and double', () => {
    expect(
      emissionsPurchaseArray.intermediate.beef.scope3.purchasedLivestock,
    ).toBeCloseTo(emissions.intermediate.beef.scope3.purchasedLivestock * 2);
  });
});

describe('checking SheefBeef purchases as array validation', () => {
  // deep copy
  const beefInput = JSON.parse(JSON.stringify(beefTestInput));

  const classesKeys = Object.keys(
    beefInput.classes,
  ) as (keyof typeof beefInput.classes)[];

  classesKeys.forEach((key) => {
    beefInput.classes[key].purchases = [
      {
        head: beefInput.classes[key].headPurchased ?? 0,
        purchaseWeight: beefInput.classes[key].purchasedWeight ?? 0,
        purchaseSource: beefInput.classes[key].source ?? 'Dairy origin',
      },
      {
        head: beefInput.classes[key].headPurchased ?? 0,
        purchaseWeight: beefInput.classes[key].purchasedWeight ?? 0,
        purchaseSource: beefInput.classes[key].source ?? 'Dairy origin',
      },
    ];

    beefInput.classes[key] = JSON.parse(JSON.stringify(beefInput.classes[key]));

    delete beefInput.classes[key].headPurchased;
    delete beefInput.classes[key].purchasedWeight;
    delete beefInput.classes[key].source;
  });

  const classedInput = plainToClass(BeefComplete, beefInput);
  const errors = validateSync(classedInput);

  test('validation should result in no errors', () => {
    expect(errors.length).toBe(0);
  });
});
