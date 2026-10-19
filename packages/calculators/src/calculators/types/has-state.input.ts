import { State, States } from '@/constants/enums';
import { Container } from '@/tools/containers';
import { enumInput, NonEmptyArray } from '@/tools/inputs';
import { StateModules } from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

/**
 * `modules` lists every module the calculator passes the `state` key to. This is usually
 * more than the calculation that looks up a state constant, as the activity or herd that
 * holds the key is also passed to 6.3, 15.7 and 15.10.
 */
export const hasStateInputSchema = (modules: NonEmptyArray<StateModules>) =>
  object({
    state: enumInput(States, {
      name: 'Activity state or territory',
      description: 'The state or territory the activity is based in',
      modules,
    }),
  });

export type HasStateInput = z.input<ReturnType<typeof hasStateInputSchema>>;
export type HasStateInputTransformed = {
  state: Container<State>;
};
