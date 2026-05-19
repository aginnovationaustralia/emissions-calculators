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
import { checkClimate } from '../fertiliser-domain';
import { checkFeedlotMMSType } from '../livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import * as col from './feedlot-tab';

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
  const lengthOfStayDays = Number(cell(col.columnLengthOfStayDays));
  const numberOfCattle = Number(cell(col.columnNumberOfCattle));
  const dryMatterIntake = cell(col.columnDryMatterIntake);
  const crudeProteinContent = cell(col.columnCrudeProteinContent);
  const fractionAppliedToSoils = Number(cell(col.columnFractionAppliedToSoils));
  const directApplicationStage2 =
    cell(col.columnDirectApplicationStage2) === 'yes';
  const secondaryMMS = directApplicationStage2
    ? 'Direct application'
    : checkFeedlotMMSType(cell(col.columnSecondaryMMS));
  const tertiaryLagoonInUse = cell(col.columnTertiaryLagoonInUse) === 'yes';

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
          massAppliedKg: totalNitrogenExcreted, // TODO: check this
          origin: {
            origin: 'Purchased_Traced',
            details: {
              type: 'feedlot',
              herds: [
                {
                  lengthOfStayDays,
                  numberOfCattle,
                  dryMatterIntake: dryMatterIntake
                    ? Number(dryMatterIntake)
                    : undefined,
                  crudeProteinContent: crudeProteinContent
                    ? Number(crudeProteinContent)
                    : undefined,
                },
              ],
              fractionAppliedToSoils,
              secondaryMMS,
              tertiaryLagoonInUse,
            },
          },
        },
      ],
    },
  };

  // console.dir(fertiliserInput, { depth: null });

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
  return Number(
    sheet.cell(`${col.columnExpectedResultPurchasedTraced}${row}`).value(),
  );
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('5.2.1.1 Organic Fertiliser N2O (purchased traced feedlot)', () => {
  it('method 1 purchased scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.2-organic-fertiliser-n2o/5.2-organic-fertiliser.xlsx',
      '5.2.1.1 (feedlot)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 8, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate52OrganicFertiliser);
  });
});
