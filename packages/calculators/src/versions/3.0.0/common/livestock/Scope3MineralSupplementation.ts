import { ExecutionContext } from '../../executionContext';
import { MineralSupplementation } from '../../types/mineral.input';
import { SupplementationType } from '../../types/types';
import { CommonConstants } from '../constants';

export function getSupplementUreaCalculation(
  mineralUrea: number,
  kgCO2: number,
) {
  return mineralUrea * kgCO2;
}

// WARNING: embeddedEmissionsE25 points to
// "dry season mix, 30% urea, 5,4% P, with protein meal, at production" for
// kg CO2 product but then points to
// "dry season mix, 30% urea, 5.5% P, at production" for fraction of urea

// once per sheep and beef, once per mineralblock, weanerblock, dry season mix

/**
 *
 * @param mineralTonnes Tonnes of mineral used (dataInputBeefF77)
 * @param mineralPercentUrea Percentage of urea, between 0 and 1 (dataInputBeefD77)
 * @param supplementationType Type of supplementation
 * @returns
 */
export function calculateMineralSupplementationFromType(
  mineralTonnes: number,
  mineralPercentUrea: number,
  supplementationType: SupplementationType,
  context: ExecutionContext<CommonConstants>,
) {
  const materialBreakdown =
    context.constants.COMMON.MATERIAL_BREAKDOWN_SUPPLEMENTATION[
      supplementationType
    ];

  const kgCO2: number = materialBreakdown.KG_CO2;
  // (embeddedEmissions_C23)
  const mineralUrea: number = mineralTonnes * mineralPercentUrea; // tonnes

  const GHG = getSupplementUreaCalculation(mineralUrea, kgCO2);
  const mineralSuppTotalGHG = GHG;

  return mineralSuppTotalGHG;
}

export function calculateMineralSupplementationScope3(
  mineralSupplementation: MineralSupplementation,
  context: ExecutionContext<CommonConstants>,
) {
  const mineralBlock = calculateMineralSupplementationFromType(
    mineralSupplementation.mineralBlock,
    mineralSupplementation.mineralBlockUrea,
    'mineralblock',
    context,
  );

  const weanerBlock = calculateMineralSupplementationFromType(
    mineralSupplementation.weanerBlock,
    mineralSupplementation.weanerBlockUrea,
    'weanerblock',
    context,
  );

  const drySeasonMix = calculateMineralSupplementationFromType(
    mineralSupplementation.drySeasonMix,
    mineralSupplementation.drySeasonMixUrea,
    'dryseasonmix',
    context,
  );

  return mineralBlock + weanerBlock + drySeasonMix;
}
