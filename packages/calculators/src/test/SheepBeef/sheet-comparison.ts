import { LivestockSourceLocations } from '@/constants/types';
import {
  BeefClass,
  BeefInput,
  BeefOutput,
  BeefVegetation,
  CustomisedFertiliser,
  SheepBeefOutput,
  SheepBeefVegetation,
  SheepClass,
  SheepInput,
  SheepOutput,
  SheepVegetation,
} from '@/types';
import {
  FireSeasons,
  Fuels,
  Patchinesses,
  RainfallRegion,
  RainfallZones,
  SoilType,
  TreeType,
  VegetationClass,
} from '@/types/enums';
import XLSX from 'xlsx-populate';
import {
  emptyOrNumber,
  mapInput,
  mapInputRegion,
  numberInput,
  stringInput,
} from '../common/sheets';

const mapBurningFuelSize = mapInput<(typeof Fuels)[number]>({
  fine: 'Fine',
  coarse: 'Course',
});

const mapBurningSeason = mapInput<(typeof FireSeasons)[number]>({
  'early dry season': 'Early Dry Season',
  'late dry season': 'Late Dry Season',
});

const mapBurningPatchiness = mapInput<(typeof Patchinesses)[number]>({
  low: 'Low',
  high: 'High',
});

const mapBurningRainfallZone = mapInput<(typeof RainfallZones)[number]>({
  low: 'Low',
  high: 'High',
});

const getElectricity = (
  annualElectricityUse: number | null,
  percentRenewable: number | null,
) => {
  const electricitySource =
    percentRenewable && percentRenewable === 1 ? 'Renewable' : 'State Grid';

  return {
    electricitySource,
    electricityRenewable: percentRenewable ?? 0 * (annualElectricityUse ?? 0),
    electricityUse: annualElectricityUse ?? 0,
  } as const;
};

const getBeefClass = (range: XLSX.Range): BeefClass => {
  return {
    spring: {
      head: emptyOrNumber(range.cell(0, 0)) ?? 0,
      liveweight: emptyOrNumber(range.cell(16, 0)) ?? 0,
      liveweightGain: emptyOrNumber(range.cell(22, 0)) ?? 0,
    },
    summer: {
      head: emptyOrNumber(range.cell(1, 0)) ?? 0,
      liveweight: emptyOrNumber(range.cell(17, 0)) ?? 0,
      liveweightGain: emptyOrNumber(range.cell(23, 0)) ?? 0,
    },
    autumn: {
      head: emptyOrNumber(range.cell(2, 0)) ?? 0,
      liveweight: emptyOrNumber(range.cell(18, 0)) ?? 0,
      liveweightGain: emptyOrNumber(range.cell(24, 0)) ?? 0,
    },
    winter: {
      head: emptyOrNumber(range.cell(3, 0)) ?? 0,
      liveweight: emptyOrNumber(range.cell(19, 0)) ?? 0,
      liveweightGain: emptyOrNumber(range.cell(25, 0)) ?? 0,
    },
    purchases: [
      {
        head: emptyOrNumber(range.cell(41, 0)) ?? 0,
        purchaseWeight: emptyOrNumber(range.cell(42, 0)) ?? 0,
        // @ts-expect-error - this is a string input
        purchaseSource: stringInput(
          range.cell(45, 0),
        ) as unknown as LivestockSourceLocations,
      },
    ],
    headSold: emptyOrNumber(range.cell(49, 0)) ?? 0,
    saleWeight: emptyOrNumber(range.cell(50, 0)) ?? 0,
  };
};

const emptyBeefClass: BeefClass = {
  summer: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  autumn: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  winter: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  spring: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  headSold: 0,
  saleWeight: 0,
  purchases: [],
};

const getBeefVegetations = (sheet: XLSX.Sheet): BeefVegetation[] => {
  return [
    getBeefVegetation(sheet.range('D3:D7'), sheet.range('D9:D10')),
    getBeefVegetation(sheet.range('D13:D17'), sheet.range('D19:D20')),
    getBeefVegetation(sheet.range('D23:D27'), sheet.range('D29:D30')),
    getBeefVegetation(sheet.range('D33:D37'), sheet.range('D39:D40')),
  ];
};

