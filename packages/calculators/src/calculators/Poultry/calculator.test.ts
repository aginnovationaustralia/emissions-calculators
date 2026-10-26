import { createPoultryInput } from '@/modules/test/factory';
import { root } from '@/tools/containers';
import { nv } from '@/tools/inputs';
import { mass } from '@/tools/units';
import { getSingleIntensities, getTotalIntensities } from './calculator';
import { PoultryFlockInputSchema } from './types/poultry-flock.input';

const flock = (liveweightSoldKg: number, eggsSoldKg: number) =>
  PoultryFlockInputSchema.parse(
    createPoultryInput({
      liveweightSoldKg: nv(liveweightSoldKg),
      eggsSoldKg: nv(eggsSoldKg),
    }),
  );

const co2e = (kg: number) => root(mass('CO2e', kg));

describe('getTotalIntensities', () => {
  it('allocates emissions between meat and eggs by mass', () => {
    // 300kg liveweight and 100kg eggs: 75% of emissions to meat, 25% to eggs
    const result = getTotalIntensities(co2e(10_000), co2e(-2_000), [
      flock(200, 40),
      flock(100, 60),
    ]);

    expect(result.liveweightProducedKg.value).toBe(300);
    expect(result.eggsProducedKg.value).toBe(100);
    expect(result.liveweightIntensityIncludingLULUCF.value).toBeCloseTo(
      (10_000 * 0.75) / 300,
    );
    expect(result.liveweightIntensityExcludingLULUCF.value).toBeCloseTo(
      (12_000 * 0.75) / 300,
    );
    expect(result.eggsIntensityIncludingLULUCF.value).toBeCloseTo(
      (10_000 * 0.25) / 100,
    );
    expect(result.eggsIntensityExcludingLULUCF.value).toBeCloseTo(
      (12_000 * 0.25) / 100,
    );
  });

  it('gives zero intensities when nothing was produced', () => {
    const result = getTotalIntensities(co2e(10_000), co2e(0), [flock(0, 0)]);

    expect(result.liveweightIntensityIncludingLULUCF.value).toBe(0);
    expect(result.eggsIntensityIncludingLULUCF.value).toBe(0);
  });
});

describe('getSingleIntensities', () => {
  it('allocates all emissions to eggs when no liveweight was sold', () => {
    const result = getSingleIntensities(co2e(1_000), flock(0, 50));

    expect(result.liveweightIntensity.value).toBe(0);
    expect(result.eggsIntensity.value).toBeCloseTo(1_000 / 50);
  });
});
