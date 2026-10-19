import {
  BeefCalfClassMonthlyInput,
  BeefClassMonthlyInput,
  BeefClassWithCalvesMonthlyInput,
} from '@/calculators/Beef/types/beef-class.input';
import { BeefHerdInputTransformed } from '@/calculators/Beef/types/beef-herd.input';
import { HasIsFebruaryInLeapYearInputTransformed } from '@/calculators/types/has-is-february-in-leap-year.input';
import { calculate32BeefPastureEntericMethaneForHerd } from '@/modules/scope1/3-enteric-methane/3.2-beef-pasture';
import { getSheet } from '@/test/common/sheets';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { createBeefHerdInputTransformed } from '../factory';
import { checkStateOrRegion } from '../livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import {
  CellFn,
  columnCustomDryMatterIntakeI,
  columnCustomDurationDays,
  columnCustomLiveweightGainLWG,
  columnCustomLiveweightW,
  columnExpectedOutput,
  columnHeadN,
  columnProportionCowsPreviousSeasonInCalf,
  columnProportionCowsThisSeasonInCalf,
  columnStateOrRegion,
} from './common';

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnExpectedOutput}${row}`).value());
};

const readBeefClassFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefClassMonthlyInput | undefined => {
    const offsetRows = offset * 12;
    if (cell(columnHeadN, offsetRows) === undefined) {
      return undefined;
    }

    const readBeefClassPeriod = (rowOffset: number) => {
      const customLiveweight = cell(columnCustomLiveweightW, rowOffset);
      const customLiveweightGain = cell(
        columnCustomLiveweightGainLWG,
        rowOffset,
      );
      const customDurationDays = cell(columnCustomDurationDays, rowOffset);
      const customDryMatterIntake = cell(
        columnCustomDryMatterIntakeI,
        rowOffset,
      );
      return {
        head: nv(Number(cell(columnHeadN, rowOffset))),
        method2Liveweight: nvo(
          method === '2' && customLiveweight
            ? Number(customLiveweight)
            : undefined,
        ),
        method2LiveweightGain: nvo(
          method === '2' && customLiveweightGain
            ? Number(customLiveweightGain)
            : undefined,
        ),
        method2DurationDays: nvo(
          method === '2' && customDurationDays
            ? Number(customDurationDays)
            : undefined,
        ),
        method2DryMatterIntake: nvo(
          method === '2' && customDryMatterIntake
            ? Number(customDryMatterIntake)
            : undefined,
        ),
      };
    };

    return {
      january: readBeefClassPeriod(offsetRows),
      february: readBeefClassPeriod(offsetRows + 1),
      march: readBeefClassPeriod(offsetRows + 2),
      april: readBeefClassPeriod(offsetRows + 3),
      may: readBeefClassPeriod(offsetRows + 4),
      june: readBeefClassPeriod(offsetRows + 5),
      july: readBeefClassPeriod(offsetRows + 6),
      august: readBeefClassPeriod(offsetRows + 7),
      september: readBeefClassPeriod(offsetRows + 8),
      october: readBeefClassPeriod(offsetRows + 9),
      november: readBeefClassPeriod(offsetRows + 10),
      december: readBeefClassPeriod(offsetRows + 11),
    };
  };

const readBeefCalfClassFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefCalfClassMonthlyInput | undefined => {
    const offsetRows = offset * 12;
    if (cell(columnHeadN, offsetRows) === undefined) {
      return undefined;
    }

    const readBeefClassPeriod = (rowOffset: number) => {
      const customLiveweight = cell(columnCustomLiveweightW, rowOffset);
      const customLiveweightGain = cell(
        columnCustomLiveweightGainLWG,
        rowOffset,
      );
      const customDurationDays = cell(columnCustomDurationDays, rowOffset);
      const customDryMatterIntake = cell(
        columnCustomDryMatterIntakeI,
        rowOffset,
      );
      return {
        head: nv(Number(cell(columnHeadN, rowOffset))),
        method2Liveweight: nvo(
          method === '2' && customLiveweight
            ? Number(customLiveweight)
            : undefined,
        ),
        method2LiveweightGain: nvo(
          method === '2' && customLiveweightGain
            ? Number(customLiveweightGain)
            : undefined,
        ),
        method2DurationDays: nvo(
          method === '2' && customDurationDays
            ? Number(customDurationDays)
            : undefined,
        ),
        method2DryMatterIntake: nvo(
          method === '2' && customDryMatterIntake
            ? Number(customDryMatterIntake)
            : undefined,
        ),
        // Milk intake has no bearing on this module
        proportionCalvesBornThisSeason: nv(0),
        proportionCalvesBornPreviousSeason: nv(0),
      };
    };

    return {
      january: readBeefClassPeriod(offsetRows),
      february: readBeefClassPeriod(offsetRows + 1),
      march: readBeefClassPeriod(offsetRows + 2),
      april: readBeefClassPeriod(offsetRows + 3),
      may: readBeefClassPeriod(offsetRows + 4),
      june: readBeefClassPeriod(offsetRows + 5),
      july: readBeefClassPeriod(offsetRows + 6),
      august: readBeefClassPeriod(offsetRows + 7),
      september: readBeefClassPeriod(offsetRows + 8),
      october: readBeefClassPeriod(offsetRows + 9),
      november: readBeefClassPeriod(offsetRows + 10),
      december: readBeefClassPeriod(offsetRows + 11),
    };
  };

const readBeefClassWithCalvesFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefClassWithCalvesMonthlyInput | undefined => {
    const offsetRows = offset * 12;
    if (cell(columnHeadN, offsetRows) === undefined) {
      return undefined;
    }

    const readBeefClassWithCalvesPeriod = (rowOffset: number) => {
      const customLiveweight = cell(columnCustomLiveweightW, rowOffset);
      const customLiveweightGain = cell(
        columnCustomLiveweightGainLWG,
        rowOffset,
      );
      const customDurationDays = cell(columnCustomDurationDays, rowOffset);
      const customDryMatterIntake = cell(
        columnCustomDryMatterIntakeI,
        rowOffset,
      );
      return {
        head: nv(Number(cell(columnHeadN, rowOffset))),
        proportionCowsThisSeasonInCalf: nv(
          Number(cell(columnProportionCowsThisSeasonInCalf, rowOffset)),
        ),
        proportionCowsPreviousSeasonInCalf: nv(
          Number(cell(columnProportionCowsPreviousSeasonInCalf, rowOffset)),
        ),
        method2Liveweight: nvo(
          method === '2' && customLiveweight
            ? Number(customLiveweight)
            : undefined,
        ),
        method2LiveweightGain: nvo(
          method === '2' && customLiveweightGain
            ? Number(customLiveweightGain)
            : undefined,
        ),
        method2DurationDays: nvo(
          method === '2' && customDurationDays
            ? Number(customDurationDays)
            : undefined,
        ),
        method2DryMatterIntake: nvo(
          method === '2' && customDryMatterIntake
            ? Number(customDryMatterIntake)
            : undefined,
        ),
      };
    };

    return {
      january: readBeefClassWithCalvesPeriod(offsetRows),
      february: readBeefClassWithCalvesPeriod(offsetRows + 1),
      march: readBeefClassWithCalvesPeriod(offsetRows + 2),
      april: readBeefClassWithCalvesPeriod(offsetRows + 3),
      may: readBeefClassWithCalvesPeriod(offsetRows + 4),
      june: readBeefClassWithCalvesPeriod(offsetRows + 5),
      july: readBeefClassWithCalvesPeriod(offsetRows + 6),
      august: readBeefClassWithCalvesPeriod(offsetRows + 7),
      september: readBeefClassWithCalvesPeriod(offsetRows + 8),
      october: readBeefClassWithCalvesPeriod(offsetRows + 9),
      november: readBeefClassWithCalvesPeriod(offsetRows + 10),
      december: readBeefClassWithCalvesPeriod(offsetRows + 11),
    };
  };

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
):
  | (BeefHerdInputTransformed & HasIsFebruaryInLeapYearInputTransformed)
  | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  const readBeefClass = readBeefClassFn(cell, method);
  const readBeefClassWithCalves = readBeefClassWithCalvesFn(cell, method);
  const readBeefCalfClass = readBeefCalfClassFn(cell, method);

  if (cell('A') === undefined) {
    return undefined;
  }

  const region = checkStateOrRegion(cell(columnStateOrRegion));

  return createBeefHerdInputTransformed({
    region,
    classes: {
      period: 'monthly',
      bullsLt1: readBeefCalfClass(0),
      bullsGt1: readBeefClass(1),
      cows1To2Years: readBeefClassWithCalves(2),
      cows2To3Years: readBeefClassWithCalves(3),
      cowsLt1: readBeefCalfClass(4),
      cowsGt3Years: readBeefClassWithCalves(5),
      steers1To2Years: readBeefClass(6),
      steers2To3Years: readBeefClass(7),
      steersLt1: readBeefCalfClass(8),
      steersGt3Years: readBeefClass(9),
    },
  });
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 50 },
);

describe('3.2. Beef enteric methane monthly', () => {
  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.2-beef-enteric/3.2-beef-enteric.xlsx',
      '3.2.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 771, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate32BeefPastureEntericMethaneForHerd,
      '3.2',
    );
  });
});
