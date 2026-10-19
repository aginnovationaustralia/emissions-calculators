import {
  InorganicFertiliserComponentTypeNonRegional,
  InorganicFertiliserComponentTypeRegional,
  InorganicFertiliserComponentOrigin,
} from '@/constants/enums';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculateScope3Fertiliser } from '../scope3/15.4-fertiliser/calculate';
import {
  FertiliserInputInorganicScope1Method1,
  HasFertiliserInput,
  HasFertiliserInputSchema,
  HasFertiliserInputTransformed,
} from '../scope1/5-fertiliser/fertiliser.input';
import { InorganicFertiliserInput } from '../scope1/5-fertiliser/inorganic-fertiliser.input';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import { checkInorganicFertiliserType } from './fertiliser-domain';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): HasFertiliserInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const fertiliserType = checkInorganicFertiliserType(cell('A'));
  const massAppliedKg = Number(cell('B'));

  const application: InorganicFertiliserInput =
    method === '1'
      ? {
          calculationMethodScope3: '1',
          fertiliserType,
          massAppliedKg: nv(massAppliedKg),
          components: cell('D')
            ? [
                {
                  componentType: cell(
                    'D',
                  ) as InorganicFertiliserComponentTypeRegional,
                  componentOrigin: cell(
                    'E',
                  ) as InorganicFertiliserComponentOrigin,
                  fractionOfFertiliser: nv(Number(cell('F'))),
                },
                {
                  componentType: cell(
                    'G',
                  ) as InorganicFertiliserComponentTypeNonRegional,
                  fractionOfFertiliser: nv(Number(cell('H'))),
                },
                {
                  fractionOfFertiliser: nv(Number(cell('I'))),
                  emissionFactor: nv(Number(cell('J'))),
                },
              ]
            : undefined,
        }
      : {
          calculationMethodScope3: '2',
          fertiliserType,
          massAppliedKg: nv(massAppliedKg),
          customScope3EmissionFactor: nv(Number(cell('D'))),
        };

  const raw: FertiliserInputInorganicScope1Method1 = {
    productionSystem: 'Irrigated crop',
    inorganic: {
      calculationMethodScope1: '1',
      applications: [application],
    },
    organic: { applications: [] },
  };

  const fertiliserInput: HasFertiliserInput = { fertiliser: raw };

  return HasFertiliserInputSchema.parse(fertiliserInput);
};

const getExpectedOutputMethod1 = (sheet: XLSX.Sheet, row: number): number =>
  Number(sheet.cell(`K${row}`).value());

const getExpectedOutputMethod2 = (sheet: XLSX.Sheet, row: number): number =>
  Number(sheet.cell(`E${row}`).value());

const extractMethod1 = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutputMethod1,
);
const extractMethod2 = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutputMethod2,
);

describe('15.4.1 Purchased fertiliser (scope 3)', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.4-fertiliser.xlsx',
      '15.4.1.1',
    );

    const inputsAndOutputs = extractMethod1(sheet, 4, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope3Fertiliser,
      '15.4',
    );
  });

  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.4-fertiliser.xlsx',
      '15.4.1.1',
    );

    const inputsAndOutputs = extractMethod2(sheet, 21, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope3Fertiliser,
      '15.4',
    );
  });
});
