import { ExecutionContext } from '@/calculators/executionContext';
import { HasConstants } from '@/constants/types';
import { OtherLivestockManureAndEntericHerdInputTransformed } from '@/modules/scope1/shared/other-livestock/input';
import { selectConstant } from '@/tools/constants';
import { zeroCH4 } from '@/tools/sentinels';
import { sum } from '@/tools/sum';

export function calculate36OtherLivestockEntericMethaneForHerd(
  herd: OtherLivestockManureAndEntericHerdInputTransformed,
  context: ExecutionContext<HasConstants<'COMMON' | 'LIVESTOCK'>>,
) {
  const { constants } = context;
  /**
   * Eenteric = SUM[j] (Nj * Mj) * 10^-3
   */

  const emissionsFromClasses = herd.livestock.map((livestockClass) => {
    const { head, type } = livestockClass;
    const Mj = selectConstant(
      constants.LIVESTOCK,
      'OTHER_LIVESTOCK_EMISSION_FACTORS',
      type,
      'ENTERIC',
    );
    return head.multiply(Mj).reference('3.6.1.1 (1)').named('Eenteric');
  });

  return sum(emissionsFromClasses, zeroCH4);
}
