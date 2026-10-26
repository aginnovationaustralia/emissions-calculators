import { divideBySafeFromZero } from '@/calculators/common/tools/calculate';
import { LULUCFInput } from '@/modules';
import { calculateLULUCF } from '@/modules/lulucf/calculate';
import { testContext } from '@/test/Grains/context';
import {
  grainsTestData,
  grainWheat,
  wheatCropKey,
} from '@/test/Grains/grains.data';
import { sumOfValuesInKgCO2e } from '@/tools/gwp';
import { nv } from '@/tools/inputs';
import { tonnesToKg } from '@/tools/unit-conversion';
import { GrainsCropResidueInput } from '../Grains/types/crop.input';
import { calculateCropping } from './calculator';
import { CroppingOutput } from './types';
import {
  CroppingInput,
  CroppingInputSchema,
  CroppingInputTransformed,
} from './types/input';

const lulucfLandUseInput: LULUCFInput = {
  activities: [
    {
      type: 'landClearingForestToCropland',
      isInLeachingZone: false,
      cropProductionSystem: 'Irrigated crop',
      carbonMassInTreesCurrentYear: nv(10),
      carbonMassInTreesPreviousYear: nv(50),
      carbonMassInDebrisCurrentYear: nv(5),
      carbonMassInDebrisPreviousYear: nv(20),
      massCH4FromBiomassBurningPerHectare: nv(0),
      massN2OFromBiomassBurningPerHectare: nv(0),
      region: 'Arnhem Coast',
      areaBurnt: nv(0),
      activityAreaHectares: nv(100),
    },
  ],
};

const cropInputKeys: GrainsCropResidueInput[] = [
  {
    ...wheatCropKey,
    totalYieldKg: nv(1000 * 1000),
  },
  {
    ...wheatCropKey,
    totalYieldKg: nv(800 * 1000),
  },
];

const lulucfCroppingTestInput: CroppingInput = {
  electricity: {
    method: 'location',
    electricityPurchasedKWh: nv(1000),
    region: 'NSW',
  },
  landUse: lulucfLandUseInput,
  crops: [
    {
      ...grainWheat,
      crop: cropInputKeys[0],
    },
    {
      ...grainWheat,
      crop: cropInputKeys[1],
    },
  ],
};

