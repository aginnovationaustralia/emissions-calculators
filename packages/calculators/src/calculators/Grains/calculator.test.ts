import { testContext } from '@/test/Grains/context';
import { grainsTestData } from '@/test/Grains/grains.data';
import { calculateGrains } from './calculator';
import { GrainsOutput } from './types';
import { GrainsInputSchema, GrainsInputTransformed } from './types/input';

describe('Grains Calculator', () => {
  describe('summaries', () => {
    let emissions: GrainsOutput;
    beforeEach(() => {
      const input: GrainsInputTransformed =
        GrainsInputSchema.parse(grainsTestData);
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
      expect(fuelTransportCO2.value).toEqual(8.442144 * 1000000);
      expect(fuelTransportCO2.references).toEqual(['6.1.1 (55)']);
      expect(fuelTransportCO2.constants).toEqual([
        {
          name: 'COMMON[FUEL_ENERGYGJ.TRANSPORT.DIESEL.SCOPE1_EF.CO2]',
          value: 69.9,
          units: 'Mass(CO2) / Energy',
        },
        {
          name: 'COMMON[FUEL_ENERGYGJ.TRANSPORT.DIESEL.ENERGY_CONTENT_FACTOR]',
          value: 38.6,
          units: 'Energy / Volume(Fuel)',
        },
        {
          name: 'COMMON[FUEL_ENERGYGJ.TRANSPORT.PETROL.SCOPE1_EF.CO2]',
          value: 67.4,
          units: 'Mass(CO2) / Energy',
        },
        {
          name: 'COMMON[FUEL_ENERGYGJ.TRANSPORT.PETROL.ENERGY_CONTENT_FACTOR]',
          value: 34.2,
          units: 'Energy / Volume(Fuel)',
        },
        {
          name: 'COMMON[FUEL_ENERGYGJ.TRANSPORT.LPG.SCOPE1_EF.CO2]',
          value: 60.2,
          units: 'Mass(CO2) / Energy',
        },
        {
          name: 'COMMON[FUEL_ENERGYGJ.TRANSPORT.LPG.ENERGY_CONTENT_FACTOR]',
          value: 26.2,
          units: 'Energy / Volume(Fuel)',
        },
      ]);
    });
    it('generates a summary for scope 1 residueLeachingAndRunoffN2O emissions', () => {
      const residueLeachingAndRunoffN2O =
        emissions.scope1.residueLeachingAndRunoffN2O;

      expect(residueLeachingAndRunoffN2O.value).toEqual(84.524);
      expect(residueLeachingAndRunoffN2O.references).toEqual(['5.1.1.1 (147)']);
      expect(residueLeachingAndRunoffN2O.constants).toEqual([
        {
          name: 'COMMON[FERTILISER_EF]',
          value: 0.2,
          units: 'Mass(CO2) / Mass(Fertiliser)',
        },
      ]);
    });
  });
});
