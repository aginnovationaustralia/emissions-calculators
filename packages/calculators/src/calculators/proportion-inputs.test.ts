import { calculateCotton } from '@/calculators/Cotton';
import { CottonInput } from '@/calculators/Cotton/types/input';
import { calculateDairy } from '@/calculators/Dairy';
import { calculatePoultry } from '@/calculators/Poultry';
import { calculateSheep } from '@/calculators/Sheep';
import {
  createDairyHerdInput,
  createPoultryInput,
  createSheepFlockInput,
} from '@/modules/test/factory';
import {
  zeroFuel,
  zeroLime,
  zeroOrganicFertiliser,
  zeroPoultryMMS2Allocation,
} from '@/test/inputs/zero-input';
import { nv } from '@/tools/inputs';

const electricity = {
  method: 'location',
  electricityPurchasedKWh: nv(0),
  region: 'NSW',
} as const;

type CottonCrop = CottonInput['crops'][number];

const cottonInput = ({
  fractionSeedCottonLint = 0.4,
  ureaFractionOfFertiliser = 1,
}: {
  fractionSeedCottonLint?: number;
  ureaFractionOfFertiliser?: number;
}): CottonInput => {
  const crop: CottonCrop = {
    state: 'NSW',
    climateZone: 'Warm temperate dry',
    isInLeachingZone: false,
    electricityAllocation: nv(1),
    crop: {
      totalYieldKg: nv(3_000_000),
      fractionSeedCottonLint: nv(fractionSeedCottonLint),
      fractionOfAnnualCropBurnt: nv(0),
      residues: { calculationMethod: '1' },
    },
    fertiliser: {
      inorganic: {
        calculationMethodScope1: '1',
        applications: [
          {
            calculationMethodScope3: '1',
            fertiliserType: 'Urea',
            massAppliedKg: nv(1000),
            components: [
              {
                componentType: 'Urea',
                componentOrigin: 'China',
                fractionOfFertiliser: nv(ureaFractionOfFertiliser),
              },
            ],
          },
        ],
      },
      organic: zeroOrganicFertiliser,
    },
    chemicals: [],
    refrigerants: [],
    fuel: zeroFuel,
    services: { fuel: zeroFuel },
    lime: zeroLime,
    waste: {},
    otherPurchasedGoodsAndServices: [],
  };
  return { electricity, crops: [crop] };
};

const issuePaths = (result: { status: string; issues?: { path: string }[] }) =>
  result.status === 'INVALID_INPUT'
    ? (result.issues ?? []).map((issue) => issue.path)
    : [];

describe('Cotton fractionSeedCottonLint', () => {
  test.each([0, 0.4, 1])('accepts %p', (value) => {
    const result = calculateCotton(
      cottonInput({ fractionSeedCottonLint: value }),
    );
    expect(result.status).toBe('OK');
  });

  test.each([1.5, -0.2])('rejects %p with INVALID_INPUT', (value) => {
    const result = calculateCotton(
      cottonInput({ fractionSeedCottonLint: value }),
    );
    expect(result.status).toBe('INVALID_INPUT');
    expect(issuePaths(result)).toEqual([
      'crops.0.crop.fractionSeedCottonLint.value',
    ]);
  });
});

describe('Inorganic fertiliser known component fractionOfFertiliser', () => {
  test('accepts a fraction', () => {
    const result = calculateCotton(
      cottonInput({ ureaFractionOfFertiliser: 0.5 }),
    );
    expect(result.status).toBe('OK');
  });

  test.each([46, -0.1])('rejects %p with INVALID_INPUT', (value) => {
    const result = calculateCotton(
      cottonInput({ ureaFractionOfFertiliser: value }),
    );
    expect(result.status).toBe('INVALID_INPUT');
    expect(issuePaths(result)).toEqual([
      'crops.0.fertiliser.inorganic.applications.0.components.0.fractionOfFertiliser.value',
    ]);
  });
});

