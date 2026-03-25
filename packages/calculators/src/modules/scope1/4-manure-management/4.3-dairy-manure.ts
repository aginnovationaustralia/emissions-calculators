import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { selectConstant } from '@/tools/constants';
import { br, Container, num, root } from '@/tools/containers';
import {
  daysInYear,
  daysPostWeaning,
  daysPreWeaning,
  e,
  oneMinus,
  onePlus,
  tenToPowMinus4,
} from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  energyPerMass,
  EnergyPerMass,
  Head,
  head,
  mass,
  Mass,
  massPerEnergy,
  MassPerHeadPerDay,
  massPerHeadPerDay,
  realNumber,
  RealNumber,
  volumePerHeadPerDay,
  VolumePerHeadPerDay,
} from '@/tools/units';
import {
  DairyManureInputTransformed,
  DairyMilkInputTransformed,
  DairySpecificClassInput,
  isMilkVolumeBased,
} from './dairy-manure.input';

const mmsSystems = [
  { name: 'anaerobicLagoon', m: '1' },
  { name: 'sumpDispersal', m: '3a' },
  { name: 'drainToPaddock', m: '3b' },
  { name: 'solidStorage', m: '4' },
] as const;

const calculateMilkProduction = (
  input: DairyMilkInputTransformed,
): Container<VolumePerHeadPerDay<'Milk'>> => {
  if (isMilkVolumeBased(input)) {
    return input.litresPerHeadPerDay;
  }

  const { kgSolidsPerHeadPerDay, fatContent, proteinContent } = input;

  //@ts-expect-error Erasure of units
  const litresPerHeadPerDay: Container<VolumePerHeadPerDay<'Milk'>> =
    kgSolidsPerHeadPerDay.divide(
      num(0.01).multiply(fatContent.plus(proteinContent)),
    );

  return litresPerHeadPerDay;
};

const calculateIntakeRelativeToMaintenanceLj = (
  Ij: Container<MassPerHeadPerDay<'DryMatter'>>,
  Wj: Container<Mass<'Liveweight'>>,
  MRj: Container<MassPerHeadPerDay<'DryMatter'>>,
  MIj: Container<MassPerHeadPerDay<'DryMatter'>>,
): Container<RealNumber> => {
  // Ch 4.2 line 767

  const denominator: Container<MassPerHeadPerDay<'DryMatter'>> = br(
    num(1.185)
      .plus(num(0.00454).multiply(Wj))
      .minus(num(0.0000026).multiply(Wj.squared()))
      .squared()
      .switchUnit((r) => realNumber(r.value)),
  )
    .multiply(MRj)
    .plus(MIj);

  const Lj: Container<RealNumber> = Ij.divide(denominator).named('Lj');

  return Lj;
};

type DairyClassResult = {
  F: Container<MassPerHeadPerDay<'N'>>;
  U: Container<MassPerHeadPerDay<'N'>>;
  N: Container<Head>;
};

const calculateFeedIntakeIj = (
  Wj: Container<Mass<'Liveweight'>>,
  LWGj: Container<MassPerHeadPerDay<'Liveweight'>>,
  MRj: Container<MassPerHeadPerDay<'DryMatter'>>,
  MIj: Container<MassPerHeadPerDay<'DryMatter'>>,
): Container<MassPerHeadPerDay<'DryMatter'>> => {
  // Ij: Ch 3.3 line 226

  const intakeForWeightGain: Container<MassPerHeadPerDay<'DryMatter'>> = br(
    num(1.185)
      .plus(num(0.00454).multiply(Wj))
      .minus(num(0.0000026).multiply(Wj.squared()))
      //@ts-expect-error Erasure of units, converting liveweight and liveweight gain to intake of dry matter
      .plus(num(0.315).multiply(LWGj)),
  )
    .squared()
    .switchUnit((r) => realNumber(r.value))
    .multiply(MRj);

  const Ij: Container<MassPerHeadPerDay<'DryMatter'>> =
    intakeForWeightGain.plus(MIj);

  return Ij;
};

