/*
 * Method 1 and 2 values through a real calculator. The unit level behaviour (captureMethod1Or2Value,
 * merged value stores) is tested in @aginnovationaustralia/calculator-units; these check that the
 * calculators mark and report method 2 outputs correctly end to end.
 */
import { calculateBeef } from '@/calculators/Beef/calculator';
import { BeefClassPeriodInput } from '@/calculators/Beef/types/beef-class-period.input';
import { BeefOutputSchema } from '@/calculators/Beef/types/output';
import { BeefScope1Output } from '@/calculators/Beef/types/scope1.output';
import {
  createBeefHerdInput,
  createBeefInputTransformed,
} from '@/modules/test/factory';
import { testContext } from '@/test/Grains/context';
import { nv, nvo } from '@/tools/inputs';

const seasons = (period: BeefClassPeriodInput) => ({
  spring: period,
  summer: period,
  autumn: period,
  winter: period,
});

const DUAL_TRACK_KEYS = [
  'entericCH4',
  'manureManagementCH4',
  'manureAtmosphericDepositionN2O',
  'manureLeachingRunoffN2O',
  'manureSoilDirectN2O',
] as const;

type DualTrackKey = (typeof DUAL_TRACK_KEYS)[number];
type DualTrackOutput = BeefScope1Output[DualTrackKey];
type Method2Output = Extract<DualTrackOutput, { method: '2' }>;

const livestockDualTrackOutputs = (scope1: BeefScope1Output) => ({
  entericCH4: scope1.entericCH4,
  manureManagementCH4: scope1.manureManagementCH4,
  manureAtmosphericDepositionN2O: scope1.manureAtmosphericDepositionN2O,
  manureLeachingRunoffN2O: scope1.manureLeachingRunoffN2O,
  manureSoilDirectN2O: scope1.manureSoilDirectN2O,
});

const assertOutputKeys = (output: DualTrackOutput) => {
  expect(output).toEqual(
    expect.objectContaining({
      amountGasKg: expect.any(Number),
      gas: expect.stringMatching(/^(CO2|CH4|N2O|CO2e)$/),
      amountTonnesCO2e: expect.any(Number),
      method: expect.stringMatching(/^[12]$/),
      amountGasKgMethod1: expect.any(Number),
      references: expect.any(Array),
      constants: expect.any(Array),
    }),
  );
  if (output.method === '1') {
    // Method 1 results omit the method 2 key entirely, rather than exposing undefined
    expect(output).not.toHaveProperty('amountGasKgMethod2');
  } else {
    expect(typeof output.amountGasKgMethod2).toBe('number');
  }
};

const runBeef = (herdOverrides: Parameters<typeof createBeefHerdInput>[0]) => {
  const context = testContext();
  const input = createBeefInputTransformed({
    herds: [createBeefHerdInput(herdOverrides)],
  });
  return calculateBeef(input, context);
};

