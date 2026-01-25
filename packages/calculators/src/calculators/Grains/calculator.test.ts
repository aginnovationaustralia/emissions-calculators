import { testContext } from '@/test/common/context';
import { grainsTestData } from '@/test/Grains/grains.data';
import {
  GrainsInputSchema,
  GrainsInputTransformed,
} from '@/types/Grains/input';
import { calculateGrains } from './calculator';

describe('Grains Calculator', () => {
  describe('summaries', () => {
    it('generates a summary for scope 1 emissions', () => {
      const input: GrainsInputTransformed =
        GrainsInputSchema.parse(grainsTestData);
      const context = testContext('Grains');
      const emissions = calculateGrains(input, context);

      const fuelCO2 = emissions.scope1.fuelCO2;

      //   console.dir(emissions, { depth: null });

      expect(fuelCO2.value).toEqual(987.5);
      expect(fuelCO2.references).toEqual(['6.1.1 (55)']);
      expect(fuelCO2.constants).toEqual([
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
  });
});
