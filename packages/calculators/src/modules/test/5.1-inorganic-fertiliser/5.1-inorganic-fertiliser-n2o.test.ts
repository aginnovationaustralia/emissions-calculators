import {
  InorganicFertiliserComponentInput,
  InorganicFertiliserInput,
} from '@/calculators/AllModules';
import { InorganicFertiliserComponentType } from '@/constants/enums';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculateInorganicFertiliserN2O } from '../../scope1/5-fertiliser/5.1-inorganic-fertiliser';
import {
  FertiliserInput,
  FertiliserInputInorganicScope1Method1,
  FertiliserInputInorganicScope1Method2,
  HasFertiliserInput,
  HasFertiliserInputSchema,
  HasFertiliserInputTransformed,
} from '../../scope1/5-fertiliser/fertiliser.input';
import {
  checkBasicCropProductionSystem,
  checkInorganicFertiliserComponentNonRegionalType,
  checkInorganicFertiliserType,
  checkProductionSystemsInorganicFertilisers,
} from '../fertiliser-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';

const getComponents = (sheet: XLSX.Sheet, row: number) => {
  const cell = (column: string, offset = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('E') === undefined) return undefined;
  const components: InorganicFertiliserComponentInput[] = [];
  for (let offset = 0; offset < 4; offset++) {
    const componentType: InorganicFertiliserComponentType =
      checkInorganicFertiliserComponentNonRegionalType(cell('E', offset));
    components.push({
      componentType: componentType,
      fractionOfFertiliser: nv(Number(cell('F', offset))),
    } as InorganicFertiliserComponentInput);
  }
  return components;
};

const getFertiliserApplication = (
  sheet: XLSX.Sheet,
  row: number,
): InorganicFertiliserInput => {
  const cell = (column: string, offset = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();
  const fertiliserType = checkInorganicFertiliserType(cell('B'));
  const massAppliedKg = nv(Number(cell('D')));

  return {
    calculationMethodScope3: '1',
    fertiliserType,
    massAppliedKg,
    components: getComponents(sheet, row),
  };
};

const getFertilisersInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): FertiliserInput => {
  const cell = (column: string, offset = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();
  const application = getFertiliserApplication(sheet, row);
  if (method === '1') {
    const result: FertiliserInputInorganicScope1Method1 = {
      productionSystem: checkBasicCropProductionSystem(cell('A')),
      inorganic: {
        applications: [application],
        calculationMethodScope1: '1',
      },
      organic: {
        applications: [],
      },
    };

    return result;
  }

  const areaAppliedHectares = Number(cell('C'));

  const result: FertiliserInputInorganicScope1Method2 = {
    productionSystem: checkProductionSystemsInorganicFertilisers(cell('A')),
    inorganic: {
      applications: [application],
      areaAppliedHectares: nv(areaAppliedHectares),
      calculationMethodScope1: '2',
    },
    organic: {
      applications: [],
    },
  };

  return result;
};

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): HasFertiliserInputTransformed | undefined => {
  const cell = (column: string, offset = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const fertiliser = getFertilisersInput(sheet, row, method);

  const fertiliserInput: HasFertiliserInput = {
    fertiliser,
  };

  return HasFertiliserInputSchema.parse(fertiliserInput);
};

const getMultiFertiliserCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): HasFertiliserInputTransformed | undefined => {
  const cell = (column: string, offset = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const applications: InorganicFertiliserInput[] = [];
  for (let offset = 0; offset < 4; offset++) {
    applications.push(getFertiliserApplication(sheet, row + offset));
  }

  if (method === '1') {
    const fertiliser: FertiliserInputInorganicScope1Method1 = {
      productionSystem: checkBasicCropProductionSystem(cell('A')),
      inorganic: {
        applications,
        calculationMethodScope1: '1',
      },
      organic: {
        applications: [],
      },
    };
    return HasFertiliserInputSchema.parse({ fertiliser });
  }

  const areaAppliedHectares = Number(cell('C'));

  const fertiliser: FertiliserInputInorganicScope1Method2 = {
    productionSystem: checkProductionSystemsInorganicFertilisers(cell('A')),
    inorganic: {
      applications,
      areaAppliedHectares: nv(areaAppliedHectares),
      calculationMethodScope1: '2',
    },
    organic: {
      applications: [],
    },
  };

  return HasFertiliserInputSchema.parse({ fertiliser });
};

describe('5.1.1.1 Inorganic Fertiliser N2O - Method 1', () => {
  it('basic scenarios match spreadsheet results', async () => {
    const extractInputsAndOutput = createSheetExtractor(
      getCalculatorInput,
      'L',
    );
    const sheet = await getSheet(
      './src/modules/test/5.1-inorganic-fertiliser/5.1-inorganic-fertiliser.xlsx',
      '5.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 4, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateInorganicFertiliserN2O,
      '5.1',
    );
  });
  it('scenarios with custom components match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.1-inorganic-fertiliser/5.1-inorganic-fertiliser.xlsx',
      '5.1.1.1',
    );

    const extractInputsAndOutput = createSheetExtractor(
      getCalculatorInput,
      'L',
      { rowInterval: 4 },
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateInorganicFertiliserN2O,
      '5.1',
    );
  });
});

describe('5.1.1.2 Inorganic Fertiliser N2O - Method 2', () => {
  it('simple scenarios match spreadsheet results', async () => {
    const workbook = await getSheet(
      './src/modules/test/5.1-inorganic-fertiliser/5.1-inorganic-fertiliser.xlsx',
      '5.1.1.2',
    );

    const extractInputsAndOutput = createSheetExtractor(
      getCalculatorInput,
      'M',
    );

    const inputsAndOutputs = extractInputsAndOutput(workbook, 4, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateInorganicFertiliserN2O,
      '5.1',
    );
  });
  it('multiple N fertiliser scenarios match spreadsheet results', async () => {
    const workbook = await getSheet(
      './src/modules/test/5.1-inorganic-fertiliser/5.1-inorganic-fertiliser.xlsx',
      '5.1.1.2',
    );

    const extractInputsAndOutput = createSheetExtractor(
      getMultiFertiliserCalculatorInput,
      'M',
      { rowInterval: 4 },
    );

    const inputsAndOutputs = extractInputsAndOutput(workbook, 19, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateInorganicFertiliserN2O,
      '5.1',
    );
  });
});
