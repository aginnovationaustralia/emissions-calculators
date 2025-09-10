import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import {
  calculateFuelScope1CH4LPG,
  calculateFuelScope1CO2LPG,
  calculateFuelScope1N2OLPG,
  calculateScope3FuelWithLPGAverage,
} from '../common-legacy/fuel';
import {
  calculateScope3Fertiliser,
  mergeOtherFertilisers,
} from '../common/fertiliser';
import { calculateScope1Lime, calculateScope3Lime } from '../common/lime';
import {
  calculateMineralSupplementationScope3,
  calculateScope3PurchasedFeed,
} from '../common/livestock';
import { addTotalValue, divideBySafeFromZero } from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { singleAllocationToArray } from '../common/tools/object';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../common/trees';
import { ExecutionContext } from '../executionContext';
import { calculateScope1Urea } from '../SheepBeef/Scope1Urea';
import { calculateScope3Herbicide } from '../SheepBeef/Scope3Herbicides';
import { calculatePurchasedSheepEmissions } from '../SheepBeef/Scope3PurchasedLivestock';
import { SheepInput } from '../types/Sheep/input';
import { SheepOutput } from '../types/Sheep/output';
import { SheepComplete } from '../types/Sheep/sheep.input';
import { SheepClassesAPI, State } from '../types/types';
import { calculateCompleteSheepEmissions } from './Scope1Sheep';

export function getSheepIntensities(
  netTotal: number,
  carbonSequestration: number,
  cleanWoolProducedKg: number,
  greasyWoolProducedKg: number,
  sheepMeatProducedKg: number,
) {
  const proteinFactor = 0.18;

  const sheepMeatprotein = sheepMeatProducedKg * proteinFactor;

  // (assumptionsE3)
  const sheepMeatAllocationFactor =
    sheepMeatprotein / (sheepMeatprotein + cleanWoolProducedKg * 1000);

  // (assumptionsF3)
  const woolAllocationFactor =
    (cleanWoolProducedKg * 1000) /
    (sheepMeatprotein + cleanWoolProducedKg * 1000);

  return {
    woolProducedKg: greasyWoolProducedKg,
    sheepMeatProducedKg,
    sheepMeatBreedingIncludingSequestration: divideBySafeFromZero(
      netTotal * 1000 * sheepMeatAllocationFactor,
      sheepMeatProducedKg,
    ),
    sheepMeatBreedingExcludingSequestration: divideBySafeFromZero(
      (netTotal + carbonSequestration) * 1000 * sheepMeatAllocationFactor,
      sheepMeatProducedKg,
    ),
    woolIncludingSequestration: divideBySafeFromZero(
      netTotal * 1000 * woolAllocationFactor,
      greasyWoolProducedKg,
    ),
    woolExcludingSequestration: divideBySafeFromZero(
      (netTotal + carbonSequestration) * 1000 * woolAllocationFactor,
      greasyWoolProducedKg,
    ),
  };
}

