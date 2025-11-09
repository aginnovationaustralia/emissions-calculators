import { GoatComplete } from '@/types/Goat/goat.input';
import { GoatInput } from '@/types/Goat/input';
import { GoatOutput } from '@/types/Goat/output';
import { GoatClassesAPI, State } from '@/types/types';
import {
  calculateScope3Fertiliser,
  mergeOtherFertilisers,
} from '../../calculators/common/fertiliser';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../../calculators/common/trees';
import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import {
  calculateFuelScope1CH4LPG,
  calculateFuelScope1CO2LPG,
  calculateFuelScope1N2OLPG,
  calculateScope3FuelWithLPGAverage,
} from '../common-legacy/fuel';
import { calculateScope3Herbicide } from '../common/herbicide';
import { calculateScope1Lime, calculateScope3Lime } from '../common/lime';
import {
  calculateMineralSupplementationScope3,
  calculateScope3PurchasedFeed,
} from '../common/livestock';
import { addTotalValue } from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { singleAllocationToArray } from '../common/tools/object';
import { ExecutionContext } from '../executionContext';
import { ConstantsForGoatCalculator } from './constants';
import { getIntensities } from './functions';
import { calculateCompleteGoatEmissions } from './Scope1Goat';
import { calculateScope1Urea } from './Scope1Urea';
import { calculateScope3PurchaseLivestock } from './Scope3PurchasedLivestock';

/**
 * Entire calculator for Goat
 * @param state
 * @param rainfallAbove600
 * @param beef
 * @param sheep
 * @returns
 */
export function calculateSingleGoat(
  state: State,
  rainfallAbove600: boolean,
  goats: GoatComplete,
  context: ExecutionContext<ConstantsForGoatCalculator>,
  carbonSequestration: number,
  id: string,
) {
  const mergedFertiliser = mergeOtherFertilisers(goats.fertiliser);

  const goatEmissions = calculateCompleteGoatEmissions(
    goats.classes,
    state,
    mergedFertiliser,
    rainfallAbove600,
    context,
  );

  const limeCO2 = calculateScope1Lime(
    goats.limestone,
    goats.limestoneFraction,
    context,
  );

  const fuelCO2 = calculateFuelScope1CO2LPG(
    goats.diesel,
    goats.petrol,
    goats.lpg,
    context,
    true,
  );
  const fuelCH4 = calculateFuelScope1CH4LPG(
    goats.diesel,
    goats.petrol,
    goats.lpg,
    context,
    true,
  );
  const fuelN2O = calculateFuelScope1N2OLPG(
    goats.diesel,
    goats.petrol,
    goats.lpg,
    context,
    true,
  );

  const ureaCO2 = calculateScope1Urea(
    goats.mineralSupplementation,
    mergedFertiliser,
    context,
  );

  const electricity = calculateElectricityScope2And3(
    state,
    goats.electricitySource,
    goats.electricityRenewable,
    goats.electricityUse,
    context,
  );

  const fertiliser = calculateScope3Fertiliser(mergedFertiliser, context);

  const feed = calculateScope3PurchasedFeed(
    goats.grainFeed,
    goats.hayFeed,
    0,
    context,
  );

  const fuelScope3 = calculateScope3FuelWithLPGAverage(
    goats.diesel,
    goats.petrol,
    goats.lpg,
    context,
  );

  const mineralSupplementation = calculateMineralSupplementationScope3(
    goats.mineralSupplementation,
    context,
  );

  const herbicide = calculateScope3Herbicide(
    goats.herbicide,
    goats.herbicideOther,
    context,
  );

  const lime = calculateScope3Lime(goats.limestone, context);

  const purchasedLivestock = calculateScope3PurchaseLivestock(
    goats.classes,
    context,
  );

  const totalCO2 = fuelCO2 + ureaCO2 + limeCO2;
  const totalCH4 = fuelCH4 + goatEmissions.manureCH4 + goatEmissions.entericCH4;
  const totalN2O =
    goatEmissions.fertiliserN2O +
    goatEmissions.atmosphericDepositionN2O +
    goatEmissions.urineDungN2O +
    goatEmissions.leechingRunoffN2O +
    fuelN2O;

  const scope1 = addTotalValue({
    fertiliserN2O: goatEmissions.fertiliserN2O,
    atmosphericDepositionN2O: goatEmissions.atmosphericDepositionN2O,
    manureManagementCH4: goatEmissions.manureCH4,
    entericCH4: goatEmissions.entericCH4,
    urineAndDungN2O: goatEmissions.urineDungN2O,
    leachingAndRunoffN2O: goatEmissions.leechingRunoffN2O,
    fuelCO2,
    fuelCH4,
    fuelN2O,
    totalCO2,
    totalCH4,
    totalN2O,
    ureaCO2,
    limeCO2,
  });

  const scope2 = addTotalValue({
    electricity: electricity.scope2,
  });

  const scope3 = addTotalValue({
    fertiliser,
    electricity: electricity.scope3,
    purchasedFeed: feed.total,
    fuel: fuelScope3,
    purchasedMineralSupplementation: mineralSupplementation,
    herbicide: herbicide.total,
    lime,
    purchasedLivestock,
  });

  const net = {
    total: scope1.total + scope2.total + scope3.total - carbonSequestration,
  };

  const output = {
    scope1,
    scope2,
    scope3,
    net,
  };

  const { totalSaleWeightKg, greasyWoolSum, cleanWoolTYearSum } =
    GoatClassesAPI.reduce(
      (acc, cur) => {
        const goatClass = goats.classes[cur];
        if (!goatClass) {
          return acc;
        }

        return {
          totalSaleWeightKg:
            acc.totalSaleWeightKg + goatClass.headSold * goatClass.saleWeight,
          greasyWoolSum:
            acc.greasyWoolSum + goatClass.woolShorn * goatClass.headShorn,
          cleanWoolTYearSum:
            acc.cleanWoolTYearSum +
            (goatClass.woolShorn *
              goatClass.headShorn *
              goatClass.cleanWoolYield) /
              100 /
              1000,
        };
      },
      {
        totalSaleWeightKg: 0,
        greasyWoolSum: 0,
        cleanWoolTYearSum: 0,
      },
    );

  return {
    output,
    extensions: {
      totalSaleWeightKg,
      greasyWoolSum,
      cleanWoolTYearSum,
      carbonSequestration,
    },
    meta: {
      id,
    },
  };
}

