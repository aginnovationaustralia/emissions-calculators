import { numberInput } from '@/tools/inputs';
import {
  ATMOS_DEPOSIT_5_4,
  FERT_INORGANIC_5_1,
  LEACH_RUNOFF_5_5,
  PURCH_FERT_15_4,
} from '@/tools/modules';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';

export const InorganicFertiliserInputBaseSchema = object({
  massAppliedKilograms: numberInput(
    (val) => mass('Inorganic Fertiliser', val),
    {
      name: 'massAppliedKilograms',
      method: '1',
      description:
        'Mass of inorganic fertiliser applied. This value is distinct from the mass purchased (massPurchasedKilograms), and should only include the amount of this fertiliser type that was actually used. If all fertiliser purchased during the calculation period was also applied in the calculation period, the values should be the same.',
      modules: [FERT_INORGANIC_5_1, ATMOS_DEPOSIT_5_4, LEACH_RUNOFF_5_5],
    },
    (s) => s.min(0),
  ),
  massPurchasedKilograms: numberInput(
    (val) => mass('Inorganic Fertiliser', val),
    {
      name: 'massPurchasedKilograms',
      method: '1',
      scope: '3',
      description:
        'Mass of inorganic fertiliser purchased. This value is distinct from the mass actually applied (massAppliedKilograms), and should include the exact amount of this fertiliser type that was purchased during the period covered by the calculation. If all fertiliser purchased during the calculation period was also applied in the calculation period, the values should be the same.',
      modules: [PURCH_FERT_15_4],
    },
    (s) => s.min(0),
  ),
});
