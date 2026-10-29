import {
  HasIsInLeachingZoneInput,
  hasIsInLeachingZoneInputSchema,
  HasIsInLeachingZoneInputTransformed,
} from '@/calculators/types/has-is-in-leaching.input';
import {
  HasStateInput,
  hasStateInputSchema,
  HasStateInputTransformed,
} from '@/calculators/types/has-state.input';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import { RESIDUE_LEACH_6_3 } from '@/tools/modules';
import XLSX from 'xlsx-populate';
import {
  calculate63ResidueLeachingAndRunoffN2O,
  HasCropOrPastureResidueInputTransformed,
  HasCropResidueInput,
  HasCropResidueInputSchema,
} from '../scope1/6-residue-mgmt';
import { checkCropType, cropTypeAndBurntFraction } from './crop-residue-domain';
import { checkState } from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
):
  | (HasCropOrPastureResidueInputTransformed &
      HasStateInputTransformed &
      HasIsInLeachingZoneInputTransformed)
  | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const isInLeachingZone = cell('A') === 'yes';
  const type = checkCropType(cell('C'));
  const state = checkState(cell('D'));
  const fractionOfAnnualCropBurnt = Number(cell('E'));
  const totalYieldKg = nv(Number(cell('G')));

  const residues = {
    calculationMethod: '1',
  } as const;

  const cropResidueInput: HasCropResidueInput = {
    crop: {
      ...cropTypeAndBurntFraction(type, fractionOfAnnualCropBurnt),
      totalYieldKg,
      residues,
    },
  };

  const hasStateInput: HasStateInput = {
    state,
  };

  const hasIsInLeachingZoneInput: HasIsInLeachingZoneInput = {
    isInLeachingZone,
  };

  return {
    ...hasStateInputSchema([RESIDUE_LEACH_6_3]).parse(hasStateInput),
    ...hasIsInLeachingZoneInputSchema(RESIDUE_LEACH_6_3).parse(
      hasIsInLeachingZoneInput,
    ),
    ...HasCropResidueInputSchema.parse(cropResidueInput),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`T${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('6.3.1.1 Leaching and runoff from crop residues N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.3-leaching-runoff.xlsx',
      '6.3.1.1 crop',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 5, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate63ResidueLeachingAndRunoffN2O,
      '6.3',
    );
  });
});