export function calculateGoat(
  input: GoatInput,
  context: ExecutionContext<ConstantsForGoatCalculator>,
): GoatOutput {
  input.vegetation = singleAllocationToArray(
    input.vegetation,
    input.goats,
    'goatProportion',
  );

  const carbonSequestration = calculateAllCarbonSequestrationWithKeyProportion(
    input.vegetation,
    'goatProportion',
    input.goats,
    context,
  );

  const goatResults = input.goats.map((singleGoat, ix) =>
    calculateSingleGoat(
      input.state,
      input.rainfallAbove600,
      singleGoat,
      context,
      carbonSequestration.intermediate[ix],
      singleGoat.id || ix.toString(),
    ),
  );

  const goatResult = sumIntermediateResults(
    {
      output: {
        scope1: {
          fertiliserN2O: 0,
          atmosphericDepositionN2O: 0,
          manureManagementCH4: 0,
          entericCH4: 0,
          urineAndDungN2O: 0,
          leachingAndRunoffN2O: 0,
          fuelCO2: 0,
          fuelCH4: 0,
          fuelN2O: 0,
          totalCO2: 0,
          totalCH4: 0,
          totalN2O: 0,
          ureaCO2: 0,
          total: 0,
          limeCO2: 0,
        },
        scope2: {
          electricity: 0,
          total: 0,
        },
        scope3: {
          electricity: 0,
          fertiliser: 0,
          purchasedFeed: 0,
          fuel: 0,
          purchasedMineralSupplementation: 0,
          herbicide: 0,
          lime: 0,
          purchasedLivestock: 0,
          total: 0,
        },
        net: {
          total: 0,
        },
      },
      extensions: {
        totalSaleWeightKg: 0,
        greasyWoolSum: 0,
        cleanWoolTYearSum: 0,
        carbonSequestration: 0,
      },
      meta: {
        id: '',
      },
    },
    goatResults,
  );

  const intensities = getIntensities(
    goatResult.output.scope1.total +
      goatResult.output.scope2.total +
      goatResult.output.scope3.total,
    goatResult.extensions.carbonSequestration,
    goatResult.extensions.cleanWoolTYearSum,
    goatResult.extensions.greasyWoolSum,
    goatResult.extensions.totalSaleWeightKg,
  );

  const output: GoatOutput = {
    net: {
      total:
        goatResult.output.scope1.total +
        goatResult.output.scope2.total +
        goatResult.output.scope3.total -
        carbonSequestration.total,
    },
    scope1: goatResult.output.scope1,
    scope2: goatResult.output.scope2,
    scope3: goatResult.output.scope3,
    carbonSequestration: {
      total: goatResult.extensions.carbonSequestration,
      intermediate: carbonSequestration.intermediate,
    },
    intensities,
    intermediate: goatResults.map((result) => {
      return {
        ...result.output,
        id: result.meta.id,
        carbonSequestration: {
          total: result.extensions.carbonSequestration,
        },
        intensities: getIntensities(
          result.output.scope1.total +
            result.output.scope2.total +
            result.output.scope3.total,
          result.extensions.carbonSequestration,
          result.extensions.cleanWoolTYearSum,
          result.extensions.greasyWoolSum,
          result.extensions.totalSaleWeightKg,
        ),
      };
    }),
  };

  return output;
}
