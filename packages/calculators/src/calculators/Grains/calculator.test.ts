import { testContext } from '@/test/Grains/context';
import { grainsTestData } from '@/test/Grains/grains.data';
import { calculateGrains } from './calculator';
import { GrainsOutput } from './types';
import { GrainsInputSchema, GrainsInputTransformed } from './types/input';

describe('Grains Calculator', () => {
  describe('summaries', () => {
    let emissions: GrainsOutput;
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
      const input: GrainsInputTransformed = GrainsInputSchema.parse(testData);
      const context = testContext('Grains');
      emissions = calculateGrains(input, context);
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
      expect(fuelTransportCO2.value).toEqual(2698140);
      expect(fuelTransportCO2.references).toEqual(['8.1.1.1 (62)']);
      expect(fuelTransportCO2.constants).toEqual([
        {
          name: 'COMMON[TRANSPORT_FUEL_FACTORS.Cars and light commercial vehicles.Diesel oil.SCOPE1_EF.CO2]',
          value: 69.9,
          units: 'Mass(CO2) / Energy',
        },
        {
          name: 'COMMON[TRANSPORT_FUEL_FACTORS.Cars and light commercial vehicles.Diesel oil.ENERGY_CONTENT_FACTOR]',
          value: 38.6,
          units: 'Energy / Volume(Fuel)',
        },
      ]);
    });
    it('generates a summary for scope 1 residueLeachingAndRunoffN2O emissions', () => {
      const residueLeachingAndRunoffN2O =
        emissions.scope1.inorganicFertiliserN2O;

      expect(residueLeachingAndRunoffN2O.value).toEqual(78.53842857142857);
      expect(residueLeachingAndRunoffN2O.references).toEqual(['5.1.1.1 (119)']);
      expect(residueLeachingAndRunoffN2O.constants).toEqual([
        {
          name: 'CROP[INORGANIC_FERTILISER_FRACTIONS.Urea.N]',
          value: 0.46,
          units: 'Mass(N) / Mass(Inorganic Fertiliser)',
        },
        {
          name: 'CROP[EF_N2O_PRODUCTION_SYSTEM.Non-irrigated crops]',
          value: 0.0041,
          units: 'Mass(N2O) / Mass(Volatilised N)',
        },
        {
          name: 'COMMON[GWP_FACTORSC15]',
          value: 1.5714285714285714,
          units: 'real number',
        },
      ]);
    });
  });
});