export const getBeefVegetation = (
  details: XLSX.Range,
  allocations: XLSX.Range,
): BeefVegetation => {
  return {
    allocationToBeef: [numberInput(allocations.cell(0, 0))],
    vegetation: {
      region: stringInput(details.cell(0, 0)) as RainfallRegion,
      treeSpecies: stringInput(details.cell(1, 0)) as TreeType,
      soil: stringInput(details.cell(2, 0)) as SoilType,
      area: numberInput(details.cell(3, 0)),
      age: numberInput(details.cell(4, 0)),
    },
  };
};

const getSheepVegetations = (sheet: XLSX.Sheet): SheepVegetation[] => {
  return [
    getSheepVegetation(sheet.range('D3:D7'), sheet.range('D9:D10')),
    getSheepVegetation(sheet.range('D13:D17'), sheet.range('D19:D20')),
    getSheepVegetation(sheet.range('D23:D27'), sheet.range('D29:D30')),
    getSheepVegetation(sheet.range('D33:D37'), sheet.range('D39:D40')),
  ];
};

export const getSheepVegetation = (
  details: XLSX.Range,
  allocations: XLSX.Range,
): SheepVegetation => {
  return {
    sheepProportion: [numberInput(allocations.cell(0, 0))],
    vegetation: {
      region: stringInput(details.cell(0, 0)) as RainfallRegion,
      treeSpecies: stringInput(details.cell(1, 0)) as TreeType,
      soil: stringInput(details.cell(2, 0)) as SoilType,
      area: numberInput(details.cell(3, 0)),
      age: numberInput(details.cell(4, 0)),
    },
  };
};

export const getSheepBeefVegetation = (
  details: XLSX.Range,
  allocations: XLSX.Range,
): SheepBeefVegetation => {
  return {
    beefProportion: [numberInput(allocations.cell(0, 0))],
    sheepProportion: [numberInput(allocations.cell(1, 0))],
    vegetation: {
      region: stringInput(details.cell(0, 0)) as RainfallRegion,
      treeSpecies: stringInput(details.cell(1, 0)) as TreeType,
      soil: stringInput(details.cell(2, 0)) as SoilType,
      area: numberInput(details.cell(3, 0)),
      age: numberInput(details.cell(4, 0)),
    },
  };
};

export const getAllSheepBeefVegetations = (
  sheet: XLSX.Sheet,
): SheepBeefVegetation[] => {
  return [
    getSheepBeefVegetation(sheet.range('D3:D7'), sheet.range('D9:D10')),
    getSheepBeefVegetation(sheet.range('D13:D17'), sheet.range('D19:D20')),
    getSheepBeefVegetation(sheet.range('D23:D27'), sheet.range('D29:D30')),
    getSheepBeefVegetation(sheet.range('D33:D37'), sheet.range('D39:D40')),
  ];
};

