import { MineralSupplementation } from '@/types/mineral.input';
import { SupplementationType } from '@/types/types';
import { ExecutionContext } from '../../executionContext';

export function getSupplementUreaCalculation(
  mineralUrea: number,
  kgCO2: number,
) {
  return mineralUrea * kgCO2;
}

export function calculateMineralSupplementationFromType(
  mineralTonnes: number,
  mineralPercentUrea: number,
  supplementationType: SupplementationType,
  context: ExecutionContext,
) {
  const materialBreakdown =
    context.constants.COMMON.MATERIAL_BREAKDOWN_SUPPLEMENTATION[
      supplementationType
    ];

  const kgCO2: number = materialBreakdown.KG_CO2;
  const mineralUrea: number = mineralTonnes * mineralPercentUrea; // tonnes

  const GHG = getSupplementUreaCalculation(mineralUrea, kgCO2);
  const mineralSuppTotalGHG = GHG;

  return mineralSuppTotalGHG;
}

export function calculateMineralSupplementationScope3(
  mineralSupplementation: MineralSupplementation,
  context: ExecutionContext,
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
