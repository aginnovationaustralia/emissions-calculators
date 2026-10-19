import {
  HasIsInLeachingZoneInput,
  HasIsInLeachingZoneInputSchemaForFertiliser,
  HasIsInLeachingZoneInputTransformed,
} from '@/calculators/types/has-is-in-leaching.input';
import { getSheet } from '@/test/common/sheets';
import { testContext } from '@/test/Grains/context';
import {
  zeroDairyMMSAllocation,
  zeroPigsManureAllocation,
  zeroPoultryMMS2Allocation,
} from '@/test/inputs/zero-input';
import { collectInputs } from '@/tools/collect';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  calculateLeachingAndRunoffN2O,
  HasFertiliserInput,
  HasFertiliserInputSchema,
  HasFertiliserInputTransformed,
} from '../scope1/5-fertiliser';
import { OrganicFertiliserTracedInput } from '../scope1/5-fertiliser/organic-fertiliser-traced.input';
import { checkBasicCropProductionSystem } from './fertiliser-domain';
import { checkFeedlotSecondaryMMSType } from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const columnLengthOfStayDays = 'A';
const columnHead = 'J';
const columnFractionAppliedToSoils = 'M';
const columnSecondaryMMS = 'N';
const columnProductionSystem = 'AH';
const columnIsInLeachingZone = 'AJ';
const columnResult = 'AP';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
):
  | (HasFertiliserInputTransformed & HasIsInLeachingZoneInputTransformed)
  | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell(columnLengthOfStayDays) === undefined) {
    return undefined;
  }

  const lengthOfStayDays = Number(cell(columnLengthOfStayDays));
  const head = Number(cell(columnHead));
  const fractionAppliedToSoils = Number(cell(columnFractionAppliedToSoils));
  const secondaryMMS = checkFeedlotSecondaryMMSType(cell(columnSecondaryMMS));
  const productionSystem = checkBasicCropProductionSystem(
    cell(columnProductionSystem),
  );
  const localFeedlot: OrganicFertiliserTracedInput = {
    origin: 'Traced',
    details: {
      type: 'feedlot',
      groups: [
        {
          averageLengthOfStayDays: nv(lengthOfStayDays),
          head: nv(head),
          manureAllocations: {
            directApplication: nv(0),
            solidStorage: nv(0),
            composting: nv(0),
            ...{
              [secondaryMMS]: nv(1),
            },
          },
        },
      ],
      fractionAppliedToSoils: nv(fractionAppliedToSoils),
    },
  };

  const fertiliserInput: HasFertiliserInput = {
    fertiliser: {
      inorganic: {
        applications: [],
        calculationMethodScope1: '1',
      },
      productionSystem,
      organic: {
        applications: [
          {
            origin: localFeedlot,
          },
        ],
      },
    },
  };
  const hasIsInLeachingZoneInput: HasIsInLeachingZoneInput = {
    isInLeachingZone: cell(columnIsInLeachingZone) === 'true',
  };

  return {
    ...HasFertiliserInputSchema.parse(fertiliserInput),
    ...HasIsInLeachingZoneInputSchemaForFertiliser.parse(
      hasIsInLeachingZoneInput,
    ),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnResult}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('5.5.1.1 Fertiliser leaching and runoff N2O (organic)', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.5-leaching-runoff.xlsx',
      '5.5.1.1 (feedlot local)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateLeachingAndRunoffN2O,
      '5.5',
    );
  });

  // These tests don't check the calculated result - they only exist to confirm
  // every input consumed for these manure types is tagged with '5.5', since
  // organic fertiliser leaching and runoff can be fed manure from any livestock
  // type, not just feedlot (which is the only type covered by the spreadsheet-driven
  // test above).
  it('tags all inputs consumed for pigs manure with 5.5', async () => {
    const localPigs: OrganicFertiliserTracedInput = {
      origin: 'Traced',
      details: {
        type: 'pigs',
        herds: [
          {
            classes: {
              slaughterPigs: {
                head: nv(100),
                days: nv(365),
                manureAllocations: zeroPigsManureAllocation,
              },
            },
            isInLeachingZone: false,
            fractionAppliedToSoils: nv(0.5),
          },
        ],
      },
    };

    const fertiliserInput: HasFertiliserInput = {
      fertiliser: {
        inorganic: {
          applications: [],
          calculationMethodScope1: '1',
        },
        productionSystem: 'Non-irrigated pasture',
        organic: {
          applications: [{ origin: localPigs }],
        },
      },
    };

    const parsed = {
      ...HasFertiliserInputSchema.parse(fertiliserInput),
      ...HasIsInLeachingZoneInputSchemaForFertiliser.parse({
        isInLeachingZone: false,
      }),
    };

    const output = calculateLeachingAndRunoffN2O(parsed, testContext());

    const collectedInputs = collectInputs(output);

    expect(collectedInputs).toEqual(
      expect.arrayOf(
        expect.objectContaining({
          modules: expect.arrayContaining(['5.5']),
        }),
      ),
    );
  });

  it('tags all inputs consumed for dairy manure with 5.5', async () => {
    const localDairy: OrganicFertiliserTracedInput = {
      origin: 'Traced',
      details: {
        type: 'dairy',
        herds: [
          {
            classes: {
              milkingCows: {
                head: nv(50),
              },
            },
            milkProduction: {
              litresPerHeadPerDay: nv(20),
            },
            breed: 'Holstein-Friesian',
            manureAllocations: {
              milkingShedMMSAllocation: {
                ...zeroDairyMMSAllocation,
                solidStorage: nv(1),
              },
              feedPadMMSAllocation: {
                ...zeroDairyMMSAllocation,
                solidStorage: nv(1),
              },
            },
            isInLeachingZone: false,
            system: 'Grazed only',
            fractionAppliedToSoils: nv(0.5),
          },
        ],
      },
    };

    const fertiliserInput: HasFertiliserInput = {
      fertiliser: {
        inorganic: {
          applications: [],
          calculationMethodScope1: '1',
        },
        productionSystem: 'Non-irrigated pasture',
        organic: {
          applications: [{ origin: localDairy }],
        },
      },
    };

    const parsed = {
      ...HasFertiliserInputSchema.parse(fertiliserInput),
      ...HasIsInLeachingZoneInputSchemaForFertiliser.parse({
        isInLeachingZone: false,
      }),
    };

    const output = calculateLeachingAndRunoffN2O(parsed, testContext());

    const collectedInputs = collectInputs(output);

    expect(collectedInputs).toEqual(
      expect.arrayOf(
        expect.objectContaining({
          modules: expect.arrayContaining(['5.5']),
        }),
      ),
    );
  });

  it('tags all inputs consumed for poultry manure with 5.5', async () => {
    const localPoultry: OrganicFertiliserTracedInput = {
      origin: 'Traced',
      details: {
        type: 'poultry',
        flocks: [
          {
            classes: {
              layers: {
                head: nv(1000),
                days: nv(365),
                manureAllocations: {
                  manureWithLitter: {
                    manureAllocated: nv(0),
                    treatmentStage2Allocations: zeroPoultryMMS2Allocation,
                  },
                  beltManureRemoval: {
                    manureAllocated: nv(0),
                    treatmentStage2Allocations: zeroPoultryMMS2Allocation,
                  },
                  manureStoredInHouse: {
                    manureAllocated: nv(0),
                    treatmentStage2Allocations: zeroPoultryMMS2Allocation,
                  },
                  pastureRangeAndPaddock: nv(1),
                },
              },
            },
            isInLeachingZone: false,
            fractionAppliedToSoils: nv(0.5),
          },
        ],
      },
    };

    const fertiliserInput: HasFertiliserInput = {
      fertiliser: {
        inorganic: {
          applications: [],
          calculationMethodScope1: '1',
        },
        productionSystem: 'Non-irrigated pasture',
        organic: {
          applications: [{ origin: localPoultry }],
        },
      },
    };

    const parsed = {
      ...HasFertiliserInputSchema.parse(fertiliserInput),
      ...HasIsInLeachingZoneInputSchemaForFertiliser.parse({
        isInLeachingZone: false,
      }),
    };

    const output = calculateLeachingAndRunoffN2O(parsed, testContext());

    const collectedInputs = collectInputs(output);

    expect(collectedInputs).toEqual(
      expect.arrayOf(
        expect.objectContaining({
          modules: expect.arrayContaining(['5.5']),
        }),
      ),
    );
  });
});
