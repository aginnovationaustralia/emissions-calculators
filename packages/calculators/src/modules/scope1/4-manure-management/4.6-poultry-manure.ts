import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import {
  PoultryMMS1Type,
  PoultryMMS1TypeWithPasture,
  PoultryMMS2Type,
  PoultryMMS2TypeWithPasture,
} from '@/calculators/Grains/constants/enums';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { selectConstant } from '@/tools/constants';
import { br, Container, num, root } from '@/tools/containers';
import { oneMinus } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { mass, Mass, RealNumber } from '@/tools/units';
import {
  PoultryManureClassInputTransformed,
  PoultryManureInputTransformed,
  PoultryMMS1To2AllocationInputTransformed,
} from './poultry-manure.input';

// const mmsSystems = [
//   { name: 'anaerobicLagoon', m: '1' },
//   { name: 'sumpDispersal', m: '3a' },
//   { name: 'drainToPaddock', m: '3b' },
//   { name: 'solidStorage', m: '4' },
// ] as const;

type PoultryClassResult = Record<
  PoultryMMS1TypeWithPasture,
  Container<Mass<'N'>>
>;

const calculateForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: ConstantsForGrainsCalculator,
): PoultryClassResult => {
  const {
    head,
    days,
    manureAllocation,
    className,
    classNumber,
    method2NitrogenRetentionRate,
    method2DryMatterIntake,
  } = poultryClass;

  const NRj =
    method2NitrogenRetentionRate ??
    selectConstant(
      constants.POULTRY,
      'CLASSES',
      className,
      'nitrogenRetentionRate',
    ).named(`NRj=${classNumber}`);

  const Ij =
    method2DryMatterIntake ??
    selectConstant(
      constants.POULTRY,
      'CLASSES',
      className,
      'dryMatterIntake',
    ).named(`Ij=${classNumber}`);

  const CPj = selectConstant(
    constants.POULTRY,
    'CLASSES',
    className,
    'crudeProtein',
  ).named(`CPj=${classNumber}`);

  const crudeProteinToNitrogen = selectConstant(
    constants.COMMON,
    'CRUDE_PROTEIN_TO_NITROGEN_CONVERSION',
  ).named('CP per N');

  const NIj = Ij.multiply(CPj)
    .divide(crudeProteinToNitrogen)
    .named(`NIj=${classNumber}`);

  const NEj = NIj.multiply(br(oneMinus(NRj))).named(`NEj=${classNumber}`);

  const AEj = NEj.multiply(head).multiply(days).named(`AEj=${classNumber}`);

  return {
    manureWithLitter: AEj.multiply(manureAllocation.manureWithLitter).named(
      `MMSj=${classNumber}m=10T=1`,
    ),
    beltManureRemoval: AEj.multiply(manureAllocation.beltManureRemoval).named(
      `MMSj=${classNumber}m=11aT=1`,
    ),
    manureStoredInHouse: AEj.multiply(
      manureAllocation.manureStoredInStorage,
    ).named(`MMSj=${classNumber}m=11bT=1`),
    pastureRangeAndPaddock: AEj.multiply(
      manureAllocation.pastureRangeAndPaddock,
    ).named(`MMSj=${classNumber}m=14T=1`),
  };
};

const calculateNitrogenMNForMMS2 = <C extends PoultryMMS2TypeWithPasture>(
  mms2name: C,
  classNumber: string,
  NTm10T2: Container<Mass<'N'>>,
  NTm11aT2: Container<Mass<'N'>>,
  NTm11bT2: Container<Mass<'N'>>,
  mms1To2Allocation: PoultryMMS1To2AllocationInputTransformed,
) => {
  const mnFromM10 = NTm10T2.multiply(
    mms1To2Allocation.manureWithLitter[mms2name],
  ).named(`MNm=${classNumber}T=2 from m10T=1`);
  const mnFromM11a = NTm11aT2.multiply(
    mms1To2Allocation.beltManureRemoval[mms2name],
  ).named(`MNm=${classNumber}T=2 from m11aT=1`);
  const mnFromM11b = NTm11bT2.multiply(
    mms1To2Allocation.manureStoredInStorage[mms2name],
  ).named(`MNm=${classNumber}T=2 from m11bT=1`);
  const MNmT2 = mnFromM10
    .plus(mnFromM11a)
    .plus(mnFromM11b)
    .named(`MNm=${classNumber}T=2`);

  return MNmT2.named(`MNm=${classNumber}T=2`);
};

const calculateNitrogenMNSoilForMMS2 = <C extends PoultryMMS2Type>(
  mms2name: C,
  classNumber: string,
  NTm10T2: Container<Mass<'N'>>,
  NTm11aT2: Container<Mass<'N'>>,
  NTm11bT2: Container<Mass<'N'>>,
  mms1To2Allocation: PoultryMMS1To2AllocationInputTransformed,
  PF: Container<RealNumber>,
  FracWETSoil: Container<RealNumber>,
  constants: ConstantsForGrainsCalculator,
) => {
  const MNmT2 = calculateNitrogenMNForMMS2(
    mms2name,
    classNumber,
    NTm10T2,
    NTm11aT2,
    NTm11bT2,
    mms1To2Allocation,
  );

  const FracLeach_MS = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE',
  ).named('FracLeachMMS');

  const MleachMMS = (
    mms2name === 'solidStorage'
      ? MNmT2.multiply(FracWETSoil).multiply(FracLeach_MS)
      : root(mass('N', 0))
  ).named(`Mleach,MMS,m=${classNumber}T=2`);
  const EFmT2 = selectConstant(constants.POULTRY, 'MMS', mms2name, 'EFm').named(
    `EFm=${classNumber}T=2`,
  );
  const FracGASMmT2 = selectConstant(
    constants.POULTRY,
    'MMS',
    mms2name,
    'FracGASM',
  ).named(`FracGASMm=${classNumber}T=2`);

  const netNitrogenMass = MNmT2.multiply(
    br(oneMinus(EFmT2).minus(FracGASMmT2)),
  ).minus(MleachMMS);

  return {
    scope1: netNitrogenMass
      .multiply(PF)
      .named(`MNSoil,m=${classNumber} (Scope 1)`),
    scope3: netNitrogenMass
      .multiply(oneMinus(PF))
      .named(`MNSoil,m=${classNumber} (Scope 3)`),
  };
};

