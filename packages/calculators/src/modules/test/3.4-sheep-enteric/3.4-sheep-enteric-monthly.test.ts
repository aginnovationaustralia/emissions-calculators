import {
  SheepClassMonthlyInput,
  SheepClassWithLambingMonthlyInput,
  SheepClassWithProportionLambsBornMonthlyInput,
} from '@/calculators/Sheep/types/sheep-class-monthly.input';
import type { SheepClassPeriodInput } from '@/calculators/Sheep/types/sheep-class-period.input';
import {
  SheepFlockInput,
  SheepFlockInputSchema,
  SheepFlockInputTransformed,
} from '@/calculators/Sheep/types/sheep-flock.input';
import {
  HasIsFebruaryInLeapYearInputSchemaForSheep,
  HasIsFebruaryInLeapYearInputTransformed,
} from '@/calculators/types/has-is-february-in-leap-year.input';
import { getSheet } from '@/test/common/sheets';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculate34SheepEntericMethane } from '../../scope1/3-enteric-methane/3.4-sheep-enteric';
import { createSheepFlockInput } from '../factory';
import { checkState } from '../livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import * as col from './columns';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
):
  | (SheepFlockInputTransformed & HasIsFebruaryInLeapYearInputTransformed)
  | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

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
    };
  };

  const readSheepClass = (
    offset: number,
  ): SheepClassMonthlyInput | undefined => {
    const offsetRows = offset * 12;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      greasyWoolProduction: nv(0),
      cleanWoolYieldProportion: nv(0),
      january: readSheepClassPeriod(offsetRows),
      february: readSheepClassPeriod(offsetRows + 1),
      march: readSheepClassPeriod(offsetRows + 2),
      april: readSheepClassPeriod(offsetRows + 3),
      may: readSheepClassPeriod(offsetRows + 4),
      june: readSheepClassPeriod(offsetRows + 5),
      july: readSheepClassPeriod(offsetRows + 6),
      august: readSheepClassPeriod(offsetRows + 7),
      september: readSheepClassPeriod(offsetRows + 8),
      october: readSheepClassPeriod(offsetRows + 9),
      november: readSheepClassPeriod(offsetRows + 10),
      december: readSheepClassPeriod(offsetRows + 11),
    };
  };

  const readSheepClassWithLambing = (
    offset: number,
  ): SheepClassWithLambingMonthlyInput | undefined => {
    const offsetRows = offset * 12;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      greasyWoolProduction: nv(0),
      cleanWoolYieldProportion: nv(0),
      january: {
        ...readSheepClassPeriod(offsetRows),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows))),
        percentLambMarking: nv(Number(cell(col.columnMarkingRate, offsetRows))),
      },
      february: {
        ...readSheepClassPeriod(offsetRows + 1),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows + 1))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 1)),
        ),
      },
      march: {
        ...readSheepClassPeriod(offsetRows + 2),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows + 2))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 2)),
        ),
      },
      april: {
        ...readSheepClassPeriod(offsetRows + 3),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows + 3))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 3)),
        ),
      },
      may: {
        ...readSheepClassPeriod(offsetRows + 4),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows + 4))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 4)),
        ),
      },
      june: {
        ...readSheepClassPeriod(offsetRows + 5),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows + 5))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 5)),
        ),
      },
      july: {
        ...readSheepClassPeriod(offsetRows + 6),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows + 6))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 6)),
        ),
      },
      august: {
        ...readSheepClassPeriod(offsetRows + 7),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows + 7))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 7)),
        ),
      },
      september: {
        ...readSheepClassPeriod(offsetRows + 8),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows + 8))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 8)),
        ),
      },
      october: {
        ...readSheepClassPeriod(offsetRows + 9),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows + 9))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 9)),
        ),
      },
      november: {
        ...readSheepClassPeriod(offsetRows + 10),
        percentLambing: nv(
          Number(cell(col.columnLambingRate, offsetRows + 10)),
        ),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 10)),
        ),
      },
      december: {
        ...readSheepClassPeriod(offsetRows + 11),
        percentLambing: nv(
          Number(cell(col.columnLambingRate, offsetRows + 11)),
        ),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 11)),
        ),
      },
    };
  };

  const readSheepClassWithProportionLambsBorn = (
    offset: number,
  ): SheepClassWithProportionLambsBornMonthlyInput | undefined => {
    const offsetRows = offset * 12;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      greasyWoolProduction: nv(0),
      cleanWoolYieldProportion: nv(0),
      january: {
        ...readSheepClassPeriod(offsetRows),
        proportionOfLambsBorn: nv(0),
      },
      february: {
        ...readSheepClassPeriod(offsetRows + 1),
        proportionOfLambsBorn: nv(0),
      },
      march: {
        ...readSheepClassPeriod(offsetRows + 2),
        proportionOfLambsBorn: nv(0),
      },
      april: {
        ...readSheepClassPeriod(offsetRows + 3),
        proportionOfLambsBorn: nv(0),
      },
      may: {
        ...readSheepClassPeriod(offsetRows + 4),
        proportionOfLambsBorn: nv(0),
      },
      june: {
        ...readSheepClassPeriod(offsetRows + 5),
        proportionOfLambsBorn: nv(0),
      },
      july: {
        ...readSheepClassPeriod(offsetRows + 6),
        proportionOfLambsBorn: nv(0),
      },
      august: {
        ...readSheepClassPeriod(offsetRows + 7),
        proportionOfLambsBorn: nv(0),
      },
      september: {
        ...readSheepClassPeriod(offsetRows + 8),
        proportionOfLambsBorn: nv(0),
      },
      october: {
        ...readSheepClassPeriod(offsetRows + 9),
        proportionOfLambsBorn: nv(0),
      },
      november: {
        ...readSheepClassPeriod(offsetRows + 10),
        proportionOfLambsBorn: nv(0),
      },
      december: {
        ...readSheepClassPeriod(offsetRows + 11),
        proportionOfLambsBorn: nv(0),
      },
    };
  };

  const sheepInput: SheepFlockInput = createSheepFlockInput({
    state: checkState(cell(col.columnState)),
    classes: {
      period: 'monthly',
      rams: readSheepClass(0),
      wethers: readSheepClass(1),
      breedingEwes: readSheepClassWithLambing(2),
      lambsHoggets: readSheepClassWithProportionLambsBorn(3),
    },
  });

  return {
    ...SheepFlockInputSchema.parse(sheepInput),
    ...HasIsFebruaryInLeapYearInputSchemaForSheep.parse({
      isFebruaryInLeapYear: false,
    }),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${col.columnOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 30 },
);

describe('3.4.1.1 Sheep enteric methane monthly', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.4-sheep-enteric/3.4-sheep-enteric.xlsx',
      '3.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 331, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate34SheepEntericMethane,
      '3.4',
    );
  });

  // it('method 2 matches spreadsheet results', async () => {
  //   const sheet = await getSheet(
  //     './src/modules/test/3.4-sheep-enteric.xlsx',
  //     '3.4.1.1',
  //   );

  //   const inputsAndOutputs = extractInputsAndOutput(sheet, 201, '2');

  //   compareInputsAndOutputs(inputsAndOutputs, calculate34SheepEntericMethane);
  // });
});
