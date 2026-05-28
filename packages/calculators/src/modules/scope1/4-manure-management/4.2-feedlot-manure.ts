import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { groupDurationToDurationType } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { br, num } from '@/tools/containers';
import { one, oneMinus, zero } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { FeedlotManureInputTransformed } from './feedlot-manure.input';

export function calculateMassOfNitrogenAppliedToSoilsForFeedlot(
  manureInput: FeedlotManureInputTransformed,
  crop: BaseGrainsCropTransformed,
  constants: ConstantsForGrainsCalculator,
) {
  /* 4.5.1.5 MANURE APPLIED TO SOILS
    To calculate the mass of nitrogen applied to soils MNSoil (kgN) the following equation can
    be used:
    MNSoil = SUM SUM SUM MN jmT=2,3 * (1 - EFmT=2,3- FracGASMmT=2,3) *  PF
    Where
    MNjmT=2,3 = mass of N in secondary and tertiary treatment MMS stages as calculated for manure management (kgN)
    EFmT=2,3 = nitrous oxide emission factor for each MMS (kgN2O-N/kgN)
    FracGASMmT=2,3 = fraction of animal waste N volatilised in each MMS for each cattle group ((kg NH3-N + NOx-N)/kgN)
    PF = fraction of manure applied to soil within the feedlot boundary (dimensionless)
    */

  /*
   MNjm=5T=1 = AEj
    MT jmT=2 = (MNjm=5T=1 * (1 - FracGASMm=5T=1- EFm=5T=1)) - MNjmT=3
    MN jmT=2 = MT jmT=2 * MMSmT=2
    NIj = Ij * CP j ÷ 6.25
    NEj = NIj * (1 - NRj)
    AEj = N j * NEj * Lj
    MN jm=1 T=3 = AEj * MMSm=1 T=3
    */

  const { herds, secondaryMMS, tertiaryLagoonInUse } = manureInput;

  const EFmT1 = selectConstant(
    constants.FEEDLOT,
    'MMS',
    'Dry lot (Feedpad)',
    'N2O_EF',
  ).named('EFmT1');
  const FracGASMmT1 = selectConstant(
    constants.FEEDLOT,
    'MMS',
    'Dry lot (Feedpad)',
    'N_VOLATISED_EF',
  ).named('FracGASMmT1');

  const EFmT2 = selectConstant(
    constants.FEEDLOT,
    'MMS',
    secondaryMMS,
    'N2O_EF',
  ).named('EFmT2');
  const FracGASMmT2 = selectConstant(
    constants.FEEDLOT,
    'MMS',
    secondaryMMS,
    'N_VOLATISED_EF',
  ).named('FracGASMmT2');

  const EFmT3 = selectConstant(
    constants.FEEDLOT,
    'MMS',
    'Uncovered anaerobic lagoon (Effluent Pond)',
    'N2O_EF',
  ).named('EFmT3');
  const FracGASMmT3 = selectConstant(
    constants.FEEDLOT,
    'MMS',
    'Uncovered anaerobic lagoon (Effluent Pond)',
    'N_VOLATISED_EF',
  ).named('FracGASMmT3');

  const MMSm1t3 = (tertiaryLagoonInUse ? num(0.02) : zero).named('MMSm1t3');
  const MMSmt2 = one.named('MMSmt2');

  const directApplicationStage2 = secondaryMMS === 'Direct application';

  const herdRecords = herds.map((herd) => {
    const Lj = herd.lengthOfStayDays;
    const herdDurationType = groupDurationToDurationType(
      Lj.unit.value.toNumber(),
    );
    const Nj = herd.numberOfCattle;

    const Ij = herd.dryMatterIntake
      ? herd.dryMatterIntake
      : selectConstant(
          constants.FEEDLOT,
          'FEED',
          herdDurationType,
          'DRY_MATTER_INTAKE',
        ).named('Ij default');
    const CPj = herd.crudeProteinContent
      ? herd.crudeProteinContent
      : selectConstant(
          constants.FEEDLOT,
          'FEED',
          herdDurationType,
          'CRUDE_PROTEIN_CONTENT',
        ).named('CPj default');
    const NRj = selectConstant(
      constants.FEEDLOT,
      'FEED',
      herdDurationType,
      'NITROGEN_RETENTION_FRACTION',
    ).named('NRj');
    const crudeProteinToNitrogen = selectConstant(
      constants.COMMON,
      'CRUDE_PROTEIN_TO_NITROGEN_CONVERSION',
    ).named('CP per N');
    // CP / (CP / N)
    const NIj = Ij.multiply(CPj).divide(crudeProteinToNitrogen).named('NIj'); // kg N per head per day
    const NEj = NIj.multiply(br(oneMinus(NRj))).named('NEj');
    const AEj = NEj.multiply(Nj).multiply(Lj).named('AEj'); // kg N
    const MNjmT1 = AEj;
    const MNjmT3 = AEj.multiply(MMSm1t3).named('MNjmT3');
    const MTjmT2 = br(MNjmT1.multiply(br(oneMinus(FracGASMmT1).minus(EFmT1))))
      .minus(MNjmT3)
      .named('MTjmT2');
    const MNjmT2 = MTjmT2.multiply(MMSmt2).named('MNjmT2');

    if (directApplicationStage2) {
      return MNjmT2;
    }

    const totalForT2 = MNjmT2.multiply(br(oneMinus(EFmT2).minus(FracGASMmT2)));
    const totalForT3 = MNjmT3.multiply(br(oneMinus(EFmT3).minus(FracGASMmT3)));
    return sum([totalForT2, totalForT3]);
  });

  const pf = manureInput.fractionAppliedToSoils;

  const massNitrogenFromSystems = sum(herdRecords);

  return {
    scope1: massNitrogenFromSystems.multiply(pf, { name: 'MNSoilScope1' }),
    scope3: massNitrogenFromSystems.multiply(oneMinus(pf), {
      name: 'MNSoilscope3',
    }),
  };
}
