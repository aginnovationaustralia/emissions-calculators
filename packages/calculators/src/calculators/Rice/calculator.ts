import { RiceInput } from '@/types/Rice/input';
import { RiceOutput } from '@/types/Rice/output';
import { RiceCrop } from '@/types/Rice/rice.input';
import { RiceVegetation } from '@/types/Rice/vegetation.input';
import { State } from '@/types/types';
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
import { addTotalValue, divideBySafeFromZero } from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { ExecutionContext } from '../executionContext';
import { ConstantsForRiceCalculator } from './constants';
import { calculateScope1N2O } from './Scope1';
import { calculateScope1RiceCultivation } from './Scope1RiceCultivation';
import { calculateScope1Urea } from './Scope1Urea';
import { calculateScope3Fertiliser } from './Scope3Fertiliser';

function getIntensities(
  netTotal: number,
  carbonSequestration: number,
  riceProducedTonnes: number,
) {
  return {
    riceProducedTonnes,
    riceExcludingSequestration: divideBySafeFromZero(
      netTotal + carbonSequestration,
      riceProducedTonnes,
    ),
    riceIncludingSequestration: divideBySafeFromZero(
      netTotal,
      riceProducedTonnes,
    ),
    intensity: divideBySafeFromZero(netTotal, riceProducedTonnes),
  };
}

export function calculateEntireRice(
  crops: RiceCrop[],
  electricityUse: number,
  electricityRenewablePercentage: number,
  state: State,
  vegetation: RiceVegetation[],
  context: ExecutionContext<ConstantsForRiceCalculator>,
): RiceOutput {
  const electricity = calculateElectricityScope2And3(
    state,
    'State Grid',
    electricityRenewablePercentage,
    electricityUse,
    context,
  );

  const carbonSequestration = calculateAllCarbonSequestrationWithKeyProportion(
    vegetation,
    'allocationToCrops',
    crops,
    context,
  );

  const allCrops = crops.map((crop, i) => {
    const scope1N2O = calculateScope1N2O(crop, context);

    const scope1Urea = calculateScope1Urea(crop, context);

    const scope1Limestone = calculateScope1Lime(
      crop.limestone,
      crop.limestoneFraction,
      context,
    );

    const { lpg } = crop;

    const scope1FuelN2O = calculateFuelScope1N2OLPG(
      crop.dieselUse,
      crop.petrolUse,
      lpg,
      context,
      true,
    );
    const scope1FuelCH4 = calculateFuelScope1CH4LPG(
      crop.dieselUse,
      crop.petrolUse,
      lpg,
      context,
      true,
    );
    const scope1FuelCO2 = calculateFuelScope1CO2LPG(
      crop.dieselUse,
      crop.petrolUse,
      lpg,
      context,
      true,
    );

    const riceCultivationCH4 = calculateScope1RiceCultivation(crop, context);

    const scope3Herbicide = calculateScope3Herbicide(
      crop.glyphosateOtherHerbicideUse,
      crop.herbicideUse,
      context,
    );
    const scope3Lime = calculateScope3Lime(crop.limestone, context);
    const scope3Fuel = calculateScope3FuelWithLPGAverage(
      crop.dieselUse,
      crop.petrolUse,
      lpg,
      context,
    );

    const scope3Fertiliser = calculateScope3Fertiliser(crop, context);

    const res = {
      scope1: addTotalValue({
        fuelCO2: scope1FuelCO2,
        limeCO2: scope1Limestone,
        ureaCO2: scope1Urea,
        fieldBurningCH4: scope1N2O.burningCH4,
        riceCultivationCH4,
        fuelCH4: scope1FuelCH4,
        fertiliserN2O: scope1N2O.fertiliserN2O,
        atmosphericDepositionN2O: scope1N2O.atmosphericN2O,
        fieldBurningN2O: scope1N2O.burningN2O,
        cropResidueN2O: scope1N2O.cropResiduesN2O,
        leachingAndRunoffN2O: scope1N2O.leechingN2O,
        fuelN2O: scope1FuelN2O,
        totalCH4: scope1FuelCH4 + scope1N2O.burningCH4 + riceCultivationCH4,
        totalCO2: scope1FuelCO2 + scope1Limestone + scope1Urea,
        totalN2O:
          scope1N2O.atmosphericN2O +
          scope1N2O.fertiliserN2O +
          scope1N2O.leechingN2O +
          scope1N2O.cropResiduesN2O +
          scope1FuelN2O +
          scope1N2O.burningN2O,
      }),
      scope2: addTotalValue({
        electricity: electricity.scope2 * crop.electricityAllocation,
      }),
      scope3: addTotalValue({
        fertiliser: scope3Fertiliser,
        herbicide: scope3Herbicide.total,
        electricity: electricity.scope3 * crop.electricityAllocation,
        lime: scope3Lime,
        fuel: scope3Fuel,
      }),
      carbonSequestration: carbonSequestration.intermediate[i],
    };

    return {
      output: res,
      meta: {
        id: crop.id ?? i.toString(),
      },
      extensions: {
        carbonSequestration: carbonSequestration.intermediate[i],
        amountProduced: crop.averageRiceYield * crop.areaSown,
      },
      net: {
        total:
          res.scope1.total +
          res.scope2.total +
          res.scope3.total -
          carbonSequestration.intermediate[i],
      },
    };
  });

  const total = sumIntermediateResults(
    {
      output: {
        scope1: {
          fuelCO2: 0,
          limeCO2: 0,
          ureaCO2: 0,
          fieldBurningCH4: 0,
          riceCultivationCH4: 0,
          fuelCH4: 0,
          fertiliserN2O: 0,
          atmosphericDepositionN2O: 0,
          fieldBurningN2O: 0,
          cropResidueN2O: 0,
          leachingAndRunoffN2O: 0,
          fuelN2O: 0,
          totalCH4: 0,
          totalCO2: 0,
          totalN2O: 0,
          total: 0,
        },
        scope2: { electricity: 0, total: 0 },
        scope3: {
          fertiliser: 0,
          herbicide: 0,
          electricity: 0,
          lime: 0,
          fuel: 0,
          total: 0,
        },
        carbonSequestration: 0,
      },
      extensions: {
        carbonSequestration: 0,
        amountProduced: 0,
      },
      meta: {
        id: '',
      },
      net: {
        total: 0,
      },
    },
    allCrops,
  );

  const netTotal =
    total.output.scope1.total +
    total.output.scope2.total +
    total.output.scope3.total -
    carbonSequestration.total;

  const result: RiceOutput = {
    scope1: total.output.scope1,
    scope2: total.output.scope2,
    scope3: total.output.scope3,
    carbonSequestration,
    intermediate: allCrops.map((c) => ({
      scope1: c.output.scope1,
      scope2: c.output.scope2,
      scope3: c.output.scope3,
      net: c.net,
      carbonSequestration: c.extensions.carbonSequestration,
      intensities: getIntensities(
        c.net.total,
        c.extensions.carbonSequestration,
        c.extensions.amountProduced,
      ),
      id: c.meta.id,
    })),
    intensities: getIntensities(
      netTotal,
      carbonSequestration.total,
      total.extensions.amountProduced,
    ),
    net: {
      total: netTotal,
      crops: allCrops.map((c) => c.net.total),
    },
  };

  return result;
}

export function calculateRice(
  input: RiceInput,
  context: ExecutionContext<ConstantsForRiceCalculator>,
) {
  return calculateEntireRice(
    input.crops,
    input.electricityUse,
    input.electricityRenewable,
    input.state,
    input.vegetation,
    context,
  );
}
