import { ExecutionContext } from '../../executionContext';
import { Fertiliser } from '../../types/fertiliser.input';
import { CustomisedFertiliser } from '../../types/types';
import { CommonConstants } from '../constants';

export const OTHER_TYPE_TO_SIMPLE_KEY: {
  [key in CustomisedFertiliser]:
    | 'DAP'
    | 'MAP'
    | 'UAN'
    | 'AN'
    | 'CAN'
    | 'TSP'
    | 'SP11'
    | 'SP21'
    | 'SP31'
    | 'SP41'
    | 'SP51'
    | 'MURIATE_OF_POTASH'
    | 'SULPHATE_OF_POTASH'
    | 'SULPHATE_OF_AMMONIA';
} = {
  'Diammonium Phosphate (DAP)': 'DAP',
  'Monoammonium phosphate (MAP)': 'MAP',
  'Urea-Ammonium Nitrate (UAN)': 'UAN',
  'Ammonium Nitrate (AN)': 'AN',
  'Calcium Ammonium Nitrate (CAN)': 'CAN',
  'Triple Superphosphate (TSP)': 'TSP',
  'Super Potash 1:1': 'SP11',
  'Super Potash 2:1': 'SP21',
  'Super Potash 3:1': 'SP31',
  'Super Potash 4:1': 'SP41',
  'Super Potash 5:1': 'SP51',
  'Muriate of Potash': 'MURIATE_OF_POTASH',
  'Sulphate of Potash': 'SULPHATE_OF_POTASH',
  'Sulphate of Ammonia': 'SULPHATE_OF_AMMONIA',
};

function getRatioN(
  context: ExecutionContext<CommonConstants>,
  otherType: CustomisedFertiliser,
) {
  const { constants } = context;
  return constants.COMMON.FERTILISER_CONTENT[
    OTHER_TYPE_TO_SIMPLE_KEY[otherType]
  ].N;
}

export function getOtherFertiliserAmounts(
  context: ExecutionContext<CommonConstants>,
  fertiliser: Fertiliser,
) {
  return (fertiliser.otherFertilisers ?? []).reduce(
    (acc, f) => {
      const ratioN = getRatioN(context, f.otherType);
      return {
        otherFertiliserDryland:
          acc.otherFertiliserDryland + f.otherDryland * ratioN,
        otherFertiliserIrrigated:
          acc.otherFertiliserIrrigated + f.otherIrrigated * ratioN,
      };
    },
    { otherFertiliserDryland: 0, otherFertiliserIrrigated: 0 },
  );
}

export type CropWithUrea = {
  ureaApplication: number;
  ureaAmmoniumNitrate: number;
};
export function getUreaMass(
  context: ExecutionContext<CommonConstants>,
  crop: CropWithUrea,
) {
  const { constants } = context;

  return (
    crop.ureaApplication +
    crop.ureaAmmoniumNitrate * constants.COMMON.GWP_FACTORSC22
  );
}
