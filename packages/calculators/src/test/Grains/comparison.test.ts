import { calculateGrains, validateCalculatorInput } from '@/calculators';
import { entriesFromObject } from '@/calculators/common/tools/object';
import {
  CropType,
  GrainsInput,
  GrainsInputSchema,
  GrainsIntermediateOutput,
  GrainsOutput,
  ProductionSystem,
} from '@/types';
import XLSX, { Cell } from 'xlsx-populate';
import { traverseExpectations } from '../common/emissions';
import {
  getWorkbook,
  mapInputRegionFromNumber,
  numberInput,
} from '../common/sheets';

// const mapInputProductionSystem = mapInput<AquacultureProductionSystem>({
//   'Offshore Caged Aquaculture': 'Offshore caged aquaculture',
//   'Onland Fish Farming': 'On-land fish farming (eg. barra, perch etc)',
//   'Onshore Hatchery': 'On-shore hatchery only',
//   'Abalone Farming': 'Abalone farming',
//   'Mussel Farming': 'Mussel farming',
//   'Oyster Farming': 'Oyster farming',
//   'Pearl Farming': 'Pearl farming',
//   'Prawn Farming': 'Prawn farming',
//   'Seaweed and Macroalgae Farming': 'Seaweed and macroalgae farming',
//   Other: 'Other',
// });

// const mapInputAquacultureBait = mapInput<AquacultureBait | 'None'>({
//   None: 'None',
//   'Whole Sardines': 'Whole Sardines',
//   'Low Animal Protein Formulated Feed': 'Low Animal Protein Formulated Feed',
//   'High Animal Protein Formulated Feed': 'High Animal Protein Formulated Feed',
//   'Cereal Grain': 'Cereal Grain',
//   Squid: 'Squid',
//   'Whole Fish': 'Whole Fish',
// });

// const mapFluidWasteTreatmentType = mapInput<FluidWasteTreatmentType>({
//   [FluidWasteTreatmentType.MANAGED_AEROBIC]: 'managed aerobic treatment',
//   [FluidWasteTreatmentType.UNMANAGED_AEROBIC]: 'unmanaged aerobic treatment',
//   [FluidWasteTreatmentType.ANAEROBIC_DIGESTER_REACTOR]:
//     'anaerobic digester/reactor',
//   [FluidWasteTreatmentType.SHALLOW_ANAEROBIC_LAGOON_LT_2M]:
//     'shallow anaerobic lagoon (<2 metres)',
//   [FluidWasteTreatmentType.DEEP_ANAEROBIC_LAGOON_GT_2M]:
//     'deep anaerobic lagoon (>2 metres)',
// });

// const getRefrigerant = (
//   typeCell: Cell,
//   amountCell: Cell,
// ): RefrigerantInput | null => {
//   const typeValue = typeCell.value();
//   if (typeof typeValue !== 'string') {
//     throw new Error(`Cell is not a string: ${typeCell.address()}`);
//   }
//   const amountValue = amountCell.value();
//   if (amountValue === undefined) {
//     return null;
//   }
//   if (typeof amountValue !== 'number') {
//     throw new Error(
//       `Cell address ${amountCell.address()} is not a number: ${amountValue}`,
//     );
//   }
//   if (typeValue === 'None') {
//     return null;
//   }
//   if (!Refrigerants.includes(typeValue as unknown as Refrigerant)) {
//     throw new Error(
//       `Cell address ${typeCell.address()} is not a valid refrigerant: ${typeValue}`,
//     );
//   }
//   return { refrigerant: typeValue as Refrigerant, chargeSize: amountValue };
// };

// const getRefrigerants = (sheet: XLSX.Sheet): RefrigerantInput[] => {
//   return [
//     getRefrigerant(sheet.cell('C17'), sheet.cell('E17')),
//     getRefrigerant(sheet.cell('C18'), sheet.cell('E18')),
//     getRefrigerant(sheet.cell('C19'), sheet.cell('E19')),
//     getRefrigerant(sheet.cell('C20'), sheet.cell('E20')),
//   ].filter((r) => r !== null);
// };