const calculateNitrogenRetainedByBodyNRj = (
  MPj: Container<VolumePerHeadPerDay<'Milk'>>,
  Lj: Container<RealNumber>,
  LWGj: Container<MassPerHeadPerDay<'Liveweight'>>,
  Zj: Container<RealNumber>,
): Container<MassPerHeadPerDay<'N'>> => {
  // Ch 4.2 line 755
  //@ts-expect-error Erasure of units, converting milk production to nitrogen retained by the body
  const retainedFromMilkProduction: Container<MassPerHeadPerDay<'N'>> = br(
    num(0.032).multiply(MPj).multiply(num(1.03)).divide(num(6.38)),
  );

  //@ts-expect-error Erasure of units, converting liveweight gain to nitrogen retained by the body
  const retainedFromGrowth: Container<MassPerHeadPerDay<'N'>> = br(
    br(
      num(0.212)
        .minus(num(0.008).multiply(br(Lj.minus(num(2)))))
        .minus(
          br(
            num(0.14)
              .minus(num(0.008).multiply(br(Lj.minus(num(2)))))
              .divide(onePlus(e.power(num(-6).multiply(Zj.minus(num(0.4)))))),
          ),
        ),
    ).multiply(br(LWGj.multiply(num(0.92)))),
  ).divide(num(6.25));

  const NRj: Container<MassPerHeadPerDay<'N'>> =
    retainedFromMilkProduction.plus(retainedFromGrowth);

  return NRj;
};

const calculateNitrogenExcretedInFaecesFj = (
  CPIj: Container<MassPerHeadPerDay<'DryMatter'>>,
  DMDj: Container<RealNumber>,
  MEj: Container<EnergyPerMass<'DryMatter'>>,
  Ij: Container<MassPerHeadPerDay<'DryMatter'>>,
): Container<MassPerHeadPerDay<'N'>> => {
  // Ch 4.2 line 730
  const Fj: Container<MassPerHeadPerDay<'N'>> = br(
    num(0.3)
      .multiply(br(CPIj.multiply(br(oneMinus(br(DMDj.plus(num(0.1))))))))
      .plus(
        num(0.105).multiply(
          br(
            MEj.switchUnit((r) => realNumber(r.value))
              .multiply(Ij)
              .multiply(num(0.008)),
          ),
        ),
      )
      .plus(num(0.0152).multiply(Ij)),
  )
    .divide(num(6.25))
    .switchUnit((r) => massPerHeadPerDay('N', r.value));

  return Fj;
};

