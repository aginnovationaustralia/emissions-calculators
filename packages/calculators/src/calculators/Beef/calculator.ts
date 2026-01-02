import { calculateScope3Fertiliser } from '@/calculators/common/fertiliser';
import { BeefComplete } from '@/types/Beef/beef.input';
import { BeefPurchase } from '@/types/Beef/beefpurchase.input';
import { BeefInput } from '@/types/Beef/input';
import { BeefOutput } from '@/types/Beef/output';
import { SavannahBurning } from '@/types/Beef/savannah.input';
import { BeefScope1Output } from '@/types/Beef/scope1.output';
import { BeefScope3Output } from '@/types/Beef/scope3.output';
import { BeefClassesAPI, State } from '@/types/enums';
import { Scope2Output } from '@/types/scope2.output';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../../calculators/common/trees';
import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import {
  calculateFuelScope1CH4LPG,
  calculateFuelScope1CO2LPG,
  calculateFuelScope1N2OLPG,
  calculateScope3FuelWithLPGAverage,
} from '../common-legacy/fuel';
import { calculateScope1Lime, calculateScope3Lime } from '../common/lime';
import {
  calculateMineralSupplementationScope3,
  calculateScope3PurchasedFeed,
} from '../common/livestock';
import { addTotalValue, divideBySafeFromZero } from '../common/tools';
import {
  sumIntermediateResults,
  SummableObject,
} from '../common/tools/intermediate-results';
import { singleAllocationToArray } from '../common/tools/object';
import { ExecutionContext } from '../executionContext';
import { calculateScope1Urea } from '../SheepBeef/Scope1Urea';
import { calculateScope3Herbicide } from '../SheepBeef/Scope3Herbicides';
import { calculatePurchasedBeefEmissions } from '../SheepBeef/Scope3PurchasedLivestock';
import { ConstantsForBeefCalculator } from './constants';
import { calculateCompleteBeefEmissions } from './Scope1Beef';
import { calculateScope1SavannahBurning } from './Scope1SavannahBurning';

export function getBeefIntensities(
  netTotal: number,
  carbonSequestration: number,
  liveweightBeefProducedKg: number,
) {
  return {
    beefIncludingSequestration: divideBySafeFromZero(
      netTotal * 1000,
      liveweightBeefProducedKg,
    ),
    beefExcludingSequestration: divideBySafeFromZero(
      (netTotal + carbonSequestration) * 1000,
      liveweightBeefProducedKg,
    ),
    liveweightBeefProducedKg,
  };
}

type BeefScopesOutput = {
  scope1: BeefScope1Output & SummableObject;
  scope2: Scope2Output & SummableObject;
  scope3: BeefScope3Output & SummableObject;
};

function transformBeefPurchasedLivestock(beef: BeefComplete) {
  return BeefClassesAPI.reduce(
    (acc, type) => {
      const b = beef.classes[type];

      const purchases = b?.purchases ?? [];

      return {
        ...acc,
        [type]: purchases,
      };
    },
    {} as {
      [type in (typeof BeefClassesAPI)[number]]: BeefPurchase[];
    },
  );
}

export function calculateSingleBeef(
  state: State,
  propertyNorthOfTropicOfCapricorn: boolean,
  rainfallAbove600: boolean,
  beef: BeefComplete,
  context: ExecutionContext<ConstantsForBeefCalculator>,
  carbonSequestration: number,
  id: string,
  savannahBurningN2O: number,
  savannahBurningCH4: number,
) {
  const {
    atmosphericDepositionN2O,
    entericCH4,
    fertiliserN2O,
    leechingRunoffN2O,
    manureManagementCH4,
    urineAndDungN2O,
  } = calculateCompleteBeefEmissions(
    beef.classes,
    state,
    beef.fertiliser,
    propertyNorthOfTropicOfCapricorn,
    rainfallAbove600,
    beef.cowsCalving,
    context,
  );

  const limeCO2 = calculateScope1Lime(
    beef.limestone,
    beef.limestoneFraction,
    context,
  );

  const { lpg } = beef;

  const fuelCO2 = calculateFuelScope1CO2LPG(
    beef.diesel,
    beef.petrol,
    lpg,
    context,
  );
  const fuelCH4 = calculateFuelScope1CH4LPG(
    beef.diesel,
    beef.petrol,
    lpg,
    context,
  );
  const fuelN2O = calculateFuelScope1N2OLPG(
    beef.diesel,
    beef.petrol,
    lpg,
    context,
  );

  const ureaCO2 = calculateScope1Urea(
    beef.mineralSupplementation,
    beef.fertiliser,
    context,
  );

  const beefElectricity = calculateElectricityScope2And3(
    state,
    beef.electricitySource,
    beef.electricityRenewable,
    beef.electricityUse,
    context,
  );

  const beefFertiliser = calculateScope3Fertiliser(beef.fertiliser, context);

  const beefMineralSupplementation = calculateMineralSupplementationScope3(
    beef.mineralSupplementation,
    context,
  );

  const beefFeed = calculateScope3PurchasedFeed(
    beef.grainFeed,
    beef.hayFeed,
    beef.cottonseedFeed,
    context,
  );

  const herbicide = calculateScope3Herbicide(
    beef.herbicide,
    beef.herbicideOther,
    0,
    0,
    context,
  );

  const fuelScope3Beef = calculateScope3FuelWithLPGAverage(
    beef.diesel,
    beef.petrol,
    lpg,
    context,
  );

  const limeScope3Beef = calculateScope3Lime(beef.limestone, context);

  const beefPurchasedLivestock = transformBeefPurchasedLivestock(beef);

  const purchasedLivestock = calculatePurchasedBeefEmissions(
    beefPurchasedLivestock,
    context,
  );

  const totalCO2 = fuelCO2 + ureaCO2 + limeCO2;
  const totalCH4 =
    fuelCH4 + entericCH4 + manureManagementCH4 + savannahBurningCH4;
  const totalN2O =
    fuelN2O +
    leechingRunoffN2O +
    atmosphericDepositionN2O +
    urineAndDungN2O +
    fertiliserN2O +
    savannahBurningN2O;

  const scope1 = addTotalValue({
    leachingAndRunoffN2O: leechingRunoffN2O,
    atmosphericDepositionN2O,
    urineAndDungN2O,
    manureManagementCH4,
    entericCH4,
    fertiliserN2O,
    savannahBurningCH4,
    savannahBurningN2O,
    limeCO2,
    fuelCO2,
    fuelCH4,
    fuelN2O,
    ureaCO2,
    totalCO2,
    totalCH4,
    totalN2O,
  });

  const scope2 = addTotalValue({
    electricity: beefElectricity.scope2,
  });

  const scope3 = addTotalValue({
    fertiliser: beefFertiliser,
    purchasedMineralSupplementation: beefMineralSupplementation,
    purchasedFeed: beefFeed.total,
    herbicide: herbicide.total,
    electricity: beefElectricity.scope3,
    fuel: fuelScope3Beef,
    lime: limeScope3Beef,
    purchasedLivestock,
  });

  const output: Omit<BeefScopesOutput, 'intermediate' | 'carbonSequestration'> =
    {
      scope1,
      scope2,
      scope3,
    };

  const totalBeefSaleWeight = BeefClassesAPI.reduce((acc, type) => {
    const beefClass = beef.classes[type];

    if (!beefClass) {
      return acc;
    }

    return acc + beefClass.headSold * beefClass.saleWeight;
  }, 0);

  return {
    output,
    net: {
      total: scope1.total + scope2.total + scope3.total - carbonSequestration,
    },
    extensions: {
      totalBeefSaleWeight,
      carbonSequestration,
    },
    meta: {
      id,
    },
  };
}

