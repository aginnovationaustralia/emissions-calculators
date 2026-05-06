import { entriesFromObject } from '@/calculators/common/tools';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { SwineInputTransformed } from '@/calculators/Swine/types/input';
import { SwineSpecificClassInputTransformed } from '@/calculators/Swine/types/swine-class.input';
import { SwineHerdInputTransformed } from '@/calculators/Swine/types/swine-herd.input';
import { SwineClass } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { Container, num } from '@/tools/containers';
import { sum } from '@/tools/sum';
import { MassPerHeadPerDay } from '@/tools/units';

function calculateEntericMethaneForClass(
  herd: SwineHerdInputTransformed,
  className: SwineClass,
  classInput: SwineSpecificClassInputTransformed | undefined,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;
  if (!classInput) {
    return num(0);
  }
  const { head, averageNumberOfDays, method2AverageFeedIntake } = classInput;
  const Nj = head.named(`Nj=${className}`);
  const Dj = averageNumberOfDays.named(`Dj=${className}`);
  const Ij =
    method2AverageFeedIntake ??
    selectConstant(
      constants.SWINE,
      'SWINE_CLASS_FACTORS',
      className,
      'FEED_INTAKE',
    ).named(`Ij=${className}`);
  const GE = selectConstant(
    constants.SWINE,
    'GROSS_ENERGY_CONTENT_OF_FEED',
  ).named(`GE`);
  const F = selectConstant(constants.SWINE, 'ENERGY_PER_MASS_METHANE').named(
    `F`,
  );
  const FRACTION_INTAKE_CONVERTED_TO_METHANE = selectConstant(
    constants.SWINE,
    'FRACTION_INTAKE_CONVERTED_TO_METHANE',
  ).named(`FRACTION_INTAKE_CONVERTED_TO_METHANE`);

  const Mj: Container<MassPerHeadPerDay<'CH4'>> = Ij.multiply(GE)
    .multiply(FRACTION_INTAKE_CONVERTED_TO_METHANE)
    .divide(F)
    .named(`Mj=${className}`);
  const Eenteric = Mj.multiply(Nj)
    .multiply(Dj)
    .named(`Eenteric,j=${className}`);
  return Eenteric;
}

function calculateEntericMethaneForHerd(
  input: SwineInputTransformed,
  herd: SwineHerdInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const entries = entriesFromObject(herd);

  const classResults = entries.map(([className, classInput]) => {
    return calculateEntericMethaneForClass(
      herd,
      className,
      classInput,
      context,
    );
  });
  return sum(classResults);
}

export function calculate35SwineEntericMethane(
  input: SwineInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  /*
    Eenteric = SUM (Nj * Mj * Dj) * 10^-3

    Mj = ( Ij * 18.6 * 0.007 ) / F
  */
  const { herds } = input;
  const herdResults = herds.map((herd) => {
    return calculateEntericMethaneForHerd(input, herd, context);
  });
  return sum(herdResults).named('Eenteric');
}
