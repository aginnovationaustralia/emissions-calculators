import type { SheepClassPeriodInput } from '@/calculators/Sheep/types/sheep-class-period.input';
import {
  SheepClassSeasonalInput,
  SheepClassWithLambingSeasonalInput,
  SheepClassWithProportionLambsBornSeasonalInput,
} from '@/calculators/Sheep/types/sheep-class-seasonal.input';
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
    };
  };

  const readSheepClass = (
    offset: number,
  ): SheepClassSeasonalInput | undefined => {
    const offsetRows = offset * 4;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      greasyWoolProduction: nv(0),
      cleanWoolYieldProportion: nv(0),
      spring: readSheepClassPeriod(offsetRows),
      summer: readSheepClassPeriod(offsetRows + 1),
      autumn: readSheepClassPeriod(offsetRows + 2),
      winter: readSheepClassPeriod(offsetRows + 3),
    };
  };

  const readSheepClassWithLambing = (
    offset: number,
  ): SheepClassWithLambingSeasonalInput | undefined => {
    const offsetRows = offset * 4;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      greasyWoolProduction: nv(0),
      cleanWoolYieldProportion: nv(0),
      spring: {
        ...readSheepClassPeriod(offsetRows),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows))),
        percentLambMarking: nv(Number(cell(col.columnMarkingRate, offsetRows))),
      },
      summer: {
        ...readSheepClassPeriod(offsetRows + 1),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows + 1))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 1)),
        ),
      },
      autumn: {
        ...readSheepClassPeriod(offsetRows + 2),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows + 2))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 2)),
        ),
      },
      winter: {
        ...readSheepClassPeriod(offsetRows + 3),
        percentLambing: nv(Number(cell(col.columnLambingRate, offsetRows + 3))),
        percentLambMarking: nv(
          Number(cell(col.columnMarkingRate, offsetRows + 3)),
        ),
      },
    };
  };

  const readSheepClassWithProportionLambsBorn = (
    offset: number,
  ): SheepClassWithProportionLambsBornSeasonalInput | undefined => {
    const offsetRows = offset * 4;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      greasyWoolProduction: nv(0),
      cleanWoolYieldProportion: nv(0),
      spring: {
        ...readSheepClassPeriod(offsetRows),
        proportionOfLambsBorn: nv(0),
      },
      summer: {
        ...readSheepClassPeriod(offsetRows + 1),
        proportionOfLambsBorn: nv(0),
      },
      autumn: {
        ...readSheepClassPeriod(offsetRows + 2),
        proportionOfLambsBorn: nv(0),
      },
      winter: {
        ...readSheepClassPeriod(offsetRows + 3),
        proportionOfLambsBorn: nv(0),
      },
    };
  };

  const sheepInput: SheepFlockInput = createSheepFlockInput({
    state: checkState(cell(col.columnState)),
    classes: {
      period: 'seasonal',
      rams: readSheepClass(0),
      wethers: readSheepClass(1),
      maidenEwes: readSheepClassWithLambing(2),
      breedingEwes: readSheepClassWithLambing(3),
      otherEwes: readSheepClass(4),
      lambsHoggets: readSheepClassWithProportionLambsBorn(5),
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

describe('3.4.1.1 Sheep enteric methane seasonal', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.4-sheep-enteric/3.4-sheep-enteric.xlsx',
      '3.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1', {
      expectedTests: 7,
    });

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate34SheepEntericMethane,
      '3.4',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.4-sheep-enteric/3.4-sheep-enteric.xlsx',
      '3.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 231, '2', {
      expectedTests: 3,
    });

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate34SheepEntericMethane,
      '3.4',
    );
  });
});
