import {
  AquacultureIntermediateOutput,
  calculateAquaculture,
} from '@/calculators/Aquaculture';
import { entriesFromObject } from '@/calculators/common/tools/object';
import { States } from '@/constants/types';
import {
  AquacultureInput,
  AquacultureOutput,
  AquacultureProductionSystem,
} from '@/types';
import XLSX, { Cell } from 'xlsx-populate';

type CellValue = string | number | boolean | Date | undefined;

const getWorkbook = async (filePath: string) => {
  // log the current working directory
  console.log(process.cwd());
  const workbook = await XLSX.fromFileAsync(filePath);
  return workbook;
};

const mapInputRegion = (input: Cell): States => {
  const value = input.value();
  if (typeof value !== 'string') {
    throw new Error(`Cell is not a string: ${input.address()}`);
  }

  const lookup: Record<States, string> = {
    wa_sw: 'SW WA',
    wa_nw: 'NW WA',
    vic: 'Vic',
    qld: 'Qld',
    sa: 'SA',
    tas: 'Tas',
    nt: 'NT',
    act: 'ACT',
    nsw: 'NSW',
  };

  const match = entriesFromObject(lookup).find(([_k, v]) => v === value);

  if (match) {
    return match[0];
  }

  throw new Error(`Cell is not a valid region: ${input.address()}`);
};

const getCalculatorInput = (workbook: XLSX.Workbook): AquacultureInput => {
  const sheetInputFarm = workbook.sheet('Input - Farm');
  const sheetInputElectricityFuel = workbook.sheet(
    'Input - Electricity & Fuel',
  );
  const sheetInputWasteOutputs = workbook.sheet('Input - Waste & Outputs');
  const sheetInputVegetation = workbook.sheet('Input - Vegetation');

  const state = mapInputRegion(sheetInputFarm.cell('C5'));

  const input: AquacultureInput = {
    enterprises: [
      {
        state,
        productionSystem:
          AquacultureProductionSystem.OFFSHORE_CAGED_AQUACULTURE,
        totalHarvestKg: 0,
        refrigerants: [],
        bait: [],
        customBait: [],
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
  const worksheet = workbook.sheet('Output');
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
      totalHarvestWeightKg: 0,
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
    console.log(input);
    const expectedOutput = getExpectedOutput(workbook);
    const calculatorData = calculateAquaculture(input);
    expect(calculatorData).toEqual(expectedOutput);
  });
});
