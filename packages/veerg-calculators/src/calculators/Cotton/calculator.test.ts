import { CalculateEmissionsResult } from '@/calculate';
import {
  zeroFuel,
  zeroLime,
  zeroOrganicFertiliser,
} from '@/test/inputs/zero-input';
import { nv } from '@/tools/inputs';
import { calculateCotton, CottonInput, CottonOutput } from '.';

type CottonCrop = CottonInput['crops'][number];

const ECONOMIC_LINT_ALLOCATION = 0.83;
const ECONOMIC_SEED_ALLOCATION = 1 - ECONOMIC_LINT_ALLOCATION;

// Lint and seed yields are deliberately different, so that mixing them up
// produces a visibly different result.
const cottonCrop = (lintKg: number, seedKg: number): CottonCrop => ({
  state: 'NSW',
  climateZone: 'Warm temperate dry',
  isInLeachingZone: false,
  electricityAllocation: nv(0.5),
  crop: {
    totalLintYieldKilograms: nv(lintKg),
    totalSeedYieldKilograms: nv(seedKg),
    residues: { calculationMethod: '1' },
  },
  fertiliser: {
    inorganic: {
      calculationMethodScope1: '1',
      applications: [
        {
          calculationMethodScope3: '1',
          fertiliserType: 'Urea',
          massAppliedKilograms: nv(1000),
          massPurchasedKilograms: nv(1000),
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
});

const calculate = (crops: CottonCrop[]): CottonOutput => {
  const result: CalculateEmissionsResult<CottonOutput> = calculateCotton({
    electricity: {
      method: 'location',
      electricityPurchasedKilowattHours: nv(1000),
      region: 'NSW',
    },
    crops,
  });
  if (result.status !== 'OK') {
    throw new Error(`Cotton calculation failed: ${JSON.stringify(result)}`);
  }
  return result.emissions;
};

describe('Cotton calculator intensities', () => {
  describe('single crop (intermediate) intensities', () => {
    const lintKg = 2_000;
    const seedKg = 3_000;
    const emissions = calculate([cottonCrop(lintKg, seedKg)]);
    const [activity] = emissions.intermediate;
    const { intensities } = activity;
    const netKg = activity.net.total.tonnesCO2e * 1000;

    it('has non-zero net emissions to allocate', () => {
      expect(netKg).toBeGreaterThan(0);
    });

    it('reports lint, seed and total cotton harvested separately', () => {
      expect(intensities.cottonLintHarvestedKilograms.value).toBe(lintKg);
      expect(intensities.cottonSeedHarvestedKilograms.value).toBe(seedKg);
      expect(intensities.cottonHarvestedKilograms.value).toBe(lintKg + seedKg);
    });

    it('calculates intensity per kg of seed cotton', () => {
      expect(intensities.cottonIntensity.value).toBeCloseTo(
        netKg / (lintKg + seedKg),
      );
    });

    it('allocates emissions by mass to lint and seed', () => {
      const totalKg = lintKg + seedKg;
      // With mass allocation, lint and seed carry the same per-kg intensity
      expect(intensities.massIntensities.cottonLint.value).toBeCloseTo(
        (netKg * (lintKg / totalKg)) / lintKg,
      );
      expect(intensities.massIntensities.cottonSeed.value).toBeCloseTo(
        (netKg * (seedKg / totalKg)) / seedKg,
      );
      expect(intensities.massIntensities.cottonSeed.value).toBeCloseTo(
        intensities.massIntensities.cottonLint.value,
      );
    });

    it('allocates emissions economically to lint and seed', () => {
      expect(intensities.economicIntensities.cottonLint.value).toBeCloseTo(
        (netKg * ECONOMIC_LINT_ALLOCATION) / lintKg,
      );
      expect(intensities.economicIntensities.cottonSeed.value).toBeCloseTo(
        (netKg * ECONOMIC_SEED_ALLOCATION) / seedKg,
      );
    });
  });

  describe('enterprise total intensities', () => {
    const crops = [cottonCrop(2_000, 3_000), cottonCrop(1_000, 4_000)];
    const lintKg = 3_000;
    const seedKg = 7_000;
    const totalKg = lintKg + seedKg;
    const emissions = calculate(crops);
    const { intensities } = emissions;
    const netKg = emissions.net.total.tonnesCO2e * 1000;

    it('sums lint, seed and total cotton harvested across crops', () => {
      expect(intensities.cottonLintHarvestedKilograms.value).toBe(lintKg);
      expect(intensities.cottonSeedHarvestedKilograms.value).toBe(seedKg);
      expect(intensities.cottonHarvestedKilograms.value).toBe(totalKg);
    });

    it('calculates intensity per kg of seed cotton', () => {
      expect(intensities.cottonIncludingLULUCF.value).toBeCloseTo(
        netKg / totalKg,
      );
    });

    it('allocates emissions by mass to lint and seed', () => {
      const { massIntensities } = intensities;
      expect(massIntensities.cottonLintIncludingLULUCF.value).toBeCloseTo(
        (netKg * (lintKg / totalKg)) / lintKg,
      );
      expect(massIntensities.cottonSeedIncludingLULUCF.value).toBeCloseTo(
        (netKg * (seedKg / totalKg)) / seedKg,
      );
      expect(massIntensities.cottonSeedIncludingLULUCF.value).toBeCloseTo(
        massIntensities.cottonLintIncludingLULUCF.value,
      );
    });

    it('allocates emissions economically to lint and seed', () => {
      const { economicIntensities } = intensities;
      expect(economicIntensities.cottonLintIncludingLULUCF.value).toBeCloseTo(
        (netKg * ECONOMIC_LINT_ALLOCATION) / lintKg,
      );
      expect(economicIntensities.cottonSeedIncludingLULUCF.value).toBeCloseTo(
        (netKg * ECONOMIC_SEED_ALLOCATION) / seedKg,
      );
    });
  });
});
