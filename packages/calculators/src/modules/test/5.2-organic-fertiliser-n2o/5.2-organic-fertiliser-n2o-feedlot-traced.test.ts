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
  | (HasFertiliserInputTransformed & HasClimateZoneInputTransformed)
  | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell(col.columnScenarioKey) === undefined) {
    return undefined;
  }

  const lengthOfStayDays = Number(cell(col.columnLengthOfStayDays));
  const numberOfCattle = Number(cell(col.columnNumberOfCattle));
  const dryMatterIntake = cell(col.columnDryMatterIntake);
  const crudeProteinContent = cell(col.columnCrudeProteinContent);
  const fractionAppliedToSoils = Number(cell(col.columnFractionAppliedToSoils));
  const secondaryMMS = checkFeedlotMMSType(cell(col.columnSecondaryMMS));

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
              origin: 'Traced',
              details: {
                type: 'feedlot',
                groups: [
                  {
                    averageLengthOfStayDays: nv(lengthOfStayDays),
                    head: nv(numberOfCattle),
                    method2DryMatterIntake: nvo(
                      dryMatterIntake ? Number(dryMatterIntake) : undefined,
                    ),
                    method2CrudeProtein: nvo(
                      crudeProteinContent
                        ? Number(crudeProteinContent)
                        : undefined,
                    ),
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

describe('5.2.1.1 Organic Fertiliser N2O (local feedlot)', () => {
  it('method 1 purchased scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.2-organic-fertiliser-n2o/5.2-organic-fertiliser.xlsx',
      '5.2.1.1 (feedlot)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 8, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate52OrganicFertiliser,
      '5.2',
    );
  });
});
