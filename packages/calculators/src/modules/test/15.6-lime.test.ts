import { getSheet } from '@/test/common/sheets';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  HasLimeInput,
  HasLimeInputSchema,
  HasLimeInputTransformed,
} from '../scope1/5-fertiliser/lime.input';
import { calculateScope3SoilAmeliorants } from '../scope3/15.6-lime';
import { checkSoilAmeliorant } from './fertiliser-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): HasLimeInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const massAppliedKg = nv(Number(cell('A')));
  const limestoneFraction = Number(cell('B'));
  const type = checkSoilAmeliorant(cell('C'));
  const customEmissionsFactor = cell('D');

  const application =
    type === 'Gypsum'
      ? {
          massAppliedKg,
          type,
        }
      : {
          massAppliedKg,
          limestoneFraction: nv(limestoneFraction),
          type,
        };

  const limeInput: HasLimeInput = {
    lime: {
      applications: [
        {
          ...application,
          ...(method === '2' && customEmissionsFactor
            ? {
                customScope3EmissionsFactor: nvo(Number(customEmissionsFactor)),
              }
            : {}),
        },
      ],
    },
  };

  return HasLimeInputSchema.parse(limeInput);
};

const extractInputsAndOutputs = createSheetExtractor(getCalculatorInput, 'E');

describe('15.6.1.1 Purchased Lime', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.6-lime.xlsx',
      '15.6.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 5, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope3SoilAmeliorants,
      '15.6',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.6-lime.xlsx',
      '15.6.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope3SoilAmeliorants,
      '15.6',
    );
  });
});
