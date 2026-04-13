import {
  BeefClassWithCalvesInputTransformed,
  isBeefClassWithCalves,
} from '@/calculators/Beef/types/beef-class.input';
import { BeefSpecificClassInputTransformed } from '@/calculators/Beef/types/beef-classes.input';
import { BeefHerdInputTransformed } from '@/calculators/Beef/types/beef-herd.input';
import { BeefInputTransformed } from '@/calculators/Beef/types/input';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import {
  addRainfallToGrazingProductionSystem,
  BeefClasses,
  isWetClimateZone,
  Season,
  stateOrRegionToExtendedRegion,
  stateOrRegionToLimitedRegion,
  stateOrRegionToPureState,
} from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { br, Container, num, root } from '@/tools/containers';
import {
  daysInSeason,
  e,
  oneMinus,
  onePlus,
  tenToPowMinus4,
} from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  energyPerMass,
  Mass,
  mass,
  MassPerHeadPerDay,
  massPerHeadPerDay,
  RealNumber,
  realNumber,
} from '@/tools/units';
import {
  calculateAdditionalIntakeForMilkProductionMAijkl,
  calculateDryMatterIntakeIijkln,
  getMilkIntakeMC236,
  getProportionCowsGt2InCalfLC,
} from '../../3-enteric-methane/3.2-beef-pasture';

const calculateFaecalNitrogenExcretedFijkln = (
  input: BeefInputTransformed,
  herd: BeefHerdInputTransformed,
  classInput: BeefSpecificClassInputTransformed,
  calvingClassInput: BeefClassWithCalvesInputTransformed | undefined,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const className = classInput.name;
  const { region } = input;
  const limitedRegion = stateOrRegionToLimitedRegion(region);

  const Iijkln = calculateDryMatterIntakeIijkln(
    input,
    classInput,
    seasonName,
    context,
  );
  const CPijkln =
    herd.method2CrudeProteinContent?.[seasonName] ??
    selectConstant(
      constants.BEEF_PASTURE,
      'CP',
      limitedRegion,
      seasonName,
    ).named(`CPijkln ${seasonName}`);
  const DMDijk =
    herd.method2Dmd?.[seasonName] ??
    selectConstant(
      constants.BEEF_PASTURE,
      'DMD',
      limitedRegion,
      seasonName,
    ).named(`DMDijk ${seasonName}`);
  const MEijkl = num(0.1604)
    .multiply(DMDijk)
    .multiply(num(100))
    .minus(num(1.037))
    .switchUnit((r) => energyPerMass('DryMatter', r.value))
    .named(`MEijkl (${className})`);
  const MCijkl = getMilkIntakeMC236(
    calvingClassInput,
    seasonName,
    limitedRegion,
    context,
  );

  /*
    line 464
    Fijkln = [{0.3 * Iijkln * CPijkln * (1 - (DMDijk + 0.1)) + (0.105 * MEijkl * Iijkln * 0.008) + (0.0152 * Iijkln)} / 6.25] + (0.08 * 0.032 * MCijkl=236 / 6.38)
  */

  return br(
    br(
      num(0.3)
        .multiply(Iijkln)
        .multiply(CPijkln)
        .multiply(oneMinus(DMDijk.plus(num(0.1))))
        .plus(
          num(0.105)
            .multiply(MEijkl)
            .switchUnit((r) => realNumber(r.value))
            .multiply(Iijkln)
            .multiply(num(0.008)),
        )
        .plus(num(0.0152).multiply(Iijkln)),
    )
      .divide(num(6.25))
      .switchUnit((t) => massPerHeadPerDay('N', t.value)),
  )
    .plus(
      num(0.08)
        .multiply(num(0.032).multiply(MCijkl).divide(num(6.38)))
        .switchUnit((t) => massPerHeadPerDay('N', t.value)),
    )
    .named(`Fijkln (${className}, ${seasonName})`);
};

// NOTE: Slightly different from the dairy version. The units on MP are different, mass vs volume / head / day
const calculateNitrogenRetainedByBodyNRj = (
  MPijkln: Container<MassPerHeadPerDay<'Milk'>>,
  Lj: Container<RealNumber>,
  LWGj: Container<MassPerHeadPerDay<'Liveweight'>>,
  Zj: Container<RealNumber>,
): Container<MassPerHeadPerDay<'N'>> => {
  // Ch 4.2 line 755
  const retainedFromMilkProduction = br(
    num(0.032).multiply(MPijkln).divide(num(6.38)),
  ).switchUnit((t) => massPerHeadPerDay('N', t.value));

  const retainedFromGrowth = br(
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
  )
    .divide(num(6.25))
    .switchUnit((t) => massPerHeadPerDay('N', t.value));

  const NRj: Container<MassPerHeadPerDay<'N'>> =
    retainedFromMilkProduction.plus(retainedFromGrowth);

  return NRj;
};

