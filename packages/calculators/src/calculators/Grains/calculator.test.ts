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
    });
  });
});