export function calculateSingleSheep(
  state: State,
  propertyNorthOfTropicOfCapricorn: boolean,
  rainfallAbove600: boolean,
  sheep: SheepComplete,
  context: ExecutionContext,
  carbonSequestration: number,
  id: string,
) {
  const mergedSheepFertiliser = mergeOtherFertilisers(sheep.fertiliser);

  const {
    atmosphericDepositionN2O,
    entericCH4,
    fertiliserN2O,
    leechingRunoffN2O,
    manureManagementCH4,
    urineAndDungN2O,
  } = calculateCompleteSheepEmissions(
    sheep.classes,
    state,
    mergedSheepFertiliser,
    rainfallAbove600,
    sheep.ewesLambing,
    sheep.seasonalLambing,
    context,
  );

  // Lime
  const limeCO2 = calculateScope1Lime(
    sheep.limestone,
    sheep.limestoneFraction,
    context,
  );

  // Fuel

  const { lpg } = sheep;

  const fuelCO2 = calculateFuelScope1CO2LPG(
    sheep.diesel,
    sheep.petrol,
    lpg,
    context,
  );

  const fuelCH4 = calculateFuelScope1CH4LPG(
    sheep.diesel,
    sheep.petrol,
    lpg,
    context,
  );

  const fuelN2O = calculateFuelScope1N2OLPG(
    sheep.diesel,
    sheep.petrol,
    lpg,
    context,
  );

  // Urea
  const ureaCO2 = calculateScope1Urea(
    sheep.mineralSupplementation,
    mergedSheepFertiliser,
    context,
  );

  // Electricity

  const sheepElectricity = calculateElectricityScope2And3(
    state,
    sheep.electricitySource,
    sheep.electricityRenewable,
    sheep.electricityUse,
    context,
  );

  // Fertiliser

  const sheepFertiliser = calculateScope3Fertiliser(
    mergedSheepFertiliser,
    context,
  );

  // Purchased Mineral Supplementation

  const sheepMineralSupplementation = calculateMineralSupplementationScope3(
    sheep.mineralSupplementation,
    context,
  );

  const sheepFeed = calculateScope3PurchasedFeed(
    sheep.grainFeed,
    sheep.hayFeed,
    0,
    context,
  );

  const herbicide = calculateScope3Herbicide(
    0,
    0,
    sheep.herbicide,
    sheep.herbicideOther,
    context,
  );

  const fuelScope3Sheep = calculateScope3FuelWithLPGAverage(
    sheep.diesel,
    sheep.petrol,
    lpg,
    context,
  );

  const limeScope3Sheep = calculateScope3Lime(sheep.limestone, context);

  const sheepPurchasedLivestock = SheepClassesAPI.reduce(
    (acc, type) => {
      const s = sheep.classes[type];

      const purchases =
        s && s.purchases && s.purchases.length > 0
          ? s.purchases
          : [
              {
                head: s?.headPurchased ?? 0,
                purchaseWeight: s?.purchasedWeight ?? 0,
              } as {
                head: number;
                purchaseWeight: number;
              },
            ];

      return {
        ...acc,
        [type]: purchases,
      };
    },
    {} as {
      [type in (typeof SheepClassesAPI)[number]]: {
        head: number;
        purchaseWeight: number;
      }[];
    },
  );

  const purchasedLivestock = calculatePurchasedSheepEmissions(
    sheepPurchasedLivestock,
    sheep.merinoPercent,
    context,
  );

  const totalCO2 = fuelCO2 + ureaCO2 + limeCO2;
  const totalCH4 = fuelCH4 + entericCH4 + manureManagementCH4;
  const totalN2O =
    fuelN2O +
    leechingRunoffN2O +
    atmosphericDepositionN2O +
    urineAndDungN2O +
    fertiliserN2O;

  // totals

  const scope1 = addTotalValue({
    leachingAndRunoffN2O: leechingRunoffN2O,
    atmosphericDepositionN2O,
    urineAndDungN2O,
    manureManagementCH4,
    entericCH4,
    fertiliserN2O,
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
    electricity: sheepElectricity.scope2,
  });

  const scope3 = addTotalValue({
    fertiliser: sheepFertiliser,
    purchasedMineralSupplementation: sheepMineralSupplementation,
    purchasedFeed: sheepFeed.total,
    herbicide: herbicide.total,
    electricity: sheepElectricity.scope3,
    fuel: fuelScope3Sheep,
    lime: limeScope3Sheep,
    purchasedLivestock,
  });

  const output = {
    scope1,
    scope2,
    scope3,
  };

  // Wool

  // (dataInputSheepN53)
  const { greasyWoolShornTotal, totalSheepSaleWeight, cleanWoolYieldTotal } =
    SheepClassesAPI.reduce(
      (acc, type) => {
        const s = sheep.classes[type];

        if (!s) {
          return acc;
        }

        return {
          greasyWoolShornTotal:
            acc.greasyWoolShornTotal + s.woolShorn * s.headShorn,
          totalSheepSaleWeight:
            acc.totalSheepSaleWeight + s.headSold * s.saleWeight,
          cleanWoolYieldTotal:
            acc.cleanWoolYieldTotal +
            (s.headShorn * s.woolShorn * (s.cleanWoolYield / 100)) / 1000,
        };
      },
      {
        greasyWoolShornTotal: 0,
        totalSheepSaleWeight: 0,
        cleanWoolYieldTotal: 0,
      },
    );

  const netTotal =
    output.scope1.total +
    output.scope2.total +
    output.scope3.total -
    carbonSequestration;

  return {
    output,
    extensions: {
      totalSheepSaleWeight,
      greasyWoolShornTotal,
      cleanWoolYieldTotal,
      carbonSequestration,
    },
    net: {
      total: netTotal,
    },
    meta: {
      id,
    },
  };
}

export function calculateSheep(
  input: SheepInput,
  context: ExecutionContext,
): SheepOutput {
  // eslint-disable-next-line no-param-reassign
  input.vegetation = singleAllocationToArray(
    input.vegetation,
    input.sheep,
    'sheepProportion',
  );

  const sheepCarbonSequestration =
    calculateAllCarbonSequestrationWithKeyProportion(
      input.vegetation,
      'sheepProportion',
      input.sheep,
      context,
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

  const sheepResults = input.sheep.map((singleSheep, i) =>
    calculateSingleSheep(
      input.state,
      input.northOfTropicOfCapricorn,
      input.rainfallAbove600,
      singleSheep,
      context,
      sheepCarbonSequestration.intermediate[i],
      singleSheep.id ?? i.toString(),
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
    scope1: baseSheepEmissions.scope1,
    scope2: baseSheepEmissions.scope2,
    scope3: baseSheepEmissions.scope3,
    net: {
      ...baseSheepEmissions.net,
      sheep: baseSheepEmissions.net.total,
    },
  };

  return {
    ...combinedResult,
    carbonSequestration: {
      total: sheepCarbonSequestration.total,
      intermediate: [], // TODO
    },
    intermediate: sheepResults.map((x) => ({
      ...x.output,
      carbonSequestration: x.extensions.carbonSequestration,
      id: x.meta.id,
      net: {
        total: x.net.total,
      },
      intensities: getSheepIntensities(
        x.net.total,
        x.extensions.carbonSequestration,
        x.extensions.cleanWoolYieldTotal,
        x.extensions.greasyWoolShornTotal,
        x.extensions.totalSheepSaleWeight,
      ),
    })),
    intensities: getSheepIntensities(
      combinedResult.net.total,
      sheepCarbonSequestration.total,
      cleanWoolYieldTotal,
      greasyWoolShornTotal,
      totalSheepSaleWeight,
    ),
  };
}
