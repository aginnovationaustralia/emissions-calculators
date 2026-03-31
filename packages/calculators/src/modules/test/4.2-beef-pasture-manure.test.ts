import {
  BeefClassInput,
  BeefClassWithCalvesInput,
} from '@/calculators/Beef/types/beef-class.input';
import { BeefHerdInput } from '@/calculators/Beef/types/beef-herd.input';
import {
  BeefInput,
  BeefInputSchema,
  BeefInputTransformed,
} from '@/calculators/Beef/types/input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateManureManagementCH4 } from '../scope1/4-manure-management/4.1-beef-pasture-manure';
import { checkClimateZone, checkRegion } from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  // method: '1' | '2',
): BeefInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  const readBeefClass = (offset: number): BeefClassInput => {
    const offsetRows = offset * 4;
    const springHead = Number(cell('G', offsetRows));
    const summerHead = Number(cell('G', offsetRows + 1));
    const autumnHead = Number(cell('G', offsetRows + 2));
    const winterHead = Number(cell('G', offsetRows + 3));

    return {
      spring: {
        head: springHead,
      },
      summer: {
        head: summerHead,
      },
      autumn: {
        head: autumnHead,
      },
      winter: {
        head: winterHead,
      },
    };
  };

  const readBeefClassWithCalves = (
    offset: number,
  ): BeefClassWithCalvesInput => {
    const offsetRows = offset * 4;
    const springHead = Number(cell('G', offsetRows));
    const springProportionCowsGt2InCalf = Number(cell('J', offsetRows));
    const summerHead = Number(cell('G', offsetRows + 1));
    const summerProportionCowsGt2InCalf = Number(cell('J', offsetRows + 1));
    const autumnHead = Number(cell('G', offsetRows + 2));
    const autumnProportionCowsGt2InCalf = Number(cell('J', offsetRows + 2));
    const winterHead = Number(cell('G', offsetRows + 3));
    const winterProportionCowsGt2InCalf = Number(cell('J', offsetRows + 3));

    return {
      spring: {
        head: springHead,
        proportionCowsGt2InCalf: springProportionCowsGt2InCalf,
      },
      summer: {
        head: summerHead,
        proportionCowsGt2InCalf: summerProportionCowsGt2InCalf,
      },
      autumn: {
        head: autumnHead,
        proportionCowsGt2InCalf: autumnProportionCowsGt2InCalf,
      },
      winter: {
        head: winterHead,
        proportionCowsGt2InCalf: winterProportionCowsGt2InCalf,
      },
    };
  };

  if (cell('A') === undefined) {
    return undefined;
  }

  const climateZone = checkClimateZone(cell('B'));
  // const state = checkState(cell('C'));
  const region = checkRegion(cell('D'));

  const unfencedWater = cell('W') === 'yes';

  const herd: BeefHerdInput = {
    unfencedNaturalWater: unfencedWater,
    classes: {
      bullsLt1: readBeefClass(0),
      bullsGt1: readBeefClass(1),
      cowsLt1: readBeefClass(2),
      cows1To2Years: readBeefClass(3),
      cows2To3Years: readBeefClassWithCalves(4),
      cowsGt3Years: readBeefClassWithCalves(5),
      steersLt1: readBeefClass(6),
      steers1To2Years: readBeefClass(7),
      steers2To3Years: readBeefClass(8),
      steersGt3Years: readBeefClass(9),
    },
  };

  const beefInput: BeefInput = {
    region,
    climateZone,
    herds: [herd],
    electricity: {
      method: 'location',
      electricityPurchasedKWh: 0,
    },
  };

  // console.dir(beefInput, { depth: null });

  return {
    ...BeefInputSchema.parse(beefInput),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`AG${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('4.2. Beef Pasture Manure methane', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.1-beef.xlsx',
      '4.2.1 methane',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateManureManagementCH4);
  });
});
