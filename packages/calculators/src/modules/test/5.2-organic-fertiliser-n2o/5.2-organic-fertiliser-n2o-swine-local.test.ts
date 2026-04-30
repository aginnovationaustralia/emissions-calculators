import {
  BaseGrainsCrop,
  BaseGrainsCropSchema,
  BaseGrainsCropTransformed,
} from '@/calculators/Grains/types/base-crop.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { SwineMMSInput } from '../../scope1/4-manure-management/swine-manure.input';
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
import { checkClimate } from '../fertiliser-domain';
import { checkSwineMMSType } from '../livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import * as col from './swine';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
):
  | (FertiliserInputTransformed &
      CropResidueInputTransformed &
      BaseGrainsCropTransformed)
  | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell(col.columnScenarioKey) === undefined) {
    return undefined;
  }

  const totalNitrogenExcreted = Number(cell(col.columnTotalNitrogenExcreted));
  const climate = checkClimate(cell(col.columnClimate));
  const isInLeachingZone = cell(col.columnIsInLeachingZone) === 'yes';
  const fractionAppliedToSoils = Number(cell(col.columnFractionAppliedToSoils));
  const fractionOfManureToLiquidsMMS = Number(cell(col.columnFractionOfManureToLiquidsMMS));
  const fractionOfManureToSolidsMMS = Number(
    cell(col.columnFractionOfManureToSolidsMMS, 1),
  );
  const fractionOfNitrogenSeparatedToSolidStorage = Number(
    cell(col.columnFractionOfNitrogenSeparatedToSolidStorage),
  );
  const liquidsStage2DirectApplication =
    cell(col.columnStage2DirectApplication) === 'yes';
  const solidsStage2DirectApplication =
    cell(col.columnStage2DirectApplication, 1) === 'yes';
  const liquidsSystem1 = checkSwineMMSType(
    cell(col.columnLiquidsSolidsSystem1),
  );
  const solidsSystem1 = checkSwineMMSType(
    cell(col.columnLiquidsSolidsSystem1, 1),
  );
  const liquidsSystem2 = liquidsStage2DirectApplication
    ? 'Direct application'
    : checkSwineMMSType(cell(col.columnLiquidsSolidsSystem2));
  const solidsSystem2 = solidsStage2DirectApplication
    ? 'Direct application'
    : checkSwineMMSType(cell(col.columnLiquidsSolidsSystem2, 1));
  const fractionOfManureFromLiquidsStage1to2 = Number(
    cell(col.columnFractionStage1to2),
  );
  const fractionOfManureFromSolidsStage1to2 = Number(
    cell(col.columnFractionStage1to2, 1),
  );

  const mms: SwineMMSInput = {
    liquids: {
      liquidsSystem1,
      fractionOfManureToLiquidsMMS,
      fractionOfManureFromLiquidsStage1to2,
      liquidsSystem2,
    },
    solids: {
      fractionOfNitrogenSeparatedToSolidStorage,
      solidsSystem1,
      fractionOfManureToSolidsMMS,
      fractionOfManureFromSolidsStage1to2,
      solidsSystem2,
    },
  };

  const fertiliserInput: FertiliserInput = {
    inorganicFertilisers: {
      applications: [],
      calculationMethodScope1: '1',
      productionSystem: 'Non-irrigated crops',
    },
    organicFertilisers: {
      applications: [
        {
          massAppliedKg: totalNitrogenExcreted, // TODO: check this
          origin: {
            origin: 'Local',
            details: {
              type: 'swine',
              mms,
              totalNitrogenExcreted,
              fractionAppliedToSoils,
            },
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
    isInLeachingZone,
    electricityAllocation: 0,
  };

  return {
    ...FertiliserInputSchema.parse(fertiliserInput),
    ...CropResidueInputSchema.parse(cropResidueInput),
    ...BaseGrainsCropSchema.parse(baseCrop),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(
    sheet.cell(`${col.columnExpectedResultLocal}${row}`).value(),
  );
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 2 },
);

describe('5.2.1.1 Organic Fertiliser N2O (local)', () => {
  it('method 1 purchased scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.2-organic-fertiliser-n2o/5.2-organic-fertiliser.xlsx',
      '5.2.1.1 (swine)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 8, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate52OrganicFertiliser);
  });
});
