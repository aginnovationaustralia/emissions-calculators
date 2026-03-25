import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { SwineMMSType } from '@/constants/enums';
import { constant, selectConstant } from '@/tools/constants';
import { br, Container, RootContainer } from '@/tools/containers';
import { one, oneMinus, zero } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass, mass, RealNumber } from '@/tools/units';
import { SwineManureInputTransformed } from './swine-manure.input';

const massNitrogenAppliedToSoilsFromSystem = (
  FNjmt1: Container<RealNumber>,
  AEj: RootContainer<Mass<'N'>>,
  MMSjmt2: RootContainer<RealNumber>,
  fracWET: RootContainer<RealNumber>,
  system1: RootContainer<SwineMMSType>,
  system2: RootContainer<SwineMMSType>,
  constants: ConstantsForGrainsCalculator,
) => {
  const fracLeachMMS = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE',
  ).named('FracLeachMMS');
  const eFmt1 = selectConstant(constants.SWINE, 'MMS', system1, 'N2O_EF').named(
    'EFmT=1',
  );
  const EFmt2 = selectConstant(constants.SWINE, 'MMS', system2, 'N2O_EF').named(
    'EFmT=2',
  );
  const FracGASMt1 = selectConstant(
    constants.SWINE,
    'MMS',
    system1,
    'N_VOLATISED_EF',
  ).named('FracGASMt1');
  const FracGASMt2 = selectConstant(
    constants.SWINE,
    'MMS',
    system2,
    'N_VOLATISED_EF',
  ).named('FracGASMt2');
  const MNjmt1 = AEj.multiply(FNjmt1).named('MN jm T=1');
  const NTjmt2 = MNjmt1.multiply(br(oneMinus(FracGASMt1).minus(eFmt1))).named(
    'NT jm T=2',
  );
  const MNjmt2 = (
    system2.unit === 'Direct application'
      ? new RootContainer(MNjmt1.unit)
      : NTjmt2.multiply(MMSjmt2)
  ).named('MN jm T=2');
  const nonVolatilisedFactor = br(one.minus(EFmt2).minus(FracGASMt2));
  const mnLeachjm5 = (
    system1.unit === 'Stockpile (Solid storage)'
      ? MNjmt1.multiply(fracWET).multiply(fracLeachMMS)
      : new RootContainer(mass('N', 0))
  ).named('MN Leach jm=5');

  const totalMassOfNitrogenAppliedToSoils = br(
    MNjmt2.multiply(nonVolatilisedFactor),
  ).minus(mnLeachjm5);

  return totalMassOfNitrogenAppliedToSoils;
};

const fractionNitrogenInPrimaryLiquidSystem = (
  MMSjmt1: RootContainer<RealNumber>,
  SNm: RootContainer<RealNumber>,
) => {
  // FN jm T=1 = MMS jm T=1 * (1 - SN m)
  return MMSjmt1.multiply(br(oneMinus(SNm))).named('FN jm T=1');
};

const fractionNitrogenInPrimarySolidsSystem = (
  MMSjm4t1: RootContainer<RealNumber>,
  MMSjm1t1: RootContainer<RealNumber>,
  SNm: RootContainer<RealNumber>,
) => {
  // FN jm=4 T=1 = MMS jm=4 T=1 + (MMSjm=1,7,9 T=1 * SNm)
  return MMSjm4t1.plus(br(MMSjm1t1.multiply(SNm))).named('FN jm=4 T=1');
};

export function calculateMassOfNitrogenAppliedToSoilsForSwine(
  manureInput: SwineManureInputTransformed,
  crop: BaseGrainsCropTransformed,
  constants: ConstantsForGrainsCalculator,
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

  /*
    MNLeachjm=5 = MN jm T=1 * FracWET * FracLeachMMS
    MN jm T=1 = AE j * FN jm T=1
    MMSjmT=1 = Fraction of manure in each primary MMS
    SNm = Fraction of nitrogen separated by pre-treatment of manure
    FN jm T=1 = MMS jm T=1 * (1 - SN m)
    AE j = N j * NW j * D j
    MN jm T=1 = AE j * FN jm T=1
    NT jm T=2 = (MNjmT=1 * (1 - FracGASMmT=1- EFmT=1))
    
    MN jm T=2 = NT jm T=2 * MMS jmT=2
    */
  const fracWET = constant(
    'FracWET',
    crop.isInLeachingZone ? one.unit : zero.unit,
  );
  const AEj = manureInput.totalNitrogenExcreted.named('AE j'); // TODO: This should be per class of swine. Currently simplified to total nitrogen excreted.

  const { mms } = manureInput;

  const { liquids, solids } = mms;

  const MMSjmt1 = liquids.fractionOfManureToLiquidsMMS.named('MMS jm T=1');
  const MMSjmt2 =
    liquids.fractionOfManureFromLiquidsStage1to2.named('MMS jm T=2'); // REVISIT: For now, assumes that every primary goes to a single secondary. In theory this may require a list of secondary MMS systems
  const SNm = solids?.fractionOfNitrogenSeparatedToSolidStorage ?? zero;
  const FNjmt1 = fractionNitrogenInPrimaryLiquidSystem(MMSjmt1, SNm);

  const totalMassOfNitrogenAppliedToSoilsFromLiquids =
    massNitrogenAppliedToSoilsFromSystem(
      FNjmt1,
      AEj,
      MMSjmt2,
      fracWET,
      liquids.liquidsSystem1,
      liquids.liquidsSystem2,
      constants,
    ).named('MSSoilScope1 liquids');

  let totalMassOfNitrogenAppliedToSoilsFromSolids: Container<Mass<'N'>> =
    new RootContainer(mass('N', 0));

  if (solids) {
    // FN jm=4 T=1 = MMS jm=4 T=1 + (MMS jm=1,7,9 T=1 * SN m)
    const FNjm4t1 = fractionNitrogenInPrimarySolidsSystem(
      solids.fractionOfManureToSolidsMMS,
      MMSjmt1,
      SNm,
    );
    totalMassOfNitrogenAppliedToSoilsFromSolids =
      massNitrogenAppliedToSoilsFromSystem(
        FNjm4t1,
        AEj,
        MMSjmt2,
        fracWET,
        solids.solidsSystem1,
        solids.solidsSystem2,
        constants,
      ).named('MSSoilScope1 solids');
  }

  // REVISIT: eFmt has units of kg N2O-N/kg N, but the minus operation is throwing that away
  // REVISIT: fracGASM has units of (kg NH3-N + NOx-N)/kg N, but the minus operation is throwing that away
  const pf = manureInput.fractionAppliedToSoils; // REVISIT: This is strictly the fraction applied to soils of origin. Need to be careful with this as an input for local vs purchased manure

  const massNitrogenFromSystems = sum([
    totalMassOfNitrogenAppliedToSoilsFromLiquids,
    totalMassOfNitrogenAppliedToSoilsFromSolids,
  ]);

  return {
    scope1: massNitrogenFromSystems.multiply(pf, { name: 'MNSoilScope1' }),
    scope3: massNitrogenFromSystems.multiply(oneMinus(pf), {
      name: 'MNSoilscope3',
    }),
  };
}