describe('Cropping Calculator', () => {
  describe('summaries', () => {
    let emissions: CroppingOutput;
    beforeEach(() => {
      const testData = {
        ...grainsTestData,
        crops: [
          {
            ...grainsTestData.crops[0],
            isInLeachingZone: true,
          },
        ],
      };
      const input: CroppingInputTransformed =
        CroppingInputSchema.parse(testData);
      const context = testContext('Cropping');
      emissions = calculateCropping(input, context);
    });
    it('generates a summary for scope 1 fuelTransportCO2 emissions', () => {
      const fuelTransportCO2 = emissions.scope1.fuelTransportCO2;

      /* actual diesel (l) * content factor * ef for fuel | 6352 * 38.6 * 69.9 = 17,138,585.28
      // + petrol (l) * content factor * ef for fuel | 0
      // + lpg (l) * content factor * ef for fuel | 100 * 26.2 * 60.2 = 157724
      // = 17,296,309.28
      // energy content factor = GJ / kL
      // ef for fuel = kg CO2 / GJ
      */
      expect(fuelTransportCO2.amountGasKg).toEqual(2698.14);
      expect(fuelTransportCO2.references).toEqual(['8.1.1.1 (1)']);
      expect(fuelTransportCO2.constants).toEqual([
        {
          name: 'COMMON[TRANSPORT_FUEL_FACTORS.Cars and light commercial vehicles.Diesel oil.SCOPE1_EF.CO2]',
          value: 0.0000699,
          units: 'Mass(CO2e) / Energy',
        },
        {
          name: 'COMMON[TRANSPORT_FUEL_FACTORS.Cars and light commercial vehicles.Diesel oil.ENERGY_CONTENT_FACTOR]',
          value: 38600,
          units: 'Energy / Volume(Fuel)',
        },
      ]);
    });
    it('generates a summary for scope 1 residueLeachingAndRunoffN2O emissions', () => {
      const residueLeachingAndRunoffN2O =
        emissions.scope1.inorganicFertiliserN2O;

      expect(residueLeachingAndRunoffN2O.amountTonnesCO2e).toEqual(0.03444894);
      expect(residueLeachingAndRunoffN2O.references).toEqual([
        '5.1.1.1 (1)',
        '5.1.1.1 (2)',
      ]);
      expect(residueLeachingAndRunoffN2O.constants).toEqual([
        {
          name: 'FNinorganic,f (Urea)',
          value: 0.46,
          units: 'Mass(N) / Mass(Inorganic Fertiliser)',
        },
        {
          name: 'CROP[EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM.Non-irrigated pasture]',
          units: 'Mass(N2O) / Mass(N)',
          value: 0.0018,
        },
        {
          name: 'COMMON[ELEMENTAL_TO_MOLECULAR_N2O]',
          value: 1.57,
          units: 'Mass(N2O) / Mass(N2O)',
        },
      ]);
    });
  });

  describe('lulucf', () => {
    let input: CroppingInputTransformed;
    let emissions: CroppingOutput;
    let fullLulucfWoodyCarbonStocksCO2: number;

    beforeEach(() => {
      input = CroppingInputSchema.parse(lulucfCroppingTestInput);
      const context = testContext('Cropping');
      const lulucf = calculateLULUCF(input, context);
      fullLulucfWoodyCarbonStocksCO2 =
        lulucf.woodyCarbonStocksCO2.unit.store.toNumber();
      emissions = calculateCropping(input, context);
    });

    it('includes the full, unallocated LULUCF total only in the merged scope 1 output', () => {
      expect(emissions.scope1.woodyCarbonStocksCO2.amountGasKg).toBeCloseTo(
        fullLulucfWoodyCarbonStocksCO2,
      );
    });

    it('does not include LULUCF keys in per-crop intermediate scope 1 outputs', () => {
      for (const crop of emissions.intermediate) {
        expect(crop.scope1).not.toHaveProperty('woodyCarbonStocksCO2');
      }
    });
  });

  describe('intensities', () => {
    let input: CroppingInputTransformed;
    let emissions: CroppingOutput;
    let lulucfTotalCO2e: number;

    beforeEach(() => {
      input = CroppingInputSchema.parse(lulucfCroppingTestInput);
      const context = testContext('Cropping');
      lulucfTotalCO2e = sumOfValuesInKgCO2e(
        calculateLULUCF(input, context),
      ).toNumber();
      emissions = calculateCropping(input, context);
    });

    it('calculates top-level intensities including and excluding LULUCF', () => {
      const {
        cropHarvestedKg: grainProducedKg,
        cropIntensityIncludingLULUCF: grainsIncludingLULUCF,
        cropIntensityExcludingLULUCF: grainsExcludingLULUCF,
      } = emissions.intensities;

      expect(grainProducedKg.value).toBe(1800 * 1000); // Convert tonnes to kg
      expect(grainsIncludingLULUCF.value).toBeCloseTo(
        divideBySafeFromZero(
          tonnesToKg(emissions.net.total.tonnesCO2e).toNumber(),
          grainProducedKg.value,
        ),
      );
      expect(grainsExcludingLULUCF.value).toBeCloseTo(
        divideBySafeFromZero(
          tonnesToKg(emissions.net.total.tonnesCO2e).toNumber() -
            lulucfTotalCO2e,
          grainProducedKg.value,
        ),
      );
      // Land clearing is a net LULUCF emission, so excluding it lowers the intensity
      expect(grainsExcludingLULUCF.value).toBeLessThan(
        grainsIncludingLULUCF.value,
      );
    });

    it('calculates a single, unallocated intensity per crop', () => {
      const [cropA, cropB] = emissions.intermediate;

      [cropA, cropB].forEach((crop, index) => {
        const { cropHarvestedKg: grainProducedKg, cropIntensity } =
          crop.intensities;

        expect(grainProducedKg.value).toBe(
          // Convert tonnes to kg
          cropInputKeys[index].totalYieldKg.value,
        );
        expect(cropIntensity.value).toBeCloseTo(
          divideBySafeFromZero(
            tonnesToKg(crop.net.total.tonnesCO2e).toNumber(),
            grainProducedKg.value,
          ),
        );
      });
    });
  });
  describe('intensities with LULUCF sequestration', () => {
    let emissions: CroppingOutput;
    let lulucfTotalKgCO2e: number;
    const cropHarvestedKg = 1000 * 1000;

    beforeEach(() => {
      const sequestrationInput: CroppingInput = {
        electricity: {
          method: 'location',
          electricityPurchasedKWh: nv(0),
          region: 'NSW',
        },
        landUse: {
          activities: [
            {
              type: 'revegetationByPlanting',
              // Trees and debris gain carbon, so LULUCF is a net removal (negative)
              carbonMassInTreesCurrentYear: nv(50),
              carbonMassInTreesPreviousYear: nv(10),
              carbonMassInDebrisCurrentYear: nv(20),
              carbonMassInDebrisPreviousYear: nv(5),
              activityAreaHectares: nv(10),
            },
          ],
        },
        crops: [
          {
            climateZone: 'wet',
            state: 'NSW',
            electricityAllocation: nv(1),
            crop: {
              type: 'Wheat',
              totalYieldKg: nv(cropHarvestedKg),
              residues: { calculationMethod: '1' },
              fractionOfAnnualCropBurnt: nv(0),
            },
            lime: { applications: [] },
            chemicals: [],
            refrigerants: [],
            fertiliser: {
              productionSystem: 'Non-irrigated pasture',
              inorganic: { applications: [], calculationMethodScope1: '1' },
              organic: { applications: [] },
            },
            isInLeachingZone: false,
            fuel: {
              transport: [
                {
                  vehicleType: 'Cars and light commercial vehicles',
                  amountKilolitres: nv(1),
                  fuelType: 'Diesel oil',
                },
              ],
              stationary: [],
            },
            services: { fuel: { stationary: [], transport: [] } },
            waste: {},
          },
        ],
      };
      const input = CroppingInputSchema.parse(sequestrationInput);
      const context = testContext('Cropping');
      lulucfTotalKgCO2e = sumOfValuesInKgCO2e(
        calculateLULUCF(input, context),
      ).toNumber();
      emissions = calculateCropping(input, context);
    });

    it('has negative LULUCF emissions included in the net total', () => {
      expect(lulucfTotalKgCO2e).toBeLessThan(0);
      expect(emissions.scope1.woodyCarbonStocksCO2.amountGasKg).toBeLessThan(0);
    });

    it('reports a higher intensity when sequestration is excluded', () => {
      const {
        cropHarvestedKg: harvested,
        cropIntensityIncludingLULUCF,
        cropIntensityExcludingLULUCF,
      } = emissions.intensities;
      const netKgCO2e = tonnesToKg(emissions.net.total.tonnesCO2e).toNumber();

      expect(harvested.value).toBe(cropHarvestedKg);
      expect(cropIntensityIncludingLULUCF.value).toBeCloseTo(
        netKgCO2e / cropHarvestedKg,
      );
      // Net already contains LULUCF, so excluding it means removing it from net
      expect(cropIntensityExcludingLULUCF.value).toBeCloseTo(
        (netKgCO2e - lulucfTotalKgCO2e) / cropHarvestedKg,
      );
      expect(cropIntensityExcludingLULUCF.value).toBeGreaterThan(
        cropIntensityIncludingLULUCF.value,
      );
    });
  });

  describe('scope outputs correctly sum to reported totals', () => {
    let input: CroppingInputTransformed;
    let emissions: CroppingOutput;
    let totalFromCO2keys = 0;
    let totalFromCH4keys = 0;
    let totalFromN2Okeys = 0;
    let totalFromOtherKeys = 0;

    beforeAll(() => {
      input = CroppingInputSchema.parse(lulucfCroppingTestInput);
      const context = testContext('Cropping');
      emissions = calculateCropping(input, context);
      const {
        totalCO2: _CO2,
        totalCH4: _CH4,
        totalN2O: _N2O,
        totalOtherGases: _other,
        total: _total,
        ...individualOutputs
      } = emissions.scope1;

      Object.values(individualOutputs).forEach((value) => {
        switch (value.gas) {
          case 'CO2':
            totalFromCO2keys += value.amountTonnesCO2e;
            break;
          case 'CH4':
            totalFromCH4keys += value.amountTonnesCO2e;
            break;
          case 'N2O':
            totalFromN2Okeys += value.amountTonnesCO2e;
            break;
          default:
            totalFromOtherKeys += value.amountTonnesCO2e;
        }
      });
    });

    it('calculates the CO2 scope 1 subtotal correctly', () => {
      expect(emissions.scope1.totalCO2.tonnesCO2e).toBeCloseTo(
        totalFromCO2keys,
        7,
      );
    });
    it('calculates the CH4 scope 1 subtotal correctly', () => {
      expect(emissions.scope1.totalCH4.tonnesCO2e).toBeCloseTo(
        totalFromCH4keys,
        7,
      );
    });
    it('calculates the N2O scope 1 subtotal correctly', () => {
      expect(emissions.scope1.totalN2O.tonnesCO2e).toBeCloseTo(
        totalFromN2Okeys,
        7,
      );
    });
    it('calculates the other gas scope 1 subtotal correctly', () => {
      expect(emissions.scope1.totalOtherGases.tonnesCO2e).toBeCloseTo(
        totalFromOtherKeys,
        7,
      );
    });
    it('calculates the scope 1 total correctly', () => {
      expect(emissions.scope1.total.tonnesCO2e).toBeCloseTo(
        totalFromCO2keys +
          totalFromCH4keys +
          totalFromN2Okeys +
          totalFromOtherKeys,
        7,
      );

      // This test is here to make sure refrigerants aren't missed. This check is here to
      // make sure that this scenario is actually being covered.
      expect(emissions.scope1.total.tonnesCO2e).not.toBeCloseTo(
        totalFromCO2keys + totalFromCH4keys + totalFromN2Okeys + 7,
      );
    });

    it('calculates the scope 3 total correctly', () => {
      const { total, ...scope3IndividualResults } = emissions.scope3;
      const sumOfKeys = Object.values(scope3IndividualResults).reduce(
        (acc, curr) => acc + curr.amountTonnesCO2e,
        0,
      );
      expect(total.tonnesCO2e).toBeCloseTo(sumOfKeys, 7);
    });

    it('calculates net total correctly', () => {
      const scopeSum =
        emissions.scope1.total.tonnesCO2e +
        emissions.scope2.total.tonnesCO2e +
        emissions.scope3.total.tonnesCO2e;
      expect(emissions.net.total.tonnesCO2e).toBeCloseTo(scopeSum, 7);
    });
  });

  describe('summing across crops when the first crop has none of an emission source', () => {
    let emissions: CroppingOutput;

    beforeAll(() => {
      const input = CroppingInputSchema.parse({
        ...lulucfCroppingTestInput,
        crops: [
          {
            ...grainWheat,
            crop: cropInputKeys[0],
            chemicals: [],
            fertiliser: {
              productionSystem: 'Non-irrigated pasture',
              inorganic: { applications: [], calculationMethodScope1: '1' },
              organic: { applications: [] },
            },
          },
          { ...grainWheat, crop: cropInputKeys[1] },
        ],
      } satisfies CroppingInput);
      emissions = calculateCropping(input, testContext('Cropping'));
    });

    it("carries the second crop's fertiliser N2O into the enterprise total", () => {
      const [first, second] = emissions.intermediate;
      expect(first.scope1.inorganicFertiliserN2O.amountGasKg).toBe(0);
      expect(second.scope1.inorganicFertiliserN2O.amountGasKg).toBeGreaterThan(
        0,
      );
      expect(emissions.scope1.inorganicFertiliserN2O).toMatchObject({
        gas: 'N2O',
        amountGasKg: second.scope1.inorganicFertiliserN2O.amountGasKg,
      });
    });

    it("carries the second crop's agrichemicals into the enterprise total", () => {
      const [first, second] = emissions.intermediate;
      expect(first.scope3.agrichemicals.amountGasKg).toBe(0);
      expect(second.scope3.agrichemicals.amountGasKg).toBeGreaterThan(0);
      expect(emissions.scope3.agrichemicals.amountGasKg).toBe(
        second.scope3.agrichemicals.amountGasKg,
      );
    });
  });
});
