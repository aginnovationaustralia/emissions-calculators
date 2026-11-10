import { collectInputs } from '@/tools/collect';
import { Container } from '@/tools/containers';
import { AnyUnit } from '@/tools/units';

/**
 * Walks every `InputContainer` reached by `container` (via `collectInputs`) and
 * asserts each one is tagged with `moduleId` in its `modules` metadata.
 *
 * This is the runtime half of an experiment to verify that every input a module
 * (a `calculateXX...` function under `src/modules/...`) actually consumes is tagged,
 * on its Zod schema definition, with the module(s) that consume it. A module test
 * that populates every field the module under test reads (across both method 1 and
 * method 2 branches, where relevant) and calls this on the result gives good
 * confidence that the schema-level `modules` tags for that module are complete.
 *
 * Note this only catches *missing* tags on inputs a given call actually touched -
 * it can't tell you about a field that should be tagged for this module but wasn't
 * exercised by the test at all.
 */
export const expectInputsTaggedForModule = (
  container: Container<AnyUnit>,
  moduleId: string,
) => {
  const untagged = new Set(
    collectInputs(container)
      .filter((input) => !(input.modules ?? []).includes(moduleId))
      .map((input) => input.name),
  );

  // Asserting on the (ideally empty) list of names, rather than one expectation per
  // input, means a failure reports every offending field at once. Deduped, since a
  // single field is typically collected once per row/group/period the test exercises.
  expect([...untagged]).toEqual([]);
};
