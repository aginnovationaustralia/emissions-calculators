import { entriesFromObject } from '@/calculators/common/tools';
import { ExecutionContext } from '@/calculators/executionContext';
import { PigsClassLivestockInputTransformed } from '@/calculators/Pigs/types/pigs-class.input';
import { PigsClass } from '@/constants/enums';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { captureMethod1Or2Value } from '@/tools/multi';
import { zeroCH4 } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass, MassPerHeadPerDay } from '@/tools/units';
import { PigsHerdLivestockInputTransformed } from '../shared/pigs/input';

function calculateEntericMethaneForClass(
  className: PigsClass,
  classInput: PigsClassLivestockInputTransformed | undefined,
  constants: HasConstants<'PIGS'>,
): Container<Mass<'CH4'>> {
  if (!classInput) {
    return zeroCH4;
  }
  const { head, days, method2AverageFeedIntake } = classInput;
  const Nj = head.named(`Nj=${className}`);
  const Dj = days.named(`Dj=${className}`);
  const Ij = captureMethod1Or2Value(
    selectConstant(
      constants.PIGS,
      'PIGS_CLASS_FACTORS',
      className,
      'FEED_INTAKE',
    ),
    method2AverageFeedIntake,
  ).named(`Ij=${className}`);
  const GE = selectConstant(
    constants.PIGS,
    'GROSS_ENERGY_CONTENT_OF_FEED',
  ).named(`GE`);
  const F = selectConstant(constants.PIGS, 'ENERGY_PER_MASS_METHANE').named(
    `F`,
  );
  const FRACTION_INTAKE_CONVERTED_TO_METHANE = selectConstant(
    constants.PIGS,
    'FRACTION_INTAKE_CONVERTED_TO_METHANE',
  ).named(`FRACTION_INTAKE_CONVERTED_TO_METHANE`);

  const Mj: Container<MassPerHeadPerDay<'CH4'>> = Ij.multiply(GE)
    .multiply(FRACTION_INTAKE_CONVERTED_TO_METHANE)
    .divide(F)
    .named(`Mj=${className}`)
    .reference('3.5.1.1 (2)');

  const Eenteric = Mj.multiply(Nj)
    .multiply(Dj)
    .named(`Eenteric,j=${className}`)
    .reference('3.5.1.1 (1)');
  return Eenteric;
}

export function calculate35PigsEntericMethane(
  herd: PigsHerdLivestockInputTransformed,
  context: ExecutionContext<HasConstants<'COMMON' | 'PIGS'>>,
) {
  const entries = entriesFromObject(herd.classes);

  const classResults = entries.map(([className, classInput]) => {
    return calculateEntericMethaneForClass(
      className,
      classInput,
      context.constants,
    );
  });
  return sum(classResults).named('Eenteric');
}
