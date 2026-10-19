import type { SheepClassPeriodInput } from '@/calculators/Sheep/types/sheep-class-period.input';

import { nv, nvo } from '@/tools/inputs';
import * as col from './columns';
import {
  SheepClassMonthlyInput,
  SheepClassWithLambingMonthlyInput,
  SheepClassWithProportionLambsBornMonthlyInput,
} from '@/calculators/Sheep/types/sheep-class-monthly.input';
import {
  SheepClassSeasonalInput,
  SheepClassWithLambingSeasonalInput,
  SheepClassWithProportionLambsBornSeasonalInput,
} from '@/calculators/Sheep/types/sheep-class-seasonal.input';

export type CellFn = (column: string, offset?: number) => string | undefined;

export type SheepManurePeriodsPerClass = 4 | 12;
type SheepClassInputFromPeriods<P extends SheepManurePeriodsPerClass> =
  P extends 12 ? SheepClassMonthlyInput : SheepClassSeasonalInput;
type SheepClassWithLambingInputFromPeriods<
  P extends SheepManurePeriodsPerClass,
> = P extends 12
  ? SheepClassWithLambingMonthlyInput
  : SheepClassWithLambingSeasonalInput;
type SheepClassWithProportionLambsBornInputFromPeriods<
  P extends SheepManurePeriodsPerClass,
> = P extends 12
  ? SheepClassWithProportionLambsBornMonthlyInput
  : SheepClassWithProportionLambsBornSeasonalInput;

export const SHEEP_MANURE_SEASONAL_PERIODS_PER_CLASS = 4 as const;
export const SHEEP_MANURE_MONTHLY_PERIODS_PER_CLASS = 12 as const;

const SEASONAL_PERIOD_KEYS = ['spring', 'summer', 'autumn', 'winter'] as const;

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

export function createSheepManureSheetReaders<
  P extends SheepManurePeriodsPerClass,
>(
  cell: CellFn,
  method: '1' | '2',
  periodsPerClass: SheepManurePeriodsPerClass,
): {
  readSheepClass: (offset: number) => SheepClassInputFromPeriods<P> | undefined;
  readSheepClassWithLambing: (
    offset: number,
  ) => SheepClassWithLambingInputFromPeriods<P> | undefined;
  readSheepClassWithProportionLambsBorn: (
    offset: number,
  ) => SheepClassWithProportionLambsBornInputFromPeriods<P> | undefined;
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
    const customCrudeProteinContent = cell(
      col.columnCustomCrudeProteinContent,
      offsetRows,
    );
    const customLiveweightGain = cell(
      col.columnCustomLiveweightGain,
      offsetRows,
    );
    return {
      head: nv(Number(cell(col.columnHead, offsetRows))),
      method2Liveweight: nvo(
        method === '2' && customLiveweight
          ? Number(customLiveweight)
          : undefined,
      ),
      method2DryMatterAvailability: nvo(
        method === '2' && customDryMatterAvailability
          ? Number(customDryMatterAvailability)
          : undefined,
      ),
      method2DryMatterDigestibility: nvo(
        method === '2' && customDryMatterDigestibility
          ? Number(customDryMatterDigestibility)
          : undefined,
      ),
      method2AverageDurationDays: nvo(
        method === '2' && customAverageDurationDays
          ? Number(customAverageDurationDays)
          : undefined,
      ),
      method2CrudeProteinContent: nvo(
        method === '2' && customCrudeProteinContent
          ? Number(customCrudeProteinContent)
          : undefined,
      ),
      method2LiveweightGain: nvo(
        method === '2' && customLiveweightGain
          ? Number(customLiveweightGain)
          : undefined,
      ),
    };
  };

  const readSheepClassBase = (offsetRows: number) => ({
    greasyWoolProduction: nv(
      Number(cell(col.columnGreasyWoolProduction, offsetRows) ?? 0),
    ),
    cleanWoolYieldProportion: nv(
      Number(cell(col.columnCleanWoolYieldProportion, offsetRows) ?? 0),
    ),
  });

  const readSheepClass = (
    offset: number,
  ): SheepClassWithLambingInputFromPeriods<P> | undefined => {
    const offsetRows = offset * periodsPerClass;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      ...readSheepClassBase(offsetRows),
      ...readPeriods(periodKeys, offsetRows, readSheepClassPeriod),
    } as SheepClassWithLambingInputFromPeriods<P>;
  };

  const readSheepClassWithLambing = (
    offset: number,
  ): SheepClassWithLambingInputFromPeriods<P> | undefined => {
    const offsetRows = offset * periodsPerClass;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      ...readSheepClassBase(offsetRows),
      ...readPeriods(periodKeys, offsetRows, (rowOffset) => ({
        ...readSheepClassPeriod(rowOffset),
        percentLambing: nv(Number(cell(col.columnLambingRateLR, rowOffset))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRateLMR, rowOffset)),
        ),
      })),
    } as SheepClassWithLambingInputFromPeriods<P>;
  };

  const readSheepClassWithProportionLambsBorn = (
    offset: number,
  ): SheepClassWithProportionLambsBornInputFromPeriods<P> | undefined => {
    const offsetRows = offset * periodsPerClass;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      ...readSheepClassBase(offsetRows),
      ...readPeriods(periodKeys, offsetRows, (rowOffset) => ({
        ...readSheepClassPeriod(rowOffset),
        proportionOfLambsBorn: nv(
          Number(cell(col.columnProportionOfLambsBornPL, rowOffset)),
        ),
      })),
    } as SheepClassWithProportionLambsBornInputFromPeriods<P>;
  };

  return {
    readSheepClass,
    readSheepClassWithLambing,
    readSheepClassWithProportionLambsBorn,
  };
}
