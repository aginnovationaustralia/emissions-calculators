import { calculateProportionLactatingLEjk } from '@/modules/scope1/shared/sheep/calculate';
import { SheepPeriodProps } from '@/modules/scope1/shared/sheep/helpers';
import { nv } from '@/tools/inputs';
import { SheepClassWithLambingPeriodInputSchema } from './sheep-class-period.input';

const lambingPeriod = (percentLambing: number, percentLambMarking: number) => ({
  head: nv(100),
  percentLambing: nv(percentLambing),
  percentLambMarking: nv(percentLambMarking),
});

const proportionLactating = (
  percentLambing: number,
  percentLambMarking: number,
) =>
  calculateProportionLactatingLEjk({
    periodInput: SheepClassWithLambingPeriodInputSchema.parse(
      lambingPeriod(percentLambing, percentLambMarking),
    ),
    periodName: 'spring',
    className: 'breedingEwes',
  } as SheepPeriodProps).unit.store.toNumber();

describe('Sheep lambing inputs', () => {
  test('accepts a lamb marking rate above 100%', () => {
    expect(() =>
      SheepClassWithLambingPeriodInputSchema.parse(lambingPeriod(90, 130)),
    ).not.toThrow();
  });

  test('rejects a negative lamb marking rate', () => {
    expect(() =>
      SheepClassWithLambingPeriodInputSchema.parse(lambingPeriod(90, -1)),
    ).toThrow();
  });

  test('rejects a share of ewes lambing above 100%', () => {
    expect(() =>
      SheepClassWithLambingPeriodInputSchema.parse(lambingPeriod(130, 90)),
    ).toThrow();
  });

  test('proportion lactating uses the lamb marking rate up to 100%', () => {
    expect(proportionLactating(90, 85)).toBeCloseTo(0.765);
  });

  test('proportion lactating caps the lamb marking rate at 100%', () => {
    expect(proportionLactating(90, 130)).toBeCloseTo(0.9);
    expect(proportionLactating(90, 130)).toBe(proportionLactating(90, 100));
  });
});
