import {
  BaseGrainsCrop,
  BaseGrainsCropSchema,
  BaseGrainsCropTransformed,
} from '@/calculators/Grains/types/base-crop.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculate52OrganicFertiliser } from '../../scope1/5-fertiliser/5.2-organic-fertiliser';
import {
  FertiliserInput,
  FertiliserInputSchema,
  FertiliserInputTransformed,
} from '../../scope1/5-fertiliser/fertiliser.input';
import {
  CropResidueInput,
  CropResidueInputSchema,
  CropResidueInputTransformed,
} from '../../scope1/6-residue-mgmt/crop-residue.input';
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
  | (FertiliserInputTransformed &
      CropResidueInputTransformed &
      BaseGrainsCropTransformed)
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
  const climate = checkClimate(cell(col.columnClimate));

  const fertiliserInput: FertiliserInput = {
    inorganicFertilisers: {
      applications: [],
      calculationMethodScope1: '1',
      productionSystem: 'Non-irrigated crops',
    },
    organicFertilisers: {
      applications: [
        {
          massAppliedKg,
          origin: {
            origin: 'Purchased_Untraced',
            organicFertiliserType: livestockManureType,
            ...(customNitrogenFraction ? { customNitrogenFraction } : {}),
          },
        },
      ],
    },
  };

  const cropResidueInput: CropResidueInput = {
    rainfallAbove600: climate === 'wet',
    type: 'Cotton',
    averageYield: 1000,
    fractionOfAnnualCropBurnt: 0,
    cropResidues: {
      calculationMethod: '1',
    },
  };

  const baseCrop: BaseGrainsCrop = {
    state: 'vic',
    areaSown: 100,
    isInLeachingZone: false,
    electricityAllocation: 0,
  };

  return {
    ...FertiliserInputSchema.parse(fertiliserInput),
    ...CropResidueInputSchema.parse(cropResidueInput),
    ...BaseGrainsCropSchema.parse(baseCrop),
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

    compareInputsAndOutputs(inputsAndOutputs, calculate52OrganicFertiliser);
  });
});