const calculateNitrogenExcretedInUrineUj = (
  CPIj: Container<MassPerHeadPerDay<'DryMatter'>>,
  NRj: Container<MassPerHeadPerDay<'N'>>,
  Fj: Container<MassPerHeadPerDay<'N'>>,
  Wj: Container<Mass<'Liveweight'>>,
): Container<MassPerHeadPerDay<'N'>> => {
  // Ch 4.2 line 750
  const Uj: Container<MassPerHeadPerDay<'N'>> = br(CPIj.divide(num(6.25)))
    .switchUnit((r) => massPerHeadPerDay('N', r.value))
    .minus(NRj)
    .minus(Fj)
    .minus(
      br(
        num(1.1)
          .multiply(tenToPowMinus4)
          .multiply(Wj.power(num(0.75)))
          .divide(num(6.25)),
      ).switchUnit((r) => massPerHeadPerDay('N', r.value)),
    );

  return Uj;
};
const calculateForClass = (
  dairyClass: DairySpecificClassInput | undefined,
  MIj: Container<MassPerHeadPerDay<'DryMatter'>>,
  MPj: Container<VolumePerHeadPerDay<'Milk'>>,
  constants: ConstantsForGrainsCalculator,
): DairyClassResult => {
  if (!dairyClass) {
    return {
      F: root(massPerHeadPerDay('N', 0)),
      U: root(massPerHeadPerDay('N', 0)),
      N: root(head(0)),
    };
  }

  const className = dairyClass.name;
  const classNumber = dairyClass.number;

  const Wj =
    dairyClass.method2Liveweight ??
    selectConstant(
      constants.DAIRY,
      'CLASS_WEIGHTS',
      className,
      'liveweight',
    ).named(`Wj=${classNumber}`);

  const LWGj =
    dairyClass.method2LiveweightGain ??
    selectConstant(
      constants.DAIRY,
      'CLASS_WEIGHTS',
      className,
      'liveweightGain',
    ).named(`LWGj=${classNumber}`);

  const WRj = selectConstant(
    constants.DAIRY,
    'CLASS_WEIGHTS',
    className,
    'referenceWeight',
  ).named(`WRj=${classNumber}`);

  const Zj = Wj.divide(WRj).named(`Zj=${classNumber}`);

  // Ch 4.2 line 769
  const MRj = selectConstant(
    constants.DAIRY,
    'INCREASE_METABOLIC_RATE_FOR_MILK',
    className === 'milkingCows' ? 'milkingCows' : 'others',
  ).named('MRj');

  const Ij = calculateFeedIntakeIj(Wj, LWGj, MRj, MIj).named(
    `Ij=${classNumber}`,
  );

  // Ch 4.2 line 767
  const Lj = calculateIntakeRelativeToMaintenanceLj(Ij, Wj, MRj, MIj).named(
    `Lj=${classNumber}`,
  );

  // Ch 4.2 line 755
  const NRj = calculateNitrogenRetainedByBodyNRj(MPj, Lj, LWGj, Zj).named(
    `NRj=${classNumber}`,
  );

  const CPj =
    dairyClass.method2CrudeProteinContent ??
    selectConstant(constants.DAIRY, 'CRUDE_PROTEIN_CONTENT_OF_FEED').named(
      'CPj',
    );

  const CPIj: Container<MassPerHeadPerDay<'DryMatter'>> = Ij.multiply(
    CPj,
  ).named(`CPIj=${classNumber}`);

  const DMDj =
    dairyClass.method2DryMatterDigestibility ??
    selectConstant(constants.DAIRY, 'DRY_MATTER_DIGESTIBILITY').named('DMDj');

  // Ch 4.2 line 737
  const MEj: Container<EnergyPerMass<'DryMatter'>> = num(0.1604)
    .multiply(DMDj)
    .multiply(num(100))
    .minus(num(1.037))
    .switchUnit((r) => energyPerMass('DryMatter', r.value))
    .named(`MEj=${classNumber}`);

  // Ch 4.2 line 730
  const Fj = calculateNitrogenExcretedInFaecesFj(CPIj, DMDj, MEj, Ij).named(
    `Fj=${classNumber}`,
  );

  // Ch 4.2 line 750
  const Uj = calculateNitrogenExcretedInUrineUj(CPIj, NRj, Fj, Wj).named(
    `Uj=${classNumber}`,
  );

  return {
    U: Uj,
    F: Fj,
    N: dairyClass.head,
  };
};

const calculateExtraIntakeForMilkProductionMIj = (
  MPj: Container<VolumePerHeadPerDay<'Milk'>>,
  DMDj: Container<RealNumber>,
  constants: ConstantsForGrainsCalculator,
): Container<MassPerHeadPerDay<'DryMatter'>> => {
  // Ch 3.3 line 234
  // line 278
  const NE = selectConstant(
    constants.DAIRY,
    'NET_ENERGY_FOR_MILK_PRODUCTION',
  ).named('NE');
  // line 279
  const GEC = selectConstant(constants.DAIRY, 'GROSS_ENERGY_CONTENT').named(
    'GEC',
  );
  // line 281
  const k = selectConstant(
    constants.DAIRY,
    'EFFICIENCY_OF_MILK_PRODUCTION',
  ).named('k');

  const qmj = num(0.795).multiply(DMDj).minus(num(0.0014)).named('qmj');

  return MPj.multiply(num(1.03))
    .switchUnit((r) => massPerEnergy('Milk', r.value))
    .multiply(NE)
    .divide(
      GEC.multiply(k)
        .multiply(qmj)
        .switchUnit((r) => realNumber(r.value)),
    )
    .switchUnit((r) => massPerHeadPerDay('DryMatter', r.value))
    .named('MIj');
};

const sumNValues = (results: DairyClassResult[]): Container<Head> => {
  const nValues = results.map((result) => result.N);
  return sum(nValues);
};

const sumFValues = (
  results: DairyClassResult[],
): Container<MassPerHeadPerDay<'N'>> => {
  const fValues = results.map((result) => result.F);
  return sum(fValues);
};

const sumUValues = (
  results: DairyClassResult[],
): Container<MassPerHeadPerDay<'N'>> => {
  const uValues = results.map((result) => result.U);
  return sum(uValues);
};

