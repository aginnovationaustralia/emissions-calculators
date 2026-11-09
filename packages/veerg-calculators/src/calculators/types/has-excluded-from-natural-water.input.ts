import { booleanInput } from '@/tools/inputs';
import { ExcludedFromNaturalWaterModules } from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const hasExcludedFromNaturalWaterInputSchema = (
  module: ExcludedFromNaturalWaterModules,
) =>
  object({
    excludedFromNaturalWater: booleanInput(
      'excludedFromNaturalWater',
      'Whether the herd is excluded from natural water use. If animals are on bore or reticulated water systems where water is provided in troughs (i.e. no unfenced natural water sources) then set to true',
      [module],
    ),
  });

export type HasExcludedFromNaturalWaterInput = z.input<
  ReturnType<typeof hasExcludedFromNaturalWaterInputSchema>
>;
export type HasExcludedFromNaturalWaterInputTransformed = z.output<
  ReturnType<typeof hasExcludedFromNaturalWaterInputSchema>
>;
