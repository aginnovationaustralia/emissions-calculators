import {
  BaseGrainsCrop,
  BaseGrainsCropSchema,
  BaseGrainsCropTransformed,
} from '@/calculators/Grains/types/base-crop.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  PoultryManureClassesInput,
  PoultryMMS1To2AllocationInput,
} from '../../scope1/4-manure-management/poultry-manure.input';
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
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import * as col from './poultry-tab';

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

  const isInLeachingZone = cell(col.columnIsInLeachingZone) === 'yes';
  const climate = checkClimate(cell(col.columnClimate));
  const fractionAppliedToSoils = Number(cell(col.columnFractionAppliedToSoils));

  const headLayers = Number(cell(col.columnHeadClasses));
  const headMeatChickenGrowers = Number(cell(col.columnHeadClasses, 1));
  const headMeatChickenBreeder = Number(cell(col.columnHeadClasses, 2));
  const headMeatOther = Number(cell(col.columnHeadClasses, 3));

  const daysLayers = Number(cell(col.columnDays));
  const daysMeatChickenGrowers = Number(cell(col.columnDays, 1));
  const daysMeatChickenBreeder = Number(cell(col.columnDays, 2));
  const daysMeatOther = Number(cell(col.columnDays, 3));

  const method2NitrogenRetentionRateLayers = cell(
    col.columnMethod2NitrogenRetentionRate,
  );
  const method2NitrogenRetentionRateMeatChickenGrowers = cell(
    col.columnMethod2NitrogenRetentionRate,
    1,
  );
  const method2NitrogenRetentionRateMeatChickenBreeder = cell(
    col.columnMethod2NitrogenRetentionRate,
    2,
  );
  const method2NitrogenRetentionRateMeatOther = cell(
    col.columnMethod2NitrogenRetentionRate,
    3,
  );

  const method2DryMatterIntakeLayers = cell(col.columnMethod2DryMatterIntake);
  const method2DryMatterIntakeMeatChickenGrowers = cell(
    col.columnMethod2DryMatterIntake,
    1,
  );
  const method2DryMatterIntakeMeatChickenBreeder = cell(
    col.columnMethod2DryMatterIntake,
    2,
  );
  const method2DryMatterIntakeMeatOther = cell(
    col.columnMethod2DryMatterIntake,
    3,
  );

  const mms1LayersM10 = Number(cell(col.columnMms1M10) ?? 0);
  const mms1MeatChickenGrowersM10 = Number(cell(col.columnMms1M10, 1) ?? 0);
  const mms1MeatChickenBreederM10 = Number(cell(col.columnMms1M10, 2) ?? 0);
  const mms1MeatOtherM10 = Number(cell(col.columnMms1M10, 3) ?? 0);
  const mm1LayersM11a = Number(cell(col.columnMm1M11a) ?? 0);
  const mm1MeatChickenGrowersM11a = Number(cell(col.columnMm1M11a, 1) ?? 0);
  const mm1MeatChickenBreederM11a = Number(cell(col.columnMm1M11a, 2) ?? 0);
  const mm1MeatOtherM11a = Number(cell(col.columnMm1M11a, 3) ?? 0);
  const mm1LayersM11b = Number(cell(col.columnMm1M11b) ?? 0);
  const mm1MeatChickenGrowersM11b = Number(cell(col.columnMm1M11b, 1) ?? 0);
  const mm1MeatChickenBreederM11b = Number(cell(col.columnMm1M11b, 2) ?? 0);
  const mm1MeatOtherM11b = Number(cell(col.columnMm1M11b, 3) ?? 0);
  const mm1LayersM14 = Number(cell(col.columnMm1M14) ?? 0);
  const mm1MeatChickenGrowersM14 = Number(cell(col.columnMm1M14, 1) ?? 0);
  const mm1MeatChickenBreederM14 = Number(cell(col.columnMm1M14, 2) ?? 0);
  const mm1MeatOtherM14 = Number(cell(col.columnMm1M14, 3) ?? 0);

  const mms2M10SolidStorage = Number(cell(col.columnMms2M10Block) ?? 0);
  const mms2M10Composting = Number(cell(col.columnMms2M10Block, 1) ?? 0);
  const mms2M10Digester = Number(cell(col.columnMms2M10Block, 2) ?? 0);
  const mms2M10DirectProcessing = Number(cell(col.columnMms2M10Block, 3) ?? 0);
  const mms2M10DirectApplication = Number(cell(col.columnMms2M10Block, 4) ?? 0);
  const mms2M11aSolidStorage = Number(cell(col.columnMms2M11aBlock) ?? 0);
  const mms2M11aComposting = Number(cell(col.columnMms2M11aBlock, 1) ?? 0);
  const mms2M11aDigester = Number(cell(col.columnMms2M11aBlock, 2) ?? 0);
  const mms2M11aDirectProcessing = Number(
    cell(col.columnMms2M11aBlock, 3) ?? 0,
  );
  const mms2M11aDirectApplication = Number(
    cell(col.columnMms2M11aBlock, 4) ?? 0,
  );
  const mms2M11bSolidStorage = Number(cell(col.columnMms2M11bBlock) ?? 0);
  const mms2M11bComposting = Number(cell(col.columnMms2M11bBlock, 1) ?? 0);
  const mms2M11bDigester = Number(cell(col.columnMms2M11bBlock, 2) ?? 0);
  const mms2M11bDirectProcessing = Number(
    cell(col.columnMms2M11bBlock, 3) ?? 0,
  );
  const mms2M11bDirectApplication = Number(
    cell(col.columnMms2M11bBlock, 4) ?? 0,
  );

  const mms1To2Allocation: PoultryMMS1To2AllocationInput = {
    manureWithLitter: {
      solidStorage: mms2M10SolidStorage,
      composting: mms2M10Composting,
      digester: mms2M10Digester,
      directProcessing: mms2M10DirectProcessing,
      directApplication: mms2M10DirectApplication,
    },
    beltManureRemoval: {
      solidStorage: mms2M11aSolidStorage,
      composting: mms2M11aComposting,
      digester: mms2M11aDigester,
      directProcessing: mms2M11aDirectProcessing,
      directApplication: mms2M11aDirectApplication,
    },
    manureStoredInStorage: {
      solidStorage: mms2M11bSolidStorage,
      composting: mms2M11bComposting,
      digester: mms2M11bDigester,
      directProcessing: mms2M11bDirectProcessing,
      directApplication: mms2M11bDirectApplication,
    },
  };

  const classes: PoultryManureClassesInput = {
    layers: {
      head: headLayers,
      days: daysLayers,
      method2NitrogenRetentionRate:
        method2NitrogenRetentionRateLayers === undefined
          ? undefined
          : Number(method2NitrogenRetentionRateLayers),
      method2DryMatterIntake:
        method2DryMatterIntakeLayers === undefined
          ? undefined
          : Number(method2DryMatterIntakeLayers),
      manureAllocation: {
        manureWithLitter: mms1LayersM10,
        beltManureRemoval: mm1LayersM11a,
        manureStoredInStorage: mm1LayersM11b,
        pastureRangeAndPaddock: mm1LayersM14,
      },
    },
    meatChickenGrowers: {
      head: headMeatChickenGrowers,
      days: daysMeatChickenGrowers,
      method2NitrogenRetentionRate:
        method2NitrogenRetentionRateMeatChickenGrowers === undefined
          ? undefined
          : Number(method2NitrogenRetentionRateMeatChickenGrowers),
      method2DryMatterIntake:
        method2DryMatterIntakeMeatChickenGrowers === undefined
          ? undefined
          : Number(method2DryMatterIntakeMeatChickenGrowers),
      manureAllocation: {
        manureWithLitter: mms1MeatChickenGrowersM10,
        beltManureRemoval: mm1MeatChickenGrowersM11a,
        manureStoredInStorage: mm1MeatChickenGrowersM11b,
        pastureRangeAndPaddock: mm1MeatChickenGrowersM14,
      },
    },
    meatChickenBreeder: {
      head: headMeatChickenBreeder,
      days: daysMeatChickenBreeder,
      method2NitrogenRetentionRate:
        method2NitrogenRetentionRateMeatChickenBreeder === undefined
          ? undefined
          : Number(method2NitrogenRetentionRateMeatChickenBreeder),
      method2DryMatterIntake:
        method2DryMatterIntakeMeatChickenBreeder === undefined
          ? undefined
          : Number(method2DryMatterIntakeMeatChickenBreeder),
      manureAllocation: {
        manureWithLitter: mms1MeatChickenBreederM10,
        beltManureRemoval: mm1MeatChickenBreederM11a,
        manureStoredInStorage: mm1MeatChickenBreederM11b,
        pastureRangeAndPaddock: mm1MeatChickenBreederM14,
      },
    },
    meatOther: {
      head: headMeatOther,
      days: daysMeatOther,
      method2NitrogenRetentionRate:
        method2NitrogenRetentionRateMeatOther === undefined
          ? undefined
          : Number(method2NitrogenRetentionRateMeatOther),
      method2DryMatterIntake:
        method2DryMatterIntakeMeatOther === undefined
          ? undefined
          : Number(method2DryMatterIntakeMeatOther),
      manureAllocation: {
        manureWithLitter: mms1MeatOtherM10,
        beltManureRemoval: mm1MeatOtherM11a,
        manureStoredInStorage: mm1MeatOtherM11b,
        pastureRangeAndPaddock: mm1MeatOtherM14,
      },
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
          massAppliedKg: 0, // TODO: check this
          origin: {
            origin: 'Local',
            details: {
              type: 'poultry',
              classes,
              mms1To2Allocation,
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
  return Number(sheet.cell(`${col.columnExpectedResultLocal}${row}`).value());
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

    compareInputsAndOutputs(inputsAndOutputs, calculate52OrganicFertiliser);
  });
});