// const getBaitPurchase = (range: XLSX.Range): AquacultureBaitPurchase | null => {
//   const typeCell = range.cell(1, 0);
//   const amountCell = range.cell(0, 0);
//   const additionalIngredientsCell = range.cell(2, 0);
//   const emissionsIntensityCell = range.cell(3, 0);
//   if (
//     isEmptyCell(typeCell) ||
//     isEmptyCell(amountCell) ||
//     isEmptyCell(additionalIngredientsCell) ||
//     isEmptyCell(emissionsIntensityCell)
//   ) {
//     return null;
//   }
//   const type = mapInputAquacultureBait(typeCell);
//   if (type === 'None') {
//     return null;
//   }
//   return {
//     type,
//     purchasedTonnes: numberInput(range.cell(0, 0)),
//     additionalIngredients: numberInput(range.cell(2, 0)),
//     emissionsIntensity: numberInput(range.cell(3, 0)),
//   };
// };

// const getBaitPurchases = (sheet: XLSX.Sheet): AquacultureBaitPurchase[] => {
//   return [
//     getBaitPurchase(sheet.range('C26:C29')),
//     getBaitPurchase(sheet.range('D26:D29')),
//     getBaitPurchase(sheet.range('E26:E29')),
//     getBaitPurchase(sheet.range('F26:F29')),
//   ].filter((b) => b !== null);
// };

// const getCustomBaitPurchase = (
//   sheet: XLSX.Sheet,
// ): AquacultureCustomBaitPurchase[] => {
//   const amountCell = sheet.cell('G26');
//   const emissionsIntensityCell = sheet.cell('G30');
//   if (isEmptyCell(amountCell) || isEmptyCell(emissionsIntensityCell)) {
//     return [];
//   }
//   return [
//     {
//       purchasedTonnes: numberInput(amountCell),
//       emissionsIntensity: numberInput(emissionsIntensityCell),
//     },
//   ];
// };

// const getDownstreamFreight = (sheet: XLSX.Sheet): FreightInput[] => {
//   const enabled = sheet.cell('C5').value() === 'Yes';

//   if (!enabled) {
//     return [];
//   }

//   const truck = {
//     type: FreightTypes.TRUCK,
//     totalKmTonnes: emptyOrNumber(sheet.cell('C10')),
//   };
//   const rail = {
//     type: FreightTypes.RAIL,
//     totalKmTonnes: emptyOrNumber(sheet.cell('C11')),
//   };
//   const longHaulFlight = {
//     type: FreightTypes.LONG_HAUL_FLIGHT,
//     totalKmTonnes: emptyOrNumber(sheet.cell('C12')),
//   };
//   const mediumHaulFlight = {
//     type: FreightTypes.MEDIUM_HAUL_FLIGHT,
//     totalKmTonnes: emptyOrNumber(sheet.cell('C13')),
//   };
//   const smallContainerShip = {
//     type: FreightTypes.SMALL_CONTAINER_SHIP,
//     totalKmTonnes: emptyOrNumber(sheet.cell('C14')),
//   };
//   const largeContainerShip = {
//     type: FreightTypes.LARGE_CONTAINER_SHIP,
//     totalKmTonnes: emptyOrNumber(sheet.cell('C15')),
//   };

//   return [
//     truck,
//     rail,
//     longHaulFlight,
//     mediumHaulFlight,
//     smallContainerShip,
//     largeContainerShip,
//   ].filter((f) => f.totalKmTonnes !== null) as FreightInput[];
// };

// const getUpstreamFreight = (sheet: XLSX.Sheet): FreightInput[] => {
//   const enabled = sheet.cell('C19').value() === 'Yes';

//   if (!enabled) {
//     return [];
//   }

//   const truck = {
//     type: FreightTypes.TRUCK,
//     totalKmTonnes: emptyOrNumber(sheet.cell('C24')),
//   };
//   const rail = {
//     type: FreightTypes.RAIL,
//     totalKmTonnes: emptyOrNumber(sheet.cell('C25')),
//   };
//   const longHaulFlight = {
//     type: FreightTypes.LONG_HAUL_FLIGHT,
//     totalKmTonnes: emptyOrNumber(sheet.cell('C26')),
//   };
//   const mediumHaulFlight = {
//     type: FreightTypes.MEDIUM_HAUL_FLIGHT,
//     totalKmTonnes: emptyOrNumber(sheet.cell('C27')),
//   };
//   const smallContainerShip = {
//     type: FreightTypes.SMALL_CONTAINER_SHIP,
//     totalKmTonnes: emptyOrNumber(sheet.cell('C28')),
//   };
//   const largeContainerShip = {
//     type: FreightTypes.LARGE_CONTAINER_SHIP,
//     totalKmTonnes: emptyOrNumber(sheet.cell('C29')),
//   };

