import XLSX from 'xlsx-populate';
import {
  checkGrazingProductionSystemsWithRainfall,
  checkPureState,
} from '../livestock-domain';
import { SwineSpecificClassInput } from '@/calculators/Swine/types/swine-class.input';
import {
  SwineInput,
  SwineInputSchema,
  SwineInputTransformed,
} from '@/calculators/Swine/types/input';
import { SwineHerdInput } from '@/calculators/Swine/types/swine-herd.input';

export const readSwineClass = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): SwineSpecificClassInput | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('E') === undefined) return undefined;

  const head = Number(cell('F'));
  const days = Number(cell('G'));

  const manureAllocation = {
    anaerobicLagoon: Number(cell('K')),
    outdoorAndFreeRange: Number(cell('L')),
    digester: Number(cell('M')),
    deepLitter: Number(cell('N')),
    pitStorage: Number(cell('O')),
    solidStorage: Number(cell('P')),
  };

  const classInput: SwineSpecificClassInput = {
    head,
    days,
    manureAllocation: {
      ...manureAllocation,
      ...(method === '1'
        ? { solidsSeparatedPreTreatment: cell('Q') === 'true' }
        : {
            fractionSolidsSeparatedPreTreatment: Number(cell('R')),
            fractionNitrogenSeparatedPreTreatment: Number(cell('S')),
          }),
    },
  };

  if (method === '1') return classInput;

  classInput.method2AverageFeedIntake = Number(cell('H'));
  classInput.method2VolatileSolidProductionRate = Number(cell('I'));
  classInput.method2NitrogenWasteProductionRate = Number(cell('J'));

  return classInput;
};

export const getSimpleCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): SwineInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) return undefined;

  const herd: SwineHerdInput = {
    boars: readSwineClass(sheet, row, method),
    sows: readSwineClass(sheet, row + 1, method),
    gilts: readSwineClass(sheet, row + 2, method),
    others: readSwineClass(sheet, row + 3, method),
  };

  const swineInput: SwineInput = {
    state: checkPureState(cell('A')),
    productionSystem: checkGrazingProductionSystemsWithRainfall(cell('C')),
    isInLeachingZone: cell('D') === 'true',
    herds: [herd],
  };

  return SwineInputSchema.parse(swineInput);
};
