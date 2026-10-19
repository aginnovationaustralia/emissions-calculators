import { testContext } from '@/test/Grains/context';
import { ZERO_ALL_MODULES_INPUT } from '@/test/inputs/zero-input';
import { calculateAllModules } from './calculator';
import { AllModulesInputSchema } from './types/input';

describe('calculateAllModules', () => {
  it('returns zero totals for every scope when every input is zeroed out', () => {
    const input = AllModulesInputSchema.parse(ZERO_ALL_MODULES_INPUT);
    const context = testContext('AllModules');

    const result = calculateAllModules(input, context);

    expect(result.scope1.total.tonnesCO2e).toBe(0);
    expect(result.scope2.total.tonnesCO2e).toBe(0);
    expect(result.scope3.total.tonnesCO2e).toBe(0);
    expect(result.net.total.tonnesCO2e).toBe(0);

    // A couple of targeted individual scope 1 keys, to prove the zeroed-out shape
    // round-trips through the underlying modules and not just the top-level sum.
    expect(result.scope1.entericBeefCH4.amountGasKg).toBe(0);
    expect(result.scope1.inorganicFertiliserN2O.amountGasKg).toBe(0);
    expect(result.scope1.fuelTransportCO2.amountGasKg).toBe(0);
  });

  it('returns zero totals when every top-level key is omitted (each is optional)', () => {
    const input = AllModulesInputSchema.parse({});
    const context = testContext('AllModules');

    const result = calculateAllModules(input, context);

    expect(result.scope1.total.tonnesCO2e).toBe(0);
    expect(result.scope2.total.tonnesCO2e).toBe(0);
    expect(result.scope3.total.tonnesCO2e).toBe(0);
    expect(result.net.total.tonnesCO2e).toBe(0);
  });
});
