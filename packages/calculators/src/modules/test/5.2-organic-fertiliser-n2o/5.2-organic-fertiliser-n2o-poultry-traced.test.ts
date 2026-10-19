import { PoultryMMSAllocationInput } from '@/calculators/Poultry/types/mms-allocation.input';
import {
  PoultryClassesLivestockInput,
  PoultryClassesSharedInput,
} from '@/calculators/Poultry/types/poultry-classes.input';
import {
  HasClimateZoneInput,
  HasClimateZoneInputSchemaForCrops,
  HasClimateZoneInputTransformed,
} from '@/calculators/types/has-climate-zone.input';
import { PoultryClass } from '@/constants/enums';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculate52OrganicFertiliser } from '../../scope1/5-fertiliser/5.2-organic-fertiliser';
import {
  HasFertiliserInput,
  HasFertiliserInputSchema,
  HasFertiliserInputTransformed,
} from '../../scope1/5-fertiliser/fertiliser.input';
import { checkClimate } from '../fertiliser-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import * as col from './poultry-tab';

export const readPoultryClass = (
  sheet: XLSX.Sheet,
  row: number,
): PoultryClassesLivestockInput[PoultryClass] => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  const nvOrZero = (column: string) => nv(Number(cell(column)) || 0);

  const head = Number(cell(col.columnHeadClasses));
  const days = Number(cell(col.columnDays));

  const manureAllocations: PoultryMMSAllocationInput = {
    manureWithLitter: {
      manureAllocated: nvOrZero(col.columnMms1M10),
      treatmentStage2Allocations: {
        solidStorage: nvOrZero('AF'),
        composting: nvOrZero('AG'),
        digester: nvOrZero('AH'),
        directProcessing: nvOrZero('AI'),
        directApplication: nvOrZero('AJ'),
      },
    },
    beltManureRemoval: {
      manureAllocated: nvOrZero(col.columnMm1M11a),
      treatmentStage2Allocations: {
        solidStorage: nvOrZero('AK'),
        composting: nvOrZero('AL'),
        digester: nvOrZero('AM'),
        directProcessing: nvOrZero('AN'),
        directApplication: nvOrZero('AO'),
      },
    },
    manureStoredInHouse: {
      manureAllocated: nvOrZero(col.columnMm1M11b),
      treatmentStage2Allocations: {
        solidStorage: nvOrZero('AP'),
        composting: nvOrZero('AQ'),
        digester: nvOrZero('AR'),
        directProcessing: nvOrZero('AS'),
        directApplication: nvOrZero('AT'),
      },
    },
    pastureRangeAndPaddock: nvOrZero(col.columnMm1M14),
  };

  const classInput: PoultryClassesLivestockInput[PoultryClass] = {
    head: nv(head),
    days: nv(days),
    manureAllocations,
  };

  return classInput;
};

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
):
  | (HasFertiliserInputTransformed & HasClimateZoneInputTransformed)
  | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell(col.columnScenarioKey) === undefined) {
    return undefined;
  }

  const isInLeachingZone = cell(col.columnIsInLeachingZone) === 'yes';
  const climateZone = checkClimate(cell(col.columnClimate));
  const fractionAppliedToSoils = Number(cell(col.columnFractionAppliedToSoils));

  const classes: PoultryClassesSharedInput = {
    layers: readPoultryClass(sheet, row),
    meatChickenGrowers: readPoultryClass(sheet, row + 1),
    meatChickenBreeders: readPoultryClass(sheet, row + 2),
    meatOther: readPoultryClass(sheet, row + 3),
  };

  const fertiliserInput: HasFertiliserInput = {
    fertiliser: {
      productionSystem: 'Non-irrigated pasture',
      inorganic: {
        applications: [],
        calculationMethodScope1: '1',
      },
      organic: {
        applications: [
          {
            origin: {
              origin: 'Traced',
              details: {
                type: 'poultry',
                flocks: [
                  {
                    classes,
                    isInLeachingZone,
                    fractionAppliedToSoils: nv(fractionAppliedToSoils),
                  },
                ],
              },
            },
          },
        ],
      },
    },
  };

  const hasClimateZoneInput: HasClimateZoneInput = {
    climateZone,
  };

  return {
    ...HasFertiliserInputSchema.parse(fertiliserInput),
    ...HasClimateZoneInputSchemaForCrops.parse(hasClimateZoneInput),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${col.columnExpectedResult}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 10 },
);

describe('5.2.1.1 Organic Fertiliser N2O (local)', () => {
  it('method 1 purchased scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.2-organic-fertiliser-n2o/5.2-organic-fertiliser.xlsx',
      '5.2.1.1 (poultry)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate52OrganicFertiliser,
      '5.2',
    );
  });
});
