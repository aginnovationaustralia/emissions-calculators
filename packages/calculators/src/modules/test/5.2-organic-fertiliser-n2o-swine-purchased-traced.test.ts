import {
  BaseGrainsCrop,
  BaseGrainsCropSchema,
  BaseGrainsCropTransformed,
} from '@/calculators/Grains/types/base-crop.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { SwineMMSInput } from '../scope1/4-manure-management/swine-manure.input';
import { calculate52OrganicFertiliser } from '../scope1/5-fertiliser/5.2-organic-fertiliser';
import {
  FertiliserInput,
  FertiliserInputSchema,
  FertiliserInputTransformed,
} from '../scope1/5-fertiliser/fertiliser.input';
import {
  CropResidueInput,
  CropResidueInputSchema,
  CropResidueInputTransformed,
} from '../scope1/6-residue-mgmt/crop-residue.input';
import { checkClimate } from './fertiliser-domain';
import { checkSwineMMSType } from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

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

  if (cell('B') === undefined) {
    return undefined;
  }

  const totalNitrogenExcreted = Number(cell('A'));
  const climate = checkClimate(cell('C'));
  const isInLeachingZone = cell('D') === 'yes';
  const fractionAppliedToSoils = Number(cell('E'));
  const fractionOfManureToLiquidsMMS = Number(cell('J'));
  const fractionOfManureToSolidsMMS = Number(cell('K', 1));
  const fractionOfNitrogenSeparatedToSolidStorage = Number(cell('I'));
  const liquidsStage2DirectApplication = cell('H') === 'yes';
  const solidsStage2DirectApplication = cell('H', 1) === 'yes';
  const liquidsSystem1 = checkSwineMMSType(cell('F'));
  const solidsSystem1 = checkSwineMMSType(cell('F', 1));
  const liquidsSystem2 = liquidsStage2DirectApplication
    ? 'Direct application'
    : checkSwineMMSType(cell('G'));
  const solidsSystem2 = solidsStage2DirectApplication
    ? 'Direct application'
    : checkSwineMMSType(cell('G', 1));
  const fractionOfManureFromLiquidsStage1to2 = Number(cell('T'));
  const fractionOfManureFromSolidsStage1to2 = Number(cell('T', 1));

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
            origin: 'Purchased_Traced',
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
  return Number(sheet.cell(`AF${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 2 },
);

describe('5.2.1.1 Organic Fertiliser N2O (purchased_traced)', () => {
  it('method 1 purchased scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.2-organic-fertiliser.xlsx',
      '5.2.1.1 (swine)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 8, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate52OrganicFertiliser);
  });
});
