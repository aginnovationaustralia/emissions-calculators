import { ExecutionContext } from '../executionContext';
import { Fertiliser } from '../types/fertiliser.input';
import { MineralSupplementation } from '../types/mineral.input';
import { HasLivestockConstants } from './constants';

export function calculateScope1Urea(
  supplementation: MineralSupplementation,
  fertiliser: Fertiliser,
  context: ExecutionContext<HasLivestockConstants>,
) {
  const { constants } = context;

  // (ureaApplicationC26)
  const massUreaLickBlocks =
    (supplementation.mineralBlock ?? 0) *
      (supplementation.mineralBlockUrea ?? 0) +
    (supplementation.weanerBlock ?? 0) *
      (supplementation.weanerBlockUrea ?? 0) +
    (supplementation.drySeasonMix ?? 0) *
      (supplementation.drySeasonMixUrea ?? 0);

  // (ureaApplicationC29)
  const totalMassFertiliser =
    massUreaLickBlocks +
    fertiliser.pastureDryland +
    fertiliser.pastureIrrigated +
    fertiliser.cropsDryland +
    fertiliser.cropsIrrigated;

  // (ureaApplicationC37)
  const carbon =
    totalMassFertiliser *
    constants.LIVESTOCK.CARBON_FRACTION_OF_UREA *
    constants.COMMON.GWP_FACTORSC13;

  return carbon;
}
