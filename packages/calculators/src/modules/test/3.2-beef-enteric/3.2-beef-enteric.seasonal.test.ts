import {
  BeefCalfClassSeasonalInput,
  BeefClassSeasonalInput,
  BeefClassWithCalvesSeasonalInput,
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
  (offset: number): BeefClassSeasonalInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell(columnHeadN, offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const summerHead = Number(cell(columnHeadN, offsetRows + 1));
    const autumnHead = Number(cell(columnHeadN, offsetRows + 2));
    const winterHead = Number(cell(columnHeadN, offsetRows + 3));
    const springLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows));
    const summerLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 1));
    const autumnLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 2));
    const winterLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 3));

    const springLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows));
    const summerLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 1));
    const autumnLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 2));
    const winterLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 3));

    return {
      spring: {
        head: nv(springHead),
        method2Liveweight: nvo(springLiveweight),
        method2LiveweightGain: nvo(springLiveweightGain),
      },
      summer: {
        head: nv(summerHead),
        method2Liveweight: nvo(summerLiveweight),
        method2LiveweightGain: nvo(summerLiveweightGain),
      },
      autumn: {
        head: nv(autumnHead),
        method2Liveweight: nvo(autumnLiveweight),
        method2LiveweightGain: nvo(autumnLiveweightGain),
      },
      winter: {
        head: nv(winterHead),
        method2Liveweight: nvo(winterLiveweight),
        method2LiveweightGain: nvo(winterLiveweightGain),
      },
    };
  };

const readBeefClassWithCalvesFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefClassWithCalvesSeasonalInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell(columnHeadN, offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const springProportionCowsInCalf = Number(
      cell(columnProportionCowsThisSeasonInCalf, offsetRows),
    );
    const springProportionCowsPreviousSeasonInCalf = Number(
      cell(columnProportionCowsPreviousSeasonInCalf, offsetRows),
    );
    const summerHead = Number(cell(columnHeadN, offsetRows + 1));
    const summerProportionCowsInCalf = Number(
      cell(columnProportionCowsThisSeasonInCalf, offsetRows + 1),
    );
    const summerProportionCowsPreviousSeasonInCalf = Number(
      cell(columnProportionCowsPreviousSeasonInCalf, offsetRows + 1),
    );
    const autumnHead = Number(cell(columnHeadN, offsetRows + 2));
    const autumnProportionCowsInCalf = Number(
      cell(columnProportionCowsThisSeasonInCalf, offsetRows + 2),
    );
    const autumnProportionCowsPreviousSeasonInCalf = Number(
      cell(columnProportionCowsPreviousSeasonInCalf, offsetRows + 2),
    );
    const winterHead = Number(cell(columnHeadN, offsetRows + 3));
    const winterProportionCowsInCalf = Number(
      cell(columnProportionCowsThisSeasonInCalf, offsetRows + 3),
    );
    const winterProportionCowsPreviousSeasonInCalf = Number(
      cell(columnProportionCowsPreviousSeasonInCalf, offsetRows + 3),
    );

    const springLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows));
    const summerLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 1));
    const autumnLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 2));
    const winterLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 3));

    const springLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows));
    const summerLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 1));
    const autumnLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 2));
    const winterLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 3));

    return {
      spring: {
        head: nv(springHead),
        proportionCowsThisSeasonInCalf: nv(springProportionCowsInCalf),
        proportionCowsPreviousSeasonInCalf: nv(
          springProportionCowsPreviousSeasonInCalf,
        ),
        method2Liveweight: nvo(springLiveweight),
        method2LiveweightGain: nvo(springLiveweightGain),
      },
      summer: {
        head: nv(summerHead),
        proportionCowsThisSeasonInCalf: nv(summerProportionCowsInCalf),
        proportionCowsPreviousSeasonInCalf: nv(
          summerProportionCowsPreviousSeasonInCalf,
        ),
        method2Liveweight: nvo(summerLiveweight),
        method2LiveweightGain: nvo(summerLiveweightGain),
      },
      autumn: {
        head: nv(autumnHead),
        proportionCowsThisSeasonInCalf: nv(autumnProportionCowsInCalf),
        proportionCowsPreviousSeasonInCalf: nv(
          autumnProportionCowsPreviousSeasonInCalf,
        ),
        method2Liveweight: nvo(autumnLiveweight),
        method2LiveweightGain: nvo(autumnLiveweightGain),
      },
      winter: {
        head: nv(winterHead),
        proportionCowsThisSeasonInCalf: nv(winterProportionCowsInCalf),
        proportionCowsPreviousSeasonInCalf: nv(
          winterProportionCowsPreviousSeasonInCalf,
        ),
        method2Liveweight: nvo(winterLiveweight),
        method2LiveweightGain: nvo(winterLiveweightGain),
      },
    };
  };

const readBeefCalfClassFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefCalfClassSeasonalInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell(columnHeadN, offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const summerHead = Number(cell(columnHeadN, offsetRows + 1));
    const autumnHead = Number(cell(columnHeadN, offsetRows + 2));
    const winterHead = Number(cell(columnHeadN, offsetRows + 3));

    const springLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows));
    const summerLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 1));
    const autumnLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 2));
    const winterLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 3));

    const springLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows));
    const summerLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 1));
    const autumnLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 2));
    const winterLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 3));

    return {
      spring: {
        head: nv(springHead),
        // Milk intake has no bearing on this module
        proportionCalvesBornThisSeason: nv(0),
        proportionCalvesBornPreviousSeason: nv(0),
        method2Liveweight: nvo(springLiveweight),
        method2LiveweightGain: nvo(springLiveweightGain),
      },
      summer: {
        head: nv(summerHead),
        proportionCalvesBornThisSeason: nv(0),
        proportionCalvesBornPreviousSeason: nv(0),
        method2Liveweight: nvo(summerLiveweight),
        method2LiveweightGain: nvo(summerLiveweightGain),
      },
      autumn: {
        head: nv(autumnHead),
        proportionCalvesBornThisSeason: nv(0),
        proportionCalvesBornPreviousSeason: nv(0),
        method2Liveweight: nvo(autumnLiveweight),
        method2LiveweightGain: nvo(autumnLiveweightGain),
      },
      winter: {
        head: nv(winterHead),
        proportionCalvesBornThisSeason: nv(0),
        proportionCalvesBornPreviousSeason: nv(0),
        method2Liveweight: nvo(winterLiveweight),
        method2LiveweightGain: nvo(winterLiveweightGain),
      },
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
      period: 'seasonal',
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

describe('3.2. Beef enteric methane', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.2-beef-enteric/3.2-beef-enteric.xlsx',
      '3.2.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate32BeefPastureEntericMethaneForHerd,
      '3.2',
    );
  });
});
