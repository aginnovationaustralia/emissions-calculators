import { SugarCrop } from '@/types/Sugar/sugar.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForSugarCalculator } from './constants';

export function calculateScope3Fertiliser(
  crop: SugarCrop,
  context: ExecutionContext<ConstantsForSugarCalculator>,
) {
  const { constants } = context;

  const ureaTonnes = (crop.ureaApplication * crop.areaSown) / 1000;

  const elementNEF =
    constants.CROP.COMPONENTS_ENERGY_EF.N.TOTAL_ENERGY *
    constants.CROP.COMPONENTS_ENERGY_EF.N.EF;

  const ureaTotalEnergy =
    elementNEF * constants.COMMON.FERTILISER_CONTENT.UREA.N;

  const ureaTotalGHG = ureaTonnes * ureaTotalEnergy;

  const nonUreaNitrogenTonnes = (crop.nonUreaNitrogen * crop.areaSown) / 1000;

  const nonUreaTotalEnergy =
    elementNEF * constants.COMMON.FERTILISER_CONTENT.DAP.N;

  const mapTotalEnergy = elementNEF * constants.COMMON.FERTILISER_CONTENT.MAP.N;
  const soaTotalEnergy =
    elementNEF * constants.COMMON.FERTILISER_CONTENT.SULPHATE_OF_AMMONIA.N;

  const averageDAPMAPSOA =
    (nonUreaTotalEnergy + mapTotalEnergy + soaTotalEnergy) / 3;
  const nitrogenFertiliserTotalGHG = nonUreaNitrogenTonnes * averageDAPMAPSOA;

  const phosphorusTonnes = (crop.phosphorusApplication * crop.areaSown) / 1000;
  const elementPEF =
    constants.CROP.COMPONENTS_ENERGY_EF.P.TOTAL_ENERGY *
    constants.CROP.COMPONENTS_ENERGY_EF.P.EF;
  const phosphorusTotalGHG = phosphorusTonnes * elementPEF;

  const potassiumTonnes = (crop.potassiumApplication * crop.areaSown) / 1000;
  const elementKEF =
    constants.CROP.COMPONENTS_ENERGY_EF.K.TOTAL_ENERGY *
    constants.CROP.COMPONENTS_ENERGY_EF.K.EF;
  const potassiumTotalGHG = potassiumTonnes * elementKEF;

  const sulfurTonnes = (crop.sulfurApplication * crop.areaSown) / 1000;
  const elementSEF =
    constants.CROP.COMPONENTS_ENERGY_EF.S.TOTAL_ENERGY *
    constants.CROP.COMPONENTS_ENERGY_EF.S.EF;
  const sulfurTotalGHG = sulfurTonnes * elementSEF;

  const ureaAmmoniumNTonnes = (crop.ureaAmmoniumNitrate * crop.areaSown) / 1000;
  const totalGHGCustomAmmoniumNitrate = 1173.8 / 1000;
  const ureaAmmoniumTotalGHG =
    ureaAmmoniumNTonnes * totalGHGCustomAmmoniumNitrate;

  const totalEmbeddedEmissionsFertiliser =
    ureaTotalGHG +
    nitrogenFertiliserTotalGHG +
    phosphorusTotalGHG +
    potassiumTotalGHG +
    sulfurTotalGHG +
    ureaAmmoniumTotalGHG;

  return {
    total: totalEmbeddedEmissionsFertiliser,
    intermediate: {
      urea: ureaTotalGHG,
      nitrogen: nitrogenFertiliserTotalGHG,
      phosphorus: phosphorusTotalGHG,
      potassium: potassiumTotalGHG,
      sulfur: sulfurTotalGHG,
      ureaAmmonium: ureaAmmoniumTotalGHG,
    },
  };
}
