import { calculateBeef } from '@/calculators/Beef/calculator';
import { BeefClassPeriodInput } from '@/calculators/Beef/types/beef-class-period.input';
import { BeefOutputSchema } from '@/calculators/Beef/types/output';
import { BeefScope1Output } from '@/calculators/Beef/types/scope1.output';
import {
  createBeefHerdInput,
  createBeefInputTransformed,
} from '@/modules/test/factory';
import { testContext } from '@/test/Grains/context';
import { num } from '@/tools/containers';
import { input, nv, nvo } from '@/tools/inputs';
import {
  captureMethod1Or2Value,
  Method1And2Container,
  Method2Container,
} from '@/tools/multi';
import { mass, realNumber, voidUnit } from '@/tools/units';

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

describe('captureMethod1Or2Value', () => {
  it('returns the method-1 container when method 2 is omitted', () => {
    const method1 = num(10);
    const captured = captureMethod1Or2Value(method1, undefined);

    expect(captured).toBe(method1);
    expect(captured.unit.store.hasMethod2()).toBe(false);
    expect(captured.unit.store.value.toNumber()).toBe(10);
  });

  it('wraps method 1 and 2 in a Method1And2Container preferring method 2', () => {
    const method1 = num(10);
    const method2 = input(realNumber(25), {
      name: 'method2',
      method: '2',
      modules: [],
    });
    const captured = captureMethod1Or2Value(method1, method2);

    expect(captured).toBeInstanceOf(Method1And2Container);
    expect(captured.originType).toBe('method1and2');
    expect(captured.unit.store.hasMethod2()).toBe(true);
    expect(captured.unit.store.valueMethod1?.toNumber()).toBe(10);
    expect(captured.unit.store.valueMethod2?.toNumber()).toBe(25);
    expect(captured.unit.store.value.toNumber()).toBe(25);
  });

  it('wraps a void method 1 in a Method2Container', () => {
    // The method 2 value can come from a reused input tree, with no method 2 inputs of its own
    const method2 = input(realNumber(25), {
      name: 'derived from method 2',
      modules: [],
    });
    const captured = captureMethod1Or2Value(voidUnit(), method2);

    expect(captured).toBeInstanceOf(Method2Container);
    expect(captured.originType).toBe('method2');
    expect(captured.unit.store.hasMethod1()).toBe(false);
    expect(captured.unit.store.hasMethod2()).toBe(true);
    expect(captured.unit.store.value.toNumber()).toBe(25);
  });
});

describe('Method1And2Container', () => {
  it('preserves dual tracks through switchUnit using valueMethod1 for method 1', () => {
    const method1 = input(mass('Liveweight', 100), { name: 'W1', modules: [] });
    const method2 = input(mass('Liveweight', 200), {
      name: 'W2',
      method: '2',
      modules: [],
    });
    const captured = new Method1And2Container(method1, method2);

    const switched = captured.switchUnit((u) => realNumber(u.store));

    expect(switched).toBeInstanceOf(Method1And2Container);
    expect(switched.unit.store.valueMethod1?.toNumber()).toBe(100);
    expect(switched.unit.store.valueMethod2?.toNumber()).toBe(200);
    expect(switched.unit.store.value.toNumber()).toBe(200);
  });

  // This is a complex scenario but is possible. Some optional inputs override computed values, like dry matter intake
  it('handles handles calculations with multiple sources of method 2 values', () => {
    const optionalMethod2InputUpstream = input(realNumber(25), {
      name: 'optional input for A',
      method: '2',
      modules: [],
    });
    // A has method 1 = 10, method 2 = 25
    const AWithMethod1And2 = captureMethod1Or2Value(
      num(10), // default
      optionalMethod2InputUpstream,
    ).named('A');

    // Perform some calculation on both branches
    // B has method 1 = 20, method 2 = 50
    const efDerivedFromUpstream = AWithMethod1And2.multiply(num(2)).named(
      'B (default)',
    );

    const efOptionalMethod2InputDownstream = input(realNumber(30), {
      name: 'optional input for B',
      method: '2',
      modules: [],
    });

    // Should have method 1 = 20, method 2 = 30 (not 50)
    const BWithBothCaptured = captureMethod1Or2Value(
      efDerivedFromUpstream,
      efOptionalMethod2InputDownstream,
    ).named('B (with both methods)');

    expect(BWithBothCaptured.unit.store.valueMethod1?.toNumber()).toBe(20);
    expect(BWithBothCaptured.unit.store.valueMethod2?.toNumber()).toBe(30);
    expect(BWithBothCaptured.unit.store.value.toNumber()).toBe(30);
  });
});

describe('Method2Container', () => {
  const method2Only = () =>
    new Method2Container(
      input(mass('CO2e', 100), { name: 'derived', modules: [] }),
    );

  it('reports no method 1 track', () => {
    const captured = method2Only();

    expect(captured.unit.store.valueMethod1).toBeUndefined();
    expect(captured.unit.store.hasMethod1()).toBe(false);
    expect(captured.unit.store.hasMethod2()).toBe(true);
    expect(captured.unit.store.value.toNumber()).toBe(100);
  });

  it('stays method 2 only through further calculations', () => {
    const captured = method2Only().multiply(num(3));

    expect(captured.unit.store.valueMethod1).toBeUndefined();
    expect(captured.unit.store.hasMethod1()).toBe(false);
    expect(captured.unit.store.hasMethod2()).toBe(true);
    expect(captured.unit.store.value.toNumber()).toBe(300);
  });

  it('keeps the method 2 track through switchUnit', () => {
    const switched = method2Only().switchUnit((u) => realNumber(u.store));

    expect(switched).toBeInstanceOf(Method2Container);
    expect(switched.unit.store.hasMethod1()).toBe(false);
    expect(switched.unit.store.value.toNumber()).toBe(100);
  });
});

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
          method2Liveweight: nvo(method2Liveweight),
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
          method2Liveweight: nvo(method2Liveweight),
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
          method2DryMatterIntake: nvo(method2DryMatterIntake),
        }),
      },
    });
    const withLiveweight = runBeef({
      ...herdBase,
      classes: {
        period: 'seasonal',
        bullsGt1: seasons({
          head: nv(5),
          method2Liveweight: nvo(method2Liveweight),
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
            method2Liveweight: nvo(method2Liveweight),
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
