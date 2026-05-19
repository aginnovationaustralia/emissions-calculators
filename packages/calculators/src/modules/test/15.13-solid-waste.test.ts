import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateScope3WasteSolidWaste } from '../scope3/15.13-waste/15.13.2-solid-waste';
import {
  WasteInput,
  WasteInputSchema,
  WasteInputTransformed,
} from '../scope3/15.13-waste/waste.input';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import {
  checkOrganicWasteType,
  checkSolidWasteIncinerationType,
  checkSolidWasteLandfillType,
} from './waste-domain';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): WasteInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const massWasteTonnes = Number(cell('D'));
  const volumeWasteCubicMetres = Number(cell('E'));

  const amount =
    method === '1' ? { massWasteTonnes } : { volumeWasteCubicMetres };

  const wasteInput: WasteInput = {
    waste: {
      offsiteManure: [],
      solidWaste: {
        landfill: [],
        incineration: [],
        composting: [],
        anaerobicDigestion: [],
      },
    },
  };

  const wasteCategory = cell('A');
  if (wasteCategory === 'Landfill') {
    const landfillType = checkSolidWasteLandfillType(cell('B'));
    wasteInput.waste.solidWaste.landfill.push({
      type: landfillType,
      ...amount,
    });
  } else if (wasteCategory === 'Incineration') {
    const incinerationType = checkSolidWasteIncinerationType(cell('B'));
    wasteInput.waste.solidWaste.incineration.push({
      type: incinerationType,
      ...amount,
    });
  } else if (wasteCategory === 'Composting') {
    const compostingType = checkOrganicWasteType(cell('B'));
    wasteInput.waste.solidWaste.composting.push({
      type: compostingType,
      ...amount,
    });
  } else if (wasteCategory === 'Anaerobic digestion') {
    const anaerobicDigestionType = checkOrganicWasteType(cell('B'));
    wasteInput.waste.solidWaste.anaerobicDigestion.push({
      type: anaerobicDigestionType,
      ...amount,
    });
  } else {
    throw new Error(`Invalid waste category: ${wasteCategory}`);
  }

  return WasteInputSchema.parse(wasteInput);
};

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'F');

describe('15.13 Solid waste treatment scope 3', () => {
  it('mass based solid waste matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.13-waste.xlsx',
      '15.13.1.3',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope3WasteSolidWaste);
  });

  it('volume based solid waste matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.13-waste.xlsx',
      '15.13.1.3',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 15, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope3WasteSolidWaste);
  });
});
