import type { SheepClassPeriodInput } from '@/calculators/Sheep/types/sheep-class-period.input';
import {
  SheepClassInput,
  SheepClassWithLambingInput,
  SheepClassWithProportionLambsBornInput,
} from '@/calculators/Sheep/types/sheep-class.input';
import * as col from './columns';

export type CellFn = (column: string, offset?: number) => string | undefined;

export type SheepManurePeriodsPerClass = 4 | 12;

export const SHEEP_MANURE_SEASONAL_PERIODS_PER_CLASS = 4 as const;
export const SHEEP_MANURE_MONTHLY_PERIODS_PER_CLASS = 12 as const;

const SEASONAL_PERIOD_KEYS = [
  'spring',
  'summer',
  'autumn',
  'winter',
] as const;

const MONTHLY_PERIOD_KEYS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

const readPeriods = <T>(
  keys: readonly string[],
  offsetRows: number,
  readPeriod: (offsetRows: number) => T,
): Record<string, T> =>
  Object.fromEntries(
    keys.map((key, index) => [key, readPeriod(offsetRows + index)]),
  );

export function createSheepManureSheetReaders(
  cell: CellFn,
  method: '1' | '2',
  periodsPerClass: SheepManurePeriodsPerClass,
): {
  readSheepClass: (offset: number) => SheepClassInput | undefined;
  readSheepClassWithLambing: (
    offset: number,
  ) => SheepClassWithLambingInput | undefined;
  readSheepClassWithProportionLambsBorn: (
    offset: number,
  ) => SheepClassWithProportionLambsBornInput | undefined;
} {
  const periodKeys =
    periodsPerClass === SHEEP_MANURE_SEASONAL_PERIODS_PER_CLASS
      ? SEASONAL_PERIOD_KEYS
      : MONTHLY_PERIOD_KEYS;

  const readSheepClassPeriod = (offsetRows: number): SheepClassPeriodInput => {
    const customLiveweight = cell(col.columnCustomLiveweight, offsetRows);
    const customDryMatterAvailability = cell(
      col.columnCustomDryMatterAvailability,
      offsetRows,
    );
    const customDryMatterDigestibility = cell(
      col.columnCustomDryMatterDigestibility,
      offsetRows,
    );
    const customAverageDurationDays = cell(
      col.columnCustomAverageDurationDays,
      offsetRows,
    );
    return {
      head: Number(cell(col.columnHead, offsetRows)),
      method2Liveweight:
        method === '2' && customLiveweight
          ? Number(customLiveweight)
          : undefined,
      method2DryMatterAvailability:
        method === '2' && customDryMatterAvailability
          ? Number(customDryMatterAvailability)
          : undefined,
      method2DryMatterDigestibility:
        method === '2' && customDryMatterDigestibility
          ? Number(customDryMatterDigestibility)
          : undefined,
      method2AverageDurationDays:
        method === '2' && customAverageDurationDays
          ? Number(customAverageDurationDays)
          : undefined,
    };
  };

  const readSheepClassBase = (offsetRows: number) => ({
    greasyWoolProduction: Number(
      cell(col.columnGreasyWoolProduction, offsetRows) ?? 0,
    ),
    cleanWoolYieldProportion: Number(
      cell(col.columnCleanWoolYieldProportion, offsetRows) ?? 0,
    ),
  });

  const readSheepClass = (offset: number): SheepClassInput | undefined => {
    const offsetRows = offset * periodsPerClass;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      ...readSheepClassBase(offsetRows),
      ...readPeriods(periodKeys, offsetRows, readSheepClassPeriod),
    } as SheepClassInput;
  };

  const readSheepClassWithLambing = (
    offset: number,
  ): SheepClassWithLambingInput | undefined => {
    const offsetRows = offset * periodsPerClass;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      ...readSheepClassBase(offsetRows),
      ...readPeriods(periodKeys, offsetRows, (rowOffset) => ({
        ...readSheepClassPeriod(rowOffset),
        percentLambing: Number(cell(col.columnLambingRateLR, rowOffset)),
        percentLambMarking: Number(cell(col.columnMarkingRateLMR, rowOffset)),
      })),
    } as SheepClassWithLambingInput;
  };

  const readSheepClassWithProportionLambsBorn = (
    offset: number,
  ): SheepClassWithProportionLambsBornInput | undefined => {
    const offsetRows = offset * periodsPerClass;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      ...readSheepClassBase(offsetRows),
      ...readPeriods(periodKeys, offsetRows, (rowOffset) => ({
        ...readSheepClassPeriod(rowOffset),
        proportionOfLambsBorn: Number(
          cell(col.columnProportionOfLambsBornPL, rowOffset),
        ),
      })),
    } as SheepClassWithProportionLambsBornInput;
  };

  return {
    readSheepClass,
    readSheepClassWithLambing,
    readSheepClassWithProportionLambsBorn,
  };
}
