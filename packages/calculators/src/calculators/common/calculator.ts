import { calculateLULUCF } from '@/modules/lulucf/calculate';
import { ConstantsForLULUCF } from '@/modules/lulucf/constants';
import { LULUCFOutput, LULUCFOutputSchema } from '@/modules/lulucf/output';
import { calculateElectricityScope2 } from '@/modules/scope2/14-electricity';
import { calculateElectricityScope3 } from '@/modules/scope3/15.11-electricity';
import {
  IntermediateScope1,
  IntermediateScope23,
  mergeScopeOutputs,
  ScopesSchema,
} from '@/tools/calculators';
import { Container } from '@/tools/containers';
import { extractMassAsNumber } from '@/tools/extract';
import {
  buildCalculatorLedger,
  serialiseCalculatorLedger,
  sumCO2e,
} from '@/tools/ledger';
import { Mass } from '@/tools/units';
import z from 'zod';
import { ExecutionContext } from '../executionContext';
import { ActivityInputTransformed } from '../types/activity.input';
import { EnterpriseInputTransformed } from '../types/enterprise.input';
import { Scope2Output } from '../types/scope2.output';
import { entriesFromObject, objectFromEntries } from './tools/object';

/**
 * The scope 1 shape an individual calculator produces per activity: every scope 1 key on its
 * output schema except the LULUCF ones. LULUCF is calculated once for the whole enterprise and
 * folded into the top level scope 1 totals below, so it never appears on a per-activity result.
 */
type Scope1WithoutLULUCF<KS1 extends string> = Record<
  Exclude<KS1, keyof LULUCFOutput>,
  unknown
>;

const lulucfKeys = new Set<string>(Object.keys(LULUCFOutputSchema.shape));

/**
 * Narrows a `[key, schema]` entry off a scope1 output shape to exclude LULUCF keys, so
 * `entriesFromObject(...).filter(isNotLulucfKey)` gives back an array TS can rebuild into
 * exactly the `Scope1WithoutLULUCF<KS1>` shape - no cast needed, same as the `isN2O`/`isCH4`
 * type guards in `tools/totals.ts` narrow a filtered array without one.
 */
function isNotLulucfKey<K extends string>(
  entry: [K, z.ZodType],
): entry is [Exclude<K, keyof LULUCFOutput>, z.ZodType] {
  return !lulucfKeys.has(entry[0]);
}

/*
  2.2.1 Module Map
  Indirect GHG emissions from imported energy (Scope 2)

  Purchased Electricity 14.1
*/

export const calculateScope2 = (
  activity: Pick<ActivityInputTransformed, 'electricityAllocation'>,
  enterpriseScope2Electricity: Container<Mass<'CO2e'>>,
): IntermediateScope23<Scope2Output> => {
  // Purchased Electricity 14.1
  const electricity = enterpriseScope2Electricity.multiply(
    activity.electricityAllocation,
  );

  return {
    electricity,
  };
};

/**
 * Extends `ScopesSchema` with the two constraints `createCalculator`'s output must also satisfy:
 * a top level `intensities` key matching what `getTotalIntensities` returns, and an `intermediate`
 * array whose entries each carry an `intensities` key matching what `getSingleIntensities`
 * returns (alongside whatever else - `id`, `scope1`, `net`, etc - each entry also carries).
 */
type CalculatorOutputSchema<
  S1 extends string,
  S2 extends string,
  S3 extends string,
  TSingleIntensities extends object,
  TTotalIntensities extends object,
> = ScopesSchema<S1, S2, S3> & {
  intensities: z.ZodType<TTotalIntensities>;
  intermediate: z.ZodType<{ intensities: TSingleIntensities }[]>;
};

/**
 * The function is a factory for creating a calculator function that can be called with an input and context. It should be fit for purpose
 * for all standard top level calculators. It helps to standardise the inputs and outputs of all calculators, and avoids small errors and
 * repetition of code.
 *
 * @param calculatorName - The name of the calculator
 * @param activityKey - The key of the activity in the input schema
 * @param outputSchema - The schema of the output
 * @param calculateScope1 - The function to calculate the scope 1 emissions. It also receives the
 * whole input, for enterprise level fields that affect each activity's scope 1 calculation.
 * @param calculateScope3 - The function to calculate the scope 3 emissions
 * @param getSingleIntensities - Calculates the intensities for one activity. Has no access to
 * LULUCF numbers, since LULUCF is only ever calculated for the whole enterprise. Like
 * calculateScope1, it also receives the whole input.
 * @param getTotalIntensities - Calculates the enterprise-wide intensities, including LULUCF.
 * The net total it receives already includes LULUCF, so intensities excluding LULUCF must
 * subtract the LULUCF total from it. Both totals are CO2e mass containers. Like
 * calculateScope1, it also receives the whole input.
 * @returns The calculator function that can be called with an input and context
 */
