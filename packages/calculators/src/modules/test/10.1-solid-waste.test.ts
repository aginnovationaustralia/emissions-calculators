import { ExecutionContext } from '@/calculators/executionContext';
import { GasType } from '@/constants/types';
import { getSheet } from '@/test/common/sheets';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  calculate10SolidWasteEmissions,
  SolidWasteScope1Input,
} from '../scope1/10-solid-waste';
import {
  HasSolidWasteInputSchema,
  HasSolidWasteInputTransformed,
} from '../scope1/shared/solid-waste/input';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import {
  checkOrganicWasteType,
  checkScope1WasteTreatmentType,
  checkSolidWasteNonStreamType,
} from './waste-domain';

const treatmentTypeToKeyName = {
  Burial: 'unmanagedBurial',
  'Unmanaged - deep': 'unmanagedDeep',
  'Unmanaged - shallow': 'unmanagedShallow',
  Composting: 'composting',
  'Anaerobic Digestion': 'anaerobicDigestion',
  Incineration: 'incineration',
} as const;

const createSolidWasteWrapper = (gas: GasType) => {
  const key =
    gas === 'CO2'
      ? 'solidWasteCO2'
      : gas === 'CH4'
        ? 'solidWasteCH4'
        : 'solidWasteN2O';
  return (input: HasSolidWasteInputTransformed, context: ExecutionContext) =>
    calculate10SolidWasteEmissions(input, context)[key];
};

const calculateSolidWasteCO2 = createSolidWasteWrapper('CO2');
const calculateSolidWasteCH4 = createSolidWasteWrapper('CH4');
const calculateSolidWasteN2O = createSolidWasteWrapper('N2O');

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
  const wasteTypeUnchecked = cell('B');
  const wasteType =
    treatmentType === 'Composting' || treatmentType === 'Anaerobic Digestion'
      ? checkOrganicWasteType(wasteTypeUnchecked)
      : checkSolidWasteNonStreamType(wasteTypeUnchecked);

  return {
    wasteType,
    ...amount,
  };
};

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): HasSolidWasteInputTransformed | undefined => {
  const cell = (column: string, rowOffset = 0) =>
    sheet
      .cell(`${column}${row + rowOffset}`)
      .value()
      ?.toString();

  if (cell('V') === undefined) return undefined;

  if (method === '1') {
    const input: SolidWasteScope1Input = {
      method: '1',
      composting: nvo(Number(cell('A')) || undefined),
      anaerobicDigestion: nvo(Number(cell('B')) || undefined),
      incineration: nvo(Number(cell('C')) || undefined),
      unmanagedDeep: nvo(Number(cell('D')) || undefined),
      unmanagedShallow: nvo(Number(cell('E')) || undefined),
      unmanagedBurial: nvo(Number(cell('F')) || undefined),
    };

    return HasSolidWasteInputSchema.parse({ waste: { treatedOnsite: input } });
  }

  const input: Partial<
    Record<Exclude<keyof SolidWasteScope1Input, 'method'>, object[]>
  > & {
    method: '2';
  } = {
    method: '2',
  };

  for (let i = 0; i < 10; i++) {
    const treatmentType = checkScope1WasteTreatmentType(cell('A', i));
    const keyName = treatmentTypeToKeyName[treatmentType];
    if (!input[keyName]) input[keyName] = [];

    input[keyName].push(readWasteRow(sheet, row + i));
  }

  return HasSolidWasteInputSchema.parse({
    waste: {
      treatedOnsite: input,
    },
  });
};

const createExtractor = (cell: string, options?: { rowInterval?: number }) =>
  createSheetExtractor(getCalculatorInput, cell, options);

describe('10.1 Solid waste treatment scope 1, method 1', () => {
  it('method 1 CO2 spreadsheet matches results', async () => {
    const sheet = await getSheet(
      './src/modules/test/10.1-solid-waste.xlsx',
      '10.1',
    );

    const inputsAndOutputs = createExtractor('T')(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateSolidWasteCO2, '10.1');
  });
  it('method 1 CH4 spreadsheet matches results', async () => {
    const sheet = await getSheet(
      './src/modules/test/10.1-solid-waste.xlsx',
      '10.1',
    );

    const inputsAndOutputs = createExtractor('U')(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateSolidWasteCH4, '10.1');
  });
  it('method 1 N2O spreadsheet matches results', async () => {
    const sheet = await getSheet(
      './src/modules/test/10.1-solid-waste.xlsx',
      '10.1',
    );

    const inputsAndOutputs = createExtractor('V')(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateSolidWasteN2O, '10.1');
  });
});

describe('10.1 Solid waste treatment scope 1, method 2', () => {
  it('method 2 CO2 spreadsheet matches results', async () => {
    const sheet = await getSheet(
      './src/modules/test/10.1-solid-waste.xlsx',
      '10.1',
    );

    const inputsAndOutputs = createExtractor('X', { rowInterval: 10 })(
      sheet,
      17,
      '2',
    );

    compareInputsAndOutputs(inputsAndOutputs, calculateSolidWasteCO2, '10.1');
  });
  it('method 2 CH4 spreadsheet matches results', async () => {
    const sheet = await getSheet(
      './src/modules/test/10.1-solid-waste.xlsx',
      '10.1',
    );

    const inputsAndOutputs = createExtractor('Y', { rowInterval: 10 })(
      sheet,
      17,
      '2',
    );

    compareInputsAndOutputs(inputsAndOutputs, calculateSolidWasteCH4, '10.1');
  });
  it('method 2 N2O spreadsheet matches results', async () => {
    const sheet = await getSheet(
      './src/modules/test/10.1-solid-waste.xlsx',
      '10.1',
    );

    const inputsAndOutputs = createExtractor('Z', { rowInterval: 10 })(
      sheet,
      17,
      '2',
    );

    compareInputsAndOutputs(inputsAndOutputs, calculateSolidWasteN2O, '10.1');
  });
});