export const getBeefCalculatorInput = (workbook: XLSX.Workbook): BeefInput => {
  const sheetInputBeef = workbook.sheet('Data input - beef');
  const beef = (address: string) => sheetInputBeef.cell(address);

  const sheetInputVegetation = workbook.sheet('Data input - vegetation');

  const input: BeefInput = {
    state: mapInputRegion(beef('D6')),
    northOfTropicOfCapricorn: beef('M4').value() === 'Yes',
    rainfallAbove600: beef('M6').value() === 'Yes',
    beef: [
      {
        classes: {
          bullsGt1: getBeefClass(sheetInputBeef.range('D13:D63')),
          bullsGt1Traded: emptyBeefClass,
          cowsGt2: getBeefClass(sheetInputBeef.range('H13:H63')),
          cowsGt2Traded: emptyBeefClass,
          heifers1To2: getBeefClass(sheetInputBeef.range('J13:J63')),
          heifers1To2Traded: emptyBeefClass,
          heifersLt1: getBeefClass(sheetInputBeef.range('I13:I63')),
          heifersLt1Traded: emptyBeefClass,
          steersLt1: getBeefClass(sheetInputBeef.range('E13:E63')),
          steersLt1Traded: getBeefClass(sheetInputBeef.range('N13:N63')),
          steers1To2: getBeefClass(sheetInputBeef.range('F13:F63')),
          steers1To2Traded: getBeefClass(sheetInputBeef.range('M13:M63')),
          heifersGt2: getBeefClass(sheetInputBeef.range('K13:K63')),
          heifersGt2Traded: emptyBeefClass,
          steersGt2: getBeefClass(sheetInputBeef.range('G13:G63')),
          steersGt2Traded: getBeefClass(sheetInputBeef.range('L13:L63')),
        },
        cowsCalving: {
          spring: numberInput(beef('D71')),
          summer: numberInput(beef('D72')),
          autumn: numberInput(beef('D73')),
          winter: numberInput(beef('D74')),
        },
        mineralSupplementation: {
          mineralBlockUrea: numberInput(beef('D77')),
          weanerBlockUrea: numberInput(beef('D78')),
          drySeasonMixUrea: numberInput(beef('D79')),
          mineralBlock: numberInput(beef('F77')),
          weanerBlock: numberInput(beef('F78')),
          drySeasonMix: numberInput(beef('F79')),
        },
        fertiliser: {
          pastureDryland: numberInput(beef('D84')),
          cropsDryland: numberInput(beef('D85')),
          pastureIrrigated: numberInput(beef('F84')),
          cropsIrrigated: numberInput(beef('F85')),
          otherFertilisers: [
            {
              otherType: stringInput(beef('C86')) as CustomisedFertiliser,
              otherDryland: numberInput(beef('D86')),
              otherIrrigated: numberInput(beef('F86')),
            },
          ],
          singleSuperphosphate: numberInput(beef('D88')),
        },
        limestone: numberInput(beef('D89')),
        limestoneFraction: numberInput(beef('D90')),
        ...getElectricity(
          emptyOrNumber(beef('D98')),
          emptyOrNumber(beef('D94')),
        ),
        diesel: numberInput(beef('D95')),
        petrol: numberInput(beef('D96')),
        lpg: numberInput(beef('D97')),
        grainFeed: numberInput(beef('D99')),
        cottonseedFeed: numberInput(beef('D100')),
        hayFeed: numberInput(beef('D101')),
        herbicide: numberInput(beef('D102')),
        herbicideOther: numberInput(beef('D103')),
      },
    ],
    burning: [
      {
        allocationToBeef: [1],
        burning: {
          rainfallZone: mapBurningRainfallZone(beef('D106')),
          vegetation: stringInput(beef('D107')) as unknown as VegetationClass,
          patchiness: mapBurningPatchiness(beef('D108')),
          fuel: mapBurningFuelSize(beef('D109')),
          season: mapBurningSeason(beef('I106')),
          yearsSinceLastFire: numberInput(beef('I107')),
          fireScarArea: numberInput(beef('I108')),
        },
      },
    ],
    vegetation: getBeefVegetations(sheetInputVegetation),
  };
  return input;
};

const emptySheepClass: SheepClass = {
  summer: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  autumn: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  winter: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  spring: {
    head: 0,
    liveweight: 0,
    liveweightGain: 0,
  },
  headSold: 0,
  saleWeight: 0,
  purchases: [],
  headShorn: 0,
  woolShorn: 0,
  cleanWoolYield: 0,
};

