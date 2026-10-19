import { nv } from '@/tools/inputs';
import {
  calculate12Scope1SupplementaryCO2,
  HasSupplementaryCO2Input,
  HasSupplementaryCO2InputSchema,
} from '../scope1/12-supplementary-co2';
import { collectInputs } from '@/tools/collect';

describe('12.1.1 Supplementary CO2', () => {
  it('accepts inputs for method 1 calculation', async () => {
    const input: HasSupplementaryCO2Input = {
      supplementaryCO2Kg: nv(100),
    };

    const parsed = HasSupplementaryCO2InputSchema.parse(input);

    const output = calculate12Scope1SupplementaryCO2(parsed);

    const collectedInputs = collectInputs(output);

    expect(collectedInputs).toEqual(
      expect.arrayOf(
        expect.objectContaining({
          modules: expect.arrayContaining(['12.1']),
        }),
      ),
    );

    expect(output.unit.store.toNumber()).toEqual(100);
  });
});
