import {
  HasClimateZoneInput,
  HasClimateZoneInputSchemaForCrops,
  HasClimateZoneInputTransformed,
} from '@/calculators/types/has-climate-zone.input';
import { getSheet } from '@/test/common/sheets';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculate52OrganicFertiliser } from '../../scope1/5-fertiliser/5.2-organic-fertiliser';
import {
  HasFertiliserInput,
  HasFertiliserInputSchema,
  HasFertiliserInputTransformed,
} from '../../scope1/5-fertiliser/fertiliser.input';
import { checkClimate, checkLivestockManureType } from '../fertiliser-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import * as col from './purchased-untraced';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
):
  | (HasFertiliserInputTransformed & HasClimateZoneInputTransformed)
  | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell(col.columnMassAppliedKg) === undefined) {
    return undefined;
  }

  const massAppliedKg = Number(cell(col.columnMassAppliedKg));
  const livestockManureType = checkLivestockManureType(
    cell(col.columnLivestockManureType),
  );
  const customNitrogenFraction = cell(col.columnCustomNitrogenFraction)
    ? Number(cell(col.columnCustomNitrogenFraction))
    : undefined;
  const climateZone = checkClimate(cell(col.columnClimate));

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
              origin: 'Untraced',
              massAppliedKg: nv(massAppliedKg),
              organicFertiliserType: livestockManureType,
              ...(customNitrogenFraction
                ? {
                    customNitrogenFraction: nvo(customNitrogenFraction),
                  }
                : {}),
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
);

describe('5.2.1.1 Organic Fertiliser N2O (purchased_untraced)', () => {
  it('method 1 purchased scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.2-organic-fertiliser-n2o/5.2-organic-fertiliser.xlsx',
      '5.2.1.1 (purchased_untraced)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 17, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate52OrganicFertiliser,
      '5.2',
    );
  });
});
