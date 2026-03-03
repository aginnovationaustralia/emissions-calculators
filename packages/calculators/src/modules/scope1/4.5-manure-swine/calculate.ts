import { SwineConstants } from '@/calculators/Grains/constants/types';
import { selectConstant } from '@/tools/constants';
import { RootContainer } from '@/tools/containers';
import { one, oneMinus } from '@/tools/sentinels';
import { mass } from '@/tools/units';
import { SwineManureInputTransformed } from './swine-manure.input';

export function calculateMassOfNitrogenAppliedToSoils(
  input: SwineManureInputTransformed,
  constants: SwineConstants,
) {
  /* 4.5.1.5 MANURE APPLIED TO SOILS
    The mass of nitrogen applied to soils for scope 1 emissions MNSoilscope1 (kg N) is calculated as:
    MNSoilscope1 = SUMj SUMm (MN jmT=2 * (1 - EF mT=2- FracGASMmT=2) - MNLeachjm=5) * PF
    Where:
    MN jmT=2 = mass of N in secondary stages as calculated for manure management (kg N)
    EF mT=2 = nitrous oxide emission factor for each MMS (kg N2O-N/kg N)
    FracGASMmT=2 = fraction of animal waste N volatilised in each MMS ((kg NH3-N + NOx-N)/kg N)
    PF = fraction of manure applied to soil within the piggery boundary
    Note: where direct application occurs at treatment stage 2 (MN jm=13T=2), EF jm=13T=2 and FracGASM jm=13T=2 are set to zero.
    */

  // TODO: where direct application occurs at treatment stage 2 (MN jm=13T=2), EF jm=13T=2 and FracGASM jm=13T=2 are set to zero.

  const mNjmt = new RootContainer(mass('N', 0)); // TODO
  const mnLeachjm5 = new RootContainer(mass('N', 0)); // TODO

  // REVISIT: eFmt has units of kg N2O-N/kg N, but the minus operation is throwing that away
  const eFmt = selectConstant(constants, 'MMS', input.mms, 'N2O_EF');
  // REVISIT: fracGASM has units of (kg NH3-N + NOx-N)/kg N, but the minus operation is throwing that away
  const fracGASM = selectConstant(
    constants,
    'MMS',
    input.mms,
    'N_VOLATISED_EF',
  );
  const pf = input.fractionAppliedToSoils;

  const nonVolatilisedFactor = one.minus(eFmt).minus(fracGASM);
  const totalMassOfNitrogenAppliedToSoils = mNjmt
    .multiply(nonVolatilisedFactor)
    .minus(mnLeachjm5);

  return {
    scope1: totalMassOfNitrogenAppliedToSoils.multiply(pf),
    scope3: totalMassOfNitrogenAppliedToSoils.multiply(oneMinus(pf)),
  };
}
