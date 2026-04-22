import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForRiceCalculator } from '@/calculators/Rice/constants';
import { RiceCropTransformed } from '@/calculators/Rice/types';
import { selectConstant } from '@/tools/constants';
import { num } from '@/tools/containers';
import { sum } from '@/tools/sum';

const calculateSpecificRiceCultivationEmissionsFactor = (
  crop: RiceCropTransformed,
  context: ExecutionContext<ConstantsForRiceCalculator>,
) => {
  /**
   * EFrice,wpo = EFc * SFw * SFp * SF
   *
   * Where EFc = baseline EF for continuously flooded fields without organic amendments (kg CH4/ha/day)
   * SFw = scaling factor for water regime employed during the growing season cultivation period
   * SFp = scaling factor for water regime employed in the pre-season before the
   * cultivation period
   * SFo= scaling factor for the type and amount of organic amendments applied.
   *
   * Where inorganic fertiliser is applied to the rice fields rather than organic
   * amendments, SFo is set to 1.
   */

  const { constants } = context;
  const { preSeasonWaterRegimeType, waterRegimeType, organicAmendments } = crop;

  /**
   * SFo = (1 + SUMo(ROAo * CFOAo)) ^ 0.59
   *
   * NOTE: We have the rate of application in kg/m^2, but the original equation expects
   * this value to be in t/ha (1 kg/m^2 = 10 t/ha). Hence, we have to make a few
   * modifications to calculate the correct scaling factor. Instead of violating the
   * expected unit of our `MassPerArea` type, we can factorise the 10 out (which means
   * that we add everything to 0.1, NOT 1.)
   *
   * The result of the sum *shouldn't* be considered a `MassPerArea`. As a shortcut, we
   * can tell the code that the result of the sum is a `RealNumber` unit by making
   * the first element of the array a `RealNumber`. Once we raise it to the power,
   * Typescript will know it's a real (dimensionless) number.
   */
  const cumulativeOrganicAmendmentsScalingFactor = !organicAmendments
    ? num(1)
    : sum([
        num(0.1),
        ...organicAmendments.map((amendment) => {
          const conversionFactor = selectConstant(
            constants.RICE,
            'ORGANIC_AMENDMENT_SCALING_FACTORS',
            amendment.type,
          );
          return amendment.rateOfApplication.multiply(conversionFactor);
        }),
      ])
        .multiply(num(10))
        .power(num(0.59))
        .named('SFo');

  const waterRegimeScalingFactor = selectConstant(
    constants.RICE,
    'WATER_REGIME_SCALING_FACTORS',
    waterRegimeType,
  );

  const preSeasonWaterRegimeScalingFactor = selectConstant(
    constants.RICE,
    'PRE_SEASON_WATER_REGIME_SCALING_FACTORS',
    preSeasonWaterRegimeType,
  );

  const baselineEmissionsFactor = selectConstant(
    constants.RICE,
    'BASELINE_CONTINUOUSLY_FLOODED_EF',
  );

  /**
   * EFrice,wpo = EFc * SFw * SFp * SF
   */
  return baselineEmissionsFactor
    .multiply(waterRegimeScalingFactor)
    .multiply(preSeasonWaterRegimeScalingFactor)
    .multiply(cumulativeOrganicAmendmentsScalingFactor)
    .named('EFrice,wpo');
};

export const calculateScope1RiceCultivation = (
  crop: RiceCropTransformed,
  context: ExecutionContext<ConstantsForRiceCalculator>,
) => {
  const riceEmissionsFactor = calculateSpecificRiceCultivationEmissionsFactor(
    crop,
    context,
  );

  /**
   * Erice,wpo = Arice,wpo * EFrice,wpo * trice,wpo
   */
  return riceEmissionsFactor
    .multiply(crop.areaSown)
    .multiply(crop.cultivationPeriodDays);
};
