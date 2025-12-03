import { validateCalculatorInput } from '@/calculators';
import {
  AquacultureBaitPurchase,
  AquacultureCustomBaitPurchase,
  AquacultureInputSchema,
  AquacultureIntermediateOutput,
  calculateAquaculture,
} from '@/calculators/Aquaculture';
import {
  AquacultureInput,
  AquacultureOutput,
  AquacultureProductionSystem,
  FluidWasteInput,
  FreightInput,
  FuelInput,
  RefrigerantInput,
  SolidWasteInput,
  StationaryFuelInput,
  TransportFuelInput,
} from '@/types';
import {
  AquacultureBait,
  FluidWasteTreatmentType,
  FreightTypes,
  Refrigerant,
  Refrigerants,
  StationaryFuelTypes,
  TransportFuelTypes,
} from '@/types/enums';
import XLSX, { Cell } from 'xlsx-populate';
import { GeneratedTest, traverseExpectations } from '../common/emissions';
import {
  calculateElectricity,
  emptyOrNumber,
  getWorkbook,
  isEmptyCell,
  mapInput,
  mapInputRegion,
  numberInput,
  stringInput,
} from '../common/sheets';

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

const mapFluidWasteTreatmentType = mapInput<FluidWasteTreatmentType>({
  [FluidWasteTreatmentType.MANAGED_AEROBIC]: 'managed aerobic treatment',
  [FluidWasteTreatmentType.UNMANAGED_AEROBIC]: 'unmanaged aerobic treatment',
  [FluidWasteTreatmentType.ANAEROBIC_DIGESTER_REACTOR]:
    'anaerobic digester/reactor',
  [FluidWasteTreatmentType.SHALLOW_ANAEROBIC_LAGOON_LT_2M]:
    'shallow anaerobic lagoon (<2 metres)',
  [FluidWasteTreatmentType.DEEP_ANAEROBIC_LAGOON_GT_2M]:
    'deep anaerobic lagoon (>2 metres)',
});

