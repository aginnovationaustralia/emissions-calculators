import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculatePurchasedLivestockEmissions } from '../scope3/15.1-purchased-livestock';
import {
  HasPurchasedLivestockInput,
  HasPurchasedLivestockInputSchema,
  HasPurchasedLivestockInputTransformed,
  PurchasedLivestockInput,
} from '../scope3/15.1-purchased-livestock/input';
import { BeefPurchasedLivestockInput } from '../scope3/15.1-purchased-livestock/purchased-beef.input';
import { DairyPurchasedLivestockInput } from '../scope3/15.1-purchased-livestock/purchased-dairy.input';
import { OtherPurchasedLivestockInput } from '../scope3/15.1-purchased-livestock/purchased-other.input';
import { PigPurchasedLivestockInput } from '../scope3/15.1-purchased-livestock/purchased-pig.input';
import { PoultryPurchasedLivestockInput } from '../scope3/15.1-purchased-livestock/purchased-poultry.input';
import { checkDairyBreed } from './dairy-domain';
import {
  checkBeefPurchaseCategory,
  checkDairyClass,
  checkDairyPurchaseCategory,
  checkOtherLivestockClass,
  checkPigPurchaseCategory,
  checkPigWeightClass,
  checkPoultryWeightClass,
  checkSeason,
  convertBeefClass,
  convertExtendedRegion,
} from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const columnRegion = 'B';
const columnClass = 'C';
const columnSeason = 'D';
const columnCategory = 'E';
const columnBreed = 'F';
const columnHeadPurchased = 'H';

const getBeefPurchase = (
  cellFn: (col: string) => string | undefined,
  method: '1' | '2',
): BeefPurchasedLivestockInput => {
  const headPurchased = nv(Number(cellFn(columnHeadPurchased)));
  if (method === '2') {
    return {
      type: 'Beef',
      headPurchased,
      ...getMethod2Fields(cellFn),
    };
  }
  const cls = convertBeefClass(cellFn(columnClass));
  const category = checkBeefPurchaseCategory(cellFn(columnCategory));
  const region = convertExtendedRegion(cellFn(columnRegion));
  const season = checkSeason(cellFn(columnSeason)?.toLowerCase());
  return {
    type: 'Beef',
    category,
    class: cls,
    season,
    headPurchased,
    region,
  };
};

const getDairyPurchase = (
  cellFn: (col: string) => string | undefined,
  method: '1' | '2',
): DairyPurchasedLivestockInput => {
  const headPurchased = nv(Number(cellFn(columnHeadPurchased)));
  if (method === '2') {
    return {
      type: 'Dairy',
      headPurchased,
      ...getMethod2Fields(cellFn),
    };
  }
  const breed = checkDairyBreed(cellFn(columnBreed));
  const cls = checkDairyClass(cellFn(columnClass));
  const category = checkDairyPurchaseCategory(cellFn(columnCategory));
  return {
    type: 'Dairy',
    category,
    headPurchased,
    breed,
    class: cls,
  };
};

const getPigPurchase = (
  cellFn: (col: string) => string | undefined,
  method: '1' | '2',
): PigPurchasedLivestockInput => {
  const headPurchased = nv(Number(cellFn(columnHeadPurchased)));
  if (method === '2') {
    return {
      type: 'Pig',
      headPurchased,
      ...getMethod2Fields(cellFn),
    };
  }
  const cls = checkPigWeightClass(cellFn(columnClass));
  const category = checkPigPurchaseCategory(cellFn(columnCategory));
  return {
    type: 'Pig',
    category,
    headPurchased,
    weightClass: cls,
  };
};

const getPoultryPurchase = (
  cellFn: (col: string) => string | undefined,
  method: '1' | '2',
): PoultryPurchasedLivestockInput => {
  const headPurchased = nv(Number(cellFn(columnHeadPurchased)));
  if (method === '2') {
    return {
      type: 'Poultry',
      headPurchased,
      ...getMethod2Fields(cellFn),
    };
  }
  const cls = checkPoultryWeightClass(cellFn(columnClass));
  return {
    type: 'Poultry',
    headPurchased,
    weightClass: cls,
  };
};

const getOtherPurchase = (
  cellFn: (col: string) => string | undefined,
  method: '1' | '2',
): OtherPurchasedLivestockInput => {
  const headPurchased = nv(Number(cellFn(columnHeadPurchased)));
  if (method === '2') {
    return {
      type: 'Other',
      headPurchased,
      ...getMethod2Fields(cellFn),
    };
  }
  const cls = checkOtherLivestockClass(cellFn(columnClass));
  return {
    type: 'Other',
    headPurchased,
    livestockType: cls,
  };
};

const getMethod2Fields = (cellFn: (col: string) => string | undefined) => {
  const liveweightMethod2 = nv(Number(cellFn('G')));
  const emissionFactorMethod2 = nv(Number(cellFn('I')));
  return {
    liveweightMethod2,
    emissionFactorMethod2,
  };
};

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): HasPurchasedLivestockInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  let purchase: PurchasedLivestockInput | undefined = undefined;

  const livestockPurchaseType = cell('A');

  if (livestockPurchaseType === 'Beef') {
    purchase = getBeefPurchase(cell, method);
  } else if (livestockPurchaseType === 'Dairy') {
    purchase = getDairyPurchase(cell, method);
  } else if (livestockPurchaseType === 'Pig') {
    purchase = getPigPurchase(cell, method);
  } else if (livestockPurchaseType === 'Poultry') {
    purchase = getPoultryPurchase(cell, method);
  } else if (livestockPurchaseType === 'Other') {
    purchase = getOtherPurchase(cell, method);
  }

  if (purchase === undefined) {
    throw new Error(`Unexpected purchase type ${livestockPurchaseType}`);
  }

  const input: HasPurchasedLivestockInput = {
    purchasedLivestock: [purchase],
  };

  return HasPurchasedLivestockInputSchema.parse(input);
};

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'J');

describe('15.1 Purchased Livestock', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.1-purchased-livestock.xlsx',
      '15.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculatePurchasedLivestockEmissions,
      '15.1',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.1-purchased-livestock.xlsx',
      '15.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 64, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculatePurchasedLivestockEmissions,
      '15.1',
    );
  });
});
