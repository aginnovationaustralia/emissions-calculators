import { DairyHerdInputTransformed } from '@/calculators/Dairy/types/herd.input';
import { getSheet } from '@/test/common/sheets';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { DairyMilkProductionInput } from '../../calculators/Dairy/types/milk.input';
import { calculate33EntericMethaneForHerd } from '../scope1/3-enteric-methane/3.3-dairy-enteric';
import { checkDairyBreed } from './dairy-domain';
import { createDairyHerdInputTransformed } from './factory';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const columnBreed = 'C';
const columnHead = 'E';
const columnCustomDurationDays = 'F';
const columnCustomLiveweight = 'H';
const columnCustomLiveweightGain = 'J';
const columnMilkProduction = 'O';
const columnMilkSolids = 'N';
const columnCustomFatContent = 'V';
const columnCustomProteinContent = 'X';
const columnCustomDryMatterDigestibility = 'AB';
const columnOutput = 'AG';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): DairyHerdInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const readDairyClass = (offset: number) => {
    const head = Number(cell(columnHead, offset));
    const customDurationDays = cell(columnCustomDurationDays, offset);
    const customLiveweight = cell(columnCustomLiveweight, offset);
    const customLiveweightGain = cell(columnCustomLiveweightGain, offset);
    const customDryMatterDigestibility = cell(
      columnCustomDryMatterDigestibility,
    );
    const method2Liveweight =
      method === '2' && customLiveweight ? Number(customLiveweight) : undefined;
    const method2LiveweightGain =
      method === '2' && customLiveweightGain
        ? Number(customLiveweightGain)
        : undefined;
    const method2DurationDays =
      method === '2' && customDurationDays
        ? Number(customDurationDays)
        : undefined;
    const method2DryMatterDigestibility = customDryMatterDigestibility
      ? Number(customDryMatterDigestibility)
      : undefined;
    return {
      head: nv(head),
      method2Liveweight: nvo(method2Liveweight),
      method2LiveweightGain: nvo(method2LiveweightGain),
      method2DurationDays: nvo(method2DurationDays),
      method2DryMatterDigestibility: nvo(method2DryMatterDigestibility),
    };
  };

  const readMilkProduction = (): DairyMilkProductionInput => {
    const milkSolids = cell(columnMilkSolids);
    const fatContent = cell(columnCustomFatContent);
    const proteinContent = cell(columnCustomProteinContent);

    if (milkSolids) {
      return {
        kgSolidsPerHeadPerDay: nv(Number(milkSolids)),
        fatContent: nvo(fatContent ? Number(fatContent) : undefined),
        proteinContent: nvo(
          proteinContent ? Number(proteinContent) : undefined,
        ),
      };
    }

    const milkProduction = cell(columnMilkProduction);

    return {
      litresPerHeadPerDay: nv(Number(milkProduction)),
    };
  };

  return createDairyHerdInputTransformed({
    manureAllocations: {
      feedPadMMSAllocation: {
        anaerobicLagoon: nv(0),
        sumpDispersal: nv(0),
        drainToPaddock: nv(0),
        solidStorage: nv(1),
      },
      milkingShedMMSAllocation: {
        anaerobicLagoon: nv(0),
        sumpDispersal: nv(0),
        drainToPaddock: nv(0),
        solidStorage: nv(1),
      },
      solidsSeparatedPreTreatment: false,
    },
    milkProduction: readMilkProduction(),
    breed: checkDairyBreed(cell(columnBreed, 0)),

    classes: {
      milkingCows: readDairyClass(0),
      heifersGt1: readDairyClass(1),
      heifersLt1PreWeaned: readDairyClass(2),
      heifersLt1Weaned: readDairyClass(3),
      bullsGt1: readDairyClass(4),
      bullsLt1PreWeaned: readDairyClass(5),
      bullsLt1Weaned: readDairyClass(6),
    },
  });
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 10 },
);

describe('3.3.1.1 Dairy enteric methane', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.3-dairy-enteric.xlsx',
      '3.3.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate33EntericMethaneForHerd,
      '3.3',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.3-dairy-enteric.xlsx',
      '3.3.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 71, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate33EntericMethaneForHerd,
      '3.3',
    );
  });
});
