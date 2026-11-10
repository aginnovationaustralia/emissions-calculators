import { createBeefHerdInput } from '@/modules/test/factory';
import { nv } from '@/tools/inputs';
import { BeefClassPeriodInput } from './beef-class-period.input';
import {
  BeefClassMonthlyInput,
  BeefClassSeasonalInput,
} from './beef-class.input';
import { BeefHerdInputSchema } from './beef-herd.input';

const period: BeefClassPeriodInput = {
  head: nv(0),
};
const monthlyClass: BeefClassMonthlyInput = {
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
const seasonalClass: BeefClassSeasonalInput = {
  spring: period,
  summer: period,
  winter: period,
  autumn: period,
};

describe('Beef period inputs', () => {
  test(`Seasonal inputs are accepted`, () => {
    expect(() => {
      BeefHerdInputSchema.parse(
        createBeefHerdInput({
          classes: {
            period: 'seasonal',
            bullsGt1: seasonalClass,
            steersGt3Years: seasonalClass,
          },
        }),
      );
    }).not.toThrow();
  });

  test(`Monthly inputs are accepted`, () => {
    expect(() => {
      BeefHerdInputSchema.parse(
        createBeefHerdInput({
          classes: {
            period: 'monthly',
            bullsGt1: monthlyClass,
            steersGt3Years: monthlyClass,
          },
        }),
      );
    }).not.toThrow();
  });

  test(`Empty input is accepted`, () => {
    expect(() => {
      BeefHerdInputSchema.parse(
        createBeefHerdInput({
          classes: {},
        }),
      );
    }).not.toThrow();
  });

  test(`Can't combine seasonal and monthly within a herd`, () => {
    expect(() => {
      const input = createBeefHerdInput({});
      BeefHerdInputSchema.parse({
        ...input,
        classes: {
          bullsGt1: monthlyClass,
          steersGt3Years: seasonalClass,
        },
      });
    }).toThrow();
  });
});
