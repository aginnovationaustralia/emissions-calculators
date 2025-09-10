import { ExecutionContext } from '../executionContext';
import { SavannahBurning } from '../types/Beef/savannah.input';
import { State, VegetationClassNumber } from '../types/types';

export function calculateScope1SavannahBurning(
  burn: SavannahBurning,
  state: State,
  context: ExecutionContext,
) {
  const { constants } = context;
  const stateRef = constants.FUEL_STATEREF[state];
  const vegRef = VegetationClassNumber[burn.vegetation];

  const combinedReference = `${stateRef}${vegRef}`;
  const combinedRefStateIndex = Object.values(
    constants.SAVANNAH_FUELFINE['Combined Ref'],
  ).findIndex((x) => x === combinedReference);

  if (combinedRefStateIndex === -1) {
    return {
      totalCH4: 0,
      totalN2O: 0,
    };
  }

  // TODO: this is a very weird way of doing it by state string, but oh well
  const combinedRefStateString = Object.keys(constants.SAVANNAH_FUELFINE['Combined Ref'])[
    combinedRefStateIndex
  ] as keyof typeof constants.SAVANNAH_FUELFINE.Yo;

  // (savannahBurningE48)
  const fineResidueAfterBurn = constants.SAVANNAH_FUELFINE.Yo[combinedRefStateString];
  // (savannahBurningE49)
  const fineAnnualRateOfFreshLitterInput =
    constants.SAVANNAH_FUELFINE.L[combinedRefStateString];
  // (savannahBurningE50)
  const fineDecayConstant = constants.SAVANNAH_FUELFINE.D[combinedRefStateString];
  // (savannahBurningE51)
  const fineGrassBiomass = constants.SAVANNAH_FUELFINE.Gc[combinedRefStateString];

  // (savannahBurningE55)
  const fineFuelLoad =
    (fineAnnualRateOfFreshLitterInput / fineDecayConstant) *
    (1 -
      1 *
        (fineDecayConstant * fineResidueAfterBurn) *
        Math.exp(-fineDecayConstant * burn.yearsSinceLastFire)) *
    fineGrassBiomass;

  // (savannahBurningE58)
  const coarseResidueAfterBurn = constants.SAVANNAH_FUELCOARSE.Yo[combinedRefStateString];
  // (savannahBurningE59)
  const coarseAnnualRateOfFreshLitterInput =
    constants.SAVANNAH_FUELCOARSE.L[combinedRefStateString];
  // (savannahBurningE60)
  const coarseDecayConstant = constants.SAVANNAH_FUELCOARSE.D[combinedRefStateString];

  // (savannahBurningE64)
  const coarseFuelLoad =
    (coarseAnnualRateOfFreshLitterInput / coarseDecayConstant) *
    (1 -
      coarseDecayConstant *
        coarseResidueAfterBurn *
        Math.exp(-coarseDecayConstant * burn.yearsSinceLastFire));

  // (savannahBurningE70)
  const patchinessValue = constants.BURN_PATCHINESS[burn.season][burn.patchiness];

  // (savannahBurningE73)
  const completenessOfCombustion =
    constants.BURN_COMPLETENESSOFCOMBUSTION[burn.rainfallZone][burn.fuel][burn.season];

  // (savannahBurningE78)
  const massOfFineFuelBurnt =
    burn.fireScarArea *
    fineFuelLoad *
    patchinessValue *
    completenessOfCombustion *
    10 ** -3;

  // (savannahBurningE79)
  const massOfCoarseFuelBurnt =
    burn.fireScarArea *
    coarseFuelLoad *
    patchinessValue *
    completenessOfCombustion *
    10 ** -3;

  // methane

  // (savannahBurningE84)
  const fineFuelCarbonContent =
    constants.FUELBURNT_VEGETATION_CARBONFRACTION.fine[burn.vegetation];
  // (savannahBurningE85)
  const coarseFuelCarbonContent =
    constants.FUELBURNT_VEGETATION_CARBONFRACTION.coarse[burn.vegetation];

  // (savannahBurningE86)
  const fineFuelEFCH4 = constants.FUELBURNT_VEGETATION_EF_CH4.fine[burn.vegetation];
  // (savannahBurningE87)
  const coarseFuelEFCH4 = constants.FUELBURNT_VEGETATION_EF_CH4.coarse[burn.vegetation];

  // (savannahBurningE92)
  const fineEmissionsCH4 =
    massOfFineFuelBurnt *
    fineFuelCarbonContent *
    fineFuelEFCH4 *
    constants.GWP_FACTORSC14;
  // (savannahBurningE93)
  const coarseEmissionsCH4 =
    massOfCoarseFuelBurnt *
    coarseFuelCarbonContent *
    coarseFuelEFCH4 *
    constants.GWP_FACTORSC14;

  const totalMethaneGg =
    (fineEmissionsCH4 + coarseEmissionsCH4) * constants.GWP_FACTORSC5;
  const totalCH4 = totalMethaneGg * 10 ** 3;

  // N2O

  // (savannahBurningE101)
  const fineFuelNitrogenContent =
    constants.FUELBURNT_VEGETATION_NITROGENCARBONRATIO.fine[burn.vegetation];
  // (savannahBurningE102)
  const coarseFuelNitrogenContent =
    constants.FUELBURNT_VEGETATION_NITROGENCARBONRATIO.coarse[burn.vegetation];

  // (savannahBurningE103)
  const fineFuelEFN2O = constants.FUELBURNT_VEGETATION_N2O.fine[burn.vegetation];
  // (savannahBurningE104)
  const coarseFuelEFN2O = constants.FUELBURNT_VEGETATION_N2O.coarse[burn.vegetation];

  // (savannahBurningE109)
  const fineEmissionsN2O =
    massOfFineFuelBurnt *
    fineFuelCarbonContent *
    fineFuelNitrogenContent *
    fineFuelEFN2O *
    constants.GWP_FACTORSC15;
  // (savannahBurningE110)
  const coarseEmissionsN2O =
    massOfCoarseFuelBurnt *
    coarseFuelCarbonContent *
    coarseFuelNitrogenContent *
    coarseFuelEFN2O *
    constants.GWP_FACTORSC15;

  const totalN2OGg = (fineEmissionsN2O + coarseEmissionsN2O) * 310;
  const totalN2O = totalN2OGg * 10 ** 3;

  return {
    totalCH4,
    totalN2O,
  };
}
