import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  HasSolidWasteInputSchema,
  HasSolidWasteInputTransformed,
} from '../scope1/shared/solid-waste/input';
import { calculateScope3SolidWasteEmissions } from '../scope3/15.12-waste';
import { SolidWasteScope3Input } from '../scope3/15.12-waste/solid-waste-scope3.input';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import {
  checkManagedWasteTreatmentType,
  checkOrganicWasteType,
  checkSolidWasteIncinerationType,
  checkSolidWasteLandfillType,
} from './waste-domain';

const treatmentTypeToKeyName = {
  'Landfill (with gas recovery)': 'landfillWithGasRecovery',
  'Landfill (without gas recovery)': 'landfillWithoutGasRecovery',
  Incineration: 'incineration',
  Composting: 'composting',
  'Anaerobic Digestion': 'anaerobicDigestion',
} as const;

const readWasteRow = (sheet: XLSX.Sheet, row: number) => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  const massWasteTonnes = cell('C');
  const volumeWasteCubicMetres = cell('D');

  const amount =
    volumeWasteCubicMetres === undefined
      ? { massWasteTonnes: nv(Number(massWasteTonnes)) }
      : { volumeWasteCubicMetres: nv(Number(volumeWasteCubicMetres)) };

  const treatmentType = cell('A');

  switch (treatmentType) {
    case 'Landfill (without gas recovery)':
    case 'Landfill (with gas recovery)': {
      const landfillType = checkSolidWasteLandfillType(cell('B'));
      return {
        wasteType: landfillType,
        ...amount,
      };
    }
    case 'Incineration': {
      const incinerationType = checkSolidWasteIncinerationType(cell('B'));
      return {
        wasteType: incinerationType,
        ...amount,
      };
    }
    case 'Composting':
    case 'Anaerobic Digestion': {
      const organicType = checkOrganicWasteType(cell('B'));
      return {
        wasteType: organicType,
        ...amount,
      };
    }
    default: {
      throw new Error(
        `Invalid solid waste treatment facility: ${treatmentType}`,
      );
    }
  }
};

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): HasSolidWasteInputTransformed | undefined => {
  const cell = (column: string, offset = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const input: Partial<Record<keyof SolidWasteScope3Input, object[]>> = {};

  for (let i = 0; i < 8; i++) {
    const treatmentType = checkManagedWasteTreatmentType(cell('A', i));
    const keyName = treatmentTypeToKeyName[treatmentType];
    if (!input[keyName]) input[keyName] = [];

    input[keyName].push(readWasteRow(sheet, row + i));
  }

  return HasSolidWasteInputSchema.parse({
    waste: {
      treatedOffsite: input,
    },
  });
};

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'J', {
  rowInterval: 8,
});

describe('15.12 Solid waste treatment scope 3', () => {
  it('mass based solid waste matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.12-solid-waste.xlsx',
      '15.12',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 6, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope3SolidWasteEmissions,
      '15.12',
    );
  });
});
