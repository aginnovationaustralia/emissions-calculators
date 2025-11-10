import { Fertiliser } from '@/types/fertiliser.input';
import { ExecutionContext } from '../../executionContext';

export function calculateScope3Fertiliser(
  fertiliser: Fertiliser,
  context: ExecutionContext,
) {
  const { constants } = context;

  const totalUreaFertiliser =
    fertiliser.pastureDryland +
    fertiliser.pastureIrrigated +
    fertiliser.cropsDryland +
    fertiliser.cropsIrrigated;

  const totalUrea = totalUreaFertiliser * constants.COMMON.UREA_FERTILISER_GHG;

  const totalSuperPhosphate =
    fertiliser.singleSuperphosphate * constants.COMMON.SUPERPHOSPHATE_GHG;

  const otherFertiliserTotal = (fertiliser?.otherFertilisers ?? []).reduce(
    (acc, otherFertiliser) => {
      const otherNThisFertiliserTotal =
        otherFertiliser.otherDryland + otherFertiliser.otherIrrigated;

      const otherFertiliserTotalGHGInput =
        constants.COMMON.CUSTOMIZED_FERTILIZER[otherFertiliser.otherType]
          .TotalGHG;

      const otherThisFertiliserTotalEmissions =
        otherNThisFertiliserTotal * otherFertiliserTotalGHGInput;

      return acc + otherThisFertiliserTotalEmissions;
    },
    0,
  );

  const totalEmbeddedEmissionsFertiliser =
    totalUrea + totalSuperPhosphate + otherFertiliserTotal;

  return totalEmbeddedEmissionsFertiliser;
}

// Temporary function for new `.otherFertilisers` array field, until the
// individual other fertiliser fields are removed
export function mergeOtherFertilisers(fertiliser: Fertiliser) {
  const otherFertilisers =
    fertiliser.otherFertilisers && fertiliser.otherFertilisers.length > 0
      ? fertiliser.otherFertilisers
      : [
          {
            otherType: fertiliser.otherType ?? 'Urea-Ammonium Nitrate (UAN)',
            otherDryland: fertiliser.otherDryland ?? 0,
            otherIrrigated: fertiliser.otherIrrigated ?? 0,
          },
        ];

  return { ...fertiliser, otherFertilisers };
}
