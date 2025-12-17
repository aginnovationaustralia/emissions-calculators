import { Fertiliser } from '@/types/fertiliser.input';
import { MineralSupplementation } from '@/types/mineral.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForGoatCalculator } from './constants';

export function calculateScope1Urea(
  supplementation: MineralSupplementation,
  fertiliser: Fertiliser,
  context: ExecutionContext<ConstantsForGoatCalculator>,
) {
  const { constants } = context;

  const massUreaLickBlocks =
    (supplementation.mineralBlock ?? 0) *
      (supplementation.mineralBlockUrea ?? 0) +
    (supplementation.weanerBlock ?? 0) *
      (supplementation.weanerBlockUrea ?? 0) +
    (supplementation.drySeasonMix ?? 0) *
      (supplementation.drySeasonMixUrea ?? 0);

  const totalMassFertiliser =
    massUreaLickBlocks +
    fertiliser.pastureDryland +
    fertiliser.pastureIrrigated +
    fertiliser.cropsDryland +
    fertiliser.cropsIrrigated;

  const carbon =
    totalMassFertiliser *
    constants.LIVESTOCK.CARBON_FRACTION_OF_UREA *
    constants.COMMON.GWP_FACTORSC13;

  return carbon;
}