const calculateNitrogenNTForMMS1 = <C extends PoultryMMS1Type>(
  name: C,
  classNumber: string,
  manures: PoultryClassResult[],
  constants: ConstantsForGrainsCalculator,
): Container<Mass<'N'>> => {
  const MNmT1 = sum(manures.map((m) => m[name])).named(`MNm=${classNumber}T=1`);
  const FracGASMmT1 = selectConstant(
    constants.POULTRY,
    'MMS',
    name,
    'FracGASM',
  ).named(`FracGASMm=${classNumber}T=1`);
  const EFmT1 = selectConstant(constants.POULTRY, 'MMS', name, 'EFm').named(
    `EFm=${classNumber}T=1`,
  );
  const NTmT2 = MNmT1.multiply(br(oneMinus(FracGASMmT1).minus(EFmT1))).named(
    `NTm=${classNumber}T=2`,
  );
  return NTmT2;
};

export function calculateMassOfNitrogenAppliedToSoilsForPoultry(
  manureInput: PoultryManureInputTransformed,
  crop: BaseGrainsCropTransformed,
  constants: ConstantsForGrainsCalculator,
) {
  /* 4.6.1.9 MANURE APPLIED TO SOILS
    The mass of nitrogen applied to soils for scope 1 emissions MNSoilscope1 (kg N) is
    calculated as:
    MNSoilscope1 = SUM SUM (MN jm T=2 * (1 - EF jm=1-13- FracGASM jm-1-13) - Mleach,MMS) * PF
    */

  /*

   */
  const { classes, fractionAppliedToSoils, mms1To2Allocation } = manureInput;

  const manureFromLayers = calculateForClass(classes.layers, constants);
  const manureFromMeatChickenGrowers = calculateForClass(
    classes.meatChickenGrowers,
    constants,
  );
  const manureFromMeatChickenBreeder = calculateForClass(
    classes.meatChickenBreeder,
    constants,
  );
  const manureFromMeatOther = calculateForClass(classes.meatOther, constants);

  const manuresT1 = [
    manureFromLayers,
    manureFromMeatChickenGrowers,
    manureFromMeatChickenBreeder,
    manureFromMeatOther,
  ];

  // TODO: Does this go straight to scope 1 result?
  const _MNPastureRangePaddock = sum(
    manuresT1.map((m) => m.pastureRangeAndPaddock),
  ).named('MNPastureRangePaddock');

  const NTm10T2 = calculateNitrogenNTForMMS1(
    'manureWithLitter',
    '10',
    manuresT1,
    constants,
  );
  const NTm11aT2 = calculateNitrogenNTForMMS1(
    'beltManureRemoval',
    '11a',
    manuresT1,
    constants,
  );
  const NTm11bT2 = calculateNitrogenNTForMMS1(
    'manureStoredInHouse',
    '11b',
    manuresT1,
    constants,
  );

  const PF = fractionAppliedToSoils;

  const FracWETSoil = (crop.isInLeachingZone ? num(1) : num(0)).named(
    'FracWETSoil',
  );
  const MNm4T2 = calculateNitrogenMNSoilForMMS2(
    'solidStorage',
    '4',
    NTm10T2,
    NTm11aT2,
    NTm11bT2,
    mms1To2Allocation,
    PF,
    FracWETSoil,
    constants,
  );
  const MNm6T2 = calculateNitrogenMNSoilForMMS2(
    'composting',
    '6',
    NTm10T2,
    NTm11aT2,
    NTm11bT2,
    mms1To2Allocation,
    PF,
    FracWETSoil,
    constants,
  );
  const MNm7T2 = calculateNitrogenMNSoilForMMS2(
    'digester',
    '7',
    NTm10T2,
    NTm11aT2,
    NTm11bT2,
    mms1To2Allocation,
    PF,
    FracWETSoil,
    constants,
  );
  const MNm12T2 = calculateNitrogenMNSoilForMMS2(
    'directProcessing',
    '12',
    NTm10T2,
    NTm11aT2,
    NTm11bT2,
    mms1To2Allocation,
    PF,
    FracWETSoil,
    constants,
  );
  // const MNm13T2 = calculateNitrogenMNForMMS2(
  //   'directApplication',
  //   '13',
  //   NTm10T2,
  //   NTm11aT2,
  //   NTm11bT2,
  //   mms1To2Allocation,
  //   PF,
  //   FracWETSoil,
  //   constants,
  // );
  const MNm13T2 = {
    scope1: calculateNitrogenMNForMMS2(
      'directApplication',
      '13',
      NTm10T2,
      NTm11aT2,
      NTm11bT2,
      mms1To2Allocation,
    ),
    scope3: root(mass('N', 0)).named('MNm=13T=2 (Scope 3)'),
  };

  const mmsSystemResults = [MNm4T2, MNm6T2, MNm7T2, MNm12T2, MNm13T2];

  return {
    scope1: sum(mmsSystemResults.map((result) => result.scope1)).named(
      'MNSoil (Scope 1)',
    ),
    scope3: sum(mmsSystemResults.map((result) => result.scope3)).named(
      'MNSoil (Scope 3)',
    ),
  };
}