const getSheepClass = (range: XLSX.Range): SheepClass => {
  return {
    spring: {
      head: emptyOrNumber(range.cell(0, 0)) ?? 0,
      liveweight: emptyOrNumber(range.cell(6, 0)) ?? 0,
      liveweightGain: emptyOrNumber(range.cell(12, 0)) ?? 0,
    },
    summer: {
      head: emptyOrNumber(range.cell(1, 0)) ?? 0,
      liveweight: emptyOrNumber(range.cell(7, 0)) ?? 0,
      liveweightGain: emptyOrNumber(range.cell(13, 0)) ?? 0,
    },
    autumn: {
      head: emptyOrNumber(range.cell(2, 0)) ?? 0,
      liveweight: emptyOrNumber(range.cell(8, 0)) ?? 0,
      liveweightGain: emptyOrNumber(range.cell(14, 0)) ?? 0,
    },
    winter: {
      head: emptyOrNumber(range.cell(3, 0)) ?? 0,
      liveweight: emptyOrNumber(range.cell(9, 0)) ?? 0,
      liveweightGain: emptyOrNumber(range.cell(15, 0)) ?? 0,
    },
    purchases: [
      {
        head: emptyOrNumber(range.cell(25, 0)) ?? 0,
        purchaseWeight: emptyOrNumber(range.cell(26, 0)) ?? 0,
      },
    ],
    headSold: emptyOrNumber(range.cell(33, 0)) ?? 0,
    saleWeight: emptyOrNumber(range.cell(34, 0)) ?? 0,
    headShorn: emptyOrNumber(range.cell(42, 0)) ?? 0,
    woolShorn: emptyOrNumber(range.cell(43, 0)) ?? 0,
    cleanWoolYield: emptyOrNumber(range.cell(46, 0)) ?? 0,
  };
};

export const getSheepCalculatorInput = (
  workbook: XLSX.Workbook,
): SheepInput => {
  const sheetInputSheep = workbook.sheet(' Data input - sheep');
  const sheep = (address: string) => sheetInputSheep.cell(address);

  const sheetInputVegetation = workbook.sheet('Data input - vegetation');

  const input: SheepInput = {
    state: mapInputRegion(sheep('E4')),
    northOfTropicOfCapricorn: false, // Not actually used
    rainfallAbove600: sheep('E6').value() === 'Yes',
    sheep: [
      {
        classes: {
          breedingEwes: getSheepClass(sheetInputSheep.range('G9:G55')),
          eweLambs: getSheepClass(sheetInputSheep.range('I9:I55')),
          wetherLambs: getSheepClass(sheetInputSheep.range('J9:J55')),
          maidenBreedingEwes: getSheepClass(sheetInputSheep.range('F9:F55')),
          otherEwes: getSheepClass(sheetInputSheep.range('H9:H55')),
          rams: getSheepClass(sheetInputSheep.range('D9:D55')),
          tradeBreedingEwes: getSheepClass(sheetInputSheep.range('M9:M55')), // trade ewes
          tradeEweLambs: emptySheepClass,
          tradeMaidenBreedingEwes: emptySheepClass,
          tradeOtherEwes: emptySheepClass,
          tradeRams: emptySheepClass,
          tradeWetherLambs: getSheepClass(sheetInputSheep.range('K9:K55')), // trade lambs and hoggets
          tradeWethers: getSheepClass(sheetInputSheep.range('L9:L55')), // trade wethers
          wethers: emptySheepClass,
        },
        merinoPercent: numberInput(sheep('D39')) * 100,
        ewesLambing: {
          spring: numberInput(sheep('G61')),
          summer: numberInput(sheep('G62')),
          autumn: numberInput(sheep('G63')),
          winter: numberInput(sheep('G64')),
        },
        seasonalLambing: {
          spring: numberInput(sheep('G67')),
          summer: numberInput(sheep('G68')),
          autumn: numberInput(sheep('G69')),
          winter: numberInput(sheep('G70')),
        },

        mineralSupplementation: {
          mineralBlockUrea: numberInput(sheep('D86')),
          weanerBlockUrea: numberInput(sheep('D87')),
          drySeasonMixUrea: numberInput(sheep('D88')),
          mineralBlock: numberInput(sheep('F86')),
          weanerBlock: numberInput(sheep('F87')),
          drySeasonMix: numberInput(sheep('F88')),
        },
        fertiliser: {
          pastureDryland: numberInput(sheep('D96')),
          cropsDryland: numberInput(sheep('D97')),
          pastureIrrigated: numberInput(sheep('F96')),
          cropsIrrigated: numberInput(sheep('F97')),
          otherFertilisers: [
            {
              otherType: stringInput(sheep('C98')) as CustomisedFertiliser,
              otherDryland: numberInput(sheep('D98')),
              otherIrrigated: numberInput(sheep('F98')),
            },
          ],
          singleSuperphosphate: numberInput(sheep('D100')),
        },
        limestone: numberInput(sheep('D101')),
        limestoneFraction: numberInput(sheep('D102')),
        ...getElectricity(
          emptyOrNumber(sheep('D110')),
          emptyOrNumber(sheep('D106')),
        ),
        diesel: numberInput(sheep('D107')),
        petrol: numberInput(sheep('D108')),
        lpg: numberInput(sheep('D109')),
        grainFeed: numberInput(sheep('D111')),
        hayFeed: numberInput(sheep('D112')),
        herbicide: numberInput(sheep('D113')),
        herbicideOther: numberInput(sheep('D114')),
      },
    ],

    vegetation: getSheepVegetations(sheetInputVegetation),
  };

  // console.dir(input, { depth: null });

  return input;
};

