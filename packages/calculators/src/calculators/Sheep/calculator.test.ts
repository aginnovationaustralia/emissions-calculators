import { HasIsFebruaryInLeapYearInputSchemaForSheep } from '@/calculators/types/has-is-february-in-leap-year.input';
import { createSheepFlockInput } from '@/modules/test/factory';
import { root } from '@/tools/containers';
import { nv } from '@/tools/inputs';
import { mass } from '@/tools/units';
import { contextFor, loadConstants } from '../executionContext';
import { getSingleIntensities, getTotalIntensities } from './calculator';
import { SheepClassMonthlyInput } from './types/sheep-class-monthly.input';
import { SheepClassSeasonalInput } from './types/sheep-class-seasonal.input';
import { SheepFlockInputSchema } from './types/sheep-flock.input';

const context = contextFor('sheep', loadConstants());
const input = HasIsFebruaryInLeapYearInputSchemaForSheep.parse({
  isFebruaryInLeapYear: false,
});

const seasonalClass = (
  greasyWoolKgPerHead: number,
  cleanWoolYieldProportion: number,
  head: { spring: number; summer: number; autumn: number; winter: number },
): SheepClassSeasonalInput => ({
  greasyWoolProduction: nv(greasyWoolKgPerHead),
  cleanWoolYieldProportion: nv(cleanWoolYieldProportion),
  spring: { head: nv(head.spring) },
  summer: { head: nv(head.summer) },
  autumn: { head: nv(head.autumn) },
  winter: { head: nv(head.winter) },
});

const allSeasons = (head: number) => ({
  spring: head,
  summer: head,
  autumn: head,
  winter: head,
});

// Clean wool: rams 10 head * 5kg * 0.6 = 30kg, wethers avg 30 head * 6kg * 0.7 = 126kg
const flockA = SheepFlockInputSchema.parse(
  createSheepFlockInput({
    liveweightSoldKg: nv(1000),
    classes: {
      period: 'seasonal',
      rams: seasonalClass(5, 0.6, allSeasons(10)),
      wethers: seasonalClass(6, 0.7, {
        spring: 20,
        summer: 20,
        autumn: 40,
        winter: 40,
      }),
    },
  }),
);

// Clean wool: other ewes 100 head * 4kg * 0.5 = 200kg, wethers 50 head * 3kg * 0.5 = 75kg
const flockB = SheepFlockInputSchema.parse(
  createSheepFlockInput({
    liveweightSoldKg: nv(500),
    classes: {
      period: 'seasonal',
      otherEwes: seasonalClass(4, 0.5, allSeasons(100)),
      wethers: seasonalClass(3, 0.5, allSeasons(50)),
    },
  }),
);

describe('getTotalIntensities', () => {
  const netTotalEmissionsKgCO2e = 100_000;
  const netLulucfKgCO2e = -20_000;

  const result = getTotalIntensities(
    root(mass('CO2e', netTotalEmissionsKgCO2e)),
    root(mass('CO2e', netLulucfKgCO2e)),
    [flockA, flockB],
    context,
    input,
  );

  const expectedWoolKg = 30 + 126 + 200 + 75;
  const expectedLiveweightKg = 1500;

  // Protein mass allocation: 18% of liveweight, 84% of clean wool
  const liveweightProteinKg = expectedLiveweightKg * 0.18;
  const woolProteinKg = expectedWoolKg * 0.84;
  const woolAllocation = woolProteinKg / (woolProteinKg + liveweightProteinKg);
  const meatAllocation = 1 - woolAllocation;

  it('totals clean wool produced across all classes, periods and flocks', () => {
    expect(result.woolProducedKg.value).toBeCloseTo(expectedWoolKg);
  });

  it('totals liveweight produced across all flocks', () => {
    expect(result.liveweightProducedKg.value).toBeCloseTo(expectedLiveweightKg);
  });

  it('allocates emissions to wool by protein mass', () => {
    expect(result.woolIntensityIncludingLULUCF.value).toBeCloseTo(
      (netTotalEmissionsKgCO2e * woolAllocation) / expectedWoolKg,
    );
    expect(result.woolIntensityExcludingLULUCF.value).toBeCloseTo(
      ((netTotalEmissionsKgCO2e - netLulucfKgCO2e) * woolAllocation) /
        expectedWoolKg,
    );
  });

  it('allocates emissions to liveweight by protein mass', () => {
    expect(result.liveweightIntensityIncludingLULUCF.value).toBeCloseTo(
      (netTotalEmissionsKgCO2e * meatAllocation) / expectedLiveweightKg,
    );
    expect(result.liveweightIntensityExcludingLULUCF.value).toBeCloseTo(
      ((netTotalEmissionsKgCO2e - netLulucfKgCO2e) * meatAllocation) /
        expectedLiveweightKg,
    );
  });
});

describe('getSingleIntensities', () => {
  it('calculates clean wool produced for a single flock', () => {
    const result = getSingleIntensities(
      root(mass('CO2e', 100_000)),
      flockB,
      context,
      input,
    );

    expect(result.woolProducedKg.value).toBeCloseTo(200 + 75);
    expect(result.liveweightProducedKg.value).toBeCloseTo(500);
  });

  it('calculates clean wool produced for a monthly flock', () => {
    const monthlyHead = { head: nv(12) };
    const rams: SheepClassMonthlyInput = {
      greasyWoolProduction: nv(5),
      cleanWoolYieldProportion: nv(0.6),
      january: monthlyHead,
      february: monthlyHead,
      march: monthlyHead,
      april: monthlyHead,
      may: monthlyHead,
      june: monthlyHead,
      july: monthlyHead,
      august: monthlyHead,
      september: monthlyHead,
      october: monthlyHead,
      november: monthlyHead,
      december: monthlyHead,
    };
    const flock = SheepFlockInputSchema.parse(
      createSheepFlockInput({ classes: { period: 'monthly', rams } }),
    );

    const result = getSingleIntensities(
      root(mass('CO2e', 100_000)),
      flock,
      context,
      input,
    );

    expect(result.woolProducedKg.value).toBeCloseTo(12 * 5 * 0.6);
  });
});
