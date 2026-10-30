import { SheepScope1OutputSchema } from '@/calculators/Sheep/types/scope1.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { z } from 'zod';
import { root } from './containers';
import {
  buildScopeLedger,
  scope1TotalRules,
  scope23TotalRules,
  serialiseScope,
  TotalKeysOf,
} from './ledger';
import { output, scope1Output } from './outputs';
import { sum } from './sum';
import { addScope1Totals, addScope23Totals } from './totals';
import { mass } from './units';
import { zeroCO2 } from './sentinels';

const emissions = {
  entericCH4: root(mass('CH4', 10)),
  manureDirectN2O: root(mass('N2O', 2)),
  limeCO2: root(mass('CO2', 300)),
  savannaFireBiomassBurningCO2e: root(mass('CO2e', 40)),
  emptyCO2: sum<ReturnType<typeof root<ReturnType<typeof mass<'CO2'>>>>>(
    [],
    zeroCO2,
  ),
};

describe('scope ledger', () => {
  it('builds scope 1 totals as CO2e containers matching addScope1Totals', () => {
    const ledger = buildScopeLedger(emissions, scope1TotalRules);

    const legacy = addScope1Totals({
      entericCH4: scope1Output('entericCH4', emissions.entericCH4),
      manureDirectN2O: scope1Output(
        'manureDirectN2O',
        emissions.manureDirectN2O,
      ),
      limeCO2: scope1Output('limeCO2', emissions.limeCO2),
      savannaFireBiomassBurningCO2e: scope1Output(
        'savannaFireBiomassBurningCO2e',
        emissions.savannaFireBiomassBurningCO2e,
      ),
      emptyCO2: scope1Output('emptyCO2', emissions.emptyCO2),
    });

    // addScope1Totals adds its sub-totals as floats (1.1500000000000001); the ledger stays in Decimal
    expect(serialiseScope(ledger, 1)).toEqual({
      ...legacy,
      total: { tonnesCO2e: 1.15 },
    });
    expect(ledger.totals.total.unit.substance).toBe('CO2e');
    expect(ledger.totals.total.unit.store.toNumber()).toBe(
      10 * 28 + 2 * 265 + 300 + 40,
    );
  });

  it('builds scope 2/3 totals matching addScope23Totals', () => {
    const scope2 = { electricity: root(mass('CO2e', 123)) };
    const ledger = buildScopeLedger(scope2, scope23TotalRules);

    expect(serialiseScope(ledger, 2)).toEqual(
      addScope23Totals({
        electricity: output('electricity', 2, scope2.electricity),
      }),
    );
  });

  it('serialises to the shape declared by the zod schemas', () => {
    type Scope1Shape = typeof SheepScope1OutputSchema.shape;
    const totalKeys: TotalKeysOf<Scope1Shape>[] = [
      'totalCO2',
      'totalCH4',
      'totalN2O',
      'totalOtherGases',
      'total',
    ];
    // @ts-expect-error emission keys are not total keys
    const notATotal: TotalKeysOf<Scope1Shape> = 'entericCH4';

    const scope2: z.output<typeof Scope2OutputSchema> = serialiseScope(
      buildScopeLedger(
        { electricity: root(mass('CO2e', 1)) },
        scope23TotalRules,
      ),
      2,
    );

    expect(totalKeys).toHaveLength(5);
    expect(notATotal).toBe('entericCH4');
    expect(scope2.total.tonnesCO2e).toBe(0.001);
  });
});
