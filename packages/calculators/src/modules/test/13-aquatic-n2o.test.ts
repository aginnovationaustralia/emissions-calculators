import { testContext } from '@/test/Grains/context';
import { collectInputs } from '@/tools/collect';
import { nv } from '@/tools/inputs';
import { massInTonnes } from '@/tools/unit-conversion';
import {
  calculateScope1AquaticN2O,
  HasAquacultureSystemInput,
  HasAquacultureSystemInputSchema,
} from '../scope1/13-aquatic';

describe('13.1.1 Aquatic N2O', () => {
  it('accepts inputs for method 1 calculation', async () => {
    const coastalInput: HasAquacultureSystemInput = {
      fishery: {
        amountProduced: nv(100),
        location: 'Coastal wetland habitat',
      },
    };
    const seagrassInput: HasAquacultureSystemInput = {
      fishery: {
        amountProduced: nv(100),
        location: 'Offshore cages in seagrass meadows',
      },
    };
    const otherInput: HasAquacultureSystemInput = {
      fishery: {
        amountProduced: nv(100),
        location: 'Other',
      },
    };

    const coastalParsed = HasAquacultureSystemInputSchema.parse(coastalInput);
    const seagrassParsed = HasAquacultureSystemInputSchema.parse(seagrassInput);
    const otherParsed = HasAquacultureSystemInputSchema.parse(otherInput);

    const coastalOutput = calculateScope1AquaticN2O(
      coastalParsed,
      testContext(),
    );
    const seagrassOutput = calculateScope1AquaticN2O(
      seagrassParsed,
      testContext(),
    );
    const otherOutput = calculateScope1AquaticN2O(otherParsed, testContext());

    expect(massInTonnes(coastalOutput).toNumber()).toEqual(
      massInTonnes(seagrassOutput).toNumber(),
    );
    expect(massInTonnes(coastalOutput).toNumber()).toEqual(0.169 * (44 / 28));

    expect(massInTonnes(otherOutput).toNumber()).toEqual(0);

    const coastalInputs = collectInputs(coastalOutput);
    const seagrassInputs = collectInputs(seagrassOutput);
    const otherOutputs = collectInputs(otherOutput);

    expect(coastalInputs).toEqual(
      expect.arrayOf(
        expect.objectContaining({
          modules: expect.arrayContaining(['13.1']),
        }),
      ),
    );

    expect(seagrassInputs).toEqual(
      expect.arrayOf(
        expect.objectContaining({
          modules: expect.arrayContaining(['13.1']),
        }),
      ),
    );

    expect(otherOutputs).toEqual(
      expect.arrayOf(
        expect.objectContaining({
          modules: expect.arrayContaining(['13.1']),
        }),
      ),
    );
  });
});
