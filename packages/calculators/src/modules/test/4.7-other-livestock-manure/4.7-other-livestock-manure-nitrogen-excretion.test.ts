import { OtherLivestockHerdInputSchema } from '@/calculators/OtherLivestock/types/herd.input';
import { calculate47OtherLivestockManureManagement } from '@/modules/scope1/4-manure-management/4.7-other-livestock-manure';
import { testContext } from '@/test/Grains/context';
import { createOtherLivestockInput } from '../factory';
import { getOtherLivestockInput } from './4.7-other-livestock-manure-helpers';

/**
 * Hand calculation for a herd of 400 goats, as a guard on the units of
 * `OTHER_LIVESTOCK_EMISSION_FACTORS.*.NITROGEN_EXCRETED`. NEj for goats is
 * 7 kg N per head per *year*, so annual nitrogen excreted is
 *
 *   AE = Nj * NEj = 400 * 7 = 2,800 kg N
 *
 * Multiplying NEj by days in the year as well (treating it as per day)
 * overstates every manure N2O term 365 times.
 */
describe('4.7 Other livestock manure N2O, annual nitrogen excretion', () => {
  const herd = OtherLivestockHerdInputSchema.parse(
    createOtherLivestockInput({
      livestock: [getOtherLivestockInput('Goats', 400)],
      climateZone: 'wet',
      grazingSystem: 'Non-irrigated pasture',
      isInLeachingZone: true,
    }),
  );

  const result = calculate47OtherLivestockManureManagement(herd, testContext());

  it('direct N2O is AE * EFprp(wet) * CN2O (4.7.1.3)', () => {
    // 2,800 kg N * 0.006 * 1.57 = 26.376 kg N2O
    expect(result.manureDirectN2O.unit.store.value.toNumber()).toBeCloseTo(
      26.376,
      8,
    );
  });

  it('atmospheric deposition N2O is AE * FracGASMsoil * EFN2O * CN2O (4.7.1.5)', () => {
    // 2,800 kg N * 0.21 = 588 kg N volatilised; * 0.0018 * 1.57 = 1.661688 kg N2O
    expect(
      result.manureAtmosphericDepositionN2O.unit.store.value.toNumber(),
    ).toBeCloseTo(1.661688, 8);
  });

  it('leaching and runoff N2O is AE * FracWET * FracLEACH * EFleach * CN2O (4.7.1.7)', () => {
    // 2,800 kg N * 1 * 0.24 = 672 kg N leached; * 0.011 * 1.57 = 11.60544 kg N2O
    expect(
      result.manureLeachingRunoffN2O.unit.store.value.toNumber(),
    ).toBeCloseTo(11.60544, 8);
  });
});
