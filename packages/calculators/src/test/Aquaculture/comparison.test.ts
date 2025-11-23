import {
  AquacultureBaitPurchase,
  AquacultureCustomBaitPurchase,
  AquacultureIntermediateOutput,
  calculateAquaculture,
} from '@/calculators/Aquaculture';
import { States } from '@/constants/types';
import {
  AquacultureInput,
  AquacultureOutput,
  AquacultureProductionSystem,
  RefrigerantInput,
} from '@/types';
import { AquacultureBait, Refrigerant, Refrigerants } from '@/types/enums';
import XLSX, { Cell } from 'xlsx-populate';
import {
  getWorkbook,
  isEmptyCell,
  mapInput,
  numberInput,
} from '../common/sheets';

const mapInputRegion = mapInput<States>({
  wa_sw: 'SW WA',
  wa_nw: 'NW WA',
  vic: 'Vic',
  qld: 'Qld',
  sa: 'SA',
  tas: 'Tas',
  nt: 'NT',
  act: 'ACT',
  nsw: 'NSW',
});

const mapInputProductionSystem = mapInput<AquacultureProductionSystem>({
  'Offshore Caged Aquaculture': 'Offshore caged aquaculture',
  'Onland Fish Farming': 'On-land fish farming (eg. barra, perch etc)',
  'Onshore Hatchery': 'On-shore hatchery only',
  'Abalone Farming': 'Abalone farming',
  'Mussel Farming': 'Mussel farming',
  'Oyster Farming': 'Oyster farming',
  'Pearl Farming': 'Pearl farming',
  'Prawn Farming': 'Prawn farming',
  'Seaweed and Macroalgae Farming': 'Seaweed and macroalgae farming',
  Other: 'Other',
});

const mapInputAquacultureBait = mapInput<AquacultureBait | 'None'>({
  None: 'None',
  'Whole Sardines': 'Whole Sardines',
  'Low Animal Protein Formulated Feed': 'Low Animal Protein Formulated Feed',
  'High Animal Protein Formulated Feed': 'High Animal Protein Formulated Feed',
  'Cereal Grain': 'Cereal Grain',
  Squid: 'Squid',
  'Whole Fish': 'Whole Fish',
});

const getRefrigerant = (
  typeCell: Cell,
  amountCell: Cell,
): RefrigerantInput | null => {
  const typeValue = typeCell.value();
  if (typeof typeValue !== 'string') {
    throw new Error(`Cell is not a string: ${typeCell.address()}`);
  }
  const amountValue = amountCell.value();
  if (amountValue === undefined) {
    return null;
  }
  if (typeof amountValue !== 'number') {
    throw new Error(
      `Cell address ${amountCell.address()} is not a number: ${amountValue}`,
    );
  }
  if (typeValue === 'None') {
    return null;
  }
  if (!Refrigerants.includes(typeValue as unknown as Refrigerant)) {
    throw new Error(
      `Cell address ${typeCell.address()} is not a valid refrigerant: ${typeValue}`,
    );
  }
  return { refrigerant: typeValue as Refrigerant, chargeSize: amountValue };
};

const getRefrigerants = (sheet: XLSX.Sheet): RefrigerantInput[] => {
  return [
    getRefrigerant(sheet.cell('C17'), sheet.cell('E17')),
    getRefrigerant(sheet.cell('C18'), sheet.cell('E18')),
    getRefrigerant(sheet.cell('C19'), sheet.cell('E19')),
    getRefrigerant(sheet.cell('C20'), sheet.cell('E20')),
  ].filter((r) => r !== null);
};

const getBaitPurchase = (range: XLSX.Range): AquacultureBaitPurchase | null => {
  const typeCell = range.cell(1, 0);
  const amountCell = range.cell(0, 0);
  const additionalIngredientsCell = range.cell(2, 0);
  const emissionsIntensityCell = range.cell(3, 0);
  if (
    isEmptyCell(typeCell) ||
    isEmptyCell(amountCell) ||
    isEmptyCell(additionalIngredientsCell) ||
    isEmptyCell(emissionsIntensityCell)
  ) {
    return null;
  }
  const type = mapInputAquacultureBait(typeCell);
  if (type === 'None') {
    return null;
  }
  return {
    type,
    purchasedTonnes: numberInput(range.cell(0, 0)),
    additionalIngredients: numberInput(range.cell(2, 0)),
    emissionsIntensity: numberInput(range.cell(3, 0)),
  };
};