describe('Sheep method 2 dry matter digestibility and crude protein', () => {
  const sheepInput = (period: object) => ({
    electricity,
    isFebruaryInLeapYear: false,
    flocks: [
      createSheepFlockInput({
        classes: {
          period: 'seasonal',
          rams: {
            greasyWoolProduction: nv(5),
            cleanWoolYieldProportion: nv(0.6),
            spring: { head: nv(10), ...period },
            summer: { head: nv(10) },
            autumn: { head: nv(10) },
            winter: { head: nv(10) },
          },
        },
      }),
    ],
  });

  test('accepts fractions', () => {
    const result = calculateSheep(
      sheepInput({
        method2DryMatterDigestibility: nv(0.7),
        method2CrudeProteinContent: nv(0.15),
      }),
    );
    expect(result.status).toBe('OK');
  });

  test.each([
    ['method2DryMatterDigestibility', 1.5],
    ['method2DryMatterDigestibility', -0.2],
    ['method2CrudeProteinContent', 1.5],
    ['method2CrudeProteinContent', -0.2],
  ])('rejects %s of %p with INVALID_INPUT', (key, value) => {
    const result = calculateSheep(sheepInput({ [key]: nv(value) }));
    expect(result.status).toBe('INVALID_INPUT');
    expect(issuePaths(result)).toContain(
      `flocks.0.classes.rams.spring.${key}.value`,
    );
  });
});

describe('Dairy method 2 crude protein', () => {
  const dairyInput = (method2CrudeProtein: number) => ({
    electricity,
    herds: [
      createDairyHerdInput({
        milkProduction: { litresPerHeadPerDay: nv(20) },
        classes: {
          milkingCows: {
            head: nv(10),
            method2CrudeProtein: nv(method2CrudeProtein),
          },
        },
      }),
    ],
  });

  test('accepts a fraction', () => {
    expect(calculateDairy(dairyInput(0.2)).status).toBe('OK');
  });

  test.each([1.5, -0.2])('rejects %p with INVALID_INPUT', (value) => {
    const result = calculateDairy(dairyInput(value));
    expect(result.status).toBe('INVALID_INPUT');
    expect(issuePaths(result)).toEqual([
      'herds.0.classes.milkingCows.method2CrudeProtein.value',
    ]);
  });
});

describe('Poultry method 2 dry matter digestibility and crude protein', () => {
  const poultryInput = (layers: object) => ({
    electricity,
    flocks: [
      createPoultryInput({
        classes: {
          layers: {
            head: nv(100),
            days: nv(365),
            manureAllocations: {
              manureWithLitter: {
                manureAllocated: nv(1),
                treatmentStage2Allocations: {
                  ...zeroPoultryMMS2Allocation,
                  solidStorage: nv(1),
                },
              },
              beltManureRemoval: {
                manureAllocated: nv(0),
                treatmentStage2Allocations: zeroPoultryMMS2Allocation,
              },
              manureStoredInHouse: {
                manureAllocated: nv(0),
                treatmentStage2Allocations: zeroPoultryMMS2Allocation,
              },
              pastureRangeAndPaddock: nv(0),
            },
            ...layers,
          },
        },
      }),
    ],
  });

  test('accepts fractions', () => {
    const result = calculatePoultry(
      poultryInput({
        method2DryMatterDigestibility: nv(0.8),
        method2CrudeProtein: nv(0.2),
      }),
    );
    expect(result.status).toBe('OK');
  });

  test.each([
    ['method2DryMatterDigestibility', 1.5],
    ['method2CrudeProtein', 1.5],
  ])('rejects %s of %p with INVALID_INPUT', (key, value) => {
    const result = calculatePoultry(poultryInput({ [key]: nv(value) }));
    expect(result.status).toBe('INVALID_INPUT');
    expect(issuePaths(result)).toEqual([
      `flocks.0.classes.layers.${key}.value`,
    ]);
  });
});
