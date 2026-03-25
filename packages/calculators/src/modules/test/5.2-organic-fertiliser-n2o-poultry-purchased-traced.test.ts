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
} from '../scope1/4-manure-management/poultry-manure.input';
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

  const isInLeachingZone = cell('C') === 'yes';
  const climate = checkClimate(cell('D'));
  const fractionAppliedToSoils = Number(cell('B'));

  const headLayers = Number(cell('F'));
  const headMeatChickenGrowers = Number(cell('F', 1));
  const headMeatChickenBreeder = Number(cell('F', 2));
  const headMeatOther = Number(cell('F', 3));

  const daysLayers = Number(cell('G'));
  const daysMeatChickenGrowers = Number(cell('G', 1));
  const daysMeatChickenBreeder = Number(cell('G', 2));
  const daysMeatOther = Number(cell('G', 3));

  const method2NitrogenRetentionRateLayers = cell('H');
  const method2NitrogenRetentionRateMeatChickenGrowers = cell('H', 1);
  const method2NitrogenRetentionRateMeatChickenBreeder = cell('H', 2);
  const method2NitrogenRetentionRateMeatOther = cell('H', 3);

  const method2DryMatterIntakeLayers = cell('I');
  const method2DryMatterIntakeMeatChickenGrowers = cell('I', 1);
  const method2DryMatterIntakeMeatChickenBreeder = cell('I', 2);
  const method2DryMatterIntakeMeatOther = cell('I', 3);

  const mms1LayersM10 = Number(cell('N') ?? 0);
  const mms1MeatChickenGrowersM10 = Number(cell('N', 1) ?? 0);
  const mms1MeatChickenBreederM10 = Number(cell('N', 2) ?? 0);
  const mms1MeatOtherM10 = Number(cell('N', 3) ?? 0);
  const mm1LayersM11a = Number(cell('O') ?? 0);
  const mm1MeatChickenGrowersM11a = Number(cell('O', 1) ?? 0);
  const mm1MeatChickenBreederM11a = Number(cell('O', 2) ?? 0);
  const mm1MeatOtherM11a = Number(cell('O', 3) ?? 0);
  const mm1LayersM11b = Number(cell('P') ?? 0);
  const mm1MeatChickenGrowersM11b = Number(cell('P', 1) ?? 0);
  const mm1MeatChickenBreederM11b = Number(cell('P', 2) ?? 0);
  const mm1MeatOtherM11b = Number(cell('P', 3) ?? 0);
  const mm1LayersM14 = Number(cell('Q') ?? 0);
  const mm1MeatChickenGrowersM14 = Number(cell('Q', 1) ?? 0);
  const mm1MeatChickenBreederM14 = Number(cell('Q', 2) ?? 0);
  const mm1MeatOtherM14 = Number(cell('Q', 3) ?? 0);

  const mms2M10SolidStorage = Number(cell('AG') ?? 0);
  const mms2M10Composting = Number(cell('AG', 1) ?? 0);
  const mms2M10Digester = Number(cell('AG', 2) ?? 0);
  const mms2M10DirectProcessing = Number(cell('AG', 3) ?? 0);
  const mms2M10DirectApplication = Number(cell('AG', 4) ?? 0);
  const mms2M11aSolidStorage = Number(cell('AH') ?? 0);
  const mms2M11aComposting = Number(cell('AH', 1) ?? 0);
  const mms2M11aDigester = Number(cell('AH', 2) ?? 0);
  const mms2M11aDirectProcessing = Number(cell('AH', 3) ?? 0);
  const mms2M11aDirectApplication = Number(cell('AH', 4) ?? 0);
  const mms2M11bSolidStorage = Number(cell('AI') ?? 0);
  const mms2M11bComposting = Number(cell('AI', 1) ?? 0);
  const mms2M11bDigester = Number(cell('AI', 2) ?? 0);
  const mms2M11bDirectProcessing = Number(cell('AI', 3) ?? 0);
  const mms2M11bDirectApplication = Number(cell('AI', 4) ?? 0);

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
            origin: 'Purchased_Traced',
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
  return Number(sheet.cell(`AW${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 10 },
);

describe('5.2.1.1 Organic Fertiliser N2O (purchased traced)', () => {
  it('method 1 purchased scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.2-organic-fertiliser.xlsx',
      '5.2.1.1 (poultry)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate52OrganicFertiliser);
  });
});
