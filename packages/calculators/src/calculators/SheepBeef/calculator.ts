import { SheepBeefInput } from '@/types/SheepBeef/input';
import { SheepBeefOutput } from '@/types/SheepBeef/output';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../../calculators/common/trees';
import { calculateScope1SavannahBurning } from '../Beef/Scope1SavannahBurning';
import { calculateSingleBeef, getBeefIntensities } from '../Beef/calculator';
import { calculateSingleSheep, getSheepIntensities } from '../Sheep/calculator';
import { addTotalValue } from '../common/tools/calculate';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import {
  addAcrossAllKeys,
  singleAllocationToArray,
} from '../common/tools/object';
import { ExecutionContext, WithExecutionMetadata } from '../executionContext';
import { ConstantsForSheepBeefCalculator } from './constants';

export function calculateSheepBeef(
  input: SheepBeefInput,
  context: ExecutionContext<ConstantsForSheepBeefCalculator>,
): WithExecutionMetadata<SheepBeefOutput> {
  const burningResults = input.burning.map((burning) =>
    calculateScope1SavannahBurning(burning, input.state, context),
  );

  const burningEmissions = burningResults.reduce(
    (acc, curr) => {
      return addAcrossAllKeys(acc, curr);
    },
    {
      totalCH4: 0,
      totalN2O: 0,
    },
  );

  input.vegetation = singleAllocationToArray(
    input.vegetation,
    input.beef,
    'beefProportion',
  );

  input.vegetation = singleAllocationToArray(
    input.vegetation,
    input.sheep,
    'sheepProportion',
  );

  const beefCarbonSequestration =
    calculateAllCarbonSequestrationWithKeyProportion(
      input.vegetation,
      'beefProportion',
      input.beef,
      context,
    );

  const sheepCarbonSequestration =
    calculateAllCarbonSequestrationWithKeyProportion(
      input.vegetation,
      'sheepProportion',
      input.sheep,
      context,
    );

  const beefResults = input.beef.map((singleBeef, i) =>
    calculateSingleBeef(
      input.state,
      input.northOfTropicOfCapricorn,
      input.rainfallAbove600,
      singleBeef,
      context,
      beefCarbonSequestration.intermediate[i],
      singleBeef.id ?? `beef-${i}`,
    ),
  );

  const emptyOutput = {
    scope1: {
      atmosphericDepositionN2O: 0,
      entericCH4: 0,
      fertiliserN2O: 0,
      leachingAndRunoffN2O: 0,
      manureManagementCH4: 0,
      totalCH4: 0,
      totalN2O: 0,
      ureaCO2: 0,
      fuelCO2: 0,
      fuelCH4: 0,
      fuelN2O: 0,
      limeCO2: 0,
      totalCO2: 0,
      total: 0,
      urineAndDungN2O: 0,
      savannahBurningN2O: 0,
      savannahBurningCH4: 0,
    },
    scope2: {
      electricity: 0,
      total: 0,
    },
    scope3: {
      electricity: 0,
      fuel: 0,
      fertiliser: 0,
      purchasedFeed: 0,
      purchasedMineralSupplementation: 0,
      herbicide: 0,
      lime: 0,
      purchasedLivestock: 0,
      total: 0,
    },
  };
  const beefResult = sumIntermediateResults(
    {
      output: emptyOutput,
      extensions: { totalBeefSaleWeight: 0, carbonSequestration: 0 },
      net: {
        total: 0,
      },
      meta: {
        id: '',
      },
    },
    beefResults,
  );

  const { totalBeefSaleWeight } = beefResult.extensions;

  const baseBeefEmissions = {
    scope1: addTotalValue({
      ...beefResult.output.scope1,
      savannahBurningN2O: burningEmissions.totalN2O,
      savannahBurningCH4: burningEmissions.totalCH4,
      totalCH4: beefResult.output.scope1.totalCH4 + burningEmissions.totalCH4,
      totalN2O: beefResult.output.scope1.totalN2O + burningEmissions.totalN2O,
    }),
    scope2: beefResult.output.scope2,
    scope3: beefResult.output.scope3,
    net: {
      total:
        beefResult.output.scope1.total +
        beefResult.output.scope2.total +
        beefResult.output.scope3.total -
        beefCarbonSequestration.total,
    },
    carbonSequestration: {
      total: beefCarbonSequestration.total,
    },
  };

  const sheepResults = input.sheep.map((singleSheep, i) =>
    calculateSingleSheep(
      input.state,
      input.northOfTropicOfCapricorn,
      input.rainfallAbove600,
      singleSheep,
      context,
      sheepCarbonSequestration.intermediate[i],
      singleSheep.id ?? `sheep-${i}`,
    ),
  );

  const sheepResult = sumIntermediateResults(
    {
      output: emptyOutput,
      extensions: {
        cleanWoolYieldTotal: 0,
        greasyWoolShornTotal: 0,
        totalSheepSaleWeight: 0,
        carbonSequestration: 0,
      },
      net: {
        total: 0,
      },
      meta: {
        id: '',
      },
    },
    sheepResults,
  );
  const { totalSheepSaleWeight, greasyWoolShornTotal, cleanWoolYieldTotal } =
    sheepResult.extensions;

  const baseSheepEmissions = {
    scope1: {
      ...sheepResult.output.scope1,
      savannahBurningN2O: 0,
      savannahBurningCH4: 0,
    },
    scope2: sheepResult.output.scope2,
    scope3: sheepResult.output.scope3,
    net: {
      total:
        sheepResult.output.scope1.total +
        sheepResult.output.scope2.total +
        sheepResult.output.scope3.total -
        sheepCarbonSequestration.total,
    },
    carbonSequestration: {
      total: sheepCarbonSequestration.total,
    },
  };

  const combinedResult = {
    scope1: addAcrossAllKeys(
      baseBeefEmissions.scope1,
      baseSheepEmissions.scope1,
    ),
    scope2: addAcrossAllKeys(
      baseBeefEmissions.scope2,
      baseSheepEmissions.scope2,
    ),
    scope3: addAcrossAllKeys(
      baseBeefEmissions.scope3,
      baseSheepEmissions.scope3,
    ),
    net: {
      ...addAcrossAllKeys(baseBeefEmissions.net, baseSheepEmissions.net),
      beef: baseBeefEmissions.net.total,
      sheep: baseSheepEmissions.net.total,
    },
  };

  return {
    ...combinedResult,
    carbonSequestration: {
      total: beefCarbonSequestration.total + sheepCarbonSequestration.total,
      intermediate: [], // TODO: Needs to be populated
    },
    intermediate: {
      beef: {
        ...baseBeefEmissions,
        carbonSequestration: baseBeefEmissions.carbonSequestration.total,
        intensities: getBeefIntensities(
          baseBeefEmissions.net.total,
          baseBeefEmissions.carbonSequestration.total,
          totalBeefSaleWeight,
        ),
      },
      sheep: {
        ...baseSheepEmissions,
        carbonSequestration: baseSheepEmissions.carbonSequestration.total,
        intensities: getSheepIntensities(
          baseSheepEmissions.net.total,
          baseSheepEmissions.carbonSequestration.total,
          cleanWoolYieldTotal,
          greasyWoolShornTotal,
          totalSheepSaleWeight,
        ),
      },
    },
    intermediateBeef: beefResults.map((x, i) => ({
      ...x.output,
      carbonSequestration: beefCarbonSequestration.intermediate[i],
      net: {
        total: x.net.total,
      },
      id: x.meta.id,
      intensities: getBeefIntensities(
        x.net.total,
        x.extensions.carbonSequestration,
        x.extensions.totalBeefSaleWeight,
      ),
    })),
    intermediateSheep: sheepResults.map((x, i) => ({
      ...x.output,
      carbonSequestration: sheepCarbonSequestration.intermediate[i],
      intensities: getSheepIntensities(
        x.net.total,
        x.extensions.carbonSequestration,
        x.extensions.cleanWoolYieldTotal,
        x.extensions.greasyWoolShornTotal,
        x.extensions.totalSheepSaleWeight,
      ),
      id: x.meta.id,
      net: {
        total: x.net.total,
      },
    })),
    intensities: {
      ...getSheepIntensities(
        combinedResult.net.total,
        sheepCarbonSequestration.total,
        cleanWoolYieldTotal,
        greasyWoolShornTotal,
        totalSheepSaleWeight,
      ),
      ...getBeefIntensities(
        combinedResult.net.total,
        beefCarbonSequestration.total,
        totalBeefSaleWeight,
      ),
    },
    metaData: {
      calculator: context.calculator,
      version: context.version,
      timestamp: new Date().toISOString(),
      overrides: context.overrides,
    },
  };
}
