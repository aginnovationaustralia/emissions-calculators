import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForRiceCalculator } from '@/calculators/Rice/constants';
import { RiceCropTransformed } from '@/calculators/Rice/types';
import { selectConstant } from '@/tools/constants';
import { num } from '@/tools/containers';
import { one } from '@/tools/sentinels';
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
   * SFo = (1 + SUMo ROAo * CFOAo) ^ 0.59
   */
  const cumulativeOrganicAmendmentsScalingFactor = one
    .plus(
      sum(
        organicAmendments.map((amendment) => {
          const conversionFactor = selectConstant(
            constants.RICE,
            'ORGANIC_AMENDMENT_SCALING_FACTORS',
            amendment.type,
          );

          return amendment.rateOfApplication.multiply(conversionFactor);
        }),
      ),
    )
    .power(num(0.59));

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
   * Erice = SUMw SUMp SUMo (Arice,wpo * EFrice,wpo * trice,wpo) * 10^-3
   */
  return riceEmissionsFactor
    .multiply(crop.areaSown)
    .multiply(crop.cultivationPeriodDays);
};