const getBaitPurchases = (sheet: XLSX.Sheet): AquacultureBaitPurchase[] => {
  return [
    getBaitPurchase(sheet.range('C26:C29')),
    getBaitPurchase(sheet.range('D26:D29')),
    getBaitPurchase(sheet.range('E26:E29')),
    getBaitPurchase(sheet.range('F26:F29')),
  ].filter((b) => b !== null);
};

const getCustomBaitPurchase = (
  sheet: XLSX.Sheet,
): AquacultureCustomBaitPurchase[] => {
  const amountCell = sheet.cell('G26');
  const emissionsIntensityCell = sheet.cell('G30');
  if (isEmptyCell(amountCell) || isEmptyCell(emissionsIntensityCell)) {
    return [];
  }
  return [
    {
      purchasedTonnes: numberInput(amountCell),
      emissionsIntensity: numberInput(emissionsIntensityCell),
    },
  ];
};

const getCalculatorInput = (workbook: XLSX.Workbook): AquacultureInput => {
  const sheetInputFarm = workbook.sheet('Input - Farm');
  const farm = (address: string) => sheetInputFarm.cell(address);

  //   const sheetInputElectricityFuel = workbook.sheet(
  //     'Input - Electricity & Fuel',
  //   );
  //   const sheetInputWasteOutputs = workbook.sheet('Input - Waste & Outputs');
  //   const sheetInputVegetation = workbook.sheet('Input - Vegetation');

  const input: AquacultureInput = {
    enterprises: [
      {
        state: mapInputRegion(farm('C5')),
        productionSystem: mapInputProductionSystem(farm('C10')),
        totalHarvestKg: numberInput(farm('C11')),
        refrigerants: getRefrigerants(sheetInputFarm),
        bait: getBaitPurchases(sheetInputFarm),
        customBait: getCustomBaitPurchase(sheetInputFarm),
        inboundFreight: [],
        outboundFreight: [],
        totalCommercialFlightsKm: 0,
        electricitySource: 'State Grid',
        electricityUse: 0,
        electricityRenewable: 0,
        fuel: {
          transportFuel: [],
          stationaryFuel: [],
          naturalGas: 0,
        },
        fluidWaste: [],
        solidWaste: {
          sentOffsiteTonnes: 0,
          onsiteCompostingTonnes: 0,
        },
      },
    ],
  };
  return input;
};

const getExpectedOutput = (workbook: XLSX.Workbook): AquacultureOutput => {
  const summary = workbook.sheet('Summary - Farm');
  const sheetInputFarm = workbook.sheet('Input - Farm');

  const expectedIntermediate: Omit<AquacultureIntermediateOutput, 'id'> = {
    scope1: {
      fuelCO2: 0,
      fuelCH4: 0,
      fuelN2O: 0,
      hfcsRefrigerantLeakage: 0,
      wasteWaterCO2: 0,
      compostedSolidWasteCO2: 0,
      totalCO2: 0,
      totalCH4: 0,
      totalN2O: 0,
      totalHFCs: 0,
      total: 0,
    },
    scope2: {
      electricity: 0,
      total: 0,
    },
    scope3: {
      purchasedBait: 0,
      electricity: 0,
      fuel: 0,
      commercialFlights: 0,
      inboundFreight: 0,
      outboundFreight: 0,
      solidWasteSentOffsite: 0,
      total: 0,
    },
    carbonSequestration: {
      total: 0,
    },
    intensities: {
      aquacultureIncludingCarbonOffsets: 0,
      aquacultureExcludingCarbonOffsets: 0,
      totalHarvestWeightKg: numberInput(sheetInputFarm.cell('C11')),
    },
    net: {
      total: 0,
    },
  };
  const output: AquacultureOutput = {
    ...expectedIntermediate,
    intermediate: [{ ...expectedIntermediate, id: '0' }],
    purchasedOffsets: {
      total: 0,
    },
  };

  return output;
};

describe('Compare aquaculture calculator to spreadsheet', () => {
  test('should match spreadsheet', async () => {
    const workbook = await getWorkbook(
      './src/test/sheets/comparison/Aq-GAFv1.0.xlsx',
    );
    const input = getCalculatorInput(workbook);
    console.dir(input, { depth: null });
    const expectedOutput = getExpectedOutput(workbook);
    const calculatorData = calculateAquaculture(input);
    expect(calculatorData).toEqual(expectedOutput);
  });
});
