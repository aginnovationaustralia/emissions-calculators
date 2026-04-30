import { entriesFromObject } from '@/calculators/common/tools';
import {
  DairyClassInputTransformed,
  isClassMature,
  isClassPreWeaned,
} from '@/calculators/Dairy/types/dairy-class.input';
import { DairyHerdInputTransformed } from '@/calculators/Dairy/types/herd.input';
import { DairyInputTransformed } from '@/calculators/Dairy/types/input';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { Container, num, root } from '@/tools/containers';
import {
  daysInYear,
  daysPostWeaning,
  daysPreWeaning,
  tenToPowMinus3,
} from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { massPerHeadPerDay, MassPerHeadPerDay } from '@/tools/units';
import {
  calculateExtraIntakeForMilkProductionMIj,
  calculateFeedIntakeIj,
  calculateMilkProduction,
} from '../shared/dairy/calculate';

const calculateEntericMethaneForClass = (
  herd: DairyHerdInputTransformed,
  classInput: DairyClassInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { breed, milkProduction, method2DryMatterDigestibility } = herd;
  const {
    head,
    className,
    weanedName,
    method2Liveweight,
    method2LiveweightGain,
  } = classInput;
  const { constants } = context;

  const Nj = head.named(`Nj=${weanedName}`);
  const Wj =
    method2Liveweight ??
    selectConstant(
      constants.DAIRY,
      'LIVEWEIGHTS_BY_BREED',
      breed,
      className,
    ).named(`Wj=${weanedName}`);
  const LWGj =
    method2LiveweightGain ??
    selectConstant(
      constants.DAIRY,
      'DAIRY_CLASS_FACTORS',
      className,
      'liveweightGain',
    ).named(`LWGj=${weanedName}`);
  const MRj = selectConstant(
    constants.DAIRY,
    'INCREASE_METABOLIC_RATE_FOR_MILK',
    className === 'milkingCows' ? 'milkingCows' : 'others',
  ).named('MRj');

  const DMDj =
    method2DryMatterDigestibility ??
    selectConstant(constants.DAIRY, 'DRY_MATTER_DIGESTIBILITY').named('DMDj');

  const MPj = calculateMilkProduction(milkProduction).named(
    `MPj=${weanedName}`,
  );

  const findDurationDays = (classInput: DairyClassInputTransformed) => {
    return (
      classInput.method2DurationDays ??
      (isClassMature(classInput)
        ? daysInYear
        : isClassPreWeaned(classInput)
          ? daysPreWeaning
          : daysPostWeaning)
    );
  };

  const MIj: Container<MassPerHeadPerDay<'DryMatter'>> =
    calculateExtraIntakeForMilkProductionMIj(MPj, DMDj, constants).named(
      `MIj=${weanedName}`,
    );
  const MIj0 = root(massPerHeadPerDay('DryMatter', 0)).named('MIj0');
  const Ij = calculateFeedIntakeIj(
    Wj,
    LWGj,
    MRj,
    className === 'milkingCows' ? MIj : MIj0,
  ).named(`Ij=${weanedName}`);
  // line 204 Mj = 20.7 * Ij * 10^-3
  const Mj = num(20.7)
    .multiply(Ij)
    .multiply(tenToPowMinus3)
    .switchUnit((r) => massPerHeadPerDay('CH4', r.value))
    .named(`Mj=${weanedName}`);

  const Dj = findDurationDays(classInput).named(`Dj=${weanedName}`);

  const NMD = Mj.multiply(Nj).multiply(Dj);

  const MPWenteric = (
    isClassPreWeaned(classInput)
      ? selectConstant(
          constants.DAIRY,
          'PRE_WEANED_CLASSES',
          classInput.className,
          'methaneProduction',
        )
      : root(massPerHeadPerDay('CH4', 0))
  ).named(`MPWenteric,j=${weanedName}`);

  const preWeaned = MPWenteric.multiply(Nj).multiply(Dj);

  const Eenteric = NMD.plus(preWeaned);

  return Eenteric.named(`Eenteric,j=${weanedName}`);
};

const calculateEntericMethaneForHerd = (
  herd: DairyHerdInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { classes } = herd;
  const classInputs = entriesFromObject(classes);
  const classResults = classInputs.map(([_className, classInput]) => {
    return calculateEntericMethaneForClass(herd, classInput, context);
  });
  return sum(classResults).named('Eenteric (herd)');
};

export function calculate33DairyEntericMethane(
  input: DairyInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  /*
    Eenteric = SUM ((N j=1,2,4 * M j=1,2,4 * D j=1,2,4) + (N j=3,5 * M j=3,5 * D j=3,5) + (N j=3,5 * MPW ENTERIC,j=3,5 * D j=3,5)) * 10^-3
    */

  const { herds } = input;

  const emissionsFromHerds = herds.map((herd) =>
    calculateEntericMethaneForHerd(herd, context),
  );
  return sum(emissionsFromHerds).named('Eenteric');
}
