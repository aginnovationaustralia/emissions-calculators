import { getOtherFertiliserAmounts } from '../common/fertiliser';
import { ExecutionContext } from '../executionContext';
import { Fertiliser } from '../types/fertiliser.input';

export function calculateScope1Fertiliser(
  fertiliser: Fertiliser,
  context: ExecutionContext,
) {
  const { constants } = context;

  const { otherFertiliserDryland, otherFertiliserIrrigated } =
    getOtherFertiliserAmounts(context, fertiliser);

  //
  //
  //
  // START N2O - FERTILISER
  const soilEmissionsGrazingDryland =
    fertiliser.pastureDryland *
    0.46 *
    constants.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.GWP_FACTORSC15;

  const soilEmissionsCroppingDryland =
    fertiliser.cropsDryland *
    0.46 *
    constants.AGRICULTURAL_SOILS.EF_NONIRRIGATEDCROP *
    constants.GWP_FACTORSC15;

  const soilEmissionsOtherDryland =
    otherFertiliserDryland *
    constants.AGRICULTURAL_SOILS.EF_NONIRRIGATEDCROP *
    constants.GWP_FACTORSC15;

  const soilEmissionsGrazingIrrigated =
    fertiliser.pastureIrrigated *
    0.46 *
    constants.AGRICULTURAL_SOILS.EF_IRRIGATEDPASTURE *
    constants.GWP_FACTORSC15;

  const soilEmissionsCroppingIrrigated =
    fertiliser.cropsIrrigated *
    0.46 *
    constants.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP *
    constants.GWP_FACTORSC15;

  const soilEmissionsOtherIrrigated =
    otherFertiliserIrrigated *
    constants.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP *
    constants.GWP_FACTORSC15;

  // (Agricultural_SoilsD18)
  const totalCO2 =
    (soilEmissionsGrazingDryland +
      soilEmissionsCroppingDryland +
      soilEmissionsOtherDryland +
      soilEmissionsGrazingIrrigated +
      soilEmissionsCroppingIrrigated +
      soilEmissionsOtherIrrigated) *
    constants.GWP_FACTORSC6;
  // END N2O - FERTILISER
  //
  //
  //

  return totalCO2;
}
