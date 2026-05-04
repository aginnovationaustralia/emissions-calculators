import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { OtherLivestockInputTransformed } from '@/calculators/OtherLivestock/types/input';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';

export function calculate36OtherLivestockEntericMethane(
  input: OtherLivestockInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;
  /*
    3.6.1.1 Method 1 -- Other livestock enteric methane
    Total annual methane production from enteric fermentation in other livestock Eenteric (t CH4) is calculated as:
    Eenteric = SUM (N j * M j ) * 10^-3
    Where N j = number of livestock of each livestock type j (head)
    M j = enteric fermentation emission factor (kg CH4/head/year)
  */

  const { herds } = input;

  const emissionsFromHerds = herds.map((herd) => {
    const { classes } = herd;

    const emissionsFromClasses = classes.map((livestockClass) => {
      const { head, type } = livestockClass;
      const Mj = selectConstant(
        constants.LIVESTOCK,
        'OTHER_LIVESTOCK_EMISSION_FACTORS',
        type,
        'ENTERIC',
      );
      return head.multiply(Mj);
    });

    return sum(emissionsFromClasses);
  });

  return sum(emissionsFromHerds, { name: 'Eenteric' });
}
