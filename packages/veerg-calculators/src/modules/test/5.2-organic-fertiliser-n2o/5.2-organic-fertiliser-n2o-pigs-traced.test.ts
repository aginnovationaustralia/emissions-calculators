import {
  HasClimateZoneInput,
  HasClimateZoneInputSchemaForCrops,
  HasClimateZoneInputTransformed,
} from '@/calculators/types/has-climate-zone.input';
import { PigsManureInput } from '@/modules/scope1/4-manure-management/4.5-pigs-manure';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculate52OrganicFertiliser } from '../../scope1/5-fertiliser/5.2-organic-fertiliser';
import {
  HasFertiliserInput,
  HasFertiliserInputSchema,
  HasFertiliserInputTransformed,
} from '../../scope1/5-fertiliser/fertiliser.input';
import { readPigsClass } from '../4.5-pigs-manure/common';
import { checkClimate } from '../fertiliser-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import * as col from './pigs-tab';

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

  if (cell('E') === undefined) {
    return undefined;
  }

  const climateZone = checkClimate(cell(col.columnClimate));
  const isInLeachingZone = cell(col.columnIsInLeachingZone) === 'true';
  const fractionAppliedToSoils = Number(cell(col.columnFractionAppliedToSoils));
  const pigsInput: PigsManureInput = {
    type: 'pigs',
    herds: [
      {
        classes: {
          boars: readPigsClass(sheet, row, '1'),
          sows: readPigsClass(sheet, row + 1, '1'),
          gilts: readPigsClass(sheet, row + 2, '1'),
          slaughterPigs: readPigsClass(sheet, row + 3, '1'),
        },

        fractionAppliedToSoils: nv(fractionAppliedToSoils),
        isInLeachingZone,
      },
    ],
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
              details: pigsInput,
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
  { rowInterval: 4 },
);

describe('5.2.1.1 Organic Fertiliser N2O (local)', () => {
  it('method 1 purchased scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.2-organic-fertiliser-n2o/5.2-organic-fertiliser.xlsx',
      '5.2.1.1 (pigs)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 8, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate52OrganicFertiliser,
      '5.2',
    );
  });
});