export const createCalculator =
  <
    TActivityKey extends string,
    TActivity extends ActivityInputTransformed,
    TInput extends EnterpriseInputTransformed & {
      [K in TActivityKey]: TActivity[];
    },
    TContext extends ConstantsForLULUCF,
    KS1 extends string,
    S1 extends Scope1WithoutLULUCF<KS1>,
    KS3 extends string,
    S3 extends Record<KS3, unknown>,
    TSingleIntensities extends object,
    TTotalIntensities extends object,
  >(
    calculatorName: string,
    activityKey: TActivityKey,
    outputSchema: CalculatorOutputSchema<
      KS1,
      keyof Scope2Output,
      KS3,
      TSingleIntensities,
      TTotalIntensities
    >,
    calculateScope1: (
      activity: TActivity,
      context: ExecutionContext<TContext>,
      input: TInput,
    ) => IntermediateScope1<S1>,
    calculateScope3: (
      activity: TActivity,
      enterpriseScope3Electricity: Container<Mass<'CO2e'>>,
      context: ExecutionContext<TContext>,
    ) => IntermediateScope23<S3>,

    getSingleIntensities: (
      netTotalEmissionsKgCO2e: number,
      activity: TActivity,
      context: ExecutionContext<TContext>,
      input: TInput,
    ) => TSingleIntensities,

    getTotalIntensities: (
      netTotalEmissions: Container<Mass<'CO2e'>>,
      netLulucf: Container<Mass<'CO2e'>>,
      activities: TActivity[],
      context: ExecutionContext<TContext>,
      input: TInput,
    ) => TTotalIntensities,
  ) =>
  (input: TInput, context: ExecutionContext<TContext>) => {
    const lulucf = calculateLULUCF(input, context);
    const enterpriseScope2Electricity = calculateElectricityScope2(
      input.electricity,
      context,
    );
    const enterpriseScope3Electricity = calculateElectricityScope3(
      input.electricity,
      context,
    );
    const activities = input[activityKey];
    const activityResults = activities.map((activity, ix) => {
      return {
        scope1: calculateScope1(activity, context, input),
        scope2: calculateScope2(activity, enterpriseScope2Electricity),
        scope3: calculateScope3(activity, enterpriseScope3Electricity, context),
        meta: {
          id: activity.id || calculatorName + ix.toString(),
          originalActivity: activity,
        },
      };
    });

    // calculateScope1 never returns LULUCF keys (they're added to the top level scope 1 below),
    // so mergeScopeOutputs needs a scope1 schema that agrees - built here by filtering them out
    // of outputSchema.scope1, whose shape does declare them (they belong on the calculator's
    // full output, not on any one activity's contribution to it).
    const scope1ShapeWithoutLulucf = objectFromEntries<
      Record<Exclude<KS1, keyof LULUCFOutput>, z.ZodType>
    >(entriesFromObject(outputSchema.scope1.shape).filter(isNotLulucfKey));

    const merged = mergeScopeOutputs(activityResults, {
      scope1: { shape: scope1ShapeWithoutLulucf },
      scope2: outputSchema.scope2,
      scope3: outputSchema.scope3,
    });

    // Totals are built as containers first, so the net total stays a typed CO2e mass for the
    // intensity calculations. Only the final serialise step turns them into plain numbers.
    const enterprise = buildCalculatorLedger({
      ...merged,
      scope1: { ...merged.scope1, ...lulucf },
    });
    const lulucfTotal = sumCO2e(Object.values(lulucf));

    const activityLedgers = activityResults.map((activity) => ({
      meta: activity.meta,
      ledger: buildCalculatorLedger(activity),
    }));

    return {
      ...serialiseCalculatorLedger(enterprise),
      intermediate: activityLedgers.map(({ meta, ledger }) => ({
        id: meta.id,
        ...serialiseCalculatorLedger(ledger),
        intensities: getSingleIntensities(
          extractMassAsNumber(ledger.net),
          meta.originalActivity,
          context,
          input,
        ),
      })),
      intensities: getTotalIntensities(
        enterprise.net,
        lulucfTotal,
        activities,
        context,
        input,
      ),
    };
  };