export const getExpectedBeefOutput = (workbook: XLSX.Workbook): BeefOutput => {
  const summarySheet = workbook.sheet('Data summary');
  const summary = (address: string) => numberInput(summarySheet.cell(address));

  const sheetInputBeef = workbook.sheet('Data input - beef');
  const beef = (address: string) => numberInput(sheetInputBeef.cell(address));

  const fuelCO2 = summary('C4');
  const limeCO2 = summary('C5');
  const ureaCO2 = summary('C6');
  const fuelCH4 = summary('C7');
  const entericCH4 = summary('C8');
  const manureManagementCH4 = summary('C9');
  const savannahBurningCH4 = summary('C10');
  const fertiliserN2O = summary('C11');
  const urineAndDungN2O = summary('C12');
  const atmosphericDepositionN2O = summary('C13');
  const leachingAndRunoffN2O = summary('C14');
  const savannahBurningN2O = summary('C15');
  const fuelN2O = summary('C16');

  const expectedScopes = {
    scope1: {
      fuelCO2,
      limeCO2,
      ureaCO2,
      fuelCH4,
      entericCH4,
      manureManagementCH4,
      savannahBurningCH4,
      fertiliserN2O,
      urineAndDungN2O,
      atmosphericDepositionN2O,
      leachingAndRunoffN2O,
      savannahBurningN2O,
      fuelN2O,
      totalCO2: fuelCO2 + limeCO2 + ureaCO2,
      totalCH4: fuelCH4 + entericCH4 + manureManagementCH4 + savannahBurningCH4,
      totalN2O:
        fuelN2O +
        urineAndDungN2O +
        atmosphericDepositionN2O +
        leachingAndRunoffN2O +
        fertiliserN2O +
        savannahBurningN2O,
      total: summary('C17'),
    },
    scope2: {
      electricity: summary('C20'),
      total: summary('C21'),
    },
    scope3: {
      fertiliser: summary('C24'),
      purchasedMineralSupplementation: summary('C25'),
      purchasedFeed: summary('C26'),
      herbicide: summary('C27'),
      electricity: summary('C28'),
      fuel: summary('C29'),
      lime: summary('C30'),
      purchasedLivestock: summary('C31'),
      total: summary('C32'),
    },
    intensities: {
      liveweightBeefProducedKg: beef('O64') + beef('P64'),
      beefExcludingSequestration: summary('C44'),
      beefIncludingSequestration: summary('C45'),
    },
    carbonSequestration: {
      total: -summary('C35'),
    },
  } as const;

  const output: BeefOutput = {
    ...expectedScopes,
    net: {
      total: summary('E37'),
      beef: summary('C37'),
    },
    intermediate: [
      { ...expectedScopes, id: 'beef-0', net: { total: summary('C37') } },
    ],
  };

  return output;
};