const calculateIntakeRelativeToMaintenanceLj = (
  Ij: Container<MassPerHeadPerDay<'DryMatter'>>,
  Wj: Container<Mass<'Liveweight'>>,
  MAj: Container<MassPerHeadPerDay<'DryMatter'>>,
): Container<RealNumber> => {
  // Ch 4.2 line 767

  const denominator: Container<MassPerHeadPerDay<'DryMatter'>> = br(
    num(1.185)
      .plus(num(0.00454).multiply(Wj))
      .minus(num(0.0000026).multiply(Wj.squared()))
      .squared()
      .switchUnit((r) => realNumber(r.value)),
  ).multiply(MAj);

  const Lj: Container<RealNumber> = Ij.divide(denominator).named('Lj');

  return Lj;
};

const calculateUrinaryNitrogenExcretedUijkln = (
  input: BeefInputTransformed,
  herd: BeefHerdInputTransformed,
  classInput: BeefSpecificClassInputTransformed,
  calvingClassInput: BeefClassWithCalvesInputTransformed | undefined,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const { region } = input;
  const limitedRegion = stateOrRegionToLimitedRegion(region);
  const extendedRegion = stateOrRegionToExtendedRegion(region);
  const state = stateOrRegionToPureState(region);
  const className = classInput.name;

  const seasonInput = classInput[seasonName];
  const Wijkln =
    seasonInput.method2Liveweight ??
    selectConstant(
      constants.BEEF_PASTURE,
      'LIVEWEIGHT',
      extendedRegion,
      className,
      seasonName,
      'liveweight',
    ).named(`Wijkln (${className}, ${seasonName})`);
  const LWGijkln =
    seasonInput.method2LiveweightGain ??
    selectConstant(
      constants.BEEF_PASTURE,
      'LIVEWEIGHT',
      extendedRegion,
      className,
      seasonName,
      'liveweightGain',
    ).named(`LWGijkln (${className}, ${seasonName})`);
  const Iijkln = calculateDryMatterIntakeIijkln(
    input,
    classInput,
    seasonName,
    context,
  );
  const CPijkl =
    herd.method2CrudeProteinContent?.[seasonName] ??
    selectConstant(
      constants.BEEF_PASTURE,
      'CP',
      limitedRegion,
      seasonName,
    ).named(`CPijkl ${seasonName}`);
  const MCijkl = getMilkIntakeMC236(
    calvingClassInput,
    seasonName,
    limitedRegion,
    context,
  );

  const LCijkl = getProportionCowsGt2InCalfLC(classInput, seasonName);

  const DMPijkl = isBeefClassWithCalves(classInput)
    ? getMilkIntakeMC236(classInput, seasonName, limitedRegion, context)
    : root(massPerHeadPerDay('Milk', 0)).named('DMPijkl');

  const MPijkl = LCijkl.multiply(DMPijkl).named('MPijkl');
  const MAijkl = calculateAdditionalIntakeForMilkProductionMAijkl(
    classInput,
    className,
    seasonName,
  );
  const Lijkln = calculateIntakeRelativeToMaintenanceLj(Iijkln, Wijkln, MAijkl);
  const WRil = selectConstant(
    constants.BEEF_PASTURE,
    'REFERENCE_WEIGHT',
    state,
    className,
  ).named(`WRil ${className}`);
  const Zijkln = Wijkln.divide(WRil).named('Zijkln');

  const NRijkln = calculateNitrogenRetainedByBodyNRj(
    MPijkl,
    Lijkln,
    LWGijkln,
    Zijkln,
  ).named(`NRijkln (${className}, ${seasonName})`);
  const Fijkln = calculateFaecalNitrogenExcretedFijkln(
    input,
    herd,
    classInput,
    calvingClassInput,
    seasonName,
    context,
  );

  /*
    line 486
    Uijkln = (Iijkln * CPijkl ÷ 6.25) + (0.032 * MCijkl=5 ÷ 6.38) - NRijkln - Fijkln - [(1.1 * 10^-4 * Wijkln ^ 0.75) ÷ 6.25]
  */

  const Uijkln = br(Iijkln.multiply(CPijkl).divide(num(6.25)))
    .switchUnit((r) => massPerHeadPerDay('N', r.value))
    .plus(
      br(num(0.032).multiply(MCijkl).divide(num(6.38))).switchUnit((r) =>
        massPerHeadPerDay('N', r.value),
      ),
    )
    .minus(NRijkln)
    .minus(Fijkln)
    .minus(
      br(
        num(1.1)
          .multiply(tenToPowMinus4)
          .multiply(Wijkln.power(num(0.75)))
          .divide(num(6.25)),
      ).switchUnit((r) => massPerHeadPerDay('N', r.value)),
    );

  return Uijkln.named(`Uijkln (${className}, ${seasonName})`);
};