//   return [
//     truck,
//     rail,
//     longHaulFlight,
//     mediumHaulFlight,
//     smallContainerShip,
//     largeContainerShip,
//   ].filter((f) => f.totalKmTonnes !== null) as FreightInput[];
// };

// const getCommercialFlights = (sheet: XLSX.Sheet): number => {
//   const enabled = sheet.cell('C33').value() === 'Yes';
//   if (!enabled) {
//     return 0;
//   }

//   return numberInput(sheet.cell('C38'));
// };

const mapCropTypeFromNumber = (input: Cell): CropType => {
  const numberValue = numberInput(input);
  /*
  1	Wheat
2	Barley
3	Maize
4	Oats
5	Sorghum
6	Triticale
7	Other Cereals
8	Pulses
9	Tuber and Roots
10	Peanuts
11	Hops
12	Oilseeds
13	Forage Crops
14	Lucerne
15	Other legume
16	Annual grass
17	Grass clover mixture
18	Perennial pasture
  */
  const lookup: Record<
    Exclude<CropType, 'Rice' | 'Sugar Cane' | 'Cotton'>,
    number
  > = {
    Wheat: 1,
    Barley: 2,
    Maize: 3,
    Oats: 4,
    Sorghum: 5,
    Triticale: 6,
    'Other Cereals': 7,
    Pulses: 8,
    'Tuber and Roots': 9,
    Peanuts: 10,
    Hops: 11,
    Oilseeds: 12,
    'Forage Crops': 13,
    Lucerne: 14,
    'Other legume': 15,
    'Annual grass': 16,
    'Grass clover mixture': 17,
    'Perennial pasture': 18,
  };
  const match = entriesFromObject(lookup).find(([_k, v]) => v === numberValue);

  if (match) {
    return match[0];
  }

  throw new Error(
    `Cell address ${input.address()} is not a valid crop type: ${numberValue}`,
  );
};
// const mapCropType = mapInput<CropType>({
//   Wheat: 'Wheat',
//   Sorghum: 'Sorghum',
//   Triticale: 'Triticale',
//   'Other Cereals': 'Other Cereals',
//   Pulses: 'Pulses',
//   'Tuber and Roots': 'Tuber and Roots',
//   Peanuts: 'Peanuts',
//   'Sugar Cane': 'Sugar Cane',
//   Cotton: 'Cotton',
//   Hops: 'Hops',
//   Oilseeds: 'Oilseeds',
//   'Forage Crops': 'Forage Crops',
//   Lucerne: 'Lucerne',
//   'Other legume': 'Other legume',
//   'Annual grass': 'Annual grass',
//   'Grass clover mixture': 'Grass clover mixture',
//   'Perennial pasture': 'Perennial pasture',
//   Barley: 'Barley',
//   Maize: 'Maize',
//   Oats: 'Oats',
//   Rice: 'Rice',
// });

// const mapProductionSystem = mapInput<ProductionSystem>({
//   'Irrigated crop': 'Irrigated crop',
//   'Non-irrigated crop': 'Non-irrigated crop',
//   'Sugar cane': 'Sugar cane',
//   Cotton: 'Cotton',
//   Horticulture: 'Horticulture',
// });

const mapProductionSystemFromNumber = (input: Cell): ProductionSystem => {
  const numberValue = numberInput(input);
  const lookup: Record<ProductionSystem, number> = {
    'Non-irrigated crop': 1,
    'Irrigated crop': 2,
    'Sugar cane': 3,
    Cotton: 4,
    Horticulture: 5,
  };
  const match = entriesFromObject(lookup).find(([_k, v]) => v === numberValue);
  if (match) {
    return match[0];
  }
  throw new Error(
    `Cell address ${input.address()} is not a valid production system: ${numberValue}`,
  );
};