export function calculateMassOfNitrogenAppliedToSoilsForDairy(
  manureInput: DairyManureInputTransformed,
  crop: BaseGrainsCropTransformed,
  constants: ConstantsForGrainsCalculator,
) {
  /* 4.5.1.5 MANURE APPLIED TO SOILS
    To calculate the mass of nitrogen applied to soils MNSoil (kgN) the following equation can
    be used:
    MNSoil = SUM SUM (AUMMS,m=1-13 + AFMMS,m=1-13) * (1 - EF jm=1-13- FracGASMjm-1-13) - Mleach,MMS) * PF
    */

  /*
  F j=1-6 = {0.3 * (CPIj=1-6 * (1 - (DMDij=1-6 + 0.1)) + 0.105 * (MEj=1-6 * Ij=1-6 * 0.008) + (0.0152 * Ij=1-6)} * 1 / 6.25
  AFMMS,m=1-13 = SUM ((N j=1,2,4,6 * Fij=1,2,4,6 * 365) + (N j=3,5 * Fij=3,5 * 281) + (N j=7,8 * FPW j=7,8 * 84)) * fim=1-13
  AUMMS,m=1-13 = SUM ((N j=1,2,4 * Uj=1,2,4 * 365) + (N j=3,5 * Uj=3,5 * 281) + (N j=3,5 * UPW j=3,5 * 84)) *fim=1-13
  Mleach,MMS,m=4 = (AUMMS,m=4 + AFMMS,m=4) * FracWET,soil,i * FracLEACH_MS
   */
  const {
    classes,
    fractionAppliedToSoils,
    milkProduction,
    system,
    method2TimeSpentOnFeedpad,
    method2TimeSpentOnMilkingShed,
    milkingShedMMSAllocation,
    feedPadMMSAllocation,
  } = manureInput;

  // const fmPasture = selectConstant(
  //   constants.DAIRY,
  //   'TIME_IN_LOCATIONS',
  //   system,
  //   'pasture',
  // ).named('fmPasture');
  const fmMilkingShed =
    method2TimeSpentOnMilkingShed ??
    selectConstant(
      constants.DAIRY,
      'TIME_IN_LOCATIONS',
      system,
      'milkingShed',
    ).named('fmMilkingShed');
  const fmFeedPad =
    method2TimeSpentOnFeedpad ??
    selectConstant(
      constants.DAIRY,
      'TIME_IN_LOCATIONS',
      system,
      'feedPad',
    ).named('fmFeedPad');

  const FracWETSoil = (crop.isInLeachingZone ? num(1) : num(0)).named(
    'FracWETSoil',
  );
  const FracLEACH_MS = selectConstant(constants.DAIRY, 'FracLEACH').named(
    'FracLEACH_MS',
  );

  const DMDj =
    classes.milkingCows.method2DryMatterDigestibility ??
    selectConstant(constants.DAIRY, 'DRY_MATTER_DIGESTIBILITY').named('DMDj');

  const MPj = calculateMilkProduction(milkProduction).named(`MPj=1`);
  const MPj0 = root(volumePerHeadPerDay('Milk', 0)).named(`MPj0`);
  const MIj: Container<MassPerHeadPerDay<'DryMatter'>> =
    calculateExtraIntakeForMilkProductionMIj(MPj, DMDj, constants).named(
      'MIj=1',
    );
  const MIj0 = root(massPerHeadPerDay('DryMatter', 0)).named('MIj0');

  const milkingCowsResults1 = calculateForClass(
    classes.milkingCows,
    MIj,
    MPj,
    constants,
  );
  const heifersGt1Results2 = calculateForClass(
    classes.heifersGt1,
    MIj0,
    MPj0,
    constants,
  );
  const heifersLt1Results3 = calculateForClass(
    classes.heifersLt1,
    MIj0,
    MPj0,
    constants,
  );
  const bullsGt1Results4 = calculateForClass(
    classes.bullsGt1,
    MIj0,
    MPj0,
    constants,
  );
  const bullsLt1Results5 = calculateForClass(
    classes.bullsLt1,
    MIj0,
    MPj0,
    constants,
  );

  const results124 = [
    milkingCowsResults1,
    heifersGt1Results2,
    bullsGt1Results4,
  ];
  const results1246 = [
    milkingCowsResults1,
    heifersGt1Results2,
    bullsGt1Results4,
  ];
  const results35 = [heifersLt1Results3, bullsLt1Results5];
  // const results78: DairyClassResult[] = [];

  const Nj1246 = sumNValues(results1246).named('Nj=1,2,4,6');
  const Fij1246 = sumFValues(results1246).named('Fij=1,2,4,6');
  const Nj124 = sumNValues(results124).named('Nj=1,2,4');
  const Nj35 = sumNValues(results35).named('Nj=3,5');
  const Fij35 = sumFValues(results35).named('Fij=3,5');
  const Nj78 = root(head(0)).named('Nj=7,8');

  const Uj124 = sumUValues(results124).named('Uj=1,2,4');
  const Uj35 = sumUValues(results35).named('Uj=3,5');

  const FPWj7 = selectConstant(
    constants.DAIRY,
    'PRE_WEANED_CLASSES',
    'heifersLt1',
    'faecalN',
  ).named('FPWj7');
  const FPWj8 = selectConstant(
    constants.DAIRY,
    'PRE_WEANED_CLASSES',
    'bullsLt1',
    'faecalN',
  ).named('FPWj8');
  const FPWj78 = FPWj7.plus(FPWj8).named('FPWj=7,8');

  const UPWj3 = selectConstant(
    constants.DAIRY,
    'PRE_WEANED_CLASSES',
    'heifersLt1',
    'urinaryN',
  ).named('UPWj3');
  const UPWj5 = selectConstant(
    constants.DAIRY,
    'PRE_WEANED_CLASSES',
    'bullsLt1',
    'urinaryN',
  ).named('UPWj5');
  const UPWj35 = UPWj3.plus(UPWj5).named('UPWj=3,5');

  const faecalNitrogenExcreted = br(
    Fij1246.multiply(Nj1246).multiply(daysInYear),
  )
    .plus(br(Fij35.multiply(Nj35).multiply(daysPostWeaning)))
    .plus(br(FPWj78.multiply(Nj78).multiply(daysPreWeaning)));

  const urinaryNitrogenExcreted = br(Uj124.multiply(Nj124).multiply(daysInYear))
    .plus(br(Uj35.multiply(Nj35).multiply(daysPostWeaning)))
    .plus(br(UPWj35.multiply(Nj35).multiply(daysPreWeaning)));

  const pf = fractionAppliedToSoils;

  const mmsSystemResults = mmsSystems.map((mmsSystem) => {
    const milkingShedAllocation = milkingShedMMSAllocation[mmsSystem.name];
    const feedPadAllocation = feedPadMMSAllocation[mmsSystem.name];

    const fim = fmMilkingShed
      .multiply(milkingShedAllocation)
      .plus(fmFeedPad.multiply(feedPadAllocation))
      .named(`fim=${mmsSystem.m}`);
    const AUmms = urinaryNitrogenExcreted
      .multiply(fim)
      .named(`AUmms,m=${mmsSystem.m}`);
    const AFmms = faecalNitrogenExcreted
      .multiply(fim)
      .named(`AFmms,m=${mmsSystem.m}`);
    const MleachMMS = (
      mmsSystem.name === 'solidStorage'
        ? br(AUmms.plus(AFmms)).multiply(FracWETSoil).multiply(FracLEACH_MS)
        : root(mass('N', 0))
    ).named(`Mleach,MMS,m=${mmsSystem.m}`);
    const EFjm = selectConstant(
      constants.DAIRY,
      'MMS',
      mmsSystem.name,
      'EFm',
    ).named(`EFjm=${mmsSystem.m}`);
    const FracGASMjm = selectConstant(
      constants.DAIRY,
      'MMS',
      mmsSystem.name,
      'FracGASM',
    ).named(`FracGASMjm=${mmsSystem.m}`);

    const netNitrogenMass = br(AUmms.plus(AFmms))
      .multiply(br(oneMinus(EFjm).minus(FracGASMjm)))
      .minus(MleachMMS);

    return {
      scope1: netNitrogenMass
        .multiply(pf)
        .named(`MNSoil,m=${mmsSystem.m} (Scope 1)`),
      scope3: netNitrogenMass
        .multiply(oneMinus(pf))
        .named(`MNSoil,m=${mmsSystem.m} (Scope 3)`),
    };
  });

  return {
    scope1: sum(mmsSystemResults.map((result) => result.scope1)).named(
      'MNSoil (Scope 1)',
    ),
    scope3: sum(mmsSystemResults.map((result) => result.scope3)).named(
      'MNSoil (Scope 3)',
    ),
  };
}