const calculateExcretedNitrogenForClass = (
  input: BeefInputTransformed,
  herd: BeefHerdInputTransformed,
  classInput: BeefSpecificClassInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const calvingClassInput = ['1', '3', '6'].includes(classInput.number)
    ? herd.classes.cows2To3Years
    : undefined;
  const className = classInput.name;
  const seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
  const totalNitrogenExcretedPerSeason = seasons.map((seasonName) => {
    const seasonInput = classInput[seasonName];
    const Nkln = seasonInput.head.named(`Nkln (${className}, ${seasonName})`);

    const AFi = calculateFaecalNitrogenExcretedFijkln(
      input,
      herd,
      classInput,
      calvingClassInput,
      seasonName,
      context,
    );
    const AUi = calculateUrinaryNitrogenExcretedUijkln(
      input,
      herd,
      classInput,
      calvingClassInput,
      seasonName,
      context,
    );

    return {
      AFi: AFi.multiply(Nkln)
        .multiply(daysInSeason)
        .named(`AFi (${className}, ${seasonName})`),
      AUi: AUi.multiply(Nkln)
        .multiply(daysInSeason)
        .named(`AUi (${className}, ${seasonName})`),
    };
  });
  return {
    AFi: sum(totalNitrogenExcretedPerSeason.map((result) => result.AFi)).named(
      `AFi ${className}`,
    ),
    AUi: sum(totalNitrogenExcretedPerSeason.map((result) => result.AUi)).named(
      `AUi ${className}`,
    ),
  };
};

const calculateExcretedNitrogenForHerd = (
  input: BeefInputTransformed,
  herd: BeefHerdInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { classes } = herd;
  const classResults = BeefClasses.map((className) => {
    const classInput = classes[className];
    if (classInput === undefined) {
      return {
        AFi: root(mass('N', 0)).named(`AFi ${className} (empty)`),
        AUi: root(mass('N', 0)).named(`AUi ${className} (empty)`),
      };
    }
    return calculateExcretedNitrogenForClass(input, herd, classInput, context);
  });

  return {
    AFi: sum(classResults.map((result) => result.AFi)).named('AFi'),
    AUi: sum(classResults.map((result) => result.AUi)).named('AUi'),
  };
};

const calculateManureManagementN2ODirectForHerd = (
  input: BeefInputTransformed,
  herd: BeefHerdInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
    line 442:
    EMN2O,dir = {(AFi * EFPRP * Cg,N2O) + (AUi * EFPRP * Cg,N2O)} * GWPN2O * 10^-3
    Where AFi = total mass of faecal nitrogen excreted on pasture, range and paddock for beef cattle (kgN)
    EFPRP = emission factor for nitrous oxide emissions per amount of urine and dung deposited (kgN2O-N/kgN deposited)
    AUi = total mass of urinary nitrogen excreted on pasture, range and paddock for beef cattle (kgN)
    GWPN2O = GWP of nitrous oxide to convert tN2O to tCO2e
    Cg,N2O = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
*/
  const { AFi, AUi } = calculateExcretedNitrogenForHerd(input, herd, context);
  const wetOrDry = isWetClimateZone(input.climateZone) ? 'wet' : 'dry';
  const EFPRP = selectConstant(constants.BEEF_PASTURE, 'EFPRP', wetOrDry).named(
    `EFPRP ${wetOrDry}`,
  );

  // const GWPN2O = selectConstant(constants.COMMON, 'GWP_FACTORSC6').named(
  //   'GWPN2O',
  // );
  const cgn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named(
    'Cg,N2O',
  );

  const EMN2Odir = AFi.multiply(EFPRP)
    .multiply(cgn2o)
    .plus(AUi.multiply(EFPRP).multiply(cgn2o));
  // .multiply(GWPN2O)
  // .multiply(tenToPowMinus3);
  return EMN2Odir;
};

