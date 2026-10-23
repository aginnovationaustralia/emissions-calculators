import { root } from './containers';
import { generateIntensity } from './intensity';
import { mass, massPerHead } from './units';

describe('generateIntensity', () => {
  it('divides CO2e emissions by the mass produced', () => {
    expect(
      generateIntensity(
        root(mass('CO2e', 1000)),
        root(mass('Liveweight', 250)),
      ),
    ).toEqual({ value: 4 });
  });

  it('returns zero when nothing was produced', () => {
    expect(
      generateIntensity(root(mass('CO2e', 1000)), root(mass('Liveweight', 0))),
    ).toEqual({ value: 0 });
  });

  it('rejects emissions that are not CO2e, and production that is not a mass', () => {
    const methane = root(mass('CH4', 1));
    const emissions = root(mass('CO2e', 1));
    const liveweight = root(mass('Liveweight', 1));
    const woolPerHead = root(massPerHead('Clean Wool', 1));

    // @ts-expect-error emissions must already be in CO2e
    generateIntensity(methane, liveweight);
    // @ts-expect-error a mass per head is not a mass produced
    generateIntensity(emissions, woolPerHead);
  });
});
