import { ExecutionContext } from '../executionContext';

type Scope3GrainInput = {
  ureaApplication: number;
  areaSown: number;
  nonUreaNitrogen: number;
  phosphorusApplication: number;
  potassiumApplication: number;
  sulfurApplication: number;
  ureaAmmoniumNitrate: number;
};

export function calculateScope3Fertiliser(
  crop: Scope3GrainInput,
  context: ExecutionContext,
) {
  const { constants } = context;

  // (embeddedEmissions_C4)
  const ureaTonnes = (crop.ureaApplication * crop.areaSown) / 1000;

  // (embeddedEmissions_E133)
  const elementNEF =
    constants.COMPONENTS_ENERGY_EF.N.TOTAL_ENERGY *
    constants.COMPONENTS_ENERGY_EF.N.EF;

  // (embeddedEmissions_C125)
  const ureaTotalEnergy = elementNEF * constants.FERTILISER_CONTENT.UREA.N;

  // (embeddedEmissions_F4)
  const ureaTotalGHG = ureaTonnes * ureaTotalEnergy;

  // (embeddedEmissions_C5)
  const nonUreaNitrogenTonnes = (crop.nonUreaNitrogen * crop.areaSown) / 1000;

  // (embeddedEmissions_C122)
  const nonUreaTotalEnergy = elementNEF * constants.FERTILISER_CONTENT.DAP.N;

  // (embeddedEmissions_C124)
  const mapTotalEnergy = elementNEF * constants.FERTILISER_CONTENT.MAP.N;
  // (embeddedEmissions_C126)
  const soaTotalEnergy =
    elementNEF * constants.FERTILISER_CONTENT.SULPHATE_OF_AMMONIA.N;

  // (embeddedEmissions_E122, embeddedEmissions_E5)
  const averageDAPMAPSOA =
    (nonUreaTotalEnergy + mapTotalEnergy + soaTotalEnergy) / 3;
  // (embeddedEmissions_F5)
  const nitrogenFertiliserTotalGHG = nonUreaNitrogenTonnes * averageDAPMAPSOA;

  // (embeddedEmissions_C6, dataInputCropsC10)
  const phosphorusTonnes = (crop.phosphorusApplication * crop.areaSown) / 1000;
  // (embeddedEmissions_E134)
  const elementPEF =
    constants.COMPONENTS_ENERGY_EF.P.TOTAL_ENERGY *
    constants.COMPONENTS_ENERGY_EF.P.EF;
  // (embeddedEmissions_F6)
  const phosphorusTotalGHG = phosphorusTonnes * elementPEF;

  // (embeddedEmissions_C7)
  const potassiumTonnes = (crop.potassiumApplication * crop.areaSown) / 1000;
  // (embeddedEmissions_E135)
  const elementKEF =
    constants.COMPONENTS_ENERGY_EF.K.TOTAL_ENERGY *
    constants.COMPONENTS_ENERGY_EF.K.EF;
  // (embeddedEmissions_F7)
  const potassiumTotalGHG = potassiumTonnes * elementKEF;

  // (embeddedEmissions_C8, dataInputCropsC12)
  const sulfurTonnes = (crop.sulfurApplication * crop.areaSown) / 1000;
  // (embeddedEmissions_E136)
  const elementSEF =
    constants.COMPONENTS_ENERGY_EF.S.TOTAL_ENERGY *
    constants.COMPONENTS_ENERGY_EF.S.EF;
  // (embeddedEmissions_F8)
  const sulfurTotalGHG = sulfurTonnes * elementSEF;

  // (embeddedEmissions_C9)
  const ureaAmmoniumNTonnes = (crop.ureaAmmoniumNitrate * crop.areaSown) / 1000;
  // (embeddedEmissions_G108)
  const totalGHGCustomAmmoniumNitrate = 1173.8 / 1000;
  // (embeddedEmissions_F9)
  const ureaAmmoniumTotalGHG =
    ureaAmmoniumNTonnes * totalGHGCustomAmmoniumNitrate;

  // (dataSummary_B23, embeddedEmissions_F10)
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
