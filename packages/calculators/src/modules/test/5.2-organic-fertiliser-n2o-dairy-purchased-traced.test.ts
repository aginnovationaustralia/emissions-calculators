import {
  BaseGrainsCrop,
  BaseGrainsCropSchema,
  BaseGrainsCropTransformed,
} from '@/calculators/Grains/types/base-crop.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
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
import { checkDairySystem } from './livestock-domain';
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
  const headMilkingCows = Number(cell('C'));
  const headHeifersGt1 = Number(cell('C', 1));
  const headHeifersLt1 = Number(cell('C', 2));
  const headBullsGt1 = Number(cell('C', 3));
  const headBullsLt1 = Number(cell('C', 4));
  const customLiveweightWjMilkingCows = cell('D');
  const customLiveweightWjHeifersGt1 = cell('D', 1);
  const customLiveweightWjHeifersLt1 = cell('D', 2);
  const customLiveweightWjBullsGt1 = cell('D', 3);
  const customLiveweightWjBullsLt1 = cell('D', 4);
  const customLiveweightGainLWGjMilkingCows = cell('H');
  const customLiveweightGainLWGjHeifersGt1 = cell('H', 1);
  const customLiveweightGainLWGjHeifersLt1 = cell('H', 2);
  const customLiveweightGainLWGjBullsGt1 = cell('H', 3);
  const customLiveweightGainLWGjBullsLt1 = cell('H', 4);
  const customCrudeProteinCPjMilkingCows = cell('N');
  const customCrudeProteinCPjHeifersGt1 = cell('N', 1);
  const customCrudeProteinCPjHeifersLt1 = cell('N', 2);
  const customCrudeProteinCPjBullsGt1 = cell('N', 3);
  const customCrudeProteinCPjBullsLt1 = cell('N', 4);
  const customDMDDjMilkingCows = cell('Q');
  const customDMDDjHeifersGt1 = cell('Q', 1);
  const customDMDDjHeifersLt1 = cell('Q', 2);
  const customDMDDjBullsGt1 = cell('Q', 3);
  const customDMDDjBullsLt1 = cell('Q', 4);
  const litresPerHeadPerDay = Number(cell('Y')); // MPj

  const milkSolids = cell('AF'); // MSj
  const fractionAppliedToSoils = Number(cell('AG')); // PF
  const isInLeachingZone = cell('AH') === 'yes';
  const rainfallAbove600 = cell('AI') === 'wet';
  const fatContent = cell('AJ'); // FCj
  const proteinContent = cell('AK'); // PCj

  const system = checkDairySystem(cell('AV'));
  const customFmPastureProportion = cell('AW');
  const customFmMilkingShedProportion = cell('AX');
  const customFmFeedpadProportion = cell('AY');

  const milkingShedAnaerobicLagoon = Number(cell('BD') ?? 0);
  const milkingShedSumpDispersal = Number(cell('BD', 1) ?? 0);
  const milkingShedDrainToPaddock = Number(cell('BD', 2) ?? 0);
  const milkingShedSolidStorage = Number(cell('BD', 3) ?? 0);
  const feedPadAnaerobicLagoon = Number(cell('BE') ?? 0);
  const feedPadSumpDispersal = Number(cell('BE', 1) ?? 0);
  const feedPadDrainToPaddock = Number(cell('BE', 2) ?? 0);
  const feedPadSolidStorage = Number(cell('BE', 3) ?? 0);

  const totalNitrogenExcreted = 0; // TODO: check this

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
              type: 'dairy',
              system,
              method2TimeSpentOnPasture: customFmPastureProportion
                ? Number(customFmPastureProportion)
                : undefined,
              method2TimeSpentOnFeedpad: customFmFeedpadProportion
                ? Number(customFmFeedpadProportion)
                : undefined,
              method2TimeSpentOnMilkingShed: customFmMilkingShedProportion
                ? Number(customFmMilkingShedProportion)
                : undefined,
              fractionAppliedToSoils,
              classes: {
                milkingCows: {
                  head: headMilkingCows,
                  method2Liveweight: customLiveweightWjMilkingCows
                    ? Number(customLiveweightWjMilkingCows)
                    : undefined,
                  method2LiveweightGain: customLiveweightGainLWGjMilkingCows
                    ? Number(customLiveweightGainLWGjMilkingCows)
                    : undefined,
                  method2CrudeProteinContent: customCrudeProteinCPjMilkingCows
                    ? Number(customCrudeProteinCPjMilkingCows)
                    : undefined,
                  method2DryMatterDigestibility: customDMDDjMilkingCows
                    ? Number(customDMDDjMilkingCows)
                    : undefined,
                },
                heifersGt1: {
                  head: headHeifersGt1,
                  method2Liveweight: customLiveweightWjHeifersGt1
                    ? Number(customLiveweightWjHeifersGt1)
                    : undefined,
                  method2LiveweightGain: customLiveweightGainLWGjHeifersGt1
                    ? Number(customLiveweightGainLWGjHeifersGt1)
                    : undefined,
                  method2CrudeProteinContent: customCrudeProteinCPjHeifersGt1
                    ? Number(customCrudeProteinCPjHeifersGt1)
                    : undefined,
                  method2DryMatterDigestibility: customDMDDjHeifersGt1
                    ? Number(customDMDDjHeifersGt1)
                    : undefined,
                },
                heifersLt1: {
                  head: headHeifersLt1,
                  method2Liveweight: customLiveweightWjHeifersLt1
                    ? Number(customLiveweightWjHeifersLt1)
                    : undefined,
                  method2LiveweightGain: customLiveweightGainLWGjHeifersLt1
                    ? Number(customLiveweightGainLWGjHeifersLt1)
                    : undefined,
                  method2CrudeProteinContent: customCrudeProteinCPjHeifersLt1
                    ? Number(customCrudeProteinCPjHeifersLt1)
                    : undefined,
                  method2DryMatterDigestibility: customDMDDjHeifersLt1
                    ? Number(customDMDDjHeifersLt1)
                    : undefined,
                },
                bullsGt1: {
                  head: headBullsGt1,
                  method2Liveweight: customLiveweightWjBullsGt1
                    ? Number(customLiveweightWjBullsGt1)
                    : undefined,
                  method2LiveweightGain: customLiveweightGainLWGjBullsGt1
                    ? Number(customLiveweightGainLWGjBullsGt1)
                    : undefined,
                  method2CrudeProteinContent: customCrudeProteinCPjBullsGt1
                    ? Number(customCrudeProteinCPjBullsGt1)
                    : undefined,
                  method2DryMatterDigestibility: customDMDDjBullsGt1
                    ? Number(customDMDDjBullsGt1)
                    : undefined,
                },
                bullsLt1: {
                  head: headBullsLt1,
                  method2Liveweight: customLiveweightWjBullsLt1
                    ? Number(customLiveweightWjBullsLt1)
                    : undefined,
                  method2LiveweightGain: customLiveweightGainLWGjBullsLt1
                    ? Number(customLiveweightGainLWGjBullsLt1)
                    : undefined,
                  method2CrudeProteinContent: customCrudeProteinCPjBullsLt1
                    ? Number(customCrudeProteinCPjBullsLt1)
                    : undefined,
                  method2DryMatterDigestibility: customDMDDjBullsLt1
                    ? Number(customDMDDjBullsLt1)
                    : undefined,
                },
              },
              milkProduction: milkSolids
                ? {
                    kgSolidsPerHeadPerDay: Number(milkSolids),
                    fatContent: Number(fatContent),
                    proteinContent: Number(proteinContent),
                  }
                : { litresPerHeadPerDay },
              milkingShedMMSAllocation: {
                anaerobicLagoon: milkingShedAnaerobicLagoon,
                sumpDispersal: milkingShedSumpDispersal,
                drainToPaddock: milkingShedDrainToPaddock,
                solidStorage: milkingShedSolidStorage,
              },
              feedPadMMSAllocation: {
                anaerobicLagoon: feedPadAnaerobicLagoon,
                sumpDispersal: feedPadSumpDispersal,
                drainToPaddock: feedPadDrainToPaddock,
                solidStorage: feedPadSolidStorage,
              },
            },
          },
        },
      ],
    },
  };

  // console.log(row);
  // console.dir(fertiliserInput, { depth: null });

  const cropResidueInput: CropResidueInput = {
    rainfallAbove600,
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
  return Number(sheet.cell(`BU${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 5 },
);

describe('5.2.1.1 dairy Organic Fertiliser N2O (purchased_traced)', () => {
  it('method 1 purchased scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.2-organic-fertiliser.xlsx',
      '5.2.1.1 (dairy)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate52OrganicFertiliser);
  });
});
