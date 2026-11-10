import { root } from './containers';
import { input } from './inputs';
import { captureMethod1Or2Value } from './multi';
import { output, scope1Output } from './outputs';
import { sum } from './sum';
import { addScope1Totals, addScope23Totals } from './totals';
import { mass } from './units';
import { zeroCO2e } from './sentinels';

// These functions build the `total`/`totalCO2`/`totalCH4`/`totalN2O` figures every calculator
// reports, and decide which of `amountGasKgMethod1`/`amountGasKgMethod2` is exposed under each key. A bug
// here silently mis-states a headline total without any individual output being wrong.

describe('addScope1Totals', () => {
  it('sums CO2e by gas and grand totals, and exposes flattened output keys', () => {
    const outputs = {
      co2Item: scope1Output('co2Item', root(mass('CO2', 10))),
      ch4Item: scope1Output('ch4Item', root(mass('CH4', 2))), // -> 56 kg CO2e
      n2oItem: scope1Output('n2oItem', root(mass('N2O', 1))), // -> 265 kg CO2e
      co2eItem: scope1Output('co2eItem', root(mass('CO2e', 3))),
    };

    const totals = addScope1Totals(outputs);

    // Totals are reported in tonnes, while the inputs above are in kg
    expect(totals.totalCO2.tonnesCO2e).toBe(10 / 1000);
    expect(totals.totalCH4.tonnesCO2e).toBe(56 / 1000);
    expect(totals.totalN2O.tonnesCO2e).toBe(265 / 1000);
    expect(totals.totalOtherGases.tonnesCO2e).toBe(3 / 1000);
    expect(totals.total.tonnesCO2e).toBeCloseTo((10 + 56 + 265 + 3) / 1000, 10);

    expect(totals.co2Item).toMatchObject({
      amountGasKg: 10,
      gas: 'CO2',
      amountTonnesCO2e: 10 / 1000,
      method: '1',
      amountGasKgMethod1: 10,
    });
    expect(totals.co2Item).not.toHaveProperty('amountGasKgMethod2');
    expect(totals.co2Item.references).toEqual([]);
    expect(totals.co2Item.constants).toEqual([]);
    expect(totals.co2Item.inputs).toEqual([]);
  });

  it('exposes both method amounts, and uses the method-2 value for the headline total, for a method-2 output', () => {
    const method1 = root(mass('CH4', 3));
    const method2 = input(mass('CH4', 5), {
      name: 'override',
      method: '2',
      modules: [],
    });
    const captured = captureMethod1Or2Value(method1, method2);

    const outputs = { entericCH4: scope1Output('entericCH4', captured) };
    const totals = addScope1Totals(outputs);

    expect(totals.entericCH4).toMatchObject({
      method: '2',
      amountGasKgMethod1: 3,
      amountGasKgMethod2: 5,
      amountGasKg: 5,
      amountTonnesCO2e: (5 * 28) / 1000,
    });
    // The headline total reflects the method-2 (best) value, not method 1's.
    expect(totals.totalCH4.tonnesCO2e).toBe((5 * 28) / 1000);
  });

  it('handles an empty outputs object', () => {
    const totals = addScope1Totals({});
    expect(totals.totalCO2.tonnesCO2e).toBe(0);
    expect(totals.totalCH4.tonnesCO2e).toBe(0);
    expect(totals.totalN2O.tonnesCO2e).toBe(0);
    expect(totals.totalOtherGases.tonnesCO2e).toBe(0);
    expect(totals.total.tonnesCO2e).toBe(0);
  });
});

describe('addScope23Totals', () => {
  it('sums CO2e across all outputs without splitting by gas', () => {
    const outputs = {
      electricity: output('electricity', 2, root(mass('CO2e', 12))),
      freight: output('freight', 3, root(mass('N2O', 1))), // -> 265 kg CO2e
    };

    const totals = addScope23Totals(outputs);

    expect(totals.total.tonnesCO2e).toBe((12 + 265) / 1000);
    expect(totals.electricity).toMatchObject({
      amountGasKg: 12,
      gas: 'CO2e',
      amountTonnesCO2e: 12 / 1000,
      method: '1',
    });
    expect(totals.freight).toMatchObject({
      amountGasKg: 1,
      gas: 'N2O',
      amountTonnesCO2e: 265 / 1000,
    });
  });

  it('handles an empty outputs object', () => {
    expect(addScope23Totals({}).total.tonnesCO2e).toBe(0);
  });

  // Mirrors scope 3 fuel/services, which add a transport sum to a stationary sum. When only one
  // of those fuel lists is empty, adding its empty sum to a Mass must keep the Mass's gas,
  // otherwise `gas` is undefined and dropped from the JSON response.
  describe('with a non-empty sum added to an empty sum', () => {
    const transport = sum(
      [root(mass('CO2e', 600)), root(mass('CO2e', 67.78))],
      zeroCO2e,
    );
    const stationary = sum<typeof transport>([], zeroCO2e);

    it.each([
      ['transport only', () => transport.plus(stationary)],
      ['stationary only', () => stationary.plus(transport)],
    ])('keeps the gas key in the serialised output (%s)', (_, combine) => {
      const totals = addScope23Totals({ fuel: output('fuel', 3, combine()) });

      expect(JSON.parse(JSON.stringify(totals.fuel))).toMatchObject({
        amountGasKg: 667.78,
        gas: 'CO2e',
        amountTonnesCO2e: 0.66778,
      });
    });
  });
});
