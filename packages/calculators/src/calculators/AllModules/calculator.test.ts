import { testContext } from '@/test/Grains/context';
import { nv } from '@/tools/inputs';
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

  it('calculates other livestock manure N2O from annual nitrogen excretion', () => {
    // NEj is kg N per head per year: goats 7, deer 13.2, horses 39.5
    // AE = 400 * 7 + 120 * 13.2 + 6 * 39.5 = 4,621 kg N
    const input = AllModulesInputSchema.parse({
      otherLivestock: {
        livestock: [
          { type: 'Goats', head: nv(400) },
          { type: 'Deer', head: nv(120) },
          { type: 'Horses', head: nv(6) },
        ],
        excludedFromNaturalWater: false,
        isInLeachingZone: true,
        climateZone: 'wet',
        state: 'NSW',
        grazingSystem: 'Non-irrigated pasture',
      },
    });
    const context = testContext('AllModules');

    const { scope1 } = calculateAllModules(input, context);

    // 4,621 * EFprp(wet) 0.006 * CN2O 1.57
    expect(scope1.manureDirectOtherLivestockN2O.amountGasKg).toBeCloseTo(
      43.52982,
      6,
    );
    // 4,621 * FracGASMsoil 0.21 * EFN2O 0.0018 * CN2O 1.57
    expect(
      scope1.manureAtmosphericDepositionOtherLivestockN2O.amountGasKg,
    ).toBeCloseTo(2.74237866, 6);
    // 4,621 * FracWET 1 * FracLEACH 0.24 * EFleach 0.011 * CN2O 1.57
    expect(
      scope1.manureLeachingRunoffOtherLivestockN2O.amountGasKg,
    ).toBeCloseTo(19.1531208, 6);
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
