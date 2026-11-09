import { GrazingProductionSystemsWithRainfall } from '@/constants/enums';
import { enumInput } from '@/tools/inputs';
import { ManureModules } from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const hasGrazingProductionSystemInputSchema = (module: ManureModules) =>
  object({
    grazingSystem: enumInput(GrazingProductionSystemsWithRainfall, {
      name: 'Grazing production system',
      description:
        'The production system which most accurately describes the land used for grazing and feed.',
      modules: [module],
    }),
  });
export type HasGrazingProductionSystemInput = z.input<
  ReturnType<typeof hasGrazingProductionSystemInputSchema>
>;
export type HasGrazingProductionSystemInputTransformed = z.output<
  ReturnType<typeof hasGrazingProductionSystemInputSchema>
>;
