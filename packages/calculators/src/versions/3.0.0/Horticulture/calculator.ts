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
  addTotalValue,
  addTotalValueWithEmissionElements,
  divideBySafeFromZero,
} from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../common/trees';
import { ExecutionContext } from '../executionContext';
import { HorticultureCrop } from '../types/Horticulture/horticulture.input';
import { HorticultureInput } from '../types/Horticulture/input';
import { HorticultureOutput } from '../types/Horticulture/output';
import { HorticultureVegetation } from '../types/Horticulture/vegetation.input';
import { State } from '../types/types';
import { calculateScope1N2O } from './Scope1';
import { calculateScope1Refrigerant } from './Scope1Refrigerant';
import { calculateScope1Urea } from './Scope1Urea';
import { calculateScope3Fertiliser } from './Scope3Fertiliser';

function getIntensities(
  netTotal: number,
  carbonSequestration: number,
  cropProducedTonnes: number,
) {
  return {
    tonnesCropExcludingSequestration: divideBySafeFromZero(
      netTotal + carbonSequestration,
      cropProducedTonnes,
    ),
    tonnesCropIncludingSequestration: divideBySafeFromZero(
      netTotal,
      cropProducedTonnes,
    ),
    cropProducedTonnes,
  };
}

export function calculateEntireHorticulture(
  crops: HorticultureCrop[],
  electricityUse: number,
  electricityRenewablePercentage: number,
  state: State,
  vegetation: HorticultureVegetation[],
  context: ExecutionContext,
): HorticultureOutput {
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

    const scope1FuelN2O = calculateFuelScope1N2OLPG(
      crop.dieselUse,
      crop.petrolUse,
      crop.lpg,
      context,
      true,
    );
    const scope1FuelCH4 = calculateFuelScope1CH4LPG(
      crop.dieselUse,
      crop.petrolUse,
      crop.lpg,
      context,
      true,
    );
    const scope1FuelCO2 = calculateFuelScope1CO2LPG(
      crop.dieselUse,
      crop.petrolUse,
      crop.lpg,
      context,
      true,
    );

    const scope1Refrigerant = calculateScope1Refrigerant(crop, context);

    const scope3Herbicide = calculateScope3Herbicide(
      crop.glyphosateOtherHerbicideUse,
      crop.herbicideUse,
      context,
    );
    const scope3Lime = calculateScope3Lime(crop.limestone, context);
    const scope3Fuel = calculateScope3FuelWithLPGAverage(
      crop.dieselUse,
      crop.petrolUse,
      crop.lpg,
      context,
    );

    const scope3Fertiliser = calculateScope3Fertiliser(crop, context);

    const res = {
      scope1: addTotalValueWithEmissionElements({
        atmosphericDepositionN2O: scope1N2O.atmosphericN2O,
        fertiliserN2O: scope1N2O.fertiliserN2O,
        leachingAndRunoffN2O: scope1N2O.leechingN2O,
        cropResidueN2O: scope1N2O.cropResiduesN2O,
        limeCO2: scope1Limestone,
        fuelN2O: scope1FuelN2O,
        fuelCH4: scope1FuelCH4,
        fuelCO2: scope1FuelCO2,
        ureaCO2: scope1Urea,
        fieldBurningN2O: scope1N2O.burningN2O,
        fieldBurningCH4: scope1N2O.burningCH4,
        hfcsRefrigerantLeakage: scope1Refrigerant,
        totalHFCs: scope1Refrigerant,
      }),
      scope2: addTotalValue({
        electricity: electricity.scope2 * crop.electricityAllocation,
      }),
      scope3: addTotalValue({
        fertiliser: scope3Fertiliser.total,
        herbicide: scope3Herbicide.total,
        electricity: electricity.scope3 * crop.electricityAllocation,
        lime: scope3Lime,
        fuel: scope3Fuel,
      }),
      carbonSequestration: carbonSequestration.intermediate[i],
    };

    return {
      output: {
        scope1: res.scope1,
        scope2: res.scope2,
        scope3: res.scope3,
        carbonSequestration: res.carbonSequestration,
      },
      extensions: {
        carbonSequestration: carbonSequestration.intermediate[i],
        amountProduced: crop.averageYield * crop.areaSown,
      },
      meta: {
        id: crop.id ?? i.toString(),
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
          atmosphericDepositionN2O: 0,
          fertiliserN2O: 0,
          leachingAndRunoffN2O: 0,
          cropResidueN2O: 0,
          limeCO2: 0,
          fuelN2O: 0,
          fuelCH4: 0,
          fuelCO2: 0,
          ureaCO2: 0,
          totalCH4: 0,
          totalCO2: 0,
          totalN2O: 0,
          totalHFCs: 0,
          fieldBurningN2O: 0,
          fieldBurningCH4: 0,
          hfcsRefrigerantLeakage: 0,
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
      net: {
        total: 0,
      },
      meta: {
        id: '',
      },
    },
    allCrops,
  );

  const result: HorticultureOutput = {
    carbonSequestration,
    intermediate: allCrops.map((crop) => ({
      carbonSequestration: {
        total: crop.extensions.carbonSequestration,
      },
      id: crop.meta.id,
      scope1: crop.output.scope1,
      scope2: crop.output.scope2,
      scope3: crop.output.scope3,
      net: crop.net,
      intensitiesWithSequestration: getIntensities(
        crop.net.total,
        crop.extensions.carbonSequestration,
        crop.extensions.amountProduced,
      ),
    })),
    scope1: total.output.scope1,
    scope2: total.output.scope2,
    scope3: total.output.scope3,
    intensities: allCrops.map((crop) =>
      getIntensities(
        crop.net.total,
        crop.extensions.carbonSequestration,
        crop.extensions.amountProduced,
      ),
    ),
    net: {
      total:
        total.output.scope1.total +
        total.output.scope2.total +
        total.output.scope3.total -
        carbonSequestration.total,
      crops: allCrops.map((crop) => crop.net.total),
    },
  };

  return result;
}

export function calculateHorticulture(
  input: HorticultureInput,
  context: ExecutionContext,
) {
  return calculateEntireHorticulture(
    input.crops,
    input.electricityUse,
    input.electricityRenewable,
    input.state,
    input.vegetation,
    context,
  );
}