describe('Multi method integration', () => {
  const herdBase = { isInLeachingZone: true as const };
  const method2Liveweight = 400;
  const method2DryMatterIntake = 12;

  const method1Only = runBeef({
    ...herdBase,
    classes: {
      period: 'seasonal',
      bullsGt1: seasons({ head: nv(5) }),
    },
  });
  const method1Outputs = livestockDualTrackOutputs(method1Only.scope1);

  const assertMethod2Output: (
    output: DualTrackOutput,
  ) => asserts output is Method2Output = (output) => {
    assertOutputKeys(output);
    expect(output.method).toBe('2');
    if (output.method !== '2') throw new Error('Expected a method 2 output');
    expect(output.amountGasKgMethod2).toBeDefined();
    expect(output.amountGasKg).toBe(output.amountGasKgMethod2);
    expect(output.amountGasKgMethod2).not.toBe(output.amountGasKgMethod1);
  };

  it('method-1-only inputs expose method 1 keys without a method-2 track', () => {
    for (const key of DUAL_TRACK_KEYS) {
      const output = method1Outputs[key];
      assertOutputKeys(output);
      expect(output.method).toBe('1');
      expect(output).not.toHaveProperty('amountGasKgMethod2');
      expect(output.amountGasKg).toBe(output.amountGasKgMethod1);
    }
  });

  it('method 1 and method 2 results conform to the strict output schema', () => {
    const withLiveweight = runBeef({
      ...herdBase,
      classes: {
        period: 'seasonal',
        bullsGt1: seasons({
          head: nv(5),
          method2LiveweightKilograms: nvo(method2Liveweight),
        }),
      },
    });

    // Round trip through JSON to check the shape API consumers actually receive
    for (const result of [method1Only, withLiveweight]) {
      const parsed = BeefOutputSchema.safeParse(
        JSON.parse(JSON.stringify(result)),
      );
      expect(parsed.error?.issues).toBeUndefined();
    }
  });

  it('method-2 liveweight keeps method-1 CH4 amounts and sets a distinct method-2 track', () => {
    const withLiveweight = runBeef({
      ...herdBase,
      classes: {
        period: 'seasonal',
        bullsGt1: seasons({
          head: nv(5),
          method2LiveweightKilograms: nvo(method2Liveweight),
        }),
      },
    });
    const outputs = livestockDualTrackOutputs(withLiveweight.scope1);

    for (const key of DUAL_TRACK_KEYS) {
      assertMethod2Output(outputs[key]);
    }

    // Enteric/manure CH4 dual-track method-1 amounts match the pure method-1 run exactly.
    expect(outputs.entericCH4.amountGasKgMethod1).toBe(
      method1Outputs.entericCH4.amountGasKgMethod1,
    );
    expect(outputs.manureManagementCH4.amountGasKgMethod1).toBe(
      method1Outputs.manureManagementCH4.amountGasKgMethod1,
    );
  });

  it('method-2 dry-matter intake sets a method-2 track distinct from liveweight overrides', () => {
    const withIntake = runBeef({
      ...herdBase,
      classes: {
        period: 'seasonal',
        bullsGt1: seasons({
          head: nv(5),
          method2DailyDryMatterIntakeKilograms: nvo(method2DryMatterIntake),
        }),
      },
    });
    const withLiveweight = runBeef({
      ...herdBase,
      classes: {
        period: 'seasonal',
        bullsGt1: seasons({
          head: nv(5),
          method2LiveweightKilograms: nvo(method2Liveweight),
        }),
      },
    });
    const intakeOutputs = livestockDualTrackOutputs(withIntake.scope1);
    const liveweightOutputs = livestockDualTrackOutputs(withLiveweight.scope1);

    for (const key of DUAL_TRACK_KEYS) {
      const output = intakeOutputs[key];
      assertMethod2Output(output);
      expect(output.amountGasKgMethod1).toBe(
        method1Outputs[key].amountGasKgMethod1,
      );
      const liveweightOutput = liveweightOutputs[key];
      assertMethod2Output(liveweightOutput);
      expect(output.amountGasKgMethod2).not.toBe(
        liveweightOutput.amountGasKgMethod2,
      );
    }
  });

  it('partial season method-2 overrides still mark dual-track outputs as method 2', () => {
    const mixed = runBeef({
      ...herdBase,
      classes: {
        period: 'seasonal',
        bullsGt1: {
          spring: {
            head: nv(5),
            method2LiveweightKilograms: nvo(method2Liveweight),
          },
          summer: { head: nv(5) },
          autumn: { head: nv(5) },
          winter: { head: nv(5) },
        },
      },
    });
    const outputs = livestockDualTrackOutputs(mixed.scope1);

    for (const key of DUAL_TRACK_KEYS) {
      assertMethod2Output(outputs[key]);
    }

    expect(outputs.entericCH4.amountGasKgMethod1).toBe(
      method1Outputs.entericCH4.amountGasKgMethod1,
    );
    expect(outputs.manureManagementCH4.amountGasKgMethod1).toBe(
      method1Outputs.manureManagementCH4.amountGasKgMethod1,
    );
  });
});