const calculateManureManagementN2OAtmosphericDepositionForHerd = (
  input: BeefInputTransformed,
  herd: BeefHerdInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
    line 524
    EN2O,ad = Mvol * EFad * Cg,N2O * 10^-3
    Mvol = mass of nitrogen volatilised from urine and faeces deposited on pasture (kgN)
    EFad = emission factor for atmospheric deposition (kgN2O-N/kgN)
*/
  const { AFi, AUi } = calculateExcretedNitrogenForHerd(input, herd, context);
  const fracGASMsoil = selectConstant(
    constants.CROP,
    'FRACTION_N_VOLATILISED_ORGANIC_FERTILISER',
  );
  // line 530
  const Mvol = AUi.plus(AFi).multiply(fracGASMsoil).named('Mvol');
  const cgn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named(
    'Cg,N2O',
  );
  const EFad = selectConstant(
    constants.BEEF_PASTURE,
    'EF_ATMOSPHERIC_DEPOSITION',
    addRainfallToGrazingProductionSystem(
      input.grazingSystem,
      input.rainfallAbove600,
    ),
  ).named(
    `EFad ${input.grazingSystem} ${input.rainfallAbove600 ? 'high rainfall' : 'low rainfall'}`,
  );
  return Mvol.multiply(EFad).multiply(cgn2o); //.multiply(tenToPowMinus3);
};

const calculateManureManagementN2OLeachingAndRunoffForHerd = (
  input: BeefInputTransformed,
  herd: BeefHerdInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const { AFi, AUi } = calculateExcretedNitrogenForHerd(input, herd, context);
  const fracWetSoil = selectConstant(
    constants.BEEF_PASTURE,
    'FRAC_WET_SOIL',
    input.region,
  ).named('FracWETSoil');
  const fracLeach = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
  ).named('FracLeach');
  const Mleach = AUi.plus(AFi)
    .multiply(fracWetSoil)
    .multiply(fracLeach)
    .named('Mleach');
  const EFleach = selectConstant(
    constants.CROP,
    'EF_N2O_LEACHING_AND_RUNOFF',
  ).named('EFleach');
  const cgn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named(
    'Cg,N2O',
  );
  /*
    line 535
    EN2O,leach = Mleach * EFleach * Cg,N2O * 10^-3
    Mleach = mass of nitrogen lost to leaching and runoff (kgN)
    EFleach = emission factor for leaching and runoff (kgN2O-N/kgN)
*/
  const EN2Oleach = Mleach.multiply(EFleach)
    .multiply(cgn2o)
    // .multiply(tenToPowMinus3)
    .named('EN2O,leach');
  return EN2Oleach;
};

export const calculateManureManagementN2OForHerd = (
  input: BeefInputTransformed,
  herd: BeefHerdInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
      line 437:
      EMN2O = EN2O,dir + EN2O,ad + EN2O,leach
      EN2O,dir = direct nitrous oxide emissions on pasture (tCO2e)
      EN2O,ad = atmospheric deposition nitrous oxide emissions on pasture (tCO2e)
      EN2O,leach = leaching and runoff nitrous oxide emissions on pasture (tCO2e)
  */
  const EN2Odir = calculateManureManagementN2ODirectForHerd(
    input,
    herd,
    context,
  ).named('EN2O,dir');
  const EN2Oad = calculateManureManagementN2OAtmosphericDepositionForHerd(
    input,
    herd,
    context,
  ).named('EN2O,ad');
  const EN2Oleach = calculateManureManagementN2OLeachingAndRunoffForHerd(
    input,
    herd,
    context,
  ).named('EN2O,leach');
  return EN2Odir.plus(EN2Oad).plus(EN2Oleach).named('EMN2O');
};

export const calculateManureManagementN2O = (
  input: BeefInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { herds } = input;
  const n2oEmissionsForHerds = herds.map((herd) =>
    calculateManureManagementN2OForHerd(input, herd, context),
  );

  return sum(n2oEmissionsForHerds).named('EMN2O');
};
