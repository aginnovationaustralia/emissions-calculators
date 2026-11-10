import {
  HasClimateZoneInput,
  HasClimateZoneInputSchemaForCrops,
  HasClimateZoneInputTransformed,
} from '@/calculators/types/has-climate-zone.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculate52OrganicFertiliser } from '../../scope1/5-fertiliser/5.2-organic-fertiliser';
import {
  HasFertiliserInput,
  HasFertiliserInputSchema,
  HasFertiliserInputTransformed,
} from '../../scope1/5-fertiliser/fertiliser.input';
import { readDairyHerdFertiliser } from '../4.3-dairy-manure/common';
import { checkClimate } from '../fertiliser-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import * as col from './dairy-tab';

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

  if (cell('C') === undefined) {
    return undefined;
  }

  const herd = readDairyHerdFertiliser(sheet, row, '1', Number(cell('CA')));

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
                type: 'dairy',
                herds: [herd],
              },
            },
          },
        ],
      },
    },
  };

  const hasClimateZoneInput: HasClimateZoneInput = {
    climateZone: checkClimate(cell(col.columnClimateZone)),
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
  { rowInterval: 7 },
);

describe('5.2.1.1 dairy Organic Fertiliser N2O (local)', () => {
  it('method 1 purchased scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.2-organic-fertiliser-n2o/5.2-organic-fertiliser.xlsx',
      '5.2.1.1 (dairy)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 8, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate52OrganicFertiliser,
      '5.2',
    );
  });
});
