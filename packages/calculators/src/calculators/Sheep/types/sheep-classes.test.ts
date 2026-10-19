import { nv } from '@/tools/inputs';
import { SheepClassPeriodInput } from './sheep-class-period.input';
import { SheepClassMonthlyInput } from './sheep-class-monthly.input';
import { SheepClassSeasonalInput } from './sheep-class-seasonal.input';
import { SheepFlockInputSchema } from './sheep-flock.input';
import { createSheepFlockInput } from '@/modules/test/factory';

const period: SheepClassPeriodInput = {
  head: nv(1),
};
const monthlyClass: SheepClassMonthlyInput = {
  greasyWoolProduction: nv(0),
  cleanWoolYieldProportion: nv(0),
  january: period,
  february: period,
  march: period,
  april: period,
  may: period,
  june: period,
  july: period,
  august: period,
  september: period,
  october: period,
  november: period,
  december: period,
};
const seasonalClass: SheepClassSeasonalInput = {
  greasyWoolProduction: nv(0),
  cleanWoolYieldProportion: nv(0),
  spring: period,
  summer: period,
  winter: period,
  autumn: period,
};

describe('Sheep period inputs', () => {
  test(`Seasonal inputs are accepted`, () => {
    expect(() => {
      SheepFlockInputSchema.parse(
        createSheepFlockInput({
          classes: {
            period: 'seasonal',
            rams: seasonalClass,
            wethers: seasonalClass,
          },
        }),
      );
    }).not.toThrow();
  });

  test(`Monthly inputs are accepted`, () => {
    expect(() => {
      SheepFlockInputSchema.parse(
        createSheepFlockInput({
          classes: {
            period: 'monthly',
            rams: monthlyClass,
            wethers: monthlyClass,
          },
        }),
      );
    }).not.toThrow();
  });

  test(`Can't combine seasonal and monthly within a herd`, () => {
    expect(() => {
      const input = createSheepFlockInput({});
      SheepFlockInputSchema.parse({
        ...input,
        classes: {
          rams: monthlyClass,
          wethers: seasonalClass,
        },
      });
    }).toThrow();
  });
});