const getCalculatorInput = (workbook: XLSX.Workbook): GrainsInput => {
  const sheetInputCrops = workbook.sheet('Data input - crops');
  const crops = (address: string) => sheetInputCrops.cell(address);

  //   const sheetInputVegetation = workbook.sheet('Input - Vegetation');

  const input: GrainsInput = {
    state: mapInputRegionFromNumber(crops('C2')),
    crops: [
      {
        type: mapCropTypeFromNumber(crops('C3')),
        state: mapInputRegionFromNumber(crops('C2')),
        productionSystem: mapProductionSystemFromNumber(crops('C4')),
        rainfallAbove600: crops('C5').value() === 'Yes',
        averageGrainYield: numberInput(crops('C7')),
        areaSown: numberInput(crops('C8')),
        nonUreaNitrogen: numberInput(crops('C9')),
        phosphorusApplication: numberInput(crops('C10')),
        potassiumApplication: numberInput(crops('C11')),
        sulfurApplication: numberInput(crops('C12')),
        ureaApplication: numberInput(crops('C13')),
        ureaAmmoniumNitrate: numberInput(crops('C14')),
        limestone: numberInput(crops('C15')),
        limestoneFraction: numberInput(crops('C16')),
        fractionOfAnnualCropBurnt: numberInput(crops('C17')),
        dieselUse: numberInput(crops('C18')),
        petrolUse: numberInput(crops('C19')),
        lpg: numberInput(crops('C20')),
        electricityAllocation: 1,
        herbicideUse: numberInput(crops('C24')),
        glyphosateOtherHerbicideUse: numberInput(crops('C25')),
      },
    ],
    electricityUse: numberInput(crops('C21')),
    electricityRenewable: numberInput(crops('C22')),
    vegetation: [],
  };
  return input;
};

const getExpectedOutput = (workbook: XLSX.Workbook): GrainsOutput => {
  // console.dir(
  //   workbook.sheets().map((s) => s.name()),
  //   { depth: 1 },
  // );
  const summarySheet = workbook.sheet('Data summary');
  const summary = (address: string) => numberInput(summarySheet.cell(address));

  const sheetInputCrops = workbook.sheet('Data input - crops');
  const crops = (address: string) => numberInput(sheetInputCrops.cell(address));

  const expectedIntermediate: Omit<GrainsIntermediateOutput, 'id'> = {
    scope1: {
      fuelCO2: summary('C5'),
      limeCO2: summary('C6'),
      ureaCO2: summary('C7'),
      fieldBurningCH4: summary('C8'),
      fuelCH4: summary('C9'),
      fertiliserN2O: summary('C10'),
      atmosphericDepositionN2O: summary('C11'),
      fieldBurningN2O: summary('C12'),
      cropResidueN2O: summary('C13'),
      leachingAndRunoffN2O: summary('C14'),
      fuelN2O: summary('C15'),
      totalCO2: summary('J5'),
      totalCH4: summary('J6'),
      totalN2O: summary('J7'),
      total: summary('C16'),
    },
    scope2: {
      electricity: summary('C19'),
      total: summary('C20'),
    },
    scope3: {
      fertiliser: summary('C23'),
      herbicide: summary('C24'),
      electricity: summary('C25'),
      fuel: summary('C26'),
      lime: summary('C27'),
      total: summary('C28'),
    },
    carbonSequestration: {
      total: summary('C31'),
    },
    intensitiesWithSequestration: {
      grainProducedTonnes: crops('C7') * crops('C8'),
      grainsExcludingSequestration: summary('C36'),
      grainsIncludingSequestration: summary('C37'),
    },
    net: {
      total: summary('C33'),
    },
  };
  const output: GrainsOutput = {
    ...expectedIntermediate,
    intermediate: [
      {
        ...expectedIntermediate,
        id: '0',
      },
    ],
    intensities: [
      expectedIntermediate.intensitiesWithSequestration
        .grainsExcludingSequestration,
    ],
    intensitiesWithSequestration: [
      expectedIntermediate.intensitiesWithSequestration,
    ],
    net: {
      total: expectedIntermediate.net.total,
      crops: [expectedIntermediate.net.total],
    },
  };

  return output;
};

describe('Compare grains calculator to spreadsheet', () => {
  test('should match spreadsheet', async () => {
    const workbook = await getWorkbook(
      './src/test/sheets/comparison/GrainsGreenhouseV11.1.xlsx',
    );
    const input = getCalculatorInput(workbook);
    const validatedInput = validateCalculatorInput(GrainsInputSchema, input);
    // console.dir(validatedInput, { depth: null });
    const expectedOutput = getExpectedOutput(workbook);
    const calculatorData = calculateGrains(validatedInput);
    console.dir(calculatorData, { depth: null });
    const tests = traverseExpectations(expectedOutput, calculatorData);
    tests.forEach((test) => {
      try {
        test.test();
      } catch (e: unknown) {
        console.error(`Error in test ${test.path}: ${e}`);
        throw e;
      }
    });
  });
});
