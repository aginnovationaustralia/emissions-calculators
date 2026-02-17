/*
Create a utility type that can map from an output type like GrainsScope1Output to an intermediate type for collecting scope 1 keys and values
Each key will be of type TypedContainer<Mass<'CO2' | 'CH4' | 'N2O' | 'CO2e'>>. The specific substance should be inferred from the end of the key name.
The keys will end in CO2, CH4, or N2O. If they don't end in this, they should be CO2e. These are the only valid substances and should be used as the
substance type for the TypedContainer. The first part of the key name, before the substance suffix, is not useful for the type, so should be ignored.

The output type should be a record of these TypedContainers.
*/

import {
  entriesFromObject,
  ObjectEntry,
  objectFromEntries,
} from '@/calculators/common/tools/object';
import z from 'zod';
import { TypedContainer } from './origins';
import { output, Output, scope1Output, Scope1Output } from './outputs';
import { sum } from './sum';
import { Mass } from './units';

type Scope123ExcludedKeys = 'totalCO2' | 'totalCH4' | 'totalN2O' | 'total';

type IntermediateScope1<O extends Record<string, unknown>> = {
  [K in Exclude<keyof O, Scope123ExcludedKeys>]: TypedContainer<
    Mass<
      K extends `${string}CO2`
        ? 'CO2'
        : K extends `${string}CH4`
          ? 'CH4'
          : K extends `${string}N2O`
            ? 'N2O'
            : 'CO2e'
    >
  >;
};

type IntermediateScope23<O extends Record<string, unknown>> = {
  [K in Exclude<keyof O, Scope123ExcludedKeys>]: TypedContainer<Mass<'CO2e'>>;
};

type ScopeValuesFromOutput<
  O extends {
    scope1: Record<string, unknown>;
    scope2: Record<string, unknown>;
    scope3: Record<string, unknown>;
  },
> = {
  scope1: IntermediateScope1<O['scope1']>;
  scope2: IntermediateScope23<O['scope2']>;
  scope3: IntermediateScope23<O['scope3']>;
};

type OutputScope1<O extends Record<string, unknown>> = {
  [K in Exclude<keyof O, Scope123ExcludedKeys>]: Scope1Output<
    'CH4' | 'CO2' | 'CO2e' | 'N2O'
  >;
};

type OutputScope2<O extends Record<string, unknown>> = {
  [K in Exclude<keyof O, Scope123ExcludedKeys>]: Output<2>;
};

type OutputScope3<O extends Record<string, unknown>> = {
  [K in Exclude<keyof O, Scope123ExcludedKeys>]: Output<3>;
};

type ScopeValuesAsOutputs<
  O extends {
    scope1: Record<string, unknown>;
    scope2: Record<string, unknown>;
    scope3: Record<string, unknown>;
  },
> = {
  scope1: OutputScope1<O['scope1']>;
  scope2: OutputScope2<O['scope2']>;
  scope3: OutputScope3<O['scope3']>;
};

type ScopeSchema<K extends string> = z.ZodObject<Record<K, z.ZodObject>>;

type ScopesSchema<S1 extends string, S2 extends string, S3 extends string> = {
  scope1: ScopeSchema<S1>;
  scope2: ScopeSchema<S2>;
  scope3: ScopeSchema<S3>;
};

/** Derives O from schema keys (excluding total keys) so O can be inferred from the schema parameter */
type OFromSchemaKeys<
  S1 extends string,
  S2 extends string,
  S3 extends string,
> = {
  scope1: Record<Exclude<S1, Scope123ExcludedKeys>, unknown>;
  scope2: Record<Exclude<S2, Scope123ExcludedKeys>, unknown>;
  scope3: Record<Exclude<S3, Scope123ExcludedKeys>, unknown>;
};

export function mergeScopeOutputs<
  S1 extends string,
  S2 extends string,
  S3 extends string,
>(
  intermediates: ScopeValuesFromOutput<OFromSchemaKeys<S1, S2, S3>>[],
  schema: ScopesSchema<S1, S2, S3>,
): ScopeValuesFromOutput<OFromSchemaKeys<S1, S2, S3>> {
  const excludedKeys = new Set<string>([
    'totalCO2',
    'totalCH4',
    'totalN2O',
    'total',
  ]);

  type Scope1 = ScopeValuesFromOutput<OFromSchemaKeys<S1, S2, S3>>['scope1'];
  type Scope2 = ScopeValuesFromOutput<OFromSchemaKeys<S1, S2, S3>>['scope2'];
  type Scope3 = ScopeValuesFromOutput<OFromSchemaKeys<S1, S2, S3>>['scope3'];

  const scope1Entries = entriesFromObject(schema.scope1.shape)
    .filter(([key]) => !excludedKeys.has(String(key)))
    .map(
      ([key, _value]): ObjectEntry<Scope1> => [
        key as keyof Scope1,
        sum(intermediates.map((s) => s.scope1[key as keyof Scope1])),
      ],
    );

  const scope2Entries = entriesFromObject(schema.scope2.shape)
    .filter(([key]) => !excludedKeys.has(String(key)))
    .map(
      ([key, _value]): ObjectEntry<Scope2> => [
        key as keyof Scope2,
        sum(intermediates.map((s) => s.scope2[key as keyof Scope2])),
      ],
    );

  const scope3Entries = entriesFromObject(schema.scope3.shape)
    .filter(([key]) => !excludedKeys.has(String(key)))
    .map(
      ([key, _value]): ObjectEntry<Scope3> => [
        key as keyof Scope3,
        sum(intermediates.map((s) => s.scope3[key as keyof Scope3])),
      ],
    );

  return {
    scope1: objectFromEntries(scope1Entries),
    scope2: objectFromEntries(scope2Entries),
    scope3: objectFromEntries(scope3Entries),
  };
}

export function wrapScopesAsOutputs<
  O extends {
    scope1: Record<string, unknown>;
    scope2: Record<string, unknown>;
    scope3: Record<string, unknown>;
  },
>(intermediates: ScopeValuesFromOutput<O>): ScopeValuesAsOutputs<O> {
  const scope1Entries = entriesFromObject(intermediates.scope1).map(
    ([key, value]): ObjectEntry<ScopeValuesAsOutputs<O>['scope1']> => [
      key,
      scope1Output(key, value),
    ],
  );

  const scope2Entries = entriesFromObject(intermediates.scope2).map(
    ([key, value]): ObjectEntry<ScopeValuesAsOutputs<O>['scope2']> => [
      key,
      output(key, 2, value),
    ],
  );

  const scope3Entries = entriesFromObject(intermediates.scope3).map(
    ([key, value]): ObjectEntry<ScopeValuesAsOutputs<O>['scope3']> => [
      key,
      output(key, 3, value),
    ],
  );

  return {
    scope1: objectFromEntries(scope1Entries),
    scope2: objectFromEntries(scope2Entries),
    scope3: objectFromEntries(scope3Entries),
  };
}