const getRefrigerant = (
  typeCell: Cell,
  amountCell: Cell,
): RefrigerantInput | null => {
  const typeValue = stringInput(typeCell);

  if (typeValue === 'None') {
    return null;
  }
  const amountValue = numberInput(amountCell);
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

const getDownstreamFreight = (sheet: XLSX.Sheet): FreightInput[] => {
  const enabled = sheet.cell('C5').value() === 'Yes';

  if (!enabled) {
    return [];
  }

  const truck = {
    type: FreightTypes.TRUCK,
    totalKmTonnes: emptyOrNumber(sheet.cell('C10')),
  };
  const rail = {
    type: FreightTypes.RAIL,
    totalKmTonnes: emptyOrNumber(sheet.cell('C11')),
  };
  const longHaulFlight = {
    type: FreightTypes.LONG_HAUL_FLIGHT,
    totalKmTonnes: emptyOrNumber(sheet.cell('C12')),
  };
  const mediumHaulFlight = {
    type: FreightTypes.MEDIUM_HAUL_FLIGHT,
    totalKmTonnes: emptyOrNumber(sheet.cell('C13')),
  };
  const smallContainerShip = {
    type: FreightTypes.SMALL_CONTAINER_SHIP,
    totalKmTonnes: emptyOrNumber(sheet.cell('C14')),
  };
  const largeContainerShip = {
    type: FreightTypes.LARGE_CONTAINER_SHIP,
    totalKmTonnes: emptyOrNumber(sheet.cell('C15')),
  };

  return [
    truck,
    rail,
    longHaulFlight,
    mediumHaulFlight,
    smallContainerShip,
    largeContainerShip,
  ].filter((f) => f.totalKmTonnes !== null) as FreightInput[];
};

const getUpstreamFreight = (sheet: XLSX.Sheet): FreightInput[] => {
  const enabled = sheet.cell('C19').value() === 'Yes';

  if (!enabled) {
    return [];
  }

  const truck = {
    type: FreightTypes.TRUCK,
    totalKmTonnes: emptyOrNumber(sheet.cell('C24')),
  };
  const rail = {
    type: FreightTypes.RAIL,
    totalKmTonnes: emptyOrNumber(sheet.cell('C25')),
  };
  const longHaulFlight = {
    type: FreightTypes.LONG_HAUL_FLIGHT,
    totalKmTonnes: emptyOrNumber(sheet.cell('C26')),
  };
  const mediumHaulFlight = {
    type: FreightTypes.MEDIUM_HAUL_FLIGHT,
    totalKmTonnes: emptyOrNumber(sheet.cell('C27')),
  };
  const smallContainerShip = {
    type: FreightTypes.SMALL_CONTAINER_SHIP,
    totalKmTonnes: emptyOrNumber(sheet.cell('C28')),
  };
  const largeContainerShip = {
    type: FreightTypes.LARGE_CONTAINER_SHIP,
    totalKmTonnes: emptyOrNumber(sheet.cell('C29')),
  };

  return [
    truck,
    rail,
    longHaulFlight,
    mediumHaulFlight,
    smallContainerShip,
    largeContainerShip,
  ].filter((f) => f.totalKmTonnes !== null) as FreightInput[];
};

const getCommercialFlights = (sheet: XLSX.Sheet): number => {
  const enabled = sheet.cell('C33').value() === 'Yes';
  if (!enabled) {
    return 0;
  }

  return numberInput(sheet.cell('C38'));
};

const getElectricity = (sheet: XLSX.Sheet) => {
  const nonRenewable = emptyOrNumber(sheet.cell('C9')) ?? 0;
  const renewable = emptyOrNumber(sheet.cell('C10')) ?? 0;

  return calculateElectricity(renewable, nonRenewable);
};

const getTransportFuel = (sheet: XLSX.Sheet): TransportFuelInput[] => {
  const roadEnabled = sheet.cell('C32').value() === 'Yes';

  const roadRecords = !roadEnabled
    ? []
    : [
        // Road vehicles
        {
          type: TransportFuelTypes.PETROL,
          amountLitres: emptyOrNumber(sheet.cell('C37')),
        },
        {
          type: TransportFuelTypes.DIESEL,
          amountLitres: emptyOrNumber(sheet.cell('C38')),
        },
        {
          type: TransportFuelTypes.LPG,
          amountLitres: emptyOrNumber(sheet.cell('C39')),
        },
        {
          type: TransportFuelTypes.FUEL_OIL,
          amountLitres: emptyOrNumber(sheet.cell('C40')),
        },
        {
          type: TransportFuelTypes.ETHANOL,
          amountLitres: emptyOrNumber(sheet.cell('C41')),
        },
        {
          type: TransportFuelTypes.BIODIESEL,
          amountLitres: emptyOrNumber(sheet.cell('C42')),
        },
        {
          type: TransportFuelTypes.RENEWABLE_DIESEL,
          amountLitres: emptyOrNumber(sheet.cell('C43')),
        },
        {
          type: TransportFuelTypes.OTHER_BIOFUELS,
          amountLitres: emptyOrNumber(sheet.cell('C44')),
        },
        {
          type: TransportFuelTypes.LNG,
          amountLitres: emptyOrNumber(sheet.cell('C45')),
        },
      ];

  const marineEnabled = sheet.cell('C50').value() === 'Yes';

  const marineRecords = !marineEnabled
    ? []
    : [
        {
          type: TransportFuelTypes.PETROL,
          amountLitres: emptyOrNumber(sheet.cell('C55')),
        },
        {
          type: TransportFuelTypes.DIESEL,
          amountLitres: emptyOrNumber(sheet.cell('C56')),
        },
        {
          type: TransportFuelTypes.LPG,
          amountLitres: emptyOrNumber(sheet.cell('C57')),
        },
        {
          type: TransportFuelTypes.FUEL_OIL,
          amountLitres: emptyOrNumber(sheet.cell('C58')),
        },
        {
          type: TransportFuelTypes.ETHANOL,
          amountLitres: emptyOrNumber(sheet.cell('C59')),
        },
        {
          type: TransportFuelTypes.BIODIESEL,
          amountLitres: emptyOrNumber(sheet.cell('C60')),
        },
        {
          type: TransportFuelTypes.RENEWABLE_DIESEL,
          amountLitres: emptyOrNumber(sheet.cell('C61')),
        },
        {
          type: TransportFuelTypes.OTHER_BIOFUELS,
          amountLitres: emptyOrNumber(sheet.cell('C62')),
        },
        {
          type: TransportFuelTypes.LNG,
          amountLitres: emptyOrNumber(sheet.cell('C63')),
        },
      ];

  const aviationEnabled = sheet.cell('C68').value() === 'Yes';

  const aviationRecords = !aviationEnabled
    ? []
    : [
        {
          type: TransportFuelTypes.AVGAS,
          amountLitres: emptyOrNumber(sheet.cell('C73')),
        },
        {
          type: TransportFuelTypes.JET_A1,
          amountLitres: emptyOrNumber(sheet.cell('C74')),
        },
        {
          type: TransportFuelTypes.JET_B,
          amountLitres: emptyOrNumber(sheet.cell('C75')),
        },
        {
          type: TransportFuelTypes.LNG,
          amountLitres: emptyOrNumber(sheet.cell('C76')),
        },
        {
          type: TransportFuelTypes.OTHER_BIOFUELS,
          amountLitres: emptyOrNumber(sheet.cell('C77')),
        },
      ];

  return roadRecords
    .concat(marineRecords)
    .concat(aviationRecords)
    .filter((f) => f.amountLitres !== null) as TransportFuelInput[];
};

const getStationaryFuel = (sheet: XLSX.Sheet): StationaryFuelInput[] => {
  const enabled = sheet.cell('C15').value() === 'Yes';

  if (!enabled) {
    return [];
  }

  const result = [
    {
      type: StationaryFuelTypes.PETROL,
      amountLitres: emptyOrNumber(sheet.cell('C20')),
    },
    {
      type: StationaryFuelTypes.DIESEL,
      amountLitres: emptyOrNumber(sheet.cell('C21')),
    },
    {
      type: StationaryFuelTypes.LPG,
      amountLitres: emptyOrNumber(sheet.cell('C22')),
    },
    {
      type: StationaryFuelTypes.ETHANOL,
      amountLitres: emptyOrNumber(sheet.cell('C23')),
    },
    {
      type: StationaryFuelTypes.BIODIESEL,
      amountLitres: emptyOrNumber(sheet.cell('C24')),
    },
    {
      type: StationaryFuelTypes.RENEWABLE_DIESEL,
      amountLitres: emptyOrNumber(sheet.cell('C25')),
    },
    {
      type: StationaryFuelTypes.OTHER_BIOFUELS,
      amountLitres: emptyOrNumber(sheet.cell('C26')),
    },
    {
      type: StationaryFuelTypes.LNG,
      amountLitres: emptyOrNumber(sheet.cell('C27')),
    },
  ].filter((f) => f.amountLitres !== null) as StationaryFuelInput[];

  return result;
};

const getFuel = (sheet: XLSX.Sheet): FuelInput => {
  return {
    transportFuel: getTransportFuel(sheet),
    stationaryFuel: getStationaryFuel(sheet),
    naturalGas: emptyOrNumber(sheet.cell('C28')) ?? 0,
  };
};

const getFluidWaste = (sheet: XLSX.Sheet): FluidWasteInput[] => {
  const enabled = sheet.cell('C5').value() === 'Yes';
  const amountCell = sheet.cell('C7');

  if (!enabled || isEmptyCell(amountCell)) {
    return [];
  }

  return [
    {
      fluidWasteKl: numberInput(amountCell),
      fluidWasteTreatmentType: mapFluidWasteTreatmentType(sheet.cell('C9')),
      averageInletCOD: numberInput(sheet.cell('C10')),
      averageOutletCOD: numberInput(sheet.cell('C11')),
      flaredCombustedFraction: numberInput(sheet.cell('C12')),
    },
  ];
};

const getSolidWaste = (sheet: XLSX.Sheet): SolidWasteInput => {
  const enabled = sheet.cell('C17').value() === 'Yes';

  if (!enabled) {
    return {
      sentOffsiteTonnes: 0,
      onsiteCompostingTonnes: 0,
    };
  }

  return {
    sentOffsiteTonnes: numberInput(sheet.cell('C19')),
    onsiteCompostingTonnes: numberInput(sheet.cell('C20')),
  };
};

const getCalculatorInput = (workbook: XLSX.Workbook): AquacultureInput => {
  const sheetInputFarm = workbook.sheet('Input - Farm');
  const farm = (address: string) => sheetInputFarm.cell(address);

  const sheetInputElectricityFuel = workbook.sheet(
    'Input - Electricity & Fuel',
  );
  const sheetTravelFreight = workbook.sheet('Input - Travel & freight');
  const sheetInputWasteOutputs = workbook.sheet('Input - Waste & Outputs');

  const input: AquacultureInput = {
    enterprises: [
      {
        state: mapInputRegion(farm('C5')),
        productionSystem: mapInputProductionSystem(farm('C10')),
        totalHarvestKg: numberInput(farm('C11')),
        refrigerants: getRefrigerants(sheetInputFarm),
        bait: getBaitPurchases(sheetInputFarm),
        customBait: getCustomBaitPurchase(sheetInputFarm),
        inboundFreight: getUpstreamFreight(sheetTravelFreight),
        outboundFreight: getDownstreamFreight(sheetTravelFreight),
        totalCommercialFlightsKm: getCommercialFlights(sheetTravelFreight),
        ...getElectricity(sheetInputElectricityFuel),
        fuel: getFuel(sheetInputElectricityFuel),
        fluidWaste: getFluidWaste(sheetInputWasteOutputs),
        solidWaste: getSolidWaste(sheetInputWasteOutputs),
      },
    ],
  };
  return input;
};

const getExpectedOutput = (workbook: XLSX.Workbook): AquacultureOutput => {
  const summarySheet = workbook.sheet('Summary - Farm');
  const summary = (address: string) => numberInput(summarySheet.cell(address));

  const sheetInputFarm = workbook.sheet('Input - Farm');

  const expectedIntermediate: Omit<AquacultureIntermediateOutput, 'id'> = {
    scope1: {
      fuelCO2: summary('B5'),
      fuelCH4: summary('B6'),
      fuelN2O: summary('B7'),
      wasteWaterCO2: summary('B8'),
      compostedSolidWasteCO2: summary('B9'),
      hfcsRefrigerantLeakage: summary('B10'),
      totalCO2: summary('E4'),
      totalCH4: summary('E5'),
      totalN2O: summary('E6'),
      totalHFCs: summary('E7'),
      total: summary('B12'),
    },
    scope2: {
      electricity: summary('B15'),
      total: summary('B16'),
    },
    scope3: {
      purchasedBait: summary('B20'),
      electricity: summary('B22'),
      fuel: summary('B23'),
      commercialFlights: summary('B24'),
      inboundFreight: summary('B25'),
      outboundFreight: summary('B27'),
      solidWasteSentOffsite: summary('B28'),
      total: summary('B29'),
    },
    carbonSequestration: {
      total: 0,
    },
    intensities: {
      aquacultureIncludingCarbonOffsets: summary('B36'),
      aquacultureExcludingCarbonOffsets: summary('B37'),
      totalHarvestWeightKg: numberInput(sheetInputFarm.cell('C11')),
    },
    net: {
      total: summary('B34'),
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

let tests: GeneratedTest[];

describe('Compare aquaculture calculator to spreadsheet', () => {
  test('should match spreadsheet', async () => {
    const workbook = await getWorkbook(
      './src/test/sheets/comparison/Aq-GAFv1.0.xlsx',
    );
    const input = getCalculatorInput(workbook);
    const validatedInput = validateCalculatorInput(
      AquacultureInputSchema,
      input,
    );
    if (!validatedInput.valid) {
      throw validatedInput.error;
    }
    const expectedOutput = getExpectedOutput(workbook);
    const calculatorData = calculateAquaculture(validatedInput.result);
    tests = traverseExpectations(expectedOutput, calculatorData);
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
