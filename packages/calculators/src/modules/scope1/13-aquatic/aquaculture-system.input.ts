import { AquacultureSystemLocations } from '@/constants/enums';
import { enumInput, numberInput } from '@/tools/inputs';
import { AQUATIC_13_1, INTENSITIES } from '@/tools/modules';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const AquacultureSystemInputSchema = object({
  amountProduced: numberInput((val) => mass('Fish', tonnesToKg(val)), {
    name: 'Q',
    scope: '1',
    description:
      'Quantity of fish or crustaceans harvested from this operation, in tonnes.',
    modules: [AQUATIC_13_1, INTENSITIES],
  }),
  location: enumInput(AquacultureSystemLocations, {
    name: 'location',
    description: 'Where is this aquaculture system located?',
    modules: [AQUATIC_13_1],
  }),
});

export type AquacultureSystemInput = z.input<
  typeof AquacultureSystemInputSchema
>;
export type AquacultureSystemInputTransformed = z.output<
  typeof AquacultureSystemInputSchema
>;

export const HasAquacultureSystemInputSchema = object({
  fishery: AquacultureSystemInputSchema,
});

export type HasAquacultureSystemInput = z.input<
  typeof HasAquacultureSystemInputSchema
>;
export type HasAquacultureSystemInputTransformed = z.output<
  typeof HasAquacultureSystemInputSchema
>;
