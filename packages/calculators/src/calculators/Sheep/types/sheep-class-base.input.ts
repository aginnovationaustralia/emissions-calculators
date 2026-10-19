import { isProportion, numberInput } from '@/tools/inputs';
import { INTENSITIES, MANURE_SHEEP_4_4 } from '@/tools/modules';
import { massPerHead, massPerMass } from '@/tools/units';
import { object } from '@/types/schemas';

export const SheepClassBaseInputSchema = object({
  greasyWoolProduction: numberInput(
    (val) => massPerHead('Greasy Wool', val),
    {
      name: 'GWk',
      method: '1',
      description: 'Greasy wool production for this class',
      modules: [MANURE_SHEEP_4_4, INTENSITIES],
    },
    (s) => s.min(0),
  ),
  cleanWoolYieldProportion: numberInput(
    (val) => massPerMass('Clean Wool', 'Greasy Wool', val),
    {
      name: 'Yk',
      method: '1',
      description: 'Proportion of greasy wool production that is clean wool',
      modules: [MANURE_SHEEP_4_4, INTENSITIES],
    },
    isProportion,
  ),
});