export function calculateAllBurningWithKeyProportion<
  T extends { [key in K]: number[] } & { burning: SavannahBurning },
  K extends keyof T,
  L,
>(
  burnings: T[],
  allocationKey: K,
  objects: L[],
  state: State,
  context: ExecutionContext<ConstantsForBeefCalculator>,
) {
  const burning = burnings.map((burn) => ({
    ...burn,
    burning: calculateScope1SavannahBurning(burn.burning, state, context),
  }));

  const burningAllocation = objects.map((_, i) =>
    burning.reduce(
      (acc, t) => ({
        savannahBurningN2O:
          acc.savannahBurningN2O +
          t.burning.totalN2O * (t[allocationKey][i] ?? 0),
        savannahBurningCH4:
          acc.savannahBurningCH4 +
          t.burning.totalCH4 * (t[allocationKey][i] ?? 0),
      }),
      { savannahBurningN2O: 0, savannahBurningCH4: 0 },
    ),
  );

  const totalAllocatedBurn = burningAllocation.reduce(
    (acc, t) => ({
      savannahBurningCH4: acc.savannahBurningCH4 + t.savannahBurningCH4,
      savannahBurningN2O: acc.savannahBurningN2O + t.savannahBurningN2O,
    }),
    {
      savannahBurningN2O: 0,
      savannahBurningCH4: 0,
    },
  );

  return {
    total: totalAllocatedBurn,
    intermediate: burningAllocation,
  };
}

export function calculateBeef(
  input: BeefInput,
  context: ExecutionContext<ConstantsForBeefCalculator>,
): BeefOutput {
  input.vegetation = singleAllocationToArray(
    input.vegetation,
    input.beef,
    'allocationToBeef',
  );

  const burningResults = calculateAllBurningWithKeyProportion(
    input.burning,
    'allocationToBeef',
    input.beef,
    input.state,
    context,
  );

  const beefCarbonSequestration =
    calculateAllCarbonSequestrationWithKeyProportion(
      input.vegetation,
      'allocationToBeef',
      input.beef,
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
      singleBeef.id ?? i.toString(),
      burningResults.intermediate[i].savannahBurningN2O,
      burningResults.intermediate[i].savannahBurningCH4,
    ),
  );

  const emptyOutput: Omit<
    BeefScopesOutput,
    'intermediate' | 'carbonSequestration'
  > = {
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
      savannahBurningCH4: 0,
      savannahBurningN2O: 0,
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
    scope1: beefResult.output.scope1,
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

  const combinedResult = {
    scope1: baseBeefEmissions.scope1,
    scope2: baseBeefEmissions.scope2,
    scope3: baseBeefEmissions.scope3,
    net: {
      ...baseBeefEmissions.net,
      beef: baseBeefEmissions.net.total,
    },
  };

  return {
    ...combinedResult,
    carbonSequestration: {
      total: beefCarbonSequestration.total,
    },
    intermediate: beefResults.map((x, i) => ({
      ...x.output,
      carbonSequestration: { total: beefCarbonSequestration.intermediate[i] },
      id: x.meta.id,
      intensities: getBeefIntensities(
        x.net.total,
        x.extensions.carbonSequestration,
        x.extensions.totalBeefSaleWeight,
      ),
      net: {
        total: x.net.total,
      },
      scope1: x.output.scope1,
      scope2: x.output.scope2,
      scope3: x.output.scope3,
    })),
    intensities: getBeefIntensities(
      baseBeefEmissions.net.total,
      beefCarbonSequestration.total,
      totalBeefSaleWeight,
    ),
  };
}