export const getExpectedSheepOutput = (
  workbook: XLSX.Workbook,
): SheepOutput => {
  const summarySheet = workbook.sheet('Data summary');
  const summary = (address: string) => numberInput(summarySheet.cell(address));

  const sheetInputSheep = workbook.sheet(' Data input - sheep');
  const sheep = (address: string) => numberInput(sheetInputSheep.cell(address));

  const fuelCO2 = summary('D4');
  const limeCO2 = summary('D5');
  const ureaCO2 = summary('D6');
  const fuelCH4 = summary('D7');
  const entericCH4 = summary('D8');
  const manureManagementCH4 = summary('D9');
  const fertiliserN2O = summary('D11');
  const urineAndDungN2O = summary('D12');
  const atmosphericDepositionN2O = summary('D13');
  const leachingAndRunoffN2O = summary('D14');
  const fuelN2O = summary('D16');
  const expectedScopes = {
    scope1: {
      fuelCO2,
      limeCO2,
      ureaCO2,
      fuelCH4,
      entericCH4,
      manureManagementCH4,
      fertiliserN2O,
      urineAndDungN2O,
      atmosphericDepositionN2O,
      leachingAndRunoffN2O,
      fuelN2O,
      totalCO2: fuelCO2 + limeCO2 + ureaCO2,
      totalCH4: fuelCH4 + entericCH4 + manureManagementCH4,
      totalN2O:
        fuelN2O +
        urineAndDungN2O +
        atmosphericDepositionN2O +
        leachingAndRunoffN2O +
        fertiliserN2O,
      total: summary('D17'),
    },
    scope2: {
      electricity: summary('D20'),
      total: summary('D21'),
    },
    scope3: {
      fertiliser: summary('D24'),
      purchasedMineralSupplementation: summary('D25'),
      purchasedFeed: summary('D26'),
      herbicide: summary('D27'),
      electricity: summary('D28'),
      fuel: summary('D29'),
      lime: summary('D30'),
      purchasedLivestock: summary('D31'),
      total: summary('D32'),
    },
    intensities: {
      woolProducedKg: sheep('N53'),
      sheepMeatProducedKg: sheep('N44') + sheep('O44'),
      woolIncludingSequestration: summary('C43'),
      woolExcludingSequestration: summary('C42'),
      sheepMeatBreedingIncludingSequestration: summary('C41'),
      sheepMeatBreedingExcludingSequestration: summary('C40'),
    },
    carbonSequestration: {
      total: -summary('D35'),
    },
  } as const;

  const output: SheepOutput = {
    ...expectedScopes,
    net: {
      total: summary('E37'),
      sheep: summary('D37'),
    },
    intermediate: [
      { ...expectedScopes, id: 'sheep-0', net: { total: summary('D37') } },
    ],
  };

  return output;
};

