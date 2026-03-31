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
import { BeefClasses, ExtendedRegions, Seasons } from '@/constants/enums';
import { getSheet } from '@/test/common/sheets';
import fs from 'fs';
import XLSX from 'xlsx-populate';
import { calculateManureManagementCH4 } from '../scope1/4-manure-management/4.1-beef-pasture-manure';
import { checkClimateZone, checkExtendedRegion } from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): BeefInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  const readBeefClass = (offset: number): BeefClassInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell('G', offsetRows);

    if (springHeadRaw === undefined) {
      return undefined;
    }

    const springHead = Number(springHeadRaw);
    const summerHead = Number(cell('G', offsetRows + 1));
    const autumnHead = Number(cell('G', offsetRows + 2));
    const winterHead = Number(cell('G', offsetRows + 3));

    const springLiveweight =
      method === '1' ? undefined : Number(cell('H', offsetRows));
    const summerLiveweight =
      method === '1' ? undefined : Number(cell('H', offsetRows + 1));
    const autumnLiveweight =
      method === '1' ? undefined : Number(cell('H', offsetRows + 2));
    const winterLiveweight =
      method === '1' ? undefined : Number(cell('H', offsetRows + 3));

    const springLiveweightGain =
      method === '1' ? undefined : Number(cell('I', offsetRows));
    const summerLiveweightGain =
      method === '1' ? undefined : Number(cell('I', offsetRows + 1));
    const autumnLiveweightGain =
      method === '1' ? undefined : Number(cell('I', offsetRows + 2));
    const winterLiveweightGain =
      method === '1' ? undefined : Number(cell('I', offsetRows + 3));

    return {
      spring: {
        head: springHead,
        method2Liveweight: springLiveweight,
        method2LiveweightGain: springLiveweightGain,
      },
      summer: {
        head: summerHead,
        method2Liveweight: summerLiveweight,
        method2LiveweightGain: summerLiveweightGain,
      },
      autumn: {
        head: autumnHead,
        method2Liveweight: autumnLiveweight,
        method2LiveweightGain: autumnLiveweightGain,
      },
      winter: {
        head: winterHead,
        method2Liveweight: winterLiveweight,
        method2LiveweightGain: winterLiveweightGain,
      },
    };
  };

  const readBeefClassWithCalves = (
    offset: number,
  ): BeefClassWithCalvesInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell('G', offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const springProportionCowsGt2InCalf = Number(cell('J', offsetRows));
    const summerHead = Number(cell('G', offsetRows + 1));
    const summerProportionCowsGt2InCalf = Number(cell('J', offsetRows + 1));
    const autumnHead = Number(cell('G', offsetRows + 2));
    const autumnProportionCowsGt2InCalf = Number(cell('J', offsetRows + 2));
    const winterHead = Number(cell('G', offsetRows + 3));
    const winterProportionCowsGt2InCalf = Number(cell('J', offsetRows + 3));

    const springLiveweight =
      method === '1' ? undefined : Number(cell('H', offsetRows));
    const summerLiveweight =
      method === '1' ? undefined : Number(cell('H', offsetRows + 1));
    const autumnLiveweight =
      method === '1' ? undefined : Number(cell('H', offsetRows + 2));
    const winterLiveweight =
      method === '1' ? undefined : Number(cell('H', offsetRows + 3));

    const springLiveweightGain =
      method === '1' ? undefined : Number(cell('I', offsetRows));
    const summerLiveweightGain =
      method === '1' ? undefined : Number(cell('I', offsetRows + 1));
    const autumnLiveweightGain =
      method === '1' ? undefined : Number(cell('I', offsetRows + 2));
    const winterLiveweightGain =
      method === '1' ? undefined : Number(cell('I', offsetRows + 3));

    return {
      spring: {
        head: springHead,
        proportionCowsGt2InCalf: springProportionCowsGt2InCalf,
        method2Liveweight: springLiveweight,
        method2LiveweightGain: springLiveweightGain,
      },
      summer: {
        head: summerHead,
        proportionCowsGt2InCalf: summerProportionCowsGt2InCalf,
        method2Liveweight: summerLiveweight,
        method2LiveweightGain: summerLiveweightGain,
      },
      autumn: {
        head: autumnHead,
        proportionCowsGt2InCalf: autumnProportionCowsGt2InCalf,
        method2Liveweight: autumnLiveweight,
        method2LiveweightGain: autumnLiveweightGain,
      },
      winter: {
        head: winterHead,
        proportionCowsGt2InCalf: winterProportionCowsGt2InCalf,
        method2Liveweight: winterLiveweight,
        method2LiveweightGain: winterLiveweightGain,
      },
    };
  };

  if (cell('A') === undefined) {
    return undefined;
  }

  const climateZone = checkClimateZone(cell('B'));
  // const state = checkState(cell('C'));
  const region = checkExtendedRegion(cell('D'));

  const unfencedWater = cell('W') === 'yes';

  const herd: BeefHerdInput = {
    method2NoUnfencedNaturalWater: method === '1' ? undefined : !unfencedWater,
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
    method2Dmd:
      method === '1'
        ? undefined
        : {
            spring: Number(cell('S')),
            summer: Number(cell('T')),
            autumn: Number(cell('U')),
            winter: Number(cell('V')),
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
  { rowInterval: 40 },
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

  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.1-beef.xlsx',
      '4.2.1 methane',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 141, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculateManureManagementCH4);
  });
  it('constants', () => {
    const liveweight = [
      [80, 480, 75, 300, 440, 440, 75, 380, 380, 380],
      [170, 520, 160, 360, 470, 470, 160, 420, 420, 420],
      [240, 550, 220, 390, 490, 490, 220, 450, 450, 450],
      [280, 560, 260, 410, 500, 500, 260, 460, 460, 460],
      [250, 800, 220, 400, 500, 500, 230, 420, 420, 420],
      [320, 800, 280, 420, 500, 500, 290, 420, 420, 420],
      [80, 700, 70, 300, 450, 450, 75, 400, 400, 400],
      [160, 700, 140, 350, 450, 450, 150, 400, 400, 400],
      [105, 700, 85, 300, 490, 490, 90, 480, 480, 480],
      [480, 750, 150, 350, 530, 530, 160, 460, 460, 460],
      [250, 725, 200, 360, 500, 500, 215, 490, 490, 490],
      [260, 700, 210, 380, 460, 460, 230, 470, 470, 470],
      [250, 820, 240, 410, 560, 560, 240, 510, 510, 510],
      [280, 850, 260, 440, 550, 550, 270, 520, 520, 520],
      [100, 700, 95, 300, 450, 450, 95, 410, 410, 410],
      [150, 720, 140, 320, 470, 470, 140, 440, 440, 440],
      [340, 800, 260, 420, 550, 550, 300, 480, 480, 480],
      [380, 780, 300, 450, 530, 530, 340, 470, 470, 470],
      [100, 680, 80, 320, 480, 480, 100, 340, 340, 340],
      [190, 700, 150, 330, 490, 490, 170, 360, 360, 360],
      [80, 450, 70, 260, 340, 340, 80, 370, 370, 370],
      [150, 500, 140, 310, 360, 360, 150, 400, 400, 400],
      [230, 550, 220, 330, 380, 380, 230, 420, 420, 420],
      [250, 500, 240, 340, 360, 360, 250, 390, 390, 390],
      [220, 500, 180, 300, 320, 320, 210, 340, 340, 340],
      [110, 550, 90, 220, 380, 380, 100, 390, 390, 390],
      [170, 600, 140, 270, 390, 390, 160, 430, 430, 430],
      [200, 550, 150, 280, 350, 350, 190, 400, 400, 400],
      [220, 706, 208, 323, 415, 467, 223, 371, 493, 585],
      [110, 703, 112, 256, 368, 465, 108, 280, 421, 543],
      [170, 721, 169, 306, 392, 464, 176, 339, 470, 580],
      [200, 727, 211, 338, 432, 492, 222, 377, 498, 590],
      [220, 620, 227, 319, 398, 452, 216, 334, 'NO', 'NO'],
      [110, 650, 108, 262, 346, 430, 111, 236, 'NO', 'NO'],
      [170, 670, 170, 266, 363, 444, 169, 282, 'NO', 'NO'],
      [200, 660, 225, 307, 398, 452, 214, 326, 'NO', 'NO'],
      [220, 620, 177, 267, 365, 406, 231, 249, 324, 'NO'],
      [110, 650, 102, 203, 299, 380, 102, 218, 263, 'NO'],
      [170, 670, 173, 250, 336, 414, 175, 243, 304, 'NO'],
      [200, 660, 202, 272, 365, 390, 208, 260, 337, 'NO'],
      [260, 705, 215, 302, 416, 519, 234, 455, 551, 660],
      [153, 703, 118, 277, 397, 483, 111, 304, 521, 547],
      [168, 718, 191, 319, 440, 506, 188, 326, 520, 582],
      [235, 722, 207, 352, 470, 514, 209, 421, 512, 605],
      [230, 674, 217, 344, 357, 467, 242, 370, 550, 620],
      [113, 669, 113, 283, 361, 477, 120, 273, 545, 553],
      [172, 685, 172, 309, 376, 471, 238, 329, 573, 620],
      [241, 692, 208, 344, 364, 484, 260, 350, 567, 620],
      [236, 674, 178, 310, 428, 466, 193, 370, 519, 565],
      [120, 669, 112, 250, 390, 448, 115, 273, 433, 556],
      [125, 685, 140, 277, 407, 455, 141, 296, 445, 593],
      [180, 692, 183, 316, 438, 468, 189, 354, 500, 553],
      [190, 617, 174, 265, 371, 415, 170, 272, 392, 531],
      [119, 591, 140, 205, 310, 405, 133, 218, 315, 445],
      [175, 610, 163, 232, 351, 427, 146, 242, 320, 471],
      [192, 615, 162, 255, 364, 420, 157, 261, 342, 484],
    ];

    const liveweightGain = [
      [0.5, 0.2, 0.5, 0.4, 0.3, 0.3, 0.5, 0.4, 0.4, 0.4],
      [1, 0.4, 0.9, 0.7, 0.3, 0.3, 0.9, 0.4, 0.4, 0.4],
      [0.8, 0.3, 0.7, 0.3, 0.2, 0.2, 0.7, 0.3, 0.3, 0.3],
      [0.4, 0.1, 0.4, 0.2, 0.1, 0.1, 0.4, 0.1, 0.1, 0.1],
      [0.99, 1.1, 0.88, 0.55, 0.55, 0.55, 0.88, 0.22, 0.22, 0.22],
      [0.77, 0, 0.66, 0.22, 0, 0, 0.66, 0, 0, 0],
      [0.9, -1.1, 0.7, 0.22, -0.55, -0.55, 0.8, -0.22, -0.22, -0.22],
      [0.88, 0, 0.77, 0.55, 0, 0, 0.82, 0, 0, 0],
      [1, 0.5, 1, 1, -0.44, -0.44, 1, 0.5, 0.5, 0.5],
      [0.82, 0.55, 0.71, 0.55, 0.99, 0.99, 0.77, 0.5, 0.5, 0.5],
      [0.77, 0.5, 0.55, 0.11, -0.33, -0.33, 0.6, 0.33, 0.33, 0.33],
      [0.11, -0.27, 0.11, 0.22, -0.44, -0.44, 0.16, -0.22, -0.22, -0.22],
      [1.1, 1.1, 1.1, 0.99, 0.99, 0.99, 1.1, 0.77, 0.77, 0.77],
      [0.33, 0.33, 0.22, 0.33, -0.1, -0.1, 0.33, 0.11, 0.11, 0.11],
      [0.5, 0.2, 0.55, 0.44, 0.2, 0.2, 0.55, 0.2, 0.2, 0.2],
      [0.55, 0.22, 0.49, 0.22, 0.22, 0.22, 0.49, 0.33, 0.33, 0.33],
      [1.64, 1.1, 1.21, 0.99, 0.66, 0.66, 1.42, 1.1, 1.1, 1.1],
      [0.44, -0.22, 0.44, 0.33, -0.22, -0.22, 0.44, -0.11, -0.11, -0.11],
      [0.6, 0, 0.6, 0.22, -0.55, -0.55, 0.6, 0, 0, 0],
      [0.99, 0.22, 0.77, 0.11, 0.11, 0.11, 0.77, 0.44, 0.44, 0.44],
      [0.7, -0.55, 0.7, 0.22, -0.22, -0.22, 0.7, -0.22, -0.22, -0.22],
      [0.77, 0.55, 0.77, 0.66, 0.55, 0.55, 0.77, 0.33, 0.33, 0.33],
      [0.88, 0.55, 0.88, 0.22, 0.22, 0.22, 0.88, 0.22, 0.22, 0.22],
      [0.22, -0.55, 0.22, 0.11, -0.22, -0.22, 0.22, -0.33, -0.33, -0.33],
      [0.22, -0.55, 0.33, 0.22, -0.33, -0.33, 0.22, -0.55, -0.55, -0.55],
      [0.8, 0.55, 0.7, 0.44, 0.66, 0.66, 0.8, 0.55, 0.55, 0.55],
      [0.66, 0.55, 0.55, 0.55, 0.11, 0.11, 0.66, 0.55, 0.55, 0.55],
      [0.33, -0.55, 0.11, 0.11, -0.44, -0.44, 0.33, -0.55, -0.55, -0.55],
      [0.22, -0.23, 0.25, 0.17, 0.18, -0.28, 0.32, 0.24, 0.25, -0.05],
      [0.66, 0.2, 0.62, 0.54, 0.38, 0.27, 0.75, 0.64, 0.55, 0.48],
      [0.49, 0.13, 0.54, 0.45, 0.35, 0.15, 0.63, 0.54, 0.42, 0.26],
      [0.27, -0.8, 0.22, 0.09, 0.12, 0.02, 0.25, 0.18, 0.12, 0.03],
      [0.22, -0.44, 0.2, 0.21, 0.18, 0.01, 0.12, 0.09, 'NO', 'NO'],
      [0.66, 0.22, 0.68, 0.22, 0.24, 0.25, 0.64, 0.37, 'NO', 'NO'],
      [0.49, 0.05, 0.64, 0.25, 0.29, 0.12, 0.57, 0.49, 'NO', 'NO'],
      [0.27, -0.27, 0.31, 0.29, 0.19, 0.04, 0.26, 0.28, 'NO', 'NO'],
      [0.22, -0.44, 0, 0.15, 0.08, 0.17, 0.06, 0.02, -0.14, 'NO'],
      [0.66, 0.22, 0.79, 0.4, 0.38, 0.27, 0.8, 0.16, 0.3, 'NO'],
      [0.49, 0.05, 0.55, 0.38, 0.36, 0.06, 0.58, 0.23, 0.4, 'NO'],
      [0.27, -0.27, 0.02, 0.09, 0.16, -0.04, 0.21, 0.03, 0.11, 'NO'],
      [0.27, -0.19, 0.38, 0.3, 0.07, 0.05, 0.52, 0.55, 0.19, 0.6],
      [0.16, 0.16, 0.8, 0.57, 0.76, 0.49, 0.84, 0.51, 0.36, 0.17],
      [0.45, 0.1, 0.49, 0.41, 0.4, 0.17, 0.54, 0.64, -0.05, 0.32],
      [0.51, -0.07, 0.13, -0.09, -0.13, 0.07, 0.25, 0.71, 0.17, 0.43],
      [-0.12, -0.19, 0.41, 0.09, 0.41, -0.19, 0.07, 1.07, -0.08, 0],
      [0.65, 0.19, 0.65, 0.51, 0.18, 0.63, 1.3, 0.48, 1.12, 0.38],
      [0.7, 0.13, 0.52, 0.34, 0.02, 0.04, 0.77, 0.42, 0.12, 0.74],
      [0.32, -0.06, 0.25, 0.19, -0.1, -0.02, 0.02, 0.23, -0.13, 0],
      [0.62, -0.19, 0.37, 0.41, 0.06, -0.02, 0.47, 0.44, 0.3, 0.13],
      [0.05, 0.19, 0.31, 0.54, 0.53, 0.15, 0.28, 0.57, 0.42, 0.4],
      [0.33, 0.13, 0.39, 0.36, 0.26, 0.11, 0.4, 0.44, 0.37, -0.01],
      [0.61, -0.06, 0.21, 0.18, 0.12, 0.06, 0.29, 0.41, 0.41, -0.15],
      [-0.2, 0.02, 0.24, 0.3, 0.23, -0.05, 0.34, 0.3, 0.57, 0.52],
      [0.62, 0.21, 0.25, 0.32, 0.47, 0.31, 0.14, 0.4, 0.26, 0.43],
      [0.4, 0.13, 0.12, 0.27, 0.3, 0.08, 0.13, 0.24, 0.15, 0.21],
      [0.08, 0.04, 0.06, 0.18, 0.11, -0.07, 0.13, 0.16, 0.4, 0.33],
    ];

    const lines = ['{'];
    for (let i = 0; i < ExtendedRegions.length; i++) {
      const region = ExtendedRegions[i];
      lines.push(`  '${region}': {`);

      for (let j = 0; j < BeefClasses.length; j++) {
        const beefClass = BeefClasses[j];
        lines.push(`    '${beefClass}': {`);
        for (let k = 0; k < Seasons.length; k++) {
          const season = Seasons[k];
          const y = 4 * i + k;
          const liveweightLine = liveweight[y];
          const liveweightGainLine = liveweightGain[y];
          lines.push(`      '${season}': {`);
          lines.push(
            `        liveweight: mass('Liveweight', ${liveweightLine[j]}),`,
          );
          lines.push(
            `        liveweightGain: massPerHeadPerDay('Liveweight', ${liveweightGainLine[j]}),`,
          );
          lines.push(`      },`);
        }
        lines.push(`    },`);
      }

      lines.push(`  },`);
    }
    lines.push('}');

    // console.log(lines.join('\n'));

    // push the content of lines to a local text file
    fs.writeFileSync('beef-pasture-manure-constants.txt', lines.join('\n'));
  });
});
