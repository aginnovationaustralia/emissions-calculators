import { ExecutionContext } from '@/calculators/executionContext';
import { selectConstant } from '@/tools/constants';
import { captureMethod1Or2Value } from '@/tools/multi';
import { oneMinus, zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { HasLimeInputTransformed } from '../../scope1/5-fertiliser/lime.input';

export const calculateScope3SoilAmeliorants = (
  activity: HasLimeInputTransformed,
  context: ExecutionContext,
) => {
  const { constants } = context;
  /*
  15.6.1.1 Method 1 -- Purchased Soil Ameliorants
  The embedded emissions for purchased soil ameliorants E (t CO2e) are calculated as:
  E = SUM(Ma * EFa) * 10^-3
  Where Ma = total quantity of soil ameliorant type a applied to soils (kg)
  EFa = emission factor for purchased soil ameliorant (kg CO2e/kg)
  */
  const { lime } = activity;
  const { applications } = lime;

  const efLimestone = selectConstant(
    constants.COMMON,
    'LIME_SCOPE3_EF',
    'Limestone',
  );
  const efDolomite = selectConstant(
    constants.COMMON,
    'LIME_SCOPE3_EF',
    'Dolomite',
  );
  const efGypsum = selectConstant(constants.COMMON, 'LIME_SCOPE3_EF', 'Gypsum');

  /**
   * NOTE: The equation for method 1 is simply multiplying the expected EF for each ingredient. But a custom scope 3 EF
   * is likely to be at the product level, which can be a blend, so it must be applied at that level
   */
  const emissionRecords = applications.map((application) => {
    if (application.type === 'Gypsum') {
      const ef = captureMethod1Or2Value(
        efGypsum,
        application.customScope3EmissionsFactor,
      ).named('EFa');

      const Ma = application.massAppliedKg.named('Ma (Gypsum)');

      return Ma.multiply(ef).named('E').reference('15.6.1.1 (1)');
    }

    const Ma = application.massAppliedKg.named('Ma');
    const MaLimestone = Ma.multiply(application.limestoneFraction).named(
      'Ma (Limestone)',
    );
    const MaDolomite = Ma.multiply(
      oneMinus(application.limestoneFraction),
    ).named('Ma (Dolomite)');

    const ELimestone = MaLimestone.multiply(efLimestone).named('E (Limestone)');
    const EDolomite = MaDolomite.multiply(efDolomite).named('E (Dolomite)');
    return captureMethod1Or2Value(
      ELimestone.plus(EDolomite),
      application.customScope3EmissionsFactor?.multiply(Ma),
    )
      .named('E')
      .reference('15.6.1.1 (1)');
  });

  return sum(emissionRecords, zeroCO2e, {
    name: 'E',
  });
};