export const getExpectedSheepBeefOutput = (
  workbook: XLSX.Workbook,
): SheepBeefOutput => {
  const expectedBeefOutput = getExpectedBeefOutput(workbook);
  const expectedSheepOutput = getExpectedSheepOutput(workbook);

  const intermediateBeef = expectedBeefOutput.intermediate[0];
  const intermediateSheep = expectedSheepOutput.intermediate[0];

  return {
    intermediate: {
      beef: intermediateBeef,
      sheep: intermediateSheep,
    },
    scope1: {
      atmosphericDepositionN2O:
        expectedBeefOutput.scope1.atmosphericDepositionN2O +
        expectedSheepOutput.scope1.atmosphericDepositionN2O,
      entericCH4:
        expectedBeefOutput.scope1.entericCH4 +
        expectedSheepOutput.scope1.entericCH4,
      fertiliserN2O:
        expectedBeefOutput.scope1.fertiliserN2O +
        expectedSheepOutput.scope1.fertiliserN2O,
      leachingAndRunoffN2O:
        expectedBeefOutput.scope1.leachingAndRunoffN2O +
        expectedSheepOutput.scope1.leachingAndRunoffN2O,
      manureManagementCH4:
        expectedBeefOutput.scope1.manureManagementCH4 +
        expectedSheepOutput.scope1.manureManagementCH4,
      savannahBurningCH4: expectedBeefOutput.scope1.savannahBurningCH4,
      savannahBurningN2O: expectedBeefOutput.scope1.savannahBurningN2O,
      totalCH4:
        expectedBeefOutput.scope1.totalCH4 +
        expectedSheepOutput.scope1.totalCH4,
      totalN2O:
        expectedBeefOutput.scope1.totalN2O +
        expectedSheepOutput.scope1.totalN2O,
      fuelCH4:
        expectedBeefOutput.scope1.fuelCH4 + expectedSheepOutput.scope1.fuelCH4,
      fuelN2O:
        expectedBeefOutput.scope1.fuelN2O + expectedSheepOutput.scope1.fuelN2O,
      fuelCO2:
        expectedBeefOutput.scope1.fuelCO2 + expectedSheepOutput.scope1.fuelCO2,
      ureaCO2:
        expectedBeefOutput.scope1.ureaCO2 + expectedSheepOutput.scope1.ureaCO2,
      urineAndDungN2O:
        expectedBeefOutput.scope1.urineAndDungN2O +
        expectedSheepOutput.scope1.urineAndDungN2O,
      limeCO2:
        expectedBeefOutput.scope1.limeCO2 + expectedSheepOutput.scope1.limeCO2,
      totalCO2:
        expectedBeefOutput.scope1.totalCO2 +
        expectedSheepOutput.scope1.totalCO2,
      total: expectedBeefOutput.scope1.total + expectedSheepOutput.scope1.total,
    },
    scope2: {
      electricity:
        expectedBeefOutput.scope2.electricity +
        expectedSheepOutput.scope2.electricity,
      total: expectedBeefOutput.scope2.total + expectedSheepOutput.scope2.total,
    },
    scope3: {
      fertiliser:
        expectedBeefOutput.scope3.fertiliser +
        expectedSheepOutput.scope3.fertiliser,
      purchasedMineralSupplementation:
        expectedBeefOutput.scope3.purchasedMineralSupplementation +
        expectedSheepOutput.scope3.purchasedMineralSupplementation,
      purchasedFeed:
        expectedBeefOutput.scope3.purchasedFeed +
        expectedSheepOutput.scope3.purchasedFeed,
      herbicide:
        expectedBeefOutput.scope3.herbicide +
        expectedSheepOutput.scope3.herbicide,
      electricity:
        expectedBeefOutput.scope3.electricity +
        expectedSheepOutput.scope3.electricity,
      fuel: expectedBeefOutput.scope3.fuel + expectedSheepOutput.scope3.fuel,
      lime: expectedBeefOutput.scope3.lime + expectedSheepOutput.scope3.lime,
      purchasedLivestock:
        expectedBeefOutput.scope3.purchasedLivestock +
        expectedSheepOutput.scope3.purchasedLivestock,
      total: expectedBeefOutput.scope3.total + expectedSheepOutput.scope3.total,
    },
    carbonSequestration: {
      total:
        expectedBeefOutput.carbonSequestration.total +
        expectedSheepOutput.carbonSequestration.total,
    },
    intensities: {
      ...expectedBeefOutput.intensities,
      ...expectedSheepOutput.intensities,
    },

    intermediateBeef: expectedBeefOutput.intermediate,
    intermediateSheep: expectedSheepOutput.intermediate,
    net: {
      beef: expectedBeefOutput.net.beef,
      sheep: expectedSheepOutput.net.sheep,
      total: expectedBeefOutput.net.beef + expectedSheepOutput.net.sheep,
    },
  };
};
