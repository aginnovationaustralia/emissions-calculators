import { BeefHerdInputTransformed } from '@/calculators/Beef/types/beef-herd.input';
import { BeefInputTransformed } from '@/calculators/Beef/types/input';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import {
  BeefClass,
  BeefClasses,
  extendedRegionToRegion,
  Season,
} from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { br, num, root } from '@/tools/containers';
import { daysInSeason, oneMinus } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { mass, massPerHeadPerDay } from '@/tools/units';
import { calculateDryMatterIntakeIijkln } from '../3-enteric-methane/3.2-beef-pasture';

const calculateTotalMethaneFromClassSeasonMmmSeason = (
  input: BeefInputTransformed,
  herd: BeefHerdInputTransformed,
  seasonName: Season,
  className: BeefClass,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const { climateZone, region } = input;
  const limitedRegion = extendedRegionToRegion(region);

  const { classes, method2Dmd, method2NoUnfencedNaturalWater } = herd;
  const classInput = classes[className];

  if (classInput === undefined) {
    return root(mass('CH4', 0)).named(`Mmm ${className} (empty)`);
  }

  const season = classInput[seasonName];

  const Nkln = season.head;

  const dmd = method2Dmd
    ? method2Dmd[seasonName]
    : selectConstant(constants.BEEF_PASTURE, 'DMD', limitedRegion, seasonName);

  const MMSm1 = method2NoUnfencedNaturalWater
    ? num(0).named('MMSm=1 (fenced)')
    : num(0.05).named('MMSm=1 (unfenced)');
  const MMSm14 = method2NoUnfencedNaturalWater
    ? num(1).named('MMSm=14 (fenced)')
    : num(0.95).named('MMSm=14 (unfenced)');
  const MCFm14 = selectConstant(constants.BEEF_PASTURE, 'MCF_PASTURE');

  const ashContentOfManureA = selectConstant(
    constants.COMMON,
    'ASH_CONTENT_OF_MANURE',
  ).named('A');

  const Iijkln = calculateDryMatterIntakeIijkln(
    input,
    classInput,
    seasonName,
    context,
  );

  // VSijkln = (Iijkln * (1 - DMDijk) + (0.04 * Iijkln)) * ( 1 - A ) -- line 425
  const VSijkln = br(
    Iijkln.multiply(oneMinus(dmd))
      .plus(Iijkln.multiply(num(0.04)))
      .switchUnit((u) => massPerHeadPerDay('Volatile Solids', u.value)),
  )
    .multiply(oneMinus(ashContentOfManureA))
    .named('VSijkln');

  // Mmijklnm = VSijkln * BO * MMSm * MCF m * 𝜌 -- line 405
  const Bo = selectConstant(
    constants.COMMON,
    'EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4',
  );
  const p = selectConstant(constants.COMMON, 'DENSITY_OF_METHANE');
  const MCFm1 = selectConstant(
    constants.BEEF_PASTURE,
    'MCF_LAGOON',
    climateZone,
  );

  const dailyMethanePerHeadMm1 = VSijkln.multiply(Bo)
    .multiply(MMSm1)
    .multiply(MCFm1)
    .multiply(p)
    .named(`Mmijklnm=1 (${className}, ${seasonName})`);

  const dailyMethanePerHeadMm14 = VSijkln.multiply(Bo)
    .multiply(MMSm14)
    .multiply(MCFm14)
    .multiply(p)
    .named(`Mmijklnm=14 (${className}, ${seasonName})`);

  const Mmm1 = dailyMethanePerHeadMm1
    .multiply(Nkln)
    .multiply(daysInSeason)
    .named(`Mmm=1 (${className}, ${seasonName})`);
  const Mmm14 = dailyMethanePerHeadMm14
    .multiply(Nkln)
    .multiply(daysInSeason)
    .named(`Mmm=14 (${className}, ${seasonName})`);

  return sum([Mmm1, Mmm14], { name: `Mmm (${className}, ${seasonName})` });
};

export const calculateManureManagementCH4ForClass = (
  input: BeefInputTransformed,
  herd: BeefHerdInputTransformed,
  className: BeefClass,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { classes } = herd;
  const classInput = classes[className];

  if (classInput === undefined) {
    return root(mass('CH4', 0)).named(`Mmm ${className} (empty)`);
  }

  const seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
  const totalMethaneFromClassMmmPerSeason = seasons.map((seasonName) =>
    calculateTotalMethaneFromClassSeasonMmmSeason(
      input,
      herd,
      seasonName,
      className,
      context,
    ),
  );

  return sum(totalMethaneFromClassMmmPerSeason, { name: `Mmm ${className}` });
};

export const calculateManureManagementCH4ForHerd = (
  input: BeefInputTransformed,
  herd: BeefHerdInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const classResults = BeefClasses.map((className) =>
    calculateManureManagementCH4ForClass(input, herd, className, context),
  );

  return sum(classResults, { name: 'Mmm (all classes)' });
};

export const calculateManureManagementCH4 = (
  input: BeefInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  const { herds } = input;
  const ch4EmissionsForHerds = herds.map((herd) =>
    calculateManureManagementCH4ForHerd(input, herd, context),
  );

  const Mmm = sum(ch4EmissionsForHerds, { name: 'Mmm (all herds)' });

  const GWPch4 = selectConstant(constants.COMMON, 'GWP_CH4');

  const EMch4 = Mmm.multiply(GWPch4, { name: 'EMch4' });

  return EMch4;
};

export const calculate41BeefPastureManure = (
  input: BeefInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  return {
    manureManagementCH4: calculateManureManagementCH4(input, context),
  };
};
