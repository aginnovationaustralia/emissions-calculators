import { ConstantsForDairyCalculator } from '@/calculators/Dairy/constants';
import {
  DairyClassInputTransformed,
  isClassPreWeaned,
} from '@/calculators/Dairy/types/dairy-class.input';
import { ExecutionContext } from '@/calculators/executionContext';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { zeroCH4 } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  calculateMilkProduction,
  calculateOrGetFeedIntakeForDairy,
} from '../shared/dairy/calculate';
import { getLengthOfStay } from '../shared/dairy/helpers';
import { DairyHerdLivestockInputTransformed } from '../shared/dairy/input';

// Narrowed to just the fields the dairy enteric methane (3.3) and dairy manure
// management (4.3) calculations actually read, rather than the full
// `DairyHerdInputTransformed` -- see shared/dairy/input.ts. A full herd object still
// satisfies this structurally, so the dedicated Dairy calculator (which does pass the
// full herd) is unaffected.
const calculateEntericMethaneForClass = (
  herd: DairyHerdLivestockInputTransformed,
  classInput: DairyClassInputTransformed,
  constants: HasConstants<'DAIRY' | 'BEEF_PASTURE'>,
) => {
  const { breed, milkProduction } = herd;
  const { head, weanedName } = classInput;

  const Nj = head.named(`Nj=${weanedName}`);
  const Dj = getLengthOfStay(classInput, constants);

  if (isClassPreWeaned(classInput)) {
    const MPWenteric = selectConstant(
      constants.DAIRY,
      'CLASSES',
      classInput.className,
      'methaneProduction',
    ).named(`MPWenteric,j=${weanedName}`);

    return MPWenteric.multiply(Nj)
      .multiply(Dj)
      .named(`Eenteric,j=${weanedName}`)
      .reference('3.3.1.1 (1)');
  }

  const MPj = calculateMilkProduction(milkProduction, constants).named(
    `MPj=${weanedName}`,
  );

  const Ij = calculateOrGetFeedIntakeForDairy(
    classInput,
    MPj,
    breed,
    constants,
  );

  /**
   * Mj = 20.7 * Ij * 10^-3
   * */

  const methanePerDryMatter = selectConstant(
    constants.BEEF_PASTURE,
    'DRY_MATTER_TO_METHANE_CONVERSION_FACTOR',
  );
  const Mj = Ij.multiply(methanePerDryMatter)
    .named(`Mj=${weanedName}`)
    .reference('3.3.1.1 (2)');

  return Mj.multiply(Nj)
    .multiply(Dj)
    .named(`Eenteric,j=${weanedName}`)
    .reference('3.3.1.1 (1)');
};

export const calculate33EntericMethaneForHerd = (
  herd: DairyHerdLivestockInputTransformed,
  context: ExecutionContext<ConstantsForDairyCalculator>,
) => {
  /*
    3.3.1.1 (1)
    Eenteric = SUM ((N j=1,2,4 * M j=1,2,4 * D j=1,2,4) + (N j=3,5 * M j=3,5 * D j=3,5) + (N j=3,5 * MPW ENTERIC,j=3,5 * D j=3,5)) * 10^-3
    */
  const classResults = Object.values(herd.classes).map((classInput) => {
    return calculateEntericMethaneForClass(herd, classInput, context.constants);
  });
  return sum(classResults, zeroCH4).named('Eenteric (herd)');
};
