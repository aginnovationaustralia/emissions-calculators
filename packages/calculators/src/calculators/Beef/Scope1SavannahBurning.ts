import { SavannahBurning } from '@/types/Beef/savannah.input';
import { State, VegetationClassNumber } from '@/types/enums';
import { ExecutionContext } from '../executionContext';
import { ConstantsForBeefCalculator } from './constants';

export function calculateScope1SavannahBurning(
  burn: SavannahBurning,
  state: State,
  context: ExecutionContext<ConstantsForBeefCalculator>,
) {
  const { constants } = context;
  const stateRef = constants.SAVANNA.FUEL_STATEREF[state];
  const vegRef = VegetationClassNumber[burn.vegetation];

  const combinedReference = `${stateRef}${vegRef}`;
  const combinedRefStateIndex = Object.values(
    constants.SAVANNA.FUELFINE['Combined Ref'],
  ).findIndex((x) => x === combinedReference);

  if (combinedRefStateIndex === -1) {
    return {
      totalCH4: 0,
      totalN2O: 0,
    };
  }

  // Example to help understand the combined reference lookup:
  // if state = 'nt', then stateRef = 8
  // if burn.vegetation = 'Melaleuca woodland', then vegRef = 3
  // combinedReference = '83'
  // combinedRefStateIndex = 12
  // combinedRefStateString = 'NT3'

  const combinedRefStateString = Object.keys(
    constants.SAVANNA.FUELFINE['Combined Ref'],
  )[combinedRefStateIndex] as keyof typeof constants.SAVANNA.FUELFINE.Yo;

  const fineResidueAfterBurn =
    constants.SAVANNA.FUELFINE.Yo[combinedRefStateString];
  const fineAnnualRateOfFreshLitterInput =
    constants.SAVANNA.FUELFINE.L[combinedRefStateString];
  const fineDecayConstant =
    constants.SAVANNA.FUELFINE.D[combinedRefStateString];
  const fineGrassBiomass =
    constants.SAVANNA.FUELFINE.Gc[combinedRefStateString];

  const fineFuelLoad =
    (fineAnnualRateOfFreshLitterInput / fineDecayConstant) *
    (1 -
      1 *
        (fineDecayConstant * fineResidueAfterBurn) *
        Math.exp(-fineDecayConstant * burn.yearsSinceLastFire)) *
    fineGrassBiomass;

  const coarseResidueAfterBurn =
    constants.SAVANNA.FUELCOARSE.Yo[combinedRefStateString];
  const coarseAnnualRateOfFreshLitterInput =
    constants.SAVANNA.FUELCOARSE.L[combinedRefStateString];
  const coarseDecayConstant =
    constants.SAVANNA.FUELCOARSE.D[combinedRefStateString];

  const coarseFuelLoad =
    (coarseAnnualRateOfFreshLitterInput / coarseDecayConstant) *
    (1 -
      coarseDecayConstant *
        coarseResidueAfterBurn *
        Math.exp(-coarseDecayConstant * burn.yearsSinceLastFire));

  const patchinessValue =
    constants.SAVANNA.BURN_PATCHINESS[burn.season][burn.patchiness];

  const completenessOfCombustion =
    constants.SAVANNA.BURN_COMPLETENESSOFCOMBUSTION[burn.rainfallZone][
      burn.fuel
    ][burn.season];

  const massOfFineFuelBurnt =
    burn.fireScarArea *
    fineFuelLoad *
    patchinessValue *
    completenessOfCombustion *
    10 ** -3;

  const massOfCoarseFuelBurnt =
    burn.fireScarArea *
    coarseFuelLoad *
    patchinessValue *
    completenessOfCombustion *
    10 ** -3;

  const fineFuelCarbonContent =
    constants.SAVANNA.FUELBURNT_VEGETATION_CARBONFRACTION.fine[burn.vegetation];
  const coarseFuelCarbonContent =
    constants.SAVANNA.FUELBURNT_VEGETATION_CARBONFRACTION.coarse[
      burn.vegetation
    ];

  const fineFuelEFCH4 =
    constants.SAVANNA.FUELBURNT_VEGETATION_EF_CH4.fine[burn.vegetation];
  const coarseFuelEFCH4 =
    constants.SAVANNA.FUELBURNT_VEGETATION_EF_CH4.coarse[burn.vegetation];

  const fineEmissionsCH4 =
    massOfFineFuelBurnt *
    fineFuelCarbonContent *
    fineFuelEFCH4 *
    constants.COMMON.GWP_FACTORSC14;
  const coarseEmissionsCH4 =
    massOfCoarseFuelBurnt *
    coarseFuelCarbonContent *
    coarseFuelEFCH4 *
    constants.COMMON.GWP_FACTORSC14;

  const totalMethaneGg =
    (fineEmissionsCH4 + coarseEmissionsCH4) * constants.COMMON.GWP_FACTORSC5;
  const totalCH4 = totalMethaneGg * 10 ** 3;

  const fineFuelNitrogenContent =
    constants.SAVANNA.FUELBURNT_VEGETATION_NITROGENCARBONRATIO.fine[
      burn.vegetation
    ];
  const coarseFuelNitrogenContent =
    constants.SAVANNA.FUELBURNT_VEGETATION_NITROGENCARBONRATIO.coarse[
      burn.vegetation
    ];

  const fineFuelEFN2O =
    constants.SAVANNA.FUELBURNT_VEGETATION_N2O.fine[burn.vegetation];
  const coarseFuelEFN2O =
    constants.SAVANNA.FUELBURNT_VEGETATION_N2O.coarse[burn.vegetation];

  const fineEmissionsN2O =
    massOfFineFuelBurnt *
    fineFuelCarbonContent *
    fineFuelNitrogenContent *
    fineFuelEFN2O *
    constants.COMMON.GWP_FACTORSC15;
  const coarseEmissionsN2O =
    massOfCoarseFuelBurnt *
    coarseFuelCarbonContent *
    coarseFuelNitrogenContent *
    coarseFuelEFN2O *
    constants.COMMON.GWP_FACTORSC15;

  const totalN2OGg = (fineEmissionsN2O + coarseEmissionsN2O) * 310;
  const totalN2O = totalN2OGg * 10 ** 3;

  return {
    totalCH4,
    totalN2O,
  };
}
